import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import chibiSensei from '../assets/images/Chibi Sensei in a Red Jacket.png';
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
  onToast?: (msg: string) => void;
}

const quotes = [
  'Grind never stops — welcome to the Dojo.',
  'Tonight at 5:00 PM UTC: Ranked Apex & community matches on Kick.',
  'Precision aim, clean comms, zero excuses.',
  'Grab your Discord role before tonight’s squad queue opens.',
];

// Custom duotone stat icons
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

export const Hero: React.FC<HeroProps> = ({ onToast }) => {
  const { isDark } = useTheme();
  const [quoteIdx, setQuoteIdx] = useState(0);
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

  const handleNextQuote = () => {
    const next = (quoteIdx + 1) % quotes.length;
    setQuoteIdx(next);
    onToast?.(`Sensei: "${quotes[next]}"`);
  };

  // Show the Kick player unless we positively know the channel is offline.
  // Keeps the stream visible even when the live-status API is unreachable.
  const showPlayer = !kick || kick.isLive;

  return (
    <section
      id="hero"
      className={`relative pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-0 transition-colors duration-200 border-b overflow-hidden ${
        isDark
          ? 'bg-[#080a0d] text-neutral-100 border-neutral-800/80'
          : 'bg-white text-neutral-900 border-neutral-200'
      }`}
    >
      {/* Dynamic Ambient Color Backdrops & Shadows */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Vibrant Gold Ambient Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#FFBE0D]/18 via-orange-500/12 to-transparent rounded-full blur-[130px]" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[300px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-10 left-1/4 w-[500px] h-[250px] bg-[#FFBE0D]/10 rounded-full blur-[120px]" />

        {/* Full-Width "SNNCEI" Backdrop Text */}
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 top-[45%] -translate-y-1/2 text-center select-none pointer-events-none whitespace-nowrap font-poster leading-none tracking-[0.02em] text-[34vw] bg-gradient-to-b bg-clip-text text-transparent ${
            isDark
              ? 'from-[#FFBE0D]/40 via-[#FFBE0D]/16 to-[#FFBE0D]/0 drop-shadow-[0_0_60px_rgba(255,190,13,0.25)]'
              : 'from-[#8C6500]/28 via-[#8C6500]/13 to-[#8C6500]/0'
          }`}
        >
          SNNSEI
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT: Creator Profile & Story */}
          <div className="flex flex-col justify-center order-2 lg:order-1 relative z-10">
            
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-br bg-clip-text text-transparent drop-shadow-sm ${
                  isDark ? 'from-white via-neutral-100 to-neutral-400' : 'from-neutral-950 via-neutral-800 to-neutral-500'
                }`}>
                  Hatim Naji
                </h1>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                  isDark
                    ? 'bg-[#FFBE0D]/15 text-[#FFBE0D] border-[#FFBE0D]/40 shadow-[0_0_15px_rgba(255,190,13,0.25)]'
                    : 'bg-orange-100/90 text-orange-900 border-orange-300 shadow-sm'
                }`}>
                  @Snnsei
                </span>
              </div>
              <p className={`text-sm sm:text-base leading-relaxed mt-3.5 ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                Founder of GM7, known as <span className={`font-bold drop-shadow-[0_0_12px_rgba(255,190,13,0.3)] ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>Snnsei</span>. Competitive FPS streaming, community lobbies, and tactical showdowns.
              </p>

              
            </div>

          </div>

          {/* CENTER: Snnsei AI Cinematic Hero Artwork with Deep Backdrop Text */}
          <div className="flex flex-col items-center justify-center lg:justify-end order-1 lg:order-2 relative">
            {/* Luminous Colored Halo Backlight */}
            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#FFBE0D]/30 via-orange-500/20 to-amber-400/10 rounded-full blur-[80px] pointer-events-none" />

            <div
              onClick={handleNextQuote}
              className="relative group cursor-pointer flex flex-col items-center z-10 w-full"
            >
              {/* AI CINEMATIC SNNSEI HERO PORTRAIT */}
              <img
                src={chibiSensei}
                alt="Snnsei (Hatim Naji) — GM7 competitive FPS streamer on Kick"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="relative z-10 w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[500px] h-auto object-cover max-h-[520px] sm:max-h-[600px] lg:max-h-[660px] [mask-image:linear-gradient(to_bottom,#000_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_70%,transparent_100%)] lg:[mask-image:none] lg:[-webkit-mask-image:none] transition-transform duration-500 group-hover:scale-104"
              />
            </div>
          </div>

          {/* RIGHT: Authentic Kick Broadcast Card with Green Glow & Deep Shadows */}
          <div className="flex flex-col justify-center order-3 relative z-10">
            <div
              className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 relative overflow-hidden ${
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
              className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-[#53FC18] hover:bg-[#46D814] text-black flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_8px_30px_rgba(83,252,24,0.45)] hover:shadow-[0_12px_40px_rgba(83,252,24,0.65)] hover:scale-[1.02] active:scale-98"
            >
                <KickIcon className="w-4 h-4" />
                <span>{kick?.isLive ? 'Watch Live on Kick' : 'Watch on Kick'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
