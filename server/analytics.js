import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getTursoClient, initDatabase } from './turso.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');
const PAGE_KEYS = new Set(['home', 'about', 'socials', 'tournaments', 'games', 'dashboard', 'legal']);

async function readAnalytics() {
  try {
    const data = JSON.parse(await fsp.readFile(ANALYTICS_FILE, 'utf8'));
    return data && typeof data.days === 'object' && data.days ? data : { days: {} };
  } catch (error) {
    if (error?.code === 'ENOENT') return { days: {} };
    throw error;
  }
}

async function writeAnalytics(data) {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  const tempPath = `${ANALYTICS_FILE}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  await fsp.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
  await fsp.rename(tempPath, ANALYTICS_FILE);
}

let writeQueue = Promise.resolve();
function enqueueWrite(task) {
  writeQueue = writeQueue.then(task, task);
  return writeQueue;
}

let migratedAnalytics = false;
async function ensureTursoAnalyticsReady() {
  const turso = getTursoClient();
  if (!turso) return null;
  await initDatabase();

  if (!migratedAnalytics) {
    migratedAnalytics = true;
    try {
      const res = await turso.execute('SELECT COUNT(*) as count FROM analytics_daily');
      const count = Number(res.rows[0]?.count || 0);
      if (count === 0) {
        const local = await readAnalytics();
        for (const [day, val] of Object.entries(local.days || {})) {
          if (val && typeof val === 'object') {
            await turso.execute({
              sql: `INSERT OR IGNORE INTO analytics_daily (day, visits, page_views, pages)
                    VALUES (?, ?, ?, ?)`,
              args: [
                day,
                Number(val.visits) || 0,
                Number(val.pageViews) || 0,
                JSON.stringify(val.pages || {}),
              ],
            });
          }
        }
      }
    } catch (err) {
      console.warn('[Turso] Analytics migration check skipped:', err.message);
    }
  }

  return turso;
}

export function recordVisit() {
  return enqueueWrite(async () => {
    const day = new Date().toISOString().slice(0, 10);
    const turso = await ensureTursoAnalyticsReady();
    if (turso) {
      try {
        await turso.execute({
          sql: `INSERT INTO analytics_daily (day, visits, page_views, pages)
                VALUES (?, 1, 0, '{}')
                ON CONFLICT(day) DO UPDATE SET visits = visits + 1`,
          args: [day],
        });
      } catch (err) {
        console.error('[Turso] recordVisit error:', err);
      }
    }

    // Always update local file as backup
    const analytics = await readAnalytics();
    analytics.days[day] ??= { visits: 0, pageViews: 0, pages: {} };
    analytics.days[day].visits += 1;
    await writeAnalytics(analytics);
  });
}

export function recordPageView(page) {
  const pageKey = PAGE_KEYS.has(page) ? page : 'home';
  return enqueueWrite(async () => {
    const day = new Date().toISOString().slice(0, 10);
    const turso = await ensureTursoAnalyticsReady();
    if (turso) {
      try {
        // Read or insert initial row
        const rowRes = await turso.execute({
          sql: 'SELECT visits, page_views, pages FROM analytics_daily WHERE day = ?',
          args: [day],
        });

        let pages = {};
        let visits = 0;
        let pageViews = 0;
        if (rowRes.rows.length > 0) {
          visits = Number(rowRes.rows[0].visits) || 0;
          pageViews = Number(rowRes.rows[0].page_views) || 0;
          try {
            pages = JSON.parse(String(rowRes.rows[0].pages || '{}'));
          } catch {
            pages = {};
          }
        }

        pageViews += 1;
        pages[pageKey] = (Number(pages[pageKey]) || 0) + 1;

        await turso.execute({
          sql: `INSERT INTO analytics_daily (day, visits, page_views, pages)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(day) DO UPDATE SET page_views = excluded.page_views, pages = excluded.pages`,
          args: [day, visits, pageViews, JSON.stringify(pages)],
        });
      } catch (err) {
        console.error('[Turso] recordPageView error:', err);
      }
    }

    // Local file fallback / backup
    const analytics = await readAnalytics();
    analytics.days[day] ??= { visits: 0, pageViews: 0, pages: {} };
    analytics.days[day].pageViews += 1;
    analytics.days[day].pages ??= {};
    analytics.days[day].pages[pageKey] = (analytics.days[day].pages[pageKey] || 0) + 1;
    await writeAnalytics(analytics);
  });
}

export async function getAnalyticsSummary() {
  await writeQueue;
  const turso = await ensureTursoAnalyticsReady();
  if (turso) {
    try {
      const today = new Date();
      const dateKeys = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setUTCDate(today.getUTCDate() - (6 - index));
        return date.toISOString().slice(0, 10);
      });

      // Get all-time rows
      const allRows = await turso.execute('SELECT day, visits, page_views, pages FROM analytics_daily');
      const rowsByDay = new Map();
      let visitsAllTime = 0;
      const pageCounts = {};

      for (const row of allRows.rows) {
        const d = String(row.day);
        const v = Number(row.visits) || 0;
        const pv = Number(row.page_views) || 0;
        visitsAllTime += v;
        rowsByDay.set(d, { visits: v, pageViews: pv });

        let pages = {};
        try {
          pages = JSON.parse(String(row.pages || '{}'));
        } catch {
          pages = {};
        }
        for (const [page, count] of Object.entries(pages)) {
          pageCounts[page] = (pageCounts[page] || 0) + (Number(count) || 0);
        }
      }

      const days = dateKeys.map((key) => {
        const saved = rowsByDay.get(key) || { visits: 0, pageViews: 0 };
        return {
          date: key,
          visits: saved.visits,
          pageViews: saved.pageViews,
        };
      });

      return {
        days,
        visits7d: days.reduce((total, day) => total + day.visits, 0),
        pageViews7d: days.reduce((total, day) => total + day.pageViews, 0),
        visitsAllTime,
        popularPages: Object.entries(pageCounts)
          .map(([page, views]) => ({ page, views }))
          .sort((left, right) => right.views - left.views)
          .slice(0, 5),
      };
    } catch (err) {
      console.error('[Turso] getAnalyticsSummary error, falling back to local file:', err);
    }
  }

  // Fallback to local JSON
  const analytics = await readAnalytics();
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const saved = analytics.days[key] || {};
    return { date: key, visits: Number(saved.visits) || 0, pageViews: Number(saved.pageViews) || 0 };
  });
  const pageCounts = {};
  for (const saved of Object.values(analytics.days)) {
    if (!saved || typeof saved !== 'object' || !saved.pages) continue;
    for (const [page, count] of Object.entries(saved.pages)) {
      pageCounts[page] = (pageCounts[page] || 0) + (Number(count) || 0);
    }
  }
  return {
    days,
    visits7d: days.reduce((total, day) => total + day.visits, 0),
    pageViews7d: days.reduce((total, day) => total + day.pageViews, 0),
    visitsAllTime: Object.values(analytics.days).reduce((total, day) => total + (Number(day?.visits) || 0), 0),
    popularPages: Object.entries(pageCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((left, right) => right.views - left.views)
      .slice(0, 5),
  };
}
