import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Calendar, Gamepad2, MoreHorizontal, Users, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import { defaultGames, type GameItem } from '../data/games';
import { KickIcon, YouTubeIcon } from './BrandIcons';

import senseiShowcaseImg from '../assets/images/play.png';

interface WhatWePlaySectionProps {
  onToast?: (msg: string) => void;
  onSeeMore?: () => void;
}

export const WhatWePlaySection: React.FC<WhatWePlaySectionProps> = ({ onSeeMore }) => {
  const { isDark } = useTheme();
  const { games: contentGames } = useContent();
  const games = contentGames ?? defaultGames;
  const [activeIntelGame, setActiveIntelGame] = useState<GameItem | null>(null);

  useEffect(() => {
    if (!activeIntelGame) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIntelGame(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIntelGame]);

  return (
    <section
      id="what-we-play"
      className={`py-16 sm:py-24 relative transition-colors duration-200 border-b overflow-hidden ${
        isDark
          ? 'bg-[#090c10] text-neutral-100 border-neutral-800/80'
          : 'bg-neutral-50/80 text-neutral-900 border-neutral-200'
      }`}
    >
      {/* Dynamic Ambient Background Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 -left-20 w-[500px] h-[350px] bg-[#FFBE0D]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[350px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark
                ? 'bg-[#FFBE0D]/10 border-[#FFBE0D]/30 text-[#FFBE0D] shadow-[0_0_15px_rgba(255,190,13,0.15)]'
                : 'bg-orange-50 border-orange-300 text-orange-800 shadow-xs'
            }`}>
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Active Game Rotation</span>
            </span>
            <span className={`text-xs font-mono font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              · {games.length} Broadcast Titles
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            What We Play
          </h2>

          <p className={`mt-2.5 text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Sensei's regular broadcast rotation across competitive battle royales, tactical FPS, and weekend viewer lobbies.
          </p>
        </div>

        {/* Left: Simple Game Cards (2 per line) · Right: Sensei Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Left: Cards, Two Per Line */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 content-start">
            {games.slice(0, 5).map((game) => {
              return (
                <div
                  key={game.id}
                  onClick={() => setActiveIntelGame(game)}
                  className={`group overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-95 ${
                    isDark
                      ? 'bg-neutral-900/60 border-neutral-800 hover:border-[#FFBE0D]/50 hover:shadow-[0_12px_30px_rgba(255,190,13,0.18)]'
                      : 'bg-white border-neutral-200 hover:border-orange-400 hover:shadow-md hover:shadow-orange-500/15'
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full aspect-[9/16] object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

                    {game.youtubeUrl?.trim() && (
                      <a
                        href={game.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`Watch ${game.title} on YouTube`}
                        className="absolute right-1.5 top-1.5 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                      >
                        <YouTubeIcon className="h-4 w-4" />
                      </a>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-1 text-white">
                      <h3 className="font-semibold text-[9px] leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] truncate">
                        {game.title}
                      </h3>
                      <p className="text-[8px] mt-0 text-neutral-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] truncate">
                        {game.genre}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => onSeeMore?.()}
              aria-label="View all games"
              className={`group relative overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-95 ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="relative flex aspect-[9/16] w-full flex-col items-center justify-center gap-2 px-1.5 text-center">
                <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-[#FFBE0D]/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <MoreHorizontal
                  className={`h-6 w-6 transition-colors duration-300 ${
                    isDark ? 'text-neutral-500 group-hover:text-neutral-400' : 'text-neutral-400 group-hover:text-neutral-500'
                  }`}
                />
                <span className={`text-[9px] font-semibold uppercase tracking-wide ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  View All
                </span>
              </div>
            </button>
          </div>

          {/* Right: Sensei cutout with kinetic title BEHIND it (transparent PNG) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSeeMore?.()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSeeMore?.();
              }
            }}
            aria-label="View all games"
            className="group relative overflow-hidden rounded-2xl aspect-[4/5] lg:aspect-auto lg:min-h-[500px] cursor-pointer transition-transform duration-200 active:scale-[0.98]"
          >
            {/* Ambient glow behind the character */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[78%] h-[58%] bg-[#FFBE0D]/25 rounded-full blur-[90px] pointer-events-none" />

            {/* Kinetic title sits BEHIND the character */}
            <div className="absolute inset-x-0 top-0 z-0 flex flex-col items-center pt-4 sm:pt-6 pointer-events-none px-3">
              <span className="font-anton uppercase italic leading-[0.85] text-center text-[clamp(3rem,11vw,6.5rem)] tracking-[0.02em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                What We
              </span>
              <span className="font-anton uppercase italic leading-[0.8] text-center text-[clamp(3.8rem,15vw,8.5rem)] tracking-[0.02em] -mt-1 text-[#FFBE0D] drop-shadow-[0_2px_10px_rgba(255,190,13,0.28)]">
                Play
              </span>
              <span className="mt-3 sm:mt-4 text-center text-xs sm:text-sm font-bold uppercase tracking-[0.32em] text-white/80 drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
                Six titles <span className="text-[#FFBE0D]">·</span> one squad <span className="text-[#FFBE0D]">·</span> zero chill
              </span>
            </div>

            {/* Character layered IN FRONT of the title (transparent background) */}
            <img
              src={senseiShowcaseImg}
              alt="Sensei GM7"
              className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 h-[80%] w-auto object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        </div>

        {/* Game Intel Modal */}
        {activeIntelGame && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
            onClick={() => setActiveIntelGame(null)}
          >
            <div
              className={`relative w-full max-w-3xl overflow-hidden rounded-3xl border shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] transition-all ${
                isDark
                  ? 'bg-neutral-950 border-[#FFBE0D]/40 text-white'
                  : 'bg-white border-orange-300 text-neutral-900 shadow-2xl'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid sm:grid-cols-[0.85fr_1.15fr]">
                {/* Game Artwork */}
                <div className="relative min-h-[220px] sm:min-h-[420px] overflow-hidden">
                  <img
                    src={activeIntelGame.image}
                    alt={activeIntelGame.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFBE0D] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                      <Gamepad2 className="h-3 w-3" />
                      {activeIntelGame.tag}
                    </span>
                    <h3 className="mt-2.5 text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      {activeIntelGame.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-neutral-300">
                      {activeIntelGame.genre} <span className="text-[#FFBE0D]">·</span> {activeIntelGame.scheduleDay}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="relative p-5 sm:p-6">
                  <button
                    type="button"
                    onClick={() => setActiveIntelGame(null)}
                    className={`absolute right-4 top-4 rounded-full border p-2 transition-colors ${
                      isDark
                        ? 'border-neutral-700 bg-neutral-900/80 text-neutral-400 hover:text-white'
                        : 'border-neutral-200 bg-white/90 text-neutral-500 hover:text-neutral-900'
                    }`}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="pr-10">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                      isDark
                        ? 'border-[#FFBE0D]/30 bg-[#FFBE0D]/10 text-[#FFBE0D]'
                        : 'border-orange-300 bg-orange-50 text-orange-800'
                    }`}>
                      {activeIntelGame.category}
                    </span>
                    <p className={`mt-4 text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {activeIntelGame.description}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="min-w-0">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-neutral-500">
                        <Gamepad2 className="h-3 w-3 text-[#FFBE0D]" />
                        Type
                      </span>
                      <span className="mt-1 block truncate text-sm font-bold">{activeIntelGame.genre}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-neutral-500">
                        <Calendar className="h-3 w-3 text-[#FFBE0D]" />
                        Since
                      </span>
                      <span className="mt-1 block text-sm font-bold">{activeIntelGame.scheduleDay}</span>
                    </div>
                  </div>

                

                  <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                    <a
                      href={activeIntelGame.youtubeUrl?.trim() || 'https://www.youtube.com/@Snnsei'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF0000] px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-all shadow-[0_6px_24px_rgba(255,0,0,0.35)] hover:bg-[#d90000] active:scale-[0.98]"
                    >
                      <YouTubeIcon className="h-4 w-4" />
                      <span>Watch on YouTube</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href="https://kick.com/snnsei"
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] ${
                        isDark
                          ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-[#FFBE0D]/50 hover:text-white'
                          : 'border-neutral-200 bg-neutral-100 text-neutral-700 hover:border-orange-300 hover:text-neutral-900'
                      }`}
                    >
                      <KickIcon className="h-4 w-4 text-[#53FC18]" />
                      <span>Kick</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
