import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import { SocialMediaHubSection, FEED_CHANNELS, feedSectionId, type PlatformKey } from './SocialMediaHubSection';

interface SocialsPageProps {
  onNavigateHome: (targetSection?: string) => void;
  onToast?: (msg: string) => void;
}

export const SocialsPage: React.FC<SocialsPageProps> = ({ onToast }) => {
  const { isDark } = useTheme();
  const { socials } = useContent();
  const [activeChannel, setActiveChannel] = useState<PlatformKey>(FEED_CHANNELS[0].key);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState('Loading…');
  const [refreshToken, setRefreshToken] = useState(0);

  const channels = useMemo(
    () =>
      FEED_CHANNELS.map((channel) => ({
        ...channel,
        count:
          channel.count +
          (socials ?? []).filter((video) => video.platform === channel.key).length,
      })),
    [socials],
  );

  useEffect(() => {
    const updateActiveChannel = () => {
      const probe = window.scrollY + 160;
      let next = FEED_CHANNELS[0].key;
      for (const channel of FEED_CHANNELS) {
        const element = document.getElementById(feedSectionId(channel.key));
        if (element && element.getBoundingClientRect().top + window.scrollY <= probe) next = channel.key;
      }
      setActiveChannel((previous) => (previous === next ? previous : next));
    };
    updateActiveChannel();
    window.addEventListener('scroll', updateActiveChannel, { passive: true });
    window.addEventListener('resize', updateActiveChannel);
    return () => {
      window.removeEventListener('scroll', updateActiveChannel);
      window.removeEventListener('resize', updateActiveChannel);
    };
  }, []);

  const jumpToChannel = (key: PlatformKey) => {
    setActiveChannel(key);
    document.getElementById(feedSectionId(key))?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const refreshFeed = () => {
    if (refreshing) return;
    setRefreshing(true);
    onToast?.('Syncing the latest YouTube, Kick, TikTok and Instagram content…');
    setRefreshToken((value) => value + 1);
  };

  const handleSyncStateChange = useCallback((syncing: boolean, updatedAt?: string) => {
    setRefreshing(syncing);
    if (updatedAt) setLastSynced('just now');
  }, []);

  return (
    <div className={`relative flex min-h-[80vh] flex-col transition-colors duration-300 ${isDark ? 'bg-[#080a0d] text-white' : 'bg-neutral-50/80 text-neutral-900'}`}>
      <div className={`sticky top-16 z-30 border-b backdrop-blur-xl ${isDark ? 'border-neutral-800/80 bg-[#080a0d]/85' : 'border-neutral-200 bg-neutral-50/90'}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <nav aria-label="Jump to a channel" className="no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const active = activeChannel === channel.key;
              return (
                <button
                  key={channel.key}
                  type="button"
                  onClick={() => jumpToChannel(channel.key)}
                  aria-controls={feedSectionId(channel.key)}
                  aria-current={active ? 'true' : undefined}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-bold transition-all ${active ? 'shadow-sm' : isDark ? 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:text-neutral-950'}`}
                  style={active ? { borderColor: `${channel.color}80`, backgroundColor: `${channel.color}14`, color: isDark ? channel.color : channel.lightColor } : undefined}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{channel.name}</span>
                  <span className={`rounded-full px-1.5 text-[9px] font-mono ${active ? 'bg-black/10' : isDark ? 'bg-neutral-800 text-neutral-500' : 'bg-neutral-100 text-neutral-500'}`}>
                    {channel.count}
                  </span>
                </button>
              );
            })}
          </nav>
          <div aria-live="polite" className={`hidden shrink-0 items-center text-[10px] font-mono sm:flex ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
            {refreshing ? 'Syncing…' : `Updated ${lastSynced}`}
          </div>
          <button
            type="button"
            onClick={refreshFeed}
            disabled={refreshing}
            aria-label="Refresh social content"
            title="Refresh social content"
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border disabled:cursor-wait disabled:opacity-70 ${isDark ? 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-[#FFBE0D]' : 'border-neutral-200 bg-white text-neutral-500'}`}
          >
            <RotateCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      <SocialMediaHubSection onToast={onToast} refreshToken={refreshToken} onSyncStateChange={handleSyncStateChange} />
    </div>
  );
};
