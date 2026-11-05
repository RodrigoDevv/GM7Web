import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

const FALLBACK_SITE_URL = 'https://gm7.gg';

function normalizeSiteUrl(url: string): string {
  return (url || FALLBACK_SITE_URL).replace(/\/+$/, '');
}

function seoFilesPlugin(siteUrl: string): Plugin {
  const lastmod = new Date().toISOString().slice(0, 10);

  const robots = `# robots.txt for GM7 — l'Gamers Lmla7
User-agent: *
Allow: /
Disallow: /api/
Disallow: /auth/

Sitemap: ${siteUrl}/sitemap.xml
`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${siteUrl}/og-image.jpg</image:loc>
      <image:title>GM7 — l'Gamers Lmla7 featuring Snnsei</image:title>
    </image:image>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/socials</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/games</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/tournaments</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;

  return {
    name: 'gm7-seo-files',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', siteUrl);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(robots);
          return;
        }
        if (url === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(sitemap);
          return;
        }
        next();
      });
    },
    writeBundle(options) {
      const outDir = options.dir || path.resolve(__dirname, 'dist');
      try {
        fs.writeFileSync(path.join(outDir, 'robots.txt'), robots);
        fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
      } catch (error) {
        this.warn(`Failed to write SEO files: ${(error as Error).message}`);
      }
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = normalizeSiteUrl(
    process.env.VITE_SITE_URL ||
      process.env.APP_URL ||
      env.VITE_SITE_URL ||
      env.APP_URL ||
      '',
  );

  if (siteUrl === FALLBACK_SITE_URL) {
    console.warn(
      `[SEO] Set VITE_SITE_URL (or APP_URL) to your production domain so canonical URLs and sitemap.xml are correct. Falling back to ${FALLBACK_SITE_URL}.`,
    );
  }

  return {
    plugins: [react(), tailwindcss(), seoFilesPlugin(siteUrl)],
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Proxy auth/API routes to the Express server during development.
      proxy: {
        '/api': 'http://localhost:3001',
        '/auth': 'http://localhost:3001',
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
