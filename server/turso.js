import 'dotenv/config';
import { createClient } from '@libsql/client/web';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

let client = null;
let initPromise = null;

export function isTursoConfigured() {
  return Boolean(url && url.trim());
}

export function getTursoClient() {
  if (!isTursoConfigured()) return null;
  if (!client) {
    client = createClient({
      url: url.trim(),
      authToken: authToken?.trim() || undefined,
    });
  }
  return client;
}

export async function initDatabase() {
  const turso = getTursoClient();
  if (!turso) return false;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // 1. Users table
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          discord_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          handle TEXT NOT NULL,
          avatar TEXT,
          created_at INTEGER NOT NULL
        );
      `);

      // 2. Content table (stores customized games, tournaments, and social videos)
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS content (
          key TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);

      // 3. Analytics table (daily visits and page views)
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS analytics_daily (
          day TEXT PRIMARY KEY,
          visits INTEGER NOT NULL DEFAULT 0,
          page_views INTEGER NOT NULL DEFAULT 0,
          pages TEXT NOT NULL DEFAULT '{}'
        );
      `);

      console.log('[Turso] Database schema verified and initialized.');
      return true;
    } catch (err) {
      console.error('[Turso] Failed to initialize database schema:', err);
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

