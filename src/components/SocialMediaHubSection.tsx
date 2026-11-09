import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Eye, Heart, Play, RefreshCw, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import { proxiedImageUrl } from '../lib/media';
import { Reveal } from './Reveal';
import { YouTubeIcon, KickIcon, TikTokIcon, InstagramIcon } from './BrandIcons';

export type PlatformKey = 'youtube' | 'kick' | 'tiktok' | 'instagram';

interface PlatformMeta {
  key: PlatformKey;
  name: string;
  handle: string;
  color: string;
  lightColor: string;
  onColor: string;
  url: string;
  cta: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PLATFORMS: Record<PlatformKey, PlatformMeta> = {
  youtube: { key: 'youtube', name: 'YouTube', handle: '@Snnsei', color: '#FF0033', lightColor: '#C4002B', onColor: '#fff', url: 'https://www.youtube.com/@Snnsei', cta: 'View all on YouTube', icon: YouTubeIcon },
  kick: { key: 'kick', name: 'Kick Clips', handle: 'kick.com/snnsei', color: '#53FC18', lightColor: '#2F8F0C', onColor: '#0A0A0A', url: 'https://kick.com/snnsei/clips', cta: 'View all on Kick', icon: KickIcon },
  tiktok: { key: 'tiktok', name: 'TikTok', handle: '@snnsei_', color: '#25F4EE', lightColor: '#0B7A80', onColor: '#0A0A0A', url: 'https://www.tiktok.com/@snnsei_', cta: 'View all on TikTok', icon: TikTokIcon },
  instagram: { key: 'instagram', name: 'Instagram', handle: '@snnseii', color: '#E4405F', lightColor: '#B3243E', onColor: '#fff', url: 'https://www.instagram.com/snnseii/', cta: 'View all on Instagram', icon: InstagramIcon },
};
const PLATFORM_ORDER: PlatformKey[] = ['youtube', 'instagram', 'tiktok', 'kick'];

export interface FeedChannel {
  key: PlatformKey;
  name: string;
  color: string;
  lightColor: string;
  onColor: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  live: boolean;
}

export const FEED_CHANNELS: FeedChannel[] = PLATFORM_ORDER.map((key) => ({
  ...PLATFORMS[key],
  count: 5,
  live: key === 'kick',
}));

export const feedSectionId = (key: PlatformKey) => `feed-${key}`;

interface MediaItem {
  id: string;
  platform: PlatformKey;
  title: string;
  thumb: string;
  category: string;
  duration: string;
  views: string;
  likes?: string;
  publishedAt: string;
  url: string;
}

interface FeedResponse {
  updatedAt: string;
  channels: Partial<Record<PlatformKey, MediaItem[]>>;
  errors?: Partial<Record<PlatformKey, string>>;
}

function formatCount(value: string) {
  const number = Number(value);
  return Number.isFinite(number)
    ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(number)
    : value;
}

function relativeTime(value: string) {
  const date = new Date(value);
  const seconds = (Date.now() - date.getTime()) / 1000;
  if (!value || Number.isNaN(seconds)) return 'Recently';
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const MediaCard: React.FC<{ item: MediaItem; isDark: boolean; onToast?: (message: string) => void }> = ({ item, isDark, onToast }) => {
  const meta = PLATFORMS[item.platform];
  const Icon = meta.icon;
  const isVertical = item.platform === 'tiktok' || item.platform === 'instagram';
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      onClick={() => onToast?.(`Opening ${meta.name} — ${item.title}`)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border ${isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white'}`}
    >
      <div className={`relative overflow-hidden bg-neutral-900 ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {item.thumb ? (
          <img src={proxiedImageUrl(item.thumb)} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-500">
            <Icon className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider" style={{ backgroundColor: meta.color, color: meta.onColor }}>
          <Icon className="h-3 w-3" />
          {meta.name}
        </span>
        {item.duration && <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-mono font-bold text-white">{item.duration}</span>}
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundColor: meta.color, color: meta.onColor }}>
          <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className={`mb-1.5 flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          <span style={{ color: isDark ? meta.color : meta.lightColor }}>{item.category}</span>
          <span>•</span>
          <span>{relativeTime(item.publishedAt)}</span>
        </div>
        <h4 className={`text-sm font-bold leading-snug line-clamp-2 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{item.title}</h4>
        <div className={`mt-auto flex items-center gap-4 pt-3.5 text-[10px] font-mono font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          {item.views && <span className="inline-flex items-center gap-1.5"><Eye className="h-3 w-3" />{formatCount(item.views)}</span>}
          {item.likes && <span className="inline-flex items-center gap-1.5"><Heart className="h-3 w-3" />{formatCount(item.likes)}</span>}
          <ArrowUpRight className="ml-auto h-3.5 w-3.5" style={{ color: isDark ? meta.color : meta.lightColor }} />
        </div>
      </div>
    </a>
  );
};

interface SocialMediaHubSectionProps {
  onToast?: (message: string) => void;
  refreshToken?: number;
  onSyncStateChange?: (syncing: boolean, updatedAt?: string) => void;
}

export const SocialMediaHubSection: React.FC<SocialMediaHubSectionProps> = ({ onToast, refreshToken = 0, onSyncStateChange }) => {
  const { isDark } = useTheme();
  const { socials } = useContent();
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setFailure('');
    onSyncStateChange?.(true);
    fetch(`/api/feed?refresh=${refreshToken > 0 ? 1 : 0}`, { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load the feed');
        return response.json() as Promise<FeedResponse>;
      })
      .then((data) => {
        setFeed(data);
        onSyncStateChange?.(false, data.updatedAt);
      })
      .catch((error: Error) => {
        if (error.name !== 'AbortError') {
          setFailure('Live content is temporarily unavailable. Manual GM7 videos are still shown below.');
          onSyncStateChange?.(false);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [refreshToken, onSyncStateChange]);

  const manualByPlatform = useMemo(() => {
    const map: Record<PlatformKey, MediaItem[]> = { youtube: [], kick: [], tiktok: [], instagram: [] };
    for (const video of socials ?? []) {
      if (!map[video.platform]) continue;
      map[video.platform].push({
        id: video.id,
        platform: video.platform,
        title: video.title,
        thumb: video.thumb,
        category: video.category || {
          youtube: 'YouTube video',
          kick: 'Kick clip',
          tiktok: 'TikTok video',
          instagram: 'Instagram post',
        }[video.platform],
        duration: video.duration ?? '',
        views: video.views ?? '',
        likes: video.likes,
        publishedAt: video.publishedAt ?? '',
        url: video.url,
      });
    }
    return map;
  }, [socials]);

  return (
    <section id="media" className={`min-h-[60vh] border-b py-16 sm:py-24 ${isDark ? 'border-neutral-800/80 bg-[#080a0d] text-neutral-100' : 'border-neutral-200 bg-neutral-50/80 text-neutral-900'}`}>
      <div className="mx-auto max-w-7xl 2xl:max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
       
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Latest from Snnsei</h2>
          <p className={`mt-2.5 text-sm leading-relaxed sm:text-base ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Find the latest videos, clips and posts from Snnsei across YouTube, Instagram, TikTok and Kick.
          </p>
        </div>

        {failure && (
          <div className={`mb-8 rounded-2xl border p-5 text-sm ${isDark ? 'border-red-900/60 bg-red-950/20 text-red-200' : 'border-red-200 bg-red-50 text-red-800'}`}>
            {failure}
          </div>
        )}

        <div className="space-y-14 sm:space-y-16">
          {PLATFORM_ORDER.map((key, index) => {
            const platform = PLATFORMS[key];
            const Icon = platform.icon;
            const items = [...manualByPlatform[key], ...(feed?.channels[key] || [])];
            const error = feed?.errors?.[key];
            const showSkeleton = loading && items.length === 0;
            return (
              <div key={key} id={feedSectionId(key)} className="scroll-mt-32">
                <Reveal delay={index * 60}>
                  <div className={`mb-4 flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.18em] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: platform.color }} />
                    <span>Channel {String(index + 1).padStart(2, '0')}</span>
                    <span className={`h-px flex-1 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                    <span>{items.length} latest drops</span>
                  </div>
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg" style={{ backgroundColor: platform.color, color: platform.onColor }}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black tracking-tight sm:text-2xl">{platform.name}</h3>
                          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${isDark ? 'border-neutral-700 text-neutral-400' : 'border-neutral-200 text-neutral-500'}`}>
                            Latest
                          </span>
                        </div>
                        <p className={`mt-1 text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{platform.handle}</p>
                      </div>
                    </div>
                    <a href={platform.url} target="_blank" rel="noreferrer" className="hidden shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold sm:inline-flex" style={{ borderColor: `${platform.color}55`, color: isDark ? platform.color : platform.lightColor }}>
                      <span>{platform.cta}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {showSkeleton ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                      {Array.from({ length: 5 }).map((_, item) => (
                        <div key={item} className={`${key === 'tiktok' || key === 'instagram' ? 'aspect-[9/16]' : 'aspect-video'} animate-pulse rounded-2xl ${isDark ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
                      ))}
                    </div>
                  ) : !items.length ? (
                    <div className={`rounded-2xl border p-5 text-sm ${isDark ? 'border-neutral-800 bg-neutral-900/50 text-neutral-400' : 'border-neutral-200 bg-white text-neutral-600'}`}>
                      {error || (key === 'instagram'
                        ? 'New Instagram posts are pinned from the dashboard. Follow @snnseii in the meantime.'
                        : `No recent ${platform.name} content found.`)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                      {items.map((item) => (
                        <MediaCard key={item.id} item={item} isDark={isDark} onToast={onToast} />
                      ))}
                    </div>
                  )}
                </Reveal>
              </div>
            );
          })}
        </div>

        <p className={`mt-10 flex items-center gap-2 text-xs font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          <RefreshCw className="h-3.5 w-3.5" />
          Content is cached for a few minutes to keep the social channels reliable.
        </p>
      </div>
    </section>
  );
};
