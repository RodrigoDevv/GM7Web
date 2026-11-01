import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// ---------------------------------------------------------------------------
// User store.
// Currently backed by a JSON file. To move to Turso later, replace the bodies
// of readUsers/writeUsers (or the exported functions) with @libsql/client
// queries — every caller only uses the exported functions below.
// ---------------------------------------------------------------------------

async function readUsers() {
  try {
    const raw = await fsp.readFile(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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

export async function getUserById(id) {
  const users = await readUsers();
  return users.find((u) => u.id === id) || null;
}

export async function findUserByDiscordId(discordId) {
  const users = await readUsers();
  return users.find((u) => u.discordId === discordId) || null;
}

export async function upsertDiscordUser(profile) {
  const users = await readUsers();
  const existing = users.find((u) => u.discordId === profile.id);

  if (existing) {
    existing.name = profile.global_name || profile.username || existing.name;
    existing.handle = profile.username || existing.handle;
    if (profile.email) existing.email = profile.email;
    if (profile.avatar) existing.avatar = profile.avatar;
    await writeUsers(users);
    return { user: existing, created: false };
  }

  const user = {
    id: `usr_${crypto.randomBytes(8).toString('hex')}`,
    discordId: profile.id,
    name: profile.global_name || profile.username || 'Discord User',
    handle: profile.username || 'user',
    email: profile.email || null,
    avatar: profile.avatar || null,
    joinedDate: new Date().toISOString(),
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
    email: user.email || null,
    avatarUrl,
    joinedDate: user.joinedDate,
  };
}
