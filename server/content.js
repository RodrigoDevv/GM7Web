import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { getTursoClient, initDatabase } from './turso.js';
import { DATA_DIR } from './data-dir.js';

const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

// `null` means "no custom content yet" so the client can fall back to its
// bundled defaults (images included). Once an admin saves a section it becomes
// an array, even if empty.
const INSTAGRAM_POSTS = [
  'DfbtiVIKapv',
  'DfZJAB_NI0U',
  'DfWjSFEKFNk',
  'DfUD1Wdu4xG',
  'DfRcseROheZ',
].map((shortcode) => ({
  id: `instagram-${shortcode}`,
  platform: 'instagram',
  title: `Instagram video · ${shortcode}`,
  url: `https://www.instagram.com/p/${shortcode}/`,
  thumb: `https://www.instagram.com/p/${shortcode}/media/?size=l`,
  category: 'Instagram video',
  publishedAt: '',
}));
const EMPTY_CONTENT = { games: null, tournaments: null, socials: INSTAGRAM_POSTS, setup: null, hero: null };

const TOURNAMENT_STATUSES = ['Registration Open', 'Closing Soon', 'Waitlist'];
const SOCIAL_PLATFORMS = ['youtube', 'kick', 'tiktok', 'instagram'];
const DEFAULT_VIDEO_CATEGORY = {
  youtube: 'YouTube video',
  kick: 'Kick clip',
  tiktok: 'TikTok video',
  instagram: 'Instagram post',
};

function asString(value, fallback = '') {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function withUniqueId(value, prefix, index, seen) {
  let id = asString(value).trim();
  if (!id) id = `${prefix}-${index + 1}`;
  let candidate = id;
  let suffix = 2;
  while (seen.has(candidate)) {
    candidate = `${id}-${suffix}`;
    suffix += 1;
  }
  seen.add(candidate);
  return candidate;
}

export function normalizeGame(raw = {}, index = 0, seen = new Set()) {
  return {
    id: withUniqueId(raw.id, 'game', index, seen),
    title: asString(raw.title, 'Untitled game'),
    genre: asString(raw.genre, 'Game'),
    category: asString(raw.category, 'Game'),
    tag: asString(raw.tag, 'Featured'),
    image: asString(raw.image),
    scheduleDay: asString(raw.scheduleDay),
    initialHypes: asNumber(raw.initialHypes, 0),
    rankBadge: asString(raw.rankBadge),
    loadout: asString(raw.loadout),
    squadStatus: asString(raw.squadStatus),
    description: asString(raw.description),
    youtubeUrl: asString(raw.youtubeUrl),
    showOnHome: raw.showOnHome === undefined ? true : asBoolean(raw.showOnHome),
  };
}

export function normalizeTournament(raw = {}, index = 0, seen = new Set()) {
  const status = TOURNAMENT_STATUSES.includes(raw.status) ? raw.status : 'Registration Open';
  const winner = raw.winner && typeof raw.winner === 'object' && !Array.isArray(raw.winner)
    ? {
        id: asString(raw.winner.id),
        name: asString(raw.winner.name),
        handle: asString(raw.winner.handle),
        avatarUrl: asString(raw.winner.avatarUrl),
      }
    : null;
  return {
    id: withUniqueId(raw.id, 'tournament', index, seen),
    name: asString(raw.name, 'Untitled tournament'),
    game: asString(raw.game, 'Game'),
    format: asString(raw.format),
    dateLabel: asString(raw.dateLabel),
    startIso: asString(raw.startIso),
    prizePool: asString(raw.prizePool, 'Free'),
    entry: asString(raw.entry, 'Free entry'),
    filledSlots: Math.max(0, asNumber(raw.filledSlots, 0)),
    maxSlots: Math.max(1, asNumber(raw.maxSlots, 1)),
    status,
    platform: asString(raw.platform),
    description: asString(raw.description),
    image: asString(raw.image),
    featured: asBoolean(raw.featured),
    squadRegistration: asBoolean(raw.squadRegistration),
    winner: winner?.id ? winner : null,
  };
}

export function normalizeVideo(raw = {}, index = 0, seen = new Set()) {
  const platform = SOCIAL_PLATFORMS.includes(raw.platform) ? raw.platform : 'youtube';
  return {
    id: withUniqueId(raw.id, 'video', index, seen),
    platform,
    title: asString(raw.title, 'Untitled video'),
    url: asString(raw.url),
    thumb: asString(raw.thumb),
    category: asString(raw.category, DEFAULT_VIDEO_CATEGORY[platform]),
    duration: asString(raw.duration),
    views: asString(raw.views),
    likes: asString(raw.likes),
    publishedAt: asString(raw.publishedAt),
  };
}

export function normalizeHeroSlide(raw = {}, index = 0, seen = new Set()) {
  return {
    id: withUniqueId(raw.id, 'hero', index, seen),
    src: asString(raw.src),
    alt: asString(raw.alt, `Hero image ${index + 1}`),
  };
}

export function normalizeSetupItem(raw = {}, index = 0, seen = new Set()) {
  const hotspot = raw.hotspot && typeof raw.hotspot === 'object' ? raw.hotspot : {};
  return {
    id: withUniqueId(raw.id, 'setup', index, seen),
    name: asString(raw.name, 'New item'),
    category: asString(raw.category),
    spec: asString(raw.spec),
    icon: asString(raw.icon, 'box'),
    image: asString(raw.image),
    hotspot: {
      x: Math.min(100, Math.max(0, asNumber(hotspot.x, 50))),
      y: Math.min(100, Math.max(0, asNumber(hotspot.y, 50))),
    },
  };
}

export function normalizeSetup(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const seen = new Set();
  return {
    backgroundImage: asString(raw.backgroundImage),
    items: Array.isArray(raw.items)
      ? raw.items
          .filter((item) => item && typeof item === 'object')
          .map((item, index) => normalizeSetupItem(item, index, seen))
      : [],
  };
}

export function normalizeTournamentStats(raw = {}) {
  const str = (value, fallback) => {
    const s = asString(value).trim();
    return s || fallback;
  };
  return {
    hosted: str(raw.hosted, '24'),
    prizePool: str(raw.prizePool, '$18,400'),
    players: str(raw.players, '1,286'),
    champions: str(raw.champions, '24'),
  };
}

function normalizeList(list, normalizer) {
  if (!Array.isArray(list)) return null;
  const seen = new Set();
  return list
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => normalizer(item, index, seen));
}

async function readContentFile() {
  try {
    const raw = await fsp.readFile(CONTENT_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      games: Array.isArray(parsed.games)
        ? normalizeList(parsed.games, normalizeGame)
        : null,
      tournaments: Array.isArray(parsed.tournaments)
        ? normalizeList(parsed.tournaments, normalizeTournament)
        : null,
      tournamentStats: parsed.tournamentStats && typeof parsed.tournamentStats === 'object'
        ? normalizeTournamentStats(parsed.tournamentStats)
        : null,
      socials: Array.isArray(parsed.socials)
        ? normalizeList(parsed.socials, normalizeVideo) ?? []
        : [],
      setup: parsed.setup && typeof parsed.setup === 'object'
        ? normalizeSetup(parsed.setup)
        : null,
      hero: Array.isArray(parsed.hero)
        ? normalizeList(parsed.hero, normalizeHeroSlide)
        : null,
    };
  } catch (error) {
    if (error && error.code === 'ENOENT') return { ...EMPTY_CONTENT };
    throw error;
  }
}

async function writeContentFile(content) {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${CONTENT_FILE}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  await fsp.writeFile(tmp, JSON.stringify(content, null, 2), 'utf8');
  await fsp.rename(tmp, CONTENT_FILE);
}

let writeQueue = Promise.resolve();

function enqueueWrite(task) {
  writeQueue = writeQueue.then(task, task);
  return writeQueue;
}

let migratedContent = false;
async function ensureTursoContentReady() {
  const turso = getTursoClient();
  if (!turso) return null;
  try {
    const ready = await initDatabase();
    if (!ready) return null;
  } catch {
    return null;
  }

  if (!migratedContent) {
    migratedContent = true;
    try {
      const res = await turso.execute('SELECT COUNT(*) as count FROM content');
      const count = Number(res.rows[0]?.count || 0);
      if (count === 0) {
        const local = await readContentFile();
        console.log('[Turso] Seeding initial content into Turso database...');
        for (const [sec, items] of Object.entries(local)) {
          if (items !== null && items !== undefined) {
            await turso.execute({
              sql: 'INSERT OR REPLACE INTO content (key, data, updated_at) VALUES (?, ?, ?)',
              args: [sec, JSON.stringify(items), Date.now()],
            });
          }
        }
      }
    } catch (err) {
      console.warn('[Turso] Content migration check skipped:', err.message);
    }
  }

  return turso;
}

export async function getContent() {
  await writeQueue;
  const turso = await ensureTursoContentReady();
  if (turso) {
    try {
      const res = await turso.execute('SELECT key, data FROM content');
      const map = {};
      for (const row of res.rows) {
        try {
          map[row.key] = JSON.parse(row.data);
        } catch {
          map[row.key] = null;
        }
      }
      return {
        games: Array.isArray(map.games) ? normalizeList(map.games, normalizeGame) : null,
        tournaments: Array.isArray(map.tournaments) ? normalizeList(map.tournaments, normalizeTournament) : null,
        tournamentStats: map.tournamentStats && typeof map.tournamentStats === 'object'
          ? normalizeTournamentStats(map.tournamentStats)
          : null,
        socials: Array.isArray(map.socials) ? normalizeList(map.socials, normalizeVideo) ?? [] : (EMPTY_CONTENT.socials || []),
        setup: map.setup && typeof map.setup === 'object' ? normalizeSetup(map.setup) : null,
        hero: Array.isArray(map.hero) ? normalizeList(map.hero, normalizeHeroSlide) : null,
      };
    } catch (err) {
      console.error('[Turso] Error reading content from Turso, falling back to local file:', err);
    }
  }
  return readContentFile();
}

async function saveSection(section, normalizer, items) {
  const list = normalizeList(items, normalizer);
  if (list === null) throw new Error('Expected an array of items');
  return enqueueWrite(async () => {
    const turso = await ensureTursoContentReady();
    if (turso) {
      try {
        await turso.execute({
          sql: `INSERT INTO content (key, data, updated_at) VALUES (?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
          args: [section, JSON.stringify(list), Date.now()],
        });
      } catch (err) {
        console.error('[Turso] Error saving content to Turso:', err);
      }
    }
    // Also update local file cache
    const content = await readContentFile();
    content[section] = list;
    await writeContentFile(content);
    return list;
  });
}

export function saveGames(games) {
  return saveSection('games', normalizeGame, games);
}

export function saveHero(hero) {
  return saveSection('hero', normalizeHeroSlide, hero);
}

export function saveTournaments(tournaments) {
  return saveSection('tournaments', normalizeTournament, tournaments);
}

export function saveVideos(videos) {
  return saveSection('socials', normalizeVideo, videos);
}

export function saveSetup(setup) {
  const normalized = normalizeSetup(setup);
  if (!normalized) throw new Error('Expected a setup object');
  return enqueueWrite(async () => {
    const turso = await ensureTursoContentReady();
    if (turso) {
      try {
        await turso.execute({
          sql: `INSERT INTO content (key, data, updated_at) VALUES (?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
          args: ['setup', JSON.stringify(normalized), Date.now()],
        });
      } catch (err) {
        console.error('[Turso] Error saving setup to Turso:', err);
      }
    }
    const content = await readContentFile();
    content.setup = normalized;
    await writeContentFile(content);
    return normalized;
  });
}

export function saveTournamentStats(stats) {
  const normalized = normalizeTournamentStats(stats ?? {});
  return enqueueWrite(async () => {
    const turso = await ensureTursoContentReady();
    if (turso) {
      try {
        await turso.execute({
          sql: `INSERT INTO content (key, data, updated_at) VALUES (?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
          args: ['tournamentStats', JSON.stringify(normalized), Date.now()],
        });
      } catch (err) {
        console.error('[Turso] Error saving tournament stats to Turso:', err);
      }
    }
    const content = await readContentFile();
    content.tournamentStats = normalized;
    await writeContentFile(content);
    return normalized;
  });
}
