import { useEffect } from 'react';
import type { Page } from '../types/navigation';

declare const __SITE_URL__: string;

const FALLBACK_SITE_URL = 'https://gm7.gg';

const SITE_URL = (typeof __SITE_URL__ === 'string' ? __SITE_URL__ : FALLBACK_SITE_URL).replace(
  /\/+$/,
  '',
);

export type SeoPage = Page;

interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  path: string;
  imageAlt: string;
}

const PAGE_META: Record<SeoPage, PageMeta> = {
  home: {
    title: "GM7 | l'Gamers Lmla7 — Snnsei's Apex Legends & FPS Stream",
    description:
      "GM7 (l'Gamers Lmla7) is the official home of Snnsei (Hatim Naji), a competitive FPS streamer on Kick. Watch live Apex Legends, join community tournaments, squad up on Discord, and catch daily highlights.",
    keywords:
      'GM7, l\'Gamers Lmla7, Snnsei, Hatim Naji, Kick streamer, Apex Legends streamer, FPS streamer, gaming community, GM7 Discord, GM7 tournaments, Moroccan gaming community, Arabic gaming community, live gaming streams',
    path: '/',
    imageAlt: 'Snnsei, competitive FPS streamer and founder of GM7',
  },
  about: {
    title: "About Snnsei (Hatim Naji) — Founder of GM7 | l'Gamers Lmla7",
    description:
      'Meet Snnsei, also known as Hatim Naji: competitive FPS streamer, content creator, and founder of GM7. Discover the story behind the GM7 gaming community, its tournaments, and live Kick broadcasts.',
    keywords:
      'About Snnsei, Hatim Naji, GM7 founder, l\'Gamers Lmla7, competitive FPS streamer, Kick streamer, GM7 gaming community, Apex Legends, esports, Moroccan gamer',
    path: '/about',
    imageAlt: 'Hatim Naji (Snnsei), founder and creative director of GM7',
  },
  socials: {
    title: "GM7 Socials — YouTube, Kick, Instagram & TikTok",
    description:
      'Explore GM7’s latest YouTube videos, Kick clips, Instagram reels, and TikTok posts in one place.',
    keywords:
      'GM7 socials, GM7 YouTube videos, Snnsei Kick clips, GM7 Instagram reels, GM7 TikTok videos, Snnsei highlights, GM7 gaming videos, l\'Gamers Lmla7 clips',
    path: '/socials',
    imageAlt: 'GM7 social content from YouTube, Kick, Instagram, and TikTok',
  },
  tournaments: {
    title: 'GM7 Tournaments — Available Cups, Prize Pools & Recent Champions',
    description:
      'Browse every available GM7 tournament, register your squad, and explore recent results with prize pools, player stats, match counts, and crowned champions.',
    keywords:
      'GM7 tournaments, gaming tournaments, Apex Legends tournament, Valorant tournament, EA FC tournament, GTA RP tournament, esports cups, tournament prize pool, GM7 champions, community tournaments',
    path: '/tournaments',
    imageAlt: 'GM7 tournament championship trophy and bracket announcements',
  },
  games: {
    title: 'GM7 Games — Every Title In Snnsei\'s Stream Rotation',
    description:
      'Explore every game in the GM7 broadcast rotation, from Ghost of Tsushima and GTA V RP to EA Sports FC and The Last of Us, plus upcoming mystery titles.',
    keywords:
      'GM7 games, Snnsei games, GM7 stream rotation, Ghost of Tsushima stream, GTA V RP, EA Sports FC, The Last of Us, gaming library, upcoming games, GM7 Kick',
    path: '/games',
    imageAlt: 'GM7 game library featuring every title in the stream rotation',
  },
  dashboard: {
    title: 'GM7 Dashboard — Manage Tournaments, Videos & Games',
    description: 'Private GM7 content dashboard for managing tournaments, social videos, and game cards.',
    keywords: 'GM7 dashboard, admin, content management',
    path: '/dashboard',
    imageAlt: 'GM7 content dashboard',
  },
  legal: {
    title: 'GM7 Legal Drafts — Privacy, Terms & Cookies',
    description: 'Draft legal documents for GM7. These documents are not final and require lawyer review.',
    keywords: 'GM7 privacy draft, terms draft, cookie notice draft',
    path: '/legal/privacy',
    imageAlt: 'GM7 legal documents draft',
  },
};

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Keeps the document title, description, canonical URL, Open Graph and
 * Twitter Card tags in sync with the active client-side route.
 */
export function useSeo(page: SeoPage) {
  useEffect(() => {
    const meta = PAGE_META[page];
    const canonicalUrl = `${SITE_URL}${meta.path}`;
    const imageUrl = `${SITE_URL}/og-image.jpg`;

    document.title = meta.title;

    upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'keywords', meta.keywords);
    upsertMeta(
      'name',
      'robots',
      page === 'dashboard' || page === 'legal'
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', 'GM7');
    upsertMeta('property', 'og:locale', 'en_US');
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('property', 'og:image:alt', meta.imageAlt);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', imageUrl);
    upsertMeta('name', 'twitter:image:alt', meta.imageAlt);

    upsertCanonical(canonicalUrl);
  }, [page]);
}
