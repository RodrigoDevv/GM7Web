import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vercel (and most serverless platforms) mount the deployment as read-only.
// Only /tmp is writable, and it is ephemeral per instance. Turso should hold
// persistent data in production; local files are just a fallback/dev cache.
const SERVERLESS = Boolean(process.env.VERCEL);

export const DATA_DIR =
  process.env.GM7_DATA_DIR ||
  (SERVERLESS ? path.join('/tmp', 'gm7-data') : path.join(__dirname, 'data'));
