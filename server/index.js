import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { getUserById, upsertDiscordUser, toPublicUser } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT || 3001);
const APP_URL = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'gm7-dev-session-secret-change-me';
const REDIRECT_URI = `${APP_URL}/auth/discord/callback`;
const IS_SECURE = APP_URL.startsWith('https://');

const SESSION_COOKIE = 'gm7_session';
const STATE_COOKIE = 'gm7_oauth_state';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const STATE_TTL_SEC = 600; // 10 minutes

// --- cookies ---------------------------------------------------------------

function parseCookies(req) {
  const header = req.headers.cookie;
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name) out[name] = decodeURIComponent(value);
  }
  return out;
}

function serializeCookie(name, value, { maxAge, httpOnly = false, secure = false } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'SameSite=Lax'];
  if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);
  if (httpOnly) parts.push('HttpOnly');
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

// --- session (HMAC-signed cookie) ------------------------------------------

function signSession(userId) {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + SESSION_TTL_MS }),
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function readSessionUserId(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return null;
  const dot = token.indexOf('.');
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.uid || typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return data.uid;
  } catch {
    return null;
  }
}

// --- helpers ---------------------------------------------------------------

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function requireDiscordConfig(res) {
  if (DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET) return true;
  res.redirect(`${APP_URL}/?auth=config`);
  return false;
}

// --- app -------------------------------------------------------------------

const app = express();

// Start Discord OAuth flow: set CSRF state cookie, redirect to Discord.
app.get('/auth/discord', (req, res) => {
  if (!requireDiscordConfig(res)) return;
  const state = crypto.randomBytes(16).toString('hex');
  res.setHeader(
    'Set-Cookie',
    serializeCookie(STATE_COOKIE, state, {
      maxAge: STATE_TTL_SEC,
      httpOnly: true,
      secure: IS_SECURE,
    }),
  );
  const url = `https://discord.com/oauth2/authorize?${new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: 'identify email',
    state,
  })}`;
  res.redirect(url);
});

// Discord OAuth callback: exchange code, create/find user, set session.
app.get(
  '/auth/discord/callback',
  asyncHandler(async (req, res) => {
    const fail = () => {
      res.setHeader(
        'Set-Cookie',
        serializeCookie(STATE_COOKIE, '', { maxAge: 0, httpOnly: true, secure: IS_SECURE }),
      );
      res.redirect(`${APP_URL}/?auth=error`);
    };

    if (req.query.error) return fail();
    if (!requireDiscordConfig(res)) return;

    const { code, state } = req.query;
    const cookies = parseCookies(req);
    if (!code || !state || !cookies[STATE_COOKIE] || cookies[STATE_COOKIE] !== state) {
      return fail();
    }

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: String(code),
        redirect_uri: REDIRECT_URI,
      }),
    });
    if (!tokenRes.ok) return fail();

    const token = await tokenRes.json();
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!userRes.ok) return fail();

    const profile = await userRes.json();
    const { user, created } = await upsertDiscordUser(profile);

    res.setHeader('Set-Cookie', [
      serializeCookie(SESSION_COOKIE, signSession(user.id), {
        maxAge: SESSION_TTL_MS / 1000,
        httpOnly: true,
        secure: IS_SECURE,
      }),
      serializeCookie(STATE_COOKIE, '', { maxAge: 0, httpOnly: true, secure: IS_SECURE }),
    ]);
    res.redirect(`${APP_URL}/?auth=${created ? 'signup' : 'login'}`);
  }),
);

// --- Kick live status (cached proxy) ---------------------------------------

const KICK_CHANNEL_SLUG = process.env.KICK_CHANNEL_SLUG || 'snnsei';
const KICK_CHANNEL_URL = `https://kick.com/api/v2/channels/${KICK_CHANNEL_SLUG}`;
const KICK_CACHE_TTL_MS = 30_000;
let kickCache = { data: null, at: 0 };

// Public content feeds. These requests are intentionally made by the server so
// browsers do not have to deal with CORS restrictions imposed by the platforms.
const YOUTUBE_CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@Snnsei';
const FEED_CACHE_TTL_MS = 5 * 60_000;
let feedCache = { data: null, at: 0 };

function stripHtml(value = '') {
  return String(value).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim();
}

function readXmlTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? stripHtml(match[1]) : '';
}

function formatDuration(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remaining = total % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}` : `${minutes}:${String(remaining).padStart(2, '0')}`;
}

async function fetchYouTubeFeed() {
  // A handle resolves to its canonical channel ID without requiring an API key.
  const channelPage = await fetch(`https://www.youtube.com/${YOUTUBE_CHANNEL_HANDLE}`, {
    headers: { Accept: 'text/html' },
    signal: AbortSignal.timeout(8000),
  });
  if (!channelPage.ok) throw new Error(`YouTube channel responded with ${channelPage.status}`);
  const channelHtml = await channelPage.text();
  const channelId = channelHtml.match(/"channelId":"(UC[\w-]{22})"/)?.[1];
  if (!channelId) throw new Error('Could not find YouTube channel ID');

  const rss = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
    headers: { Accept: 'application/atom+xml' },
    signal: AbortSignal.timeout(8000),
  });
  if (!rss.ok) throw new Error(`YouTube feed responded with ${rss.status}`);
  const xml = await rss.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/gi) || [];

  return entries.slice(0, 5).map((entry) => {
    const id = readXmlTag(entry, 'yt:videoId');
    const publishedAt = readXmlTag(entry, 'published');
    return {
      id: `youtube-${id}`,
      platform: 'youtube',
      title: readXmlTag(entry, 'title') || 'YouTube upload',
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      category: 'YouTube video',
      duration: '',
      views: '',
      publishedAt,
      url: `https://www.youtube.com/watch?v=${id}`,
    };
  }).filter((item) => item.id !== 'youtube-');
}

async function fetchKickClips() {
  const response = await fetch(`https://kick.com/api/v2/channels/${KICK_CHANNEL_SLUG}/clips?cursor=0&sort=date`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Kick clips responded with ${response.status}`);
  const payload = await response.json();
  const clips = Array.isArray(payload) ? payload : payload.clips || payload.data || [];

  return clips.slice(0, 5).map((clip) => {
    const id = clip.id || clip.clip_id || clip.slug;
    const thumbnail = clip.thumbnail_url || clip.thumbnail?.url || clip.thumbnail || clip.video?.thumbnail || '';
    const createdAt = clip.created_at || clip.createdAt || clip.created || '';
    const clipPath = clip.clip_url || clip.url || (id ? `https://kick.com/${KICK_CHANNEL_SLUG}/clips/${id}` : `https://kick.com/${KICK_CHANNEL_SLUG}`);
    return {
      id: `kick-${id}`,
      platform: 'kick',
      title: clip.title || clip.slug || 'Kick clip',
      thumb: thumbnail,
      category: 'Kick clip',
      duration: formatDuration(clip.duration ?? clip.duration_seconds),
      views: String(clip.views ?? clip.view_count ?? ''),
      likes: String(clip.likes ?? clip.likes_count ?? ''),
      publishedAt: createdAt,
      url: clipPath,
    };
  }).filter((item) => item.id !== 'kick-');
}

async function fetchContentFeed(forceRefresh = false) {
  if (!forceRefresh && feedCache.data && Date.now() - feedCache.at < FEED_CACHE_TTL_MS) return feedCache.data;
  const [youtube, kick] = await Promise.allSettled([fetchYouTubeFeed(), fetchKickClips()]);
  const data = {
    updatedAt: new Date().toISOString(),
    channels: {
      youtube: youtube.status === 'fulfilled' ? youtube.value : [],
      kick: kick.status === 'fulfilled' ? kick.value : [],
    },
    errors: {
      ...(youtube.status === 'rejected' ? { youtube: 'Unable to load the latest YouTube videos.' } : {}),
      ...(kick.status === 'rejected' ? { kick: 'Unable to load the latest Kick clips.' } : {}),
    },
  };
  if (!data.channels.youtube.length && !data.channels.kick.length) throw new Error('No feed sources available');
  feedCache = { data, at: Date.now() };
  return data;
}

async function fetchKickLive() {
  if (kickCache.data && Date.now() - kickCache.at < KICK_CACHE_TTL_MS) return kickCache.data;
  const res = await fetch(KICK_CHANNEL_URL, {
    // No User-Agent: Kick's Cloudflare blocks browser-like UAs on this endpoint.
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Kick responded with ${res.status}`);
  const ch = await res.json();
  const live = ch.livestream;
  const data = {
    isLive: Boolean(live && live.is_live),
    title: live?.session_title || null,
    viewers: live?.viewer_count ?? 0,
    category: live?.categories?.[0]?.name || null,
    language: live?.language || null,
    thumbnail: live?.thumbnail?.url || null,
    followers: Number(ch.followers_count || 0),
    profilePic: ch.user?.profile_pic || null,
    bio: ch.user?.bio || null,
    channelUrl: `https://kick.com/${KICK_CHANNEL_SLUG}`,
  };
  kickCache = { data, at: Date.now() };
  return data;
}

app.get(
  '/api/kick/live',
  asyncHandler(async (req, res) => {
    try {
      const data = await fetchKickLive();
      res.setHeader('Cache-Control', 'public, max-age=30');
      res.json(data);
    } catch (err) {
      // Serve stale data if we have it, otherwise surface the error.
      if (kickCache.data) {
        res.setHeader('Cache-Control', 'public, max-age=30');
        return res.json(kickCache.data);
      }
      console.error('[Kick] fetch failed:', err.message);
      return res.status(502).json({ error: 'Failed to fetch Kick stream status' });
    }
  }),
);

app.get(
  '/api/feed',
  asyncHandler(async (req, res) => {
    try {
      const data = await fetchContentFeed(req.query.refresh === '1');
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.json(data);
    } catch (err) {
      if (feedCache.data) return res.json(feedCache.data);
      console.error('[Feed] fetch failed:', err.message);
      res.status(502).json({ error: 'Failed to fetch the latest content.' });
    }
  }),
);

// Current session user.
app.get('/api/me', asyncHandler(async (req, res) => {
  const uid = readSessionUserId(req);
  const user = uid ? await getUserById(uid) : null;
  res.json({ user: user ? toPublicUser(user) : null });
}));

// Logout.
app.post('/api/auth/logout', (req, res) => {
  res.setHeader(
    'Set-Cookie',
    serializeCookie(SESSION_COOKIE, '', { maxAge: 0, httpOnly: true, secure: IS_SECURE }),
  );
  res.json({ ok: true });
});

// Unknown API/auth routes -> JSON 404 (before the SPA fallback).
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use('/auth', (req, res) => res.status(404).json({ error: 'Not found' }));

// Serve the built SPA when dist/ exists.
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  const configured = DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET;
  console.log(`[GM7] server listening on http://localhost:${PORT}`);
  console.log(`[GM7] OAuth redirect URI: ${REDIRECT_URI}`);
  if (!configured) {
    console.warn('[GM7] DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET not set — login will not work yet.');
  }
  if (SESSION_SECRET === 'gm7-dev-session-secret-change-me') {
    console.warn('[GM7] Using the default SESSION_SECRET — set it in .env for production.');
  }
});
