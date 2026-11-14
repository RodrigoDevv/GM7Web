import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { getTursoClient, initDatabase } from './turso.js';
import { DATA_DIR } from './data-dir.js';

const USERS_FILE = path.join(DATA_DIR, 'users.json');
// Local JSON store fallback (used if TURSO_DATABASE_URL is not configured).
async function readUsers() {
  try {
    const raw = await fsp.readFile(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    let removedUnusedFields = false;
    for (const user of parsed) {
      if (user && (Object.hasOwn(user, 'email') || Object.hasOwn(user, 'joinedDate'))) {
        delete user.email;
        delete user.joinedDate;
        removedUnusedFields = true;
      }
    }
    if (removedUnusedFields) await writeUsers(parsed);
    return parsed;
  } catch (err) {
    if (err && err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeUsers(users) {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${USERS_FILE}.tmp`;
  await fsp.writeFile(tmp, JSON.stringify(users, null, 2), 'utf8');
  await fsp.rename(tmp, USERS_FILE);
}

let migratedUsers = false;
async function ensureTursoReady() {
  const turso = getTursoClient();
  if (!turso) return null;
  try {
    const ready = await initDatabase();
    if (!ready) return null;
  } catch {
    return null;
  }

  if (!migratedUsers) {
    migratedUsers = true;
    try {
      const countRes = await turso.execute('SELECT COUNT(*) as count FROM users');
      const count = Number(countRes.rows[0]?.count || 0);
      if (count === 0) {
        const localUsers = await readUsers();
        if (localUsers.length > 0) {
          console.log(`[Turso] Seeding ${localUsers.length} local user(s) into Turso...`);
          for (const u of localUsers) {
            await turso.execute({
              sql: 'INSERT OR IGNORE INTO users (id, discord_id, name, handle, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?)',
              args: [u.id, u.discordId, u.name, u.handle, u.avatar || null, Date.now()],
            });
          }
        }
      }
    } catch (err) {
      console.warn('[Turso] Local user migration check skipped:', err.message);
    }
  }

  return turso;
}

function rowToUser(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    discordId: String(row.discord_id),
    name: String(row.name),
    handle: String(row.handle),
    avatar: row.avatar ? String(row.avatar) : null,
  };
}
// Exported user operations (Turso with fallback to JSON)
export async function getUserById(id) {
  const turso = await ensureTursoReady();
  if (turso) {
    const result = await turso.execute({
      sql: 'SELECT id, discord_id, name, handle, avatar FROM users WHERE id = ?',
      args: [id],
    });
    return result.rows.length > 0 ? rowToUser(result.rows[0]) : null;
  }

  const users = await readUsers();
  return users.find((u) => u.id === id) || null;
}

export async function listDiscordUsers(limit = 500) {
  const boundedLimit = Math.max(1, Math.min(500, Number(limit) || 500));
  const turso = await ensureTursoReady();
  if (turso) {
    const result = await turso.execute({
      sql: 'SELECT id, discord_id, name, handle, avatar FROM users ORDER BY created_at DESC LIMIT ?',
      args: [boundedLimit],
    });
    return result.rows.map(rowToUser);
  }

  return (await readUsers()).slice(-boundedLimit).reverse();
}

export async function deleteUserById(id) {
  const turso = await ensureTursoReady();
  if (turso) {
    const result = await turso.execute({
      sql: 'DELETE FROM users WHERE id = ?',
      args: [id],
    });
    return result.rowsAffected > 0;
  }

  const users = await readUsers();
  const remaining = users.filter((user) => user.id !== id);
  if (remaining.length === users.length) return false;
  await writeUsers(remaining);
  return true;
}

export async function findUserByDiscordId(discordId) {
  const turso = await ensureTursoReady();
  if (turso) {
    const result = await turso.execute({
      sql: 'SELECT id, discord_id, name, handle, avatar FROM users WHERE discord_id = ?',
      args: [discordId],
    });
    return result.rows.length > 0 ? rowToUser(result.rows[0]) : null;
  }

  const users = await readUsers();
  return users.find((u) => u.discordId === discordId) || null;
}

export async function upsertDiscordUser(profile) {
  const name = profile.global_name || profile.username || 'Discord User';
  const handle = profile.username || 'user';
  const avatar = profile.avatar || null;
  const discordId = profile.id;

  const turso = await ensureTursoReady();
  if (turso) {
    const existing = await findUserByDiscordId(discordId);
    if (existing) {
      await turso.execute({
        sql: 'UPDATE users SET name = ?, handle = ?, avatar = COALESCE(?, avatar) WHERE discord_id = ?',
        args: [name, handle, avatar, discordId],
      });
      return {
        user: {
          ...existing,
          name,
          handle,
          avatar: avatar || existing.avatar,
        },
        created: false,
      };
    }

    const id = `usr_${crypto.randomBytes(8).toString('hex')}`;
    const now = Date.now();
    await turso.execute({
      sql: 'INSERT INTO users (id, discord_id, name, handle, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      args: [id, discordId, name, handle, avatar, now],
    });
    return {
      user: {
        id,
        discordId,
        name,
        handle,
        avatar,
      },
      created: true,
    };
  }

  // Fallback to local JSON file
  const users = await readUsers();
  const existing = users.find((u) => u.discordId === profile.id);

  if (existing) {
    existing.name = profile.global_name || profile.username || existing.name;
    existing.handle = profile.username || existing.handle;
    if (profile.avatar) existing.avatar = profile.avatar;
    await writeUsers(users);
    return { user: existing, created: false };
  }

  const user = {
    id: `usr_${crypto.randomBytes(8).toString('hex')}`,
    discordId: profile.id,
    name,
    handle,
    avatar,
  };
  users.push(user);
  await writeUsers(users);
  return { user, created: true };
}

export function toPublicUser(user) {
  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user.discordId) >> 22n) % 6n)}.png`;

  return {
    id: user.id,
    name: user.name,
    handle: user.handle,
    avatarUrl,
  };
}
