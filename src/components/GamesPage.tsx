import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Calendar, Gamepad2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import { defaultGames, upcomingGames, type GameItem } from '../data/games';
import { KickIcon, YouTubeIcon } from './BrandIcons';

interface GamesPageProps {
  onNavigateHome: (targetSection?: string) => void;
  onToast?: (msg: string) => void;
}

export const GamesPage: React.FC<GamesPageProps> = ({ onNavigateHome }) => {
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
    <div
      className={`relative min-h-[80vh] flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-[#07080a] text-white' : 'bg-white text-neutral-900'
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,190,13,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,190,13,0.035) 1px, transparent 1px)'
            : 'linear-gradient(rgba(140,101,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(140,101,0,0.045) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl 2xl:max-w-[90rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigateHome('what-we-play')}
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${
            isDark
              ? 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:border-[#FFBE0D]/50 hover:text-[#FFBE0D]'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-orange-400 hover:text-[#8C6500]'
          }`}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to What We Play
        </button>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-black uppercase tracking-tight sm:text-xl">All Games</h2>
            <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
              {games.length} / 100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {games.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => setActiveIntelGame(game)}
                className={`group overflow-hidden cursor-pointer rounded-none border text-left transition-all duration-300 hover:-translate-y-1 active:scale-95 ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900/60 hover:border-[#FFBE0D]/50 hover:shadow-[0_12px_30px_rgba(255,190,13,0.18)]'
                    : 'border-neutral-200 bg-white hover:border-orange-400 hover:shadow-md hover:shadow-orange-500/15'
                }`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="aspect-[9/16] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-1 text-white">
                    <h3 className="truncate text-[10px] font-semibold leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      {game.title}
                    </h3>
                    <p className="mt-0 truncate text-[9px] text-neutral-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      {game.genre}
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {upcomingGames.map((game) => (
              <div
                key={game.id}
                className={`flex aspect-[9/16] flex-col items-center justify-center gap-2 rounded-none border p-2 text-center ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900/60'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <span
                  className={`text-xl font-bold leading-none ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}
                >
                  ?
                </span>
                <span
                  className={`text-[9px] font-semibold uppercase tracking-wide ${
                    isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  Soon
                </span>
              </div>
            ))}
          </div>
        </section>

        <div
          className={`mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center ${
            isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-200 bg-neutral-50'
          }`}
        >
          <div>
            <h2 className="text-lg font-black tracking-tight sm:text-xl">Want a game added to the rotation?</h2>
            <p className={`mt-1 text-xs sm:text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Drop your suggestion in the community Discord and vote in the next poll.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@Snnsei"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#ee0f0f] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-[#bf2626] active:scale-95"
          >
            <YouTubeIcon className="h-4 w-4" />
            Watch on Youtube
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

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
  );
};
