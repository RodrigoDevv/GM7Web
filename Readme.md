# GM7

Official site for GM7 (l'Gamers Lmla7) — the home of Snnsei (Hatim Naji) on Kick. Live stream status, game library, setup, tournament listings, socials, and a small content dashboard for editing the site without touching code.

## Stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4
- Express API server (Discord OAuth, live status, analytics, content storage)
- Turso / libSQL for persistence in production, JSON files on disk for local dev

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

`npm run dev` starts the Vite dev server and the Express API together. The client runs on `http://localhost:3000`, the API on `http://localhost:3001`, and Vite proxies `/api` and `/auth` to it.

All environment variables are documented in `.env.example`. The site works without Discord or Turso configured — auth and the dashboard just fall back to local defaults.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start client + API with reload |
| `npm run dev:client` | Vite only |
| `npm run dev:server` | Express only |
| `npm run build` | Production build to `dist/` |
| `npm start` | Build-aware server start (used by `dev` and in production) |
| `npm run lint` | TypeScript type check |

## Project layout

```
src/
  components/        page sections and shared UI
  components/dashboard/  admin editors
  context/           theme, auth, content, privacy consent
  data/              default site content (games, setup, tournaments, hero)
  lib/               SEO, image proxying, smooth scroll
server/
  index.js           Express app and API routes
  content.js         content read/write + validation
  db.js, turso.js    storage layer
  analytics.js       aggregate visit/pageview counts
api/index.js         Vercel serverless entry
scripts/start.js     dev/build orchestration
```

Content defaults live in `src/data/`. Anything saved through `/dashboard` is layered on top of those defaults at runtime.

## Deploying

The app builds on Vercel as-is (`vercel.json` handles the API entry). Set the variables from `.env.example` in the project settings. For persistent content and analytics, point `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` at a Turso database; otherwise serverless instances fall back to ephemeral storage.
