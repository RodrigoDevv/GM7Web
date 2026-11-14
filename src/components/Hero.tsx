import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { defaultHeroSlides } from '../data/hero';
import { useContent } from '../context/ContentContext';
import { useTheme } from '../context/ThemeContext';
import { OptionalThirdPartyFrame } from '../context/PrivacyConsentContext';
import { KickIcon } from './BrandIcons';

const KICK_CHANNEL_URL = 'https://kick.com/snnsei';
const KICK_EMBED_URL = 'https://player.kick.com/snnsei';

interface KickLive {
  isLive: boolean;
  title: string | null;
  viewers: number;
  category: string | null;
  language: string | null;
  thumbnail: string | null;
  followers: number;
  profilePic: string | null;
  bio: string | null;
  channelUrl: string;
}

const formatWatchers = (n: number) => n.toLocaleString('en-US');

const formatCompact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : String(n);

interface HeroProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
  onSeeAllGames?: () => void;
  onToast?: (msg: string) => void;
}


const FollowersIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z"
      fill="currentColor"
      fillOpacity=".18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="17.5" cy="4.5" r="1.5" fill="currentColor" />
  </svg>
);

const CommunityIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M3.5 19c0-2.8 2.5-5 5.5-5s5.5 2.2 5.5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="17" cy="9.5" r="2.2" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="1.6" />
    <path d="M15 14.2c2.4.3 4.3 2.3 4.3 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const LiveIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    <path
      d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity=".4"
    />
  </svg>
);

const TitlesIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M7.5 7h9a5.5 5.5 0 0 1 5.4 6.6l-.6 3a2.6 2.6 0 0 1-4.6 1.2L15 15H9l-1.7 2.8a2.6 2.6 0 0 1-4.6-1.2l-.6-3A5.5 5.5 0 0 1 7.5 7Z"
      fill="currentColor"
      fillOpacity=".15"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M8 10.5v3M6.5 12h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="16" cy="11" r="1" fill="currentColor" />
    <circle cx="18" cy="13" r="1" fill="currentColor" />
  </svg>
);

export const Hero: React.FC<HeroProps> = ({ onSeeAllGames }) => {
  const { isDark } = useTheme();
  const { hero } = useContent();
  const heroSlides = hero && hero.length > 0 ? hero : defaultHeroSlides;
  const [slide, setSlide] = useState(0);
  const [kick, setKick] = useState<KickLive | null>(null);

  // Live Kick data from the server proxy (/api/kick/live), refreshed every minute
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      let next: KickLive | null = null;

      try {
        const res = await fetch('/api/kick/live', { cache: 'no-store' });
        const data = res.ok ? await res.json() : null;
        if (data && typeof data === 'object' && typeof data.isLive === 'boolean') {
          next = data as KickLive;
        }
      } catch {
        /* Keep last known state; browser requests stay on the GM7 origin. */
      }

      if (!cancelled && next) setKick(next);
    };
    load();
    const id = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const goToSlide = (index: number) => {
    const total = heroSlides.length;
    setSlide(((index % total) + total) % total);
  };

  const nextSlide = () => goToSlide(slide + 1);
  const prevSlide = () => goToSlide(slide - 1);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [slide, heroSlides.length]);

  useEffect(() => {
    if (slide >= heroSlides.length) setSlide(0);
  }, [slide, heroSlides.length]);

  // Show the Kick player unless we positively know the channel is offline.
  // Keeps the stream visible even when the live-status API is unreachable.
  const showPlayer = !kick || kick.isLive;

  const handleBackgroundClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!onSeeAllGames) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('a,button,input,textarea,select,iframe,[data-hero-interactive]')) return;
    onSeeAllGames();
  };

  return (
    <section
      id="hero"
      onClick={handleBackgroundClick}
      className="relative isolate cursor-pointer overflow-hidden border-b border-neutral-800/70 bg-[#0a0a0c] text-white"
    >
      {/* FULL-BLEED IMAGE SLIDER BACKDROP */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {heroSlides.map((item, i) => (
          <img
            key={item.id}
            src={item.src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              slide === i ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl 2xl:max-w-[90rem] px-16 sm:px-20 lg:px-24">
        <div className="grid min-h-[560px] grid-cols-1 items-center gap-10 py-10 pb-20 sm:min-h-[620px] lg:min-h-[660px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-12 lg:py-14 lg:pb-16">

          {/* LEFT: Creator identity */}
          <div className="order-1 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_6px_24px_rgba(60,20,40,0.55)] sm:text-5xl lg:text-6xl">
                Hatim NAJI
              </h1>
              <span className="rounded-lg border border-[#FFBE0D]/40 bg-black/30 px-2.5 py-1 text-[11px] font-mono font-bold text-[#FFBE0D] backdrop-blur-sm">
                @Snnsei
              </span>
            </div>

            <div className="relative mt-4 max-w-md">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 z-0 rounded-full bg-black/80 blur-[80px]"
              />
              <p className="relative z-10 text-sm leading-relaxed text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-base">
                Founder of GM7, known as{' '}
                <span className="font-bold text-[#FFBE0D] drop-shadow-[0_0_12px_rgba(255,190,13,0.3)]">
                  Snnsei
                </span>
                . Competitive FPS streaming, community lobbies, and tactical showdowns.
              </p>
            </div>

            
          </div>
          {/* RIGHT: Authentic Kick Broadcast Card with Green Glow & Deep Shadows */}
          <div className="order-2 flex w-full justify-center lg:justify-end">
            <div
              data-hero-interactive
              className={`w-full max-w-[340px] rounded-2xl border p-5 sm:p-6 transition-all duration-300 relative overflow-hidden ${
                isDark
                  ? 'bg-neutral-900/80 border-[#53FC18]/35 shadow-[0_20px_60px_-15px_rgba(83,252,24,0.22)] hover:shadow-[0_25px_70px_-10px_rgba(83,252,24,0.32)] hover:border-[#53FC18]/60'
                  : 'bg-white border-green-400 shadow-xl shadow-green-500/10 hover:shadow-2xl hover:shadow-green-500/20'
              }`}
            >
              {/* Subtle card ambient highlight */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#53FC18]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Status Header with Glowing Live Badge */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  {kick?.isLive ? (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#53FC18] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#53FC18] shadow-[0_0_12px_#53FC18]" />
                      </span>
                      <span className={`text-xs font-black uppercase tracking-wider drop-shadow-[0_0_8px_rgba(83,252,24,0.5)] ${isDark ? 'text-[#53FC18]' : 'text-[#2F8F0C]'}`}>
                        Live on Kick
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={`inline-flex rounded-full h-3 w-3 ${isDark ? 'bg-neutral-600' : 'bg-neutral-400'}`} />
                      <span className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {kick ? 'Currently Offline' : 'Checking Kick…'}
                      </span>
                    </>
                  )}
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}>
                  {kick?.isLive
                    ? `${formatWatchers(kick.viewers)} Watching`
                    : kick
                    ? `${formatCompact(kick.followers)} Followers`
                    : 'kick.com'}
                </span>
              </div>

              {/* Stream Preview Box — live Kick player embed, channel thumbnail when offline */}
              <div className="flex justify-center">
                <div
                  className={`relative aspect-video w-full max-w-[260px] sm:max-w-[300px] rounded-xl overflow-hidden border mb-3 transition-all ${
                    isDark
                      ? 'border-neutral-700 hover:border-[#53FC18]/70 bg-black shadow-lg shadow-black/80 hover:shadow-[0_0_25px_rgba(83,252,24,0.25)]'
                      : 'border-neutral-300 hover:border-green-500 bg-neutral-900 shadow-md'
                  }`}
                >
                {showPlayer ? (
                  <>
                    <OptionalThirdPartyFrame
                      src={`${KICK_EMBED_URL}?autoplay=true&muted=true`}
                      title={`${kick?.title || 'Snnsei'} live on Kick`}
                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                      className="absolute inset-0 h-full w-full border-0"
                    />
                    <span className="pointer-events-none absolute top-2.5 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white/90">
                      <KickIcon className="w-2.5 h-2.5 text-[#53FC18]" />
                      KICK.COM/SNNSEI
                    </span>
                    {kick?.isLive && (
                      <span className="pointer-events-none absolute top-2.5 right-3 text-[10px] font-mono font-bold text-[#53FC18] px-1.5 py-0.5 rounded bg-black/80">
                        LIVE
                      </span>
                    )}
                  </>
                ) : (
                  <a
                    href={KICK_CHANNEL_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center">
                      <KickIcon className="w-16 h-16 text-neutral-800 group-hover:text-neutral-700 transition-colors" />
                    </div>
                    {kick?.thumbnail && (
                      <img
                        src={kick.thumbnail}
                        alt={kick.title || 'Snnsei on Kick'}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/55 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-black/70 border border-white/15">
                        View channel
                      </span>
                    </div>
                  </a>
                )}
                </div>
              </div>

              {/* Stream Title Row */}
              <div className="mx-auto mb-4 flex w-full max-w-[260px] sm:max-w-[300px] items-center justify-between gap-2 text-xs font-semibold">
                <a
                  href={KICK_CHANNEL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate hover:text-[#53FC18] transition-colors"
                >
                  {kick?.title || 'Watch Snnsei on Kick'}
                </a>
                {kick?.isLive && (
                  <span className="text-[10px] font-mono font-bold text-[#53FC18] px-1.5 py-0.5 rounded bg-[#53FC18]/15 border border-[#53FC18]/30 shrink-0">
                    {formatWatchers(kick.viewers)} Watching
                  </span>
                )}
              </div>

              {/* Channel Bio Summary */}
              <div className="mb-5 relative z-10">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span>Snnsei on Kick</span>
                  <span className={`text-xs px-2 py-0.5 rounded bg-[#53FC18]/20 font-mono font-bold ${isDark ? 'text-[#53FC18]' : 'text-[#2F8F0C]'}`}>
                    OFFICIAL
                  </span>
                </h3>
                <p className={`text-xs mt-1.5 leading-relaxed ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  {kick?.bio || 'Unfiltered gameplay, chat interactions, and daily squad queues on Kick.'}
                  {kick && kick.followers > 0 && (
                    <span className={isDark ? 'text-neutral-500' : 'text-neutral-500'}>
                      {' '}&middot; {formatWatchers(kick.followers)} followers
                    </span>
                  )}
                </p>
              </div>

              {/* Primary Call to Action Button with Green Glow & Deep Shadow */}
              <a
                href={KICK_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-[#53FC18] hover:bg-[#46D814] text-black flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_8px_30px_rgba(83,252,24,0.45)] hover:shadow-[0_12px_40px_rgba(83,252,24,0.65)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <KickIcon className="w-4 h-4" />
                <span>{kick?.isLive ? 'Watch Live on Kick' : 'Watch on Kick'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Slider arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous hero image"
        className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white/90 backdrop-blur-md transition hover:bg-black/55 hover:text-white active:scale-95 sm:left-6 sm:h-11 sm:w-11"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next hero image"
        className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white/90 backdrop-blur-md transition hover:bg-black/55 hover:text-white active:scale-95 sm:right-6 sm:h-11 sm:w-11"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slider dots */}
      <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-2">
        {heroSlides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goToSlide(i)}
            aria-label={`Go to hero image ${i + 1}`}
            aria-current={slide === i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              slide === i ? 'w-8 bg-white' : 'w-3 bg-white/40 hover:bg-white/65'
            }`}
          />
        ))}
      </div>
      
    </section>
  );
};
