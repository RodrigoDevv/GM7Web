import React, { useEffect, useState } from 'react';
import { Calendar, Bell, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { OptionalThirdPartyFrame } from '../context/PrivacyConsentContext';

// Background and schedule game thumbnails
import kickStreamBg from '../assets/images/kick-backdrop.jpg';
import apexImage from '../assets/images/apex-hero.jpg';
import fpsImage from '../assets/images/tactical-fps.jpg';
import soulsImage from '../assets/images/souls-elden.jpg';
import arenaImage from '../assets/images/community-collaboration.jpg';
import heistImage from '../assets/images/city-heist.jpg';
import soccerImage from '../assets/images/esports-soccer.jpg';

import customStreamPoster from '../assets/images/welcoming.png';
import { KickIcon } from './BrandIcons';

interface StreamScheduleSectionProps {
  onToast?: (msg: string) => void;
}

const scheduleDays = [
  { day: 'Monday', time: '5:00 PM UTC', startHour: 17, game: 'Ghost Of Tsushima', note: 'Ranked Predator Push', image: apexImage },
  { day: 'Tuesday', time: '5:00 PM UTC', startHour: 17, game: 'CS2 & Valorant', note: 'Premier ELO Grind', image: fpsImage },
  { day: 'Wednesday', time: '5:00 PM UTC', startHour: 17, game: 'Elden Ring / Souls', note: 'Chat Challenge Modifiers', image: soulsImage },
  { day: 'Thursday', time: '5:00 PM UTC', startHour: 17, game: 'Valorant', note: '5-Stack Subscriber Queue', image: fpsImage },
  { day: 'Friday', time: '5:00 PM UTC', startHour: 17, game: 'Community Arena', note: '$500 Bounties & Cups', image: arenaImage },
  { day: 'Saturday', time: '6:00 PM UTC', startHour: 18, game: 'GTA V RP', note: 'Syndicate Heist Night', image: heistImage },
  { day: 'Sunday', time: '5:00 PM UTC', startHour: 17, game: 'EA FC 26', note: 'Champions Rank 1', image: soccerImage },
];

const getEstNow = (d: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const val = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  return {
    weekday: val('weekday'),
    seconds:
      (parseInt(val('hour'), 10) % 24) * 3600 +
      parseInt(val('minute'), 10) * 60 +
      parseInt(val('second'), 10),
  };
};

const pad2 = (n: number) => String(n).padStart(2, '0');

export const StreamScheduleSection: React.FC<StreamScheduleSectionProps> = ({ onToast }) => {
  const { isDark } = useTheme();
  const [now, setNow] = useState(() => new Date());
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [liveTitle, setLiveTitle] = useState<string | null>(null);

  // Show the live player unless we positively know the stream is offline.
  // This keeps the live broadcast visible even if the status API is unreachable.
  const showLive = isLive !== false;

  useEffect(() => {
    let cancelled = false;
    const loadLiveStatus = async () => {
      let nextIsLive: boolean | null = null;
      let nextTitle: string | null = null;

      try {
        const response = await fetch('/api/kick/live', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (typeof data?.isLive === 'boolean') {
            nextIsLive = data.isLive;
            nextTitle = typeof data?.title === 'string' && data.title.trim() ? data.title.trim() : null;
          }
        }
      } catch {
        /* Keep last known state; browser requests stay on the GM7 origin. */
      }

      if (!cancelled && nextIsLive !== null) {
        setIsLive(nextIsLive);
        setLiveTitle(nextTitle);
      }
    };

    loadLiveStatus();
    const statusInterval = window.setInterval(loadLiveStatus, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(statusInterval);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const est = getEstNow(now);
  const todayIdx = Math.max(
    0,
    scheduleDays.findIndex((d) => d.day === est.weekday)
  );
  const todayItem = scheduleDays[todayIdx];
  const tomorrowItem = scheduleDays[(todayIdx + 1) % scheduleDays.length];

  const todayStartSec = todayItem.startHour * 3600;
  const isTonight = !showLive && est.seconds < todayStartSec;
  const remainingSec = isTonight
    ? todayStartSec - est.seconds
    : 86400 - est.seconds + tomorrowItem.startHour * 3600;

  const targetItem = showLive || isTonight ? todayItem : tomorrowItem;
  const targetLabel = showLive ? 'On air now' : isTonight ? 'Tonight' : 'Tomorrow';

  const hours = Math.floor(remainingSec / 3600);
  const minutes = Math.floor(remainingSec / 60) % 60;
  const seconds = remainingSec % 60;

  return (
    <section
      id="schedule"
      className={`py-16 sm:py-24 transition-colors duration-200 border-b relative overflow-hidden ${
        isDark
          ? 'bg-[#080a0d] text-neutral-100 border-neutral-800/80'
          : 'bg-white text-neutral-900 border-neutral-200'
      }`}
    >
      {/* Ambient Radial Color Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[350px] bg-gradient-to-r from-[#FFBE0D]/12 via-orange-600/8 to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isDark
                  ? 'bg-[#FFBE0D]/10 border-[#FFBE0D]/30 text-[#FFBE0D] shadow-[0_0_15px_rgba(255,190,13,0.15)]'
                  : 'bg-orange-50 border-orange-300 text-orange-800 shadow-xs'
              }`}>
                <Calendar className="w-3.5 h-3.5" />
                <span>Broadcast Schedule</span>
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#FFBE0D]/15 border border-[#FFBE0D]/30 ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
                UTC Timezone
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Live Every Evening at 5:00 PM UTC
            </h2>
            <p className={`mt-2.5 text-sm sm:text-base max-w-xl leading-relaxed ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Lock in for high-energy rank grinds, tactical matches, and open viewer lobbies broadcast daily on Kick.
            </p>
          </div>

         
        </div>

        {/* 2-Column Layout: Left Side (Custom Image) + Right Side (Countdown / Live Embed) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* LEFT SIDE: WELCOME TO OUR STREAM         */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="relative overflow-hidden rounded-2xl h-full min-h-[440px] sm:min-h-[500px]">
            {/* Ambient glow behind the character */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[78%] h-[58%] bg-[#FFBE0D]/25 rounded-full blur-[90px] pointer-events-none" />

            {/* Big title sits BEHIND the character */}
            <div className="absolute inset-x-0 top-0 z-0 flex flex-col items-center pt-4 sm:pt-6 pointer-events-none px-3">
              <span className="font-anton uppercase italic leading-[0.85] text-center text-[clamp(2.5rem,7.5vw,5.2rem)] tracking-[0.02em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                Welcome To
              </span>
              <span className="font-anton uppercase italic leading-[0.8] text-center text-[clamp(3rem,9.5vw,6.5rem)] tracking-[0.02em] -mt-1 text-[#FFBE0D] drop-shadow-[0_2px_10px_rgba(255,190,13,0.28)]">
                Our Stream
              </span>
              <span className="mt-3 sm:mt-4 text-center text-xs sm:text-sm font-bold uppercase tracking-[0.32em] text-white/80 drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
                Lock in <span className="text-[#FFBE0D]">·</span> level up <span className="text-[#FFBE0D]">·</span> zero chill
              </span>
            </div>

            {/* Character layered IN FRONT of the title (transparent background) */}
            <img
              src={customStreamPoster}
              alt="Welcome To Our Stream"
              className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 h-[80%] sm:h-[82%] w-auto object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.3)]"
            />
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* RIGHT SIDE: LIVE EMBED (WHEN LIVE) OR COUNTDOWN (WHEN OFFLINE) */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {showLive ? (
            /* REAL KICK STREAM EMBED PLAYER */
            <div className="relative rounded-2xl border overflow-hidden flex flex-col h-full min-h-[440px] sm:min-h-[500px] bg-black border-[#FFBE0D]/40 shadow-[0_20px_50px_rgba(255,190,13,0.25)]">
              {/* Live Player Header */}
              <div className="px-4 py-3 bg-neutral-950 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white">
                    <KickIcon className="w-3.5 h-3.5 text-[#53FC18]" />
                    <span>Broadcasting Live</span>
                    <span className="text-[#FFBE0D] font-mono">@snnsei</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://kick.com/snnsei"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-[#FFBE0D] hover:bg-[#E5A800] text-black transition-colors shadow-sm"
                  >
                    <span>Kick.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Real Kick Live Iframe Embed */}
              <div className="relative flex-1 w-full min-h-[340px] sm:min-h-[400px] bg-black">
                <OptionalThirdPartyFrame
                  src="https://player.kick.com/snnsei?autoplay=true&muted=true"
                  title="Kick Live Stream - snnsei"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              </div>

              {/* Live Player Footer */}
              <div className="px-4 py-2.5 bg-neutral-950 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-[#FFBE0D] font-black shrink-0">● ON AIR:</span>
                  <span className="font-bold text-white truncate">{liveTitle || targetItem.game}</span>
                </div>
                <a
                  href="https://kick.com/snnsei"
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-[11px] font-mono text-[#FFBE0D] hover:underline font-bold"
                >
                  Watch Chat & Full Stream →
                </a>
              </div>
            </div>
          ) : (
            /* COUNTDOWN HERO (WHEN STREAM IS NOT LIVE) */
            <div className="relative rounded-2xl border overflow-hidden flex flex-col justify-between h-full min-h-[460px] sm:min-h-[520px] border-neutral-800 hover:border-[#FFBE0D]/30 transition-colors shadow-[0_25px_80px_-20px_rgba(0,0,0,0.85)] bg-[#07090d]">
              {/* Cinematic Battlestation Backdrop Texture & Lighting */}
              <img
                src={kickStreamBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-35 filter contrast-110 brightness-95 scale-105 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/80 to-[#07090d]/65 pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#FFBE0D]/15 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-600/10 rounded-full blur-[90px] pointer-events-none" />

              {/* Status Header Pill */}
              <div className="relative z-10 p-5 sm:p-6 pb-2 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-black/60 border border-[#FFBE0D]/30 text-[#FFBE0D] backdrop-blur-md shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#FFBE0D] animate-ping" />
                  <span>{`Next Broadcast ${targetLabel.toLowerCase()}`}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-600" />
                  <span className="font-mono text-white/90">5:00 PM UTC</span>
                </div>

                <a
                  href="https://kick.com/snnsei"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all backdrop-blur-md shadow-xs"
                >
                  <KickIcon className="w-3 h-3 text-[#53FC18]" />
                  <span>kick.com/snnsei</span>
                </a>
              </div>

              {/* Center Countdown Display */}
              <div className="relative z-10 px-4 sm:px-8 py-3 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 mb-1">
                  Daily Stream Countdown
                </span>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic tracking-tight font-anton text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  Stream Starts In
                </h3>

                {/* Futuristic Ticker Cards */}
                <div className="mt-5 flex items-center justify-center gap-2 sm:gap-4">
                  {[
                    { value: pad2(hours), label: 'Hours' },
                    { value: pad2(minutes), label: 'Minutes' },
                    { value: pad2(seconds), label: 'Seconds' },
                  ].map((unit, i) => (
                    <React.Fragment key={unit.label}>
                      {i > 0 && (
                        <div className="flex flex-col gap-2 -mt-4 text-[#FFBE0D] opacity-70">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FFBE0D] shadow-[0_0_8px_#FFBE0D] animate-pulse" />
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FFBE0D] shadow-[0_0_8px_#FFBE0D] animate-pulse" />
                        </div>
                      )}

                      <div className="flex flex-col items-center">
                        {/* Split-Flap Ticker Card */}
                        <div className="relative rounded-2xl min-w-[62px] sm:min-w-[102px] py-3 sm:py-4 px-2 sm:px-3 bg-gradient-to-b from-neutral-800/90 via-neutral-900/95 to-neutral-950 border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md overflow-hidden">
                          {/* Center Divider Line */}
                          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/80 shadow-[0_1px_0_rgba(255,255,255,0.06)] pointer-events-none" />

                          {/* Digits */}
                          <div className="relative z-10 font-anton text-3xl sm:text-6xl text-[#FFBE0D] leading-none tracking-wider text-center drop-shadow-[0_0_20px_rgba(255,190,13,0.35)] tabular-nums">
                            {unit.value}
                          </div>
                        </div>

                        {/* Unit Label Pill */}
                        <span className="mt-2.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-[0.2em] bg-neutral-900 text-neutral-300 border border-white/10 shadow-xs">
                          {unit.label}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Match / Broadcast Event Intel Card */}
              
              </div>

              {/* Bottom Call to Action */}
              <div className="relative z-10 p-5 sm:p-6 pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://kick.com/snnsei"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-black font-anton uppercase italic text-sm tracking-wider bg-gradient-to-r from-[#FFBE0D] via-amber-300 to-[#FFBE0D] hover:from-[#E5A800] hover:to-[#E5A800] text-black transition-all duration-200 shadow-[0_8px_30px_rgba(255,190,13,0.4)] hover:shadow-[0_12px_45px_rgba(255,190,13,0.65)] hover:scale-[1.03] active:scale-98"
                >
                  <KickIcon className="w-4 h-4 text-black" />
                  <span>Watch on Kick</span>
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
