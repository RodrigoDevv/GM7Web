import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { deleteUserById, getUserById, upsertDiscordUser, toPublicUser } from './db.js';
import { getContent, saveGames, saveTournaments, saveVideos } from './content.js';
import { getAnalyticsSummary, recordPageView, recordVisit } from './analytics.js';
import { initDatabase, isTursoConfigured } from './turso.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT || 3001);
// On Vercel, fall back to the deployment URL so OAuth callbacks and links work
// without extra configuration (set APP_URL for a custom domain).
const APP_URL = (
  process.env.APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000'
).replace(/\/+$/, '');
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'gm7-dev-session-secret-change-me';
const REDIRECT_URI = `${APP_URL}/auth/discord/callback`;
const IS_SECURE = APP_URL.startsWith('https://');
const IS_PROD = process.env.NODE_ENV === 'production';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gm7-admin';
const USING_DEFAULT_ADMIN_PASSWORD = !process.env.ADMIN_PASSWORD;
// In production, auth can never be disabled via environment variable
const ADMIN_AUTH_DISABLED =
  !IS_PROD && (process.env.ADMIN_AUTH_DISABLED === 'true' || process.env.ADMIN_AUTH_DISABLED === '1');

const SESSION_COOKIE = 'gm7_session';
const ADMIN_COOKIE = 'gm7_admin';
const STATE_COOKIE = 'gm7_oauth_state';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days for user sessions
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours for admin session
const STATE_TTL_SEC = 600; // 10 minutes

// Brute-force protection for admin login
const ADMIN_LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15-minute lockout window
const ADMIN_LOGIN_MAX_FAILURES = 5; // Max 5 bad attempts before lockout
const adminLoginAttempts = new Map(); // IP -> { count, lockedUntil, lastAttempt }

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

function serializeCookie(name, value, { maxAge, httpOnly = false, secure = false, sameSite = 'Lax' } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', `SameSite=${sameSite}`];
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

// --- admin session & security ---------------------------------------------

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function checkAdminRateLimit(ip) {
  const record = adminLoginAttempts.get(ip);
  if (!record) return { allowed: true };
  const now = Date.now();
  if (record.lockedUntil && now < record.lockedUntil) {
    const minutesLeft = Math.ceil((record.lockedUntil - now) / 60000);
    return {
      allowed: false,
      error: `Too many failed login attempts. Locked out for ${minutesLeft} more minute${minutesLeft === 1 ? '' : 's'}.`,
    };
  }
  if (now - record.lastAttempt > ADMIN_LOGIN_WINDOW_MS) {
    adminLoginAttempts.delete(ip);
    return { allowed: true };
  }
  return { allowed: true };
}

function recordAdminLoginFailure(ip) {
  const now = Date.now();
  const record = adminLoginAttempts.get(ip) || { count: 0, lastAttempt: now };
  record.count += 1;
  record.lastAttempt = now;
  if (record.count >= ADMIN_LOGIN_MAX_FAILURES) {
    record.lockedUntil = now + ADMIN_LOGIN_WINDOW_MS;
  }
  adminLoginAttempts.set(ip, record);
}

function recordAdminLoginSuccess(ip) {
  adminLoginAttempts.delete(ip);
}

function signAdminSession() {
  const payload = Buffer.from(
    JSON.stringify({ admin: true, exp: Date.now() + ADMIN_SESSION_TTL_MS }),
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function isAdminRequest(req) {
  if (ADMIN_AUTH_DISABLED) return true;
  const token = parseCookies(req)[ADMIN_COOKIE];
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.admin === true && typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
}

// Constant-time string comparison using SHA-256 digests to prevent timing attacks
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function requireAdmin(req, res, next) {
  if (isAdminRequest(req)) return next();
  res.status(401).json({ error: 'Admin login required' });
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

// JSON body parsing for the admin dashboard + content APIs.
app.use(express.json({ limit: '12mb' }));

// Show policy links before Discord sign-in and account creation.
app.get('/auth/discord', (req, res) => {
  if (!requireDiscordConfig(res)) return;
  res.type('html').send(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Continue with Discord · GM7</title><body style="font:16px system-ui,sans-serif;max-width:42rem;margin:10vh auto;padding:1.5rem;line-height:1.6;color:#171717"><h1>Continue with Discord</h1><p>GM7 uses Discord sign-in to create or access your account. Review the <a href="${APP_URL}/legal/privacy">draft Privacy Policy</a> and <a href="${APP_URL}/legal/terms">draft Terms of Service</a> before continuing. These documents are marked as drafts and require lawyer review.</p><p><a href="/auth/discord/continue" style="display:inline-block;padding:.7rem 1rem;background:#ffbe0d;color:#111;border-radius:.5rem;font-weight:700;text-decoration:none">Continue to Discord</a></p><p><a href="${APP_URL}/">Return to GM7</a></p></body></html>`);
});

// Start Discord OAuth flow: set CSRF state cookie, redirect to Discord.
app.get('/auth/discord/continue', (req, res) => {
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
    scope: 'identify',
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
const TIKTOK_USERNAME = (process.env.TIKTOK_USERNAME || 'snnsei_').replace(/^@/, '');
const INSTAGRAM_USERNAME = (process.env.INSTAGRAM_USERNAME || 'snnseii').replace(/^@/, '');
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';
const INSTAGRAM_FEED_URL = process.env.INSTAGRAM_FEED_URL || '';
const FEED_CACHE_TTL_MS = 5 * 60_000;
const MEDIA_PREVIEW_TTL_MS = 10 * 60_000;
const MEDIA_IMAGE_TTL_MS = 6 * 60 * 60_000;
const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const CRAWLER_USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
let feedCache = { data: null, at: 0 };
const mediaPreviewCache = new Map();
const mediaImageCache = new Map();

function stripHtml(value = '') {
  return String(value).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim();
}

function readXmlTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? stripHtml(match[1]) : '';
}

function formatDuration(seconds) {
  const total = Math.floor(Math.max(0, Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remaining = total % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}` : `${minutes}:${String(remaining).padStart(2, '0')}`;
}

async function fetchYouTubeFeed() {
  // A handle resolves to its canonical channel ID without requiring an API key.
  const channelPage = await fetch(`https://www.youtube.com/${YOUTUBE_CHANNEL_HANDLE}`, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!channelPage.ok) throw new Error(`YouTube channel responded with ${channelPage.status}`);
  const channelHtml = await channelPage.text();
  const channelId =
    channelHtml.match(/"externalId":"(UC[\w-]{22})"/)?.[1] ||
    channelHtml.match(/"channelId":"(UC[\w-]{22})"/)?.[1] ||
    channelHtml.match(/itemprop="identifier"\s+content="(UC[\w-]{22})"/)?.[1] ||
    channelHtml.match(/youtube\.com\/channel\/(UC[\w-]{22})/)?.[1];
  if (!channelId) throw new Error('Could not find YouTube channel ID');

  const rss = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
    headers: {
      Accept: 'application/atom+xml',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    },
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

function tiktokVideoListFromHtml(html) {
  const scripts = html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
  for (const tag of scripts) {
    if (!tag.includes('videoList')) continue;
    const body = tag.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '');
    try {
      const parsed = JSON.parse(body);
      const source = parsed?.source?.data;
      if (!source || typeof source !== 'object') continue;
      for (const value of Object.values(source)) {
        if (value && Array.isArray(value.videoList)) return value.videoList;
      }
    } catch {
      // Ignore scripts that are not plain JSON.
    }
  }
  return [];
}

function compareTikTokIds(left, right) {
  try {
    const a = BigInt(left.id);
    const b = BigInt(right.id);
    return a === b ? 0 : a < b ? 1 : -1;
  } catch {
    return 0;
  }
}

async function fetchTikTokFeed() {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
  let lastStatus = 0;
  let html = '';
  const delays = [0, 700, 1400, 2100, 2800];

  for (const delay of delays) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    const response = await fetch(`https://www.tiktok.com/embed/@${TIKTOK_USERNAME}`, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: `https://www.tiktok.com/@${TIKTOK_USERNAME}`,
        'User-Agent': userAgent,
      },
      signal: AbortSignal.timeout(10000),
    });
    lastStatus = response.status;
    if (response.ok) {
      html = await response.text();
      break;
    }
  }

  if (!html) throw new Error(`TikTok embed responded with ${lastStatus}`);

  const videos = tiktokVideoListFromHtml(html)
    .filter((video) => video && video.id && !video.privateItem)
    .sort(compareTikTokIds)
    .slice(0, 5);

  return videos.map((video) => ({
    id: `tiktok-${video.id}`,
    platform: 'tiktok',
    title: video.desc || 'TikTok video',
    thumb: video.coverUrl || video.originCoverUrl || video.dynamicCoverUrl || '',
    category: 'TikTok video',
    duration: '',
    views: String(video.playCount ?? ''),
    publishedAt: '',
    url: `https://www.tiktok.com/@${video.authorUniqueId || TIKTOK_USERNAME}/video/${video.id}`,
  }));
}

function tiktokVideoIdFromUrl(value) {
  try {
    const url = new URL(value);
    if (!/(^|\.)tiktok\.com$/i.test(url.hostname)) return '';
    return url.pathname.match(/\/(?:video|photo)\/(\d{6,})/)?.[1] || url.searchParams.get('item_id') || '';
  } catch {
    return '';
  }
}

async function fetchTikTokVideoPreview(value) {
  let id = tiktokVideoIdFromUrl(value);
  if (!id) {
    try {
      const resolved = await fetch(value, {
        redirect: 'follow',
        headers: { Accept: 'text/html', 'User-Agent': BROWSER_USER_AGENT },
        signal: AbortSignal.timeout(8000),
      });
      id = tiktokVideoIdFromUrl(resolved.url);
    } catch {
      // Fall through to the invalid-link error below.
    }
  }
  if (!id) throw new Error('Paste a link to a TikTok video.');

  let lastStatus = 0;
  let html = '';
  const delays = [0, 700, 1400, 2100, 2800];
  for (const delay of delays) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    const response = await fetch(`https://www.tiktok.com/embed/v2/${id}`, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: `https://www.tiktok.com/@${TIKTOK_USERNAME}`,
        'User-Agent': BROWSER_USER_AGENT,
      },
      signal: AbortSignal.timeout(10000),
    });
    lastStatus = response.status;
    if (response.ok) {
      html = await response.text();
      break;
    }
  }
  if (!html) throw new Error(`TikTok responded with ${lastStatus}`);

  const stateMatch = html.match(/<script[^>]*id="__FRONTITY_CONNECT_STATE__"[^>]*>([\s\S]*?)<\/script>/i);
  if (stateMatch) {
    try {
      const state = JSON.parse(stateMatch[1]);
      for (const entry of Object.values(state?.source?.data || {})) {
        const info = entry?.videoData?.itemInfos;
        if (!info || String(info.id) !== id) continue;
        const author = entry?.videoData?.authorInfos;
        const seconds = Number(info.video?.videoMeta?.duration);
        return {
          platform: 'tiktok',
          title: String(info.text || '').trim(),
          thumb: info.covers?.[0] || info.coversOrigin?.[0] || '',
          category: 'TikTok video',
          duration: seconds > 0 ? formatDuration(seconds) : '',
          views: String(info.playCount ?? ''),
          likes: String(info.diggCount ?? ''),
          publishedAt: info.createTime
            ? new Date(Number(info.createTime) * 1000).toISOString().slice(0, 10)
            : '',
          url: `https://www.tiktok.com/@${author?.uniqueId || TIKTOK_USERNAME}/video/${id}`,
          author: author?.nickName || author?.uniqueId || '',
        };
      }
    } catch {
      // Fall back to oEmbed below.
    }
  }

  const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(value)}`, {
    headers: { Accept: 'application/json', 'User-Agent': BROWSER_USER_AGENT },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`TikTok responded with ${response.status}`);
  const data = await response.json();
  return {
    platform: 'tiktok',
    title: data.title || '',
    thumb: data.thumbnail_url || '',
    category: 'TikTok video',
    duration: '',
    views: '',
    likes: '',
    publishedAt: '',
    url: value,
    author: data.author_name || '',
  };
}

function instagramItemsFromFeedBody(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed);
    const pickList = (value) => {
      if (Array.isArray(value)) return value;
      if (!value || typeof value !== 'object') return [];
      return pickList(value.items || value.data || value.posts || value.media || value.edges || []);
    };
    return pickList(parsed);
  }

  const blocks = text.match(/<(?:item|entry)>[\s\S]*?<\/(?:item|entry)>/gi) || [];
  return blocks.map((block) => ({
    title: readXmlTag(block, 'title'),
    url: block.match(/<link[^>]*href="([^"]+)"/i)?.[1] || readXmlTag(block, 'link') || readXmlTag(block, 'guid'),
    thumbnail:
      block.match(/<media:thumbnail[^>]*url="([^"]+)"/i)?.[1] ||
      block.match(/<enclosure[^>]*url="([^"]+)"/i)?.[1] ||
      block.match(/<img[^>]*src="([^"]+)"/i)?.[1] ||
      '',
    timestamp: readXmlTag(block, 'pubDate') || readXmlTag(block, 'published') || readXmlTag(block, 'updated'),
  }));
}

function toInstagramItem(input = {}, index = 0) {
  const raw = input.node && typeof input.node === 'object' ? input.node : input;
  const pick = (...keys) => {
    for (const key of keys) {
      const value = raw[key];
      if (value !== undefined && value !== null && value !== '') return value;
    }
    return '';
  };
  const caption = String(pick('caption', 'title', 'text', 'desc') || '').trim();
  const url = pick('permalink', 'url', 'link');
  const id = pick('id', 'shortcode', 'code', 'guid') || url || `item-${index + 1}`;
  const type = String(pick('media_type', 'mediaType', 'type') || '').toLowerCase();
  return {
    id: `instagram-${id}`,
    platform: 'instagram',
    title: caption || 'Instagram post',
    thumb: pick('thumbnail_url', 'thumbnailUrl', 'thumbnail', 'media_url', 'mediaUrl', 'image', 'imageUrl', 'cover'),
    category: type.includes('video') || type.includes('reel') ? 'Instagram reel' : 'Instagram post',
    duration: '',
    views: String(pick('views', 'view_count', 'viewCount', 'play_count', 'playCount')),
    likes: String(pick('like_count', 'likeCount', 'likes')),
    publishedAt: pick('timestamp', 'publishedAt', 'published', 'date', 'taken_at'),
    url: url || `https://www.instagram.com/${INSTAGRAM_USERNAME}/`,
  };
}

async function fetchInstagramFeed() {
  // Instagram blocks anonymous scraping from most servers. Use the official
  // Graph API when a token is configured, or a user-supplied JSON/RSS feed.
  // Without either, the page simply shows posts pinned in the dashboard.
  if (INSTAGRAM_ACCESS_TOKEN) {
    const params = new URLSearchParams({
      fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count',
      limit: '5',
      access_token: INSTAGRAM_ACCESS_TOKEN,
    });
    const response = await fetch(`https://graph.instagram.com/v26.0/me/media?${params}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Instagram API responded with ${response.status}`);
    const payload = await response.json();
    return (payload.data || []).slice(0, 5).map(toInstagramItem);
  }

  if (INSTAGRAM_FEED_URL) {
    const response = await fetch(INSTAGRAM_FEED_URL, {
      headers: { Accept: 'application/json, application/rss+xml, application/atom+xml, text/xml' },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Instagram feed responded with ${response.status}`);
    return instagramItemsFromFeedBody(await response.text()).slice(0, 5).map(toInstagramItem);
  }

  return [];
}

function youtubeIdFromUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    if (host === 'youtu.be') return url.pathname.match(/^\/([\w-]{6,})/)?.[1] || '';
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      return (
        url.searchParams.get('v')?.match(/^[\w-]{6,}$/)?.[0] ||
        url.pathname.match(/\/(?:embed|shorts|live|v)\/([\w-]{6,})/)?.[1] ||
        ''
      );
    }
  } catch {
    // Not a URL.
  }
  return '';
}

function instagramShortcodeFromUrl(value) {
  try {
    const url = new URL(value);
    if (!/(^|\.)instagram\.com$/i.test(url.hostname)) return '';
    return url.pathname.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/)?.[1] || '';
  } catch {
    return '';
  }
}

function isInstagramImageHost(host) {
  return (
    host === 'instagram.com' ||
    host.endsWith('.instagram.com') ||
    host === 'cdninstagram.com' ||
    host.endsWith('.cdninstagram.com') ||
    host === 'fbcdn.net' ||
    host.endsWith('.fbcdn.net')
  );
}

async function fetchInstagramStats(shortcode) {
  try {
    const response = await fetch(`https://www.instagram.com/p/${shortcode}/embed/captioned/`, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://www.instagram.com/',
        'User-Agent': CRAWLER_USER_AGENT,
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return {};
    const html = await response.text();
    const duration = html.match(/video_duration\\?":\s*([0-9.]+)/)?.[1];
    const views = html.match(/video_view_count\\?":\s*([0-9]+)/)?.[1];
    const likes = html.match(/edge_liked_by\\?":\s*\{\\?"count\\?":\s*([0-9]+)/)?.[1];
    return {
      duration: duration ? formatDuration(duration) : '',
      views: views || '',
      likes: likes || '',
    };
  } catch {
    return {};
  }
}

async function fetchMediaPreview(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('Enter a valid link.');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http(s) links are supported.');
  }

  const host = url.hostname.replace(/^www\./i, '').toLowerCase();
  const headers = { Accept: 'application/json', 'User-Agent': BROWSER_USER_AGENT };

  if (host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtu.be') {
    const id = youtubeIdFromUrl(value);
    if (!id) throw new Error('Paste a link to a YouTube video.');
    const response = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`,
      { headers, signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error(`YouTube responded with ${response.status}`);
    const data = await response.json();

    let views = '';
    let duration = '';
    let likes = '';
    try {
      const watch = await fetch(`https://www.youtube.com/watch?v=${id}`, {
        headers: { Accept: 'text/html', 'User-Agent': BROWSER_USER_AGENT },
        signal: AbortSignal.timeout(8000),
      });
      if (watch.ok) {
        const html = await watch.text();
        views = html.match(/"viewCount":"(\d+)"/)?.[1] || '';
        likes = html.match(/"likeCount":"(\d+)"/)?.[1] || '';
        const seconds = html.match(/"lengthSeconds":"(\d+)"/)?.[1];
        if (seconds) duration = formatDuration(seconds);
      }
    } catch {
      // Views/duration/likes are optional; title and thumbnail already work.
    }

    return {
      platform: 'youtube',
      title: data.title || '',
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      category: 'YouTube video',
      duration,
      views,
      likes,
      publishedAt: '',
      url: `https://www.youtube.com/watch?v=${id}`,
      author: data.author_name || '',
    };
  }

  if (host === 'instagram.com' || host.endsWith('.instagram.com')) {
    const shortcode = instagramShortcodeFromUrl(value);
    if (!shortcode) throw new Error('Paste an Instagram post or reel link.');
    const normalized = `https://www.instagram.com/p/${shortcode}/`;
    const [response, stats] = await Promise.all([
      fetch(`https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(normalized)}`, {
        headers,
        signal: AbortSignal.timeout(8000),
      }),
      fetchInstagramStats(shortcode),
    ]);
    if (!response.ok) throw new Error(`Instagram responded with ${response.status}`);
    const data = await response.json();
    const isReel = /\/reel\//i.test(data.html || '') || /\/reel\//i.test(url.pathname);

    return {
      platform: 'instagram',
      title: data.title || '',
      thumb: `https://www.instagram.com/p/${shortcode}/media/?size=l`,
      category: isReel ? 'Instagram reel' : 'Instagram post',
      duration: stats.duration || '',
      views: stats.views || '',
      likes: stats.likes || '',
      publishedAt: '',
      url: normalized,
      author: data.author_name || '',
    };
  }

  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
    return fetchTikTokVideoPreview(url.toString());
  }

  throw new Error('Auto-fill supports YouTube, TikTok, and Instagram links.');
}

async function fetchContentFeed(forceRefresh = false) {
  if (!forceRefresh && feedCache.data && Date.now() - feedCache.at < FEED_CACHE_TTL_MS) return feedCache.data;
  const [youtube, kick, tiktok, instagram] = await Promise.allSettled([
    fetchYouTubeFeed(),
    fetchKickClips(),
    fetchTikTokFeed(),
    fetchInstagramFeed(),
  ]);
  for (const [source, result] of Object.entries({ youtube, kick, tiktok, instagram })) {
    if (result.status === 'rejected') {
      console.error(`[Feed] ${source} failed:`, result.reason?.message || result.reason);
    }
  }
  const data = {
    updatedAt: new Date().toISOString(),
    channels: {
      youtube: youtube.status === 'fulfilled' ? youtube.value : [],
      kick: kick.status === 'fulfilled' ? kick.value : [],
      tiktok: tiktok.status === 'fulfilled' ? tiktok.value : [],
      instagram: instagram.status === 'fulfilled' ? instagram.value : [],
    },
    errors: {
      ...(youtube.status === 'rejected' ? { youtube: 'Unable to load the latest YouTube videos.' } : {}),
      ...(kick.status === 'rejected' ? { kick: 'Unable to load the latest Kick clips.' } : {}),
      ...(tiktok.status === 'rejected' ? { tiktok: 'Unable to load the latest TikTok videos.' } : {}),
      ...(instagram.status === 'rejected' ? { instagram: 'Unable to load the latest Instagram posts.' } : {}),
    },
  };
  if (!Object.values(data.channels).some((items) => items.length)) throw new Error('No feed sources available');
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

// Resolve a pasted social link into title/thumbnail/etc. for the dashboard.
app.get(
  '/api/media/preview',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const target = typeof req.query.url === 'string' ? req.query.url.trim() : '';
    if (!target) return res.status(400).json({ error: 'Paste a link first.' });

    const cached = mediaPreviewCache.get(target);
    if (cached && Date.now() - cached.at < MEDIA_PREVIEW_TTL_MS) return res.json(cached.data);

    try {
      const data = await fetchMediaPreview(target);
      mediaPreviewCache.set(target, { data, at: Date.now() });
      return res.json(data);
    } catch (error) {
      return res.status(422).json({ error: error.message || 'Could not read that link.' });
    }
  }),
);

// Proxy Instagram thumbnails so browsers never have to load Instagram's
// redirecting media URLs or signed fbcdn links directly.
app.get(
  '/api/media/image',
  asyncHandler(async (req, res) => {
    const target = typeof req.query.url === 'string' ? req.query.url.trim() : '';
    let url;
    try {
      url = new URL(target);
    } catch {
      return res.status(400).json({ error: 'Invalid image URL' });
    }
    if (url.protocol !== 'https:' || !isInstagramImageHost(url.hostname.toLowerCase())) {
      return res.status(400).json({ error: 'Unsupported image URL' });
    }

    const cacheKey = url.toString();
    const cached = mediaImageCache.get(cacheKey);
    if (cached && Date.now() - cached.at < MEDIA_IMAGE_TTL_MS) {
      res.setHeader('Content-Type', cached.type);
      res.setHeader('Cache-Control', 'public, max-age=21600');
      return res.send(cached.buffer);
    }

    const response = await fetch(cacheKey, {
      redirect: 'follow',
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        Referer: 'https://www.instagram.com/',
        'User-Agent': BROWSER_USER_AGENT,
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      return res.status(502).json({ error: `Instagram image responded with ${response.status}` });
    }
    const type = response.headers.get('content-type') || '';
    if (!type.startsWith('image/')) {
      return res.status(502).json({ error: 'Instagram did not return an image' });
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > 8 * 1024 * 1024) {
      return res.status(502).json({ error: 'Image is too large' });
    }

    if (mediaImageCache.size >= 100) {
      for (const [key, entry] of mediaImageCache) {
        if (Date.now() - entry.at >= MEDIA_IMAGE_TTL_MS) mediaImageCache.delete(key);
      }
      while (mediaImageCache.size >= 100) {
        mediaImageCache.delete(mediaImageCache.keys().next().value);
      }
    }
    mediaImageCache.set(cacheKey, { buffer, type, at: Date.now() });

    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', 'public, max-age=21600');
    res.send(buffer);
  }),
);

// --- admin auth ------------------------------------------------------------

app.get('/api/admin/session', (req, res) => {
  res.json({
    authenticated: isAdminRequest(req),
    usingDefaultPassword: USING_DEFAULT_ADMIN_PASSWORD,
    authDisabled: ADMIN_AUTH_DISABLED,
  });
});

app.post('/api/admin/login', asyncHandler(async (req, res) => {
  if (ADMIN_AUTH_DISABLED) {
    return res.json({ ok: true, usingDefaultPassword: USING_DEFAULT_ADMIN_PASSWORD, authDisabled: true });
  }

  const clientIp = getClientIp(req);
  const rateLimit = checkAdminRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: rateLimit.error });
  }

  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  const usernameValid = safeEqual(username.toLowerCase(), ADMIN_USERNAME.toLowerCase());
  const passwordValid = Boolean(ADMIN_PASSWORD && safeEqual(password, ADMIN_PASSWORD));

  if (!usernameValid || !passwordValid) {
    recordAdminLoginFailure(clientIp);
    // Artificial throttle delay to slow down automated attackers
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.floor(Math.random() * 200)));
    return res.status(401).json({ error: 'Incorrect username or password' });
  }

  recordAdminLoginSuccess(clientIp);

  res.setHeader(
    'Set-Cookie',
    serializeCookie(ADMIN_COOKIE, signAdminSession(), {
      maxAge: ADMIN_SESSION_TTL_MS / 1000,
      httpOnly: true,
      secure: IS_SECURE,
      sameSite: 'Strict',
    }),
  );
  res.json({ ok: true, usingDefaultPassword: USING_DEFAULT_ADMIN_PASSWORD });
}));

app.post('/api/admin/logout', (req, res) => {
  res.setHeader(
    'Set-Cookie',
    serializeCookie(ADMIN_COOKIE, '', { maxAge: 0, httpOnly: true, secure: IS_SECURE }),
  );
  res.json({ ok: true });
});

// Privacy-minimal site usage counters. Only aggregate daily totals and page keys are stored.
app.post('/api/analytics/visit', asyncHandler(async (_req, res) => {
  await recordVisit();
  res.status(204).end();
}));

app.post('/api/analytics/pageview', asyncHandler(async (req, res) => {
  await recordPageView(typeof req.body?.page === 'string' ? req.body.page : 'home');
  res.status(204).end();
}));

app.get('/api/admin/stats', requireAdmin, asyncHandler(async (_req, res) => {
  res.json(await getAnalyticsSummary());
}));

// --- editable site content -------------------------------------------------

// Public read. The browser falls back to bundled defaults when a section is null.
app.get(
  '/api/content',
  asyncHandler(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(await getContent());
  }),
);

function readSectionBody(req, key) {
  const value = req.body?.[key];
  return Array.isArray(value) ? value : null;
}

app.put(
  '/api/content/games',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const games = readSectionBody(req, 'games');
    if (!games) return res.status(400).json({ error: 'games must be an array' });
    res.json({ games: await saveGames(games) });
  }),
);

app.put(
  '/api/content/tournaments',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const tournaments = readSectionBody(req, 'tournaments');
    if (!tournaments) return res.status(400).json({ error: 'tournaments must be an array' });
    res.json({ tournaments: await saveTournaments(tournaments) });
  }),
);

app.put(
  '/api/content/socials',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const socials = readSectionBody(req, 'socials');
    if (!socials) return res.status(400).json({ error: 'socials must be an array' });
    res.json({ socials: await saveVideos(socials) });
  }),
);

// Current session user.
app.get('/api/me', asyncHandler(async (req, res) => {
  const uid = readSessionUserId(req);
  const user = uid ? await getUserById(uid) : null;
  res.json({ user: user ? toPublicUser(user) : null });
}));

// Delete the signed-in user's account record and clear the session.
app.delete('/api/me', asyncHandler(async (req, res) => {
  const uid = readSessionUserId(req);
  if (!uid) return res.status(401).json({ error: 'Sign-in required' });
  await deleteUserById(uid);
  res.setHeader(
    'Set-Cookie',
    serializeCookie(SESSION_COOKIE, '', { maxAge: 0, httpOnly: true, secure: IS_SECURE }),
  );
  res.json({ ok: true });
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

// Vercel imports this module and invokes the exported app as a serverless
// function, so only start a standalone HTTP server when running locally.
export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    const configured = DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET;
    console.log(`[GM7] server listening on http://localhost:${PORT}`);
    console.log(`[GM7] OAuth redirect URI: ${REDIRECT_URI}`);
    if (isTursoConfigured()) {
      console.log(`[GM7] Connecting to Turso database: ${process.env.TURSO_DATABASE_URL}`);
      initDatabase().catch((err) => {
        console.error('[GM7] Turso initialization error:', err.message);
      });
    } else {
      console.log('[GM7] Turso not configured — using local file storage. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env to connect to Turso.');
    }
    if (!configured) {
      console.warn('[GM7] DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET not set — login will not work yet.');
    }
    if (SESSION_SECRET === 'gm7-dev-session-secret-change-me') {
      console.warn('[GM7] Using the default SESSION_SECRET — set it in .env for production.');
    }
    if (ADMIN_AUTH_DISABLED) {
      console.warn('[GM7] ADMIN_AUTH_DISABLED is on — the dashboard is open without a login. Anyone with the URL can edit content.');
    } else if (USING_DEFAULT_ADMIN_PASSWORD) {
      console.warn('[GM7] Dashboard uses the default password "gm7-admin" — set ADMIN_PASSWORD in .env to change it.');
    }
  });
}
