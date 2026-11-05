import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { defaultGames, upcomingGames, type GameItem } from '../data/games';

const KickIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h5.5v6.5h3V4h5.5v6h-3v4h3v6H11.5v-5.5h-3V21H3V3z" />
  </svg>
);

interface GamesPageProps {
  onNavigateHome: (targetSection?: string) => void;
  onToast?: (msg: string) => void;
}

export const GamesPage: React.FC<GamesPageProps> = ({ onNavigateHome }) => {
  const { isDark } = useTheme();
  const [activeIntelGame, setActiveIntelGame] = useState<GameItem | null>(null);

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

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
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
              {defaultGames.length + upcomingGames.length} titles
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {defaultGames.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => setActiveIntelGame(game)}
                className={`group overflow-hidden rounded-none border text-left transition-all duration-300 hover:-translate-y-1 ${
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

                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-2 text-white">
                    <h3 className="truncate text-xs font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:text-sm">
                      {game.title}
                    </h3>
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
            href="https://kick.com/snnsei"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FFBE0D] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-[#E5A800] active:scale-95"
          >
            <KickIcon className="h-4 w-4" />
            Watch on Kick
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {activeIntelGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveIntelGame(null)}
        >
          <div
            className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-[0_25px_60px_-10px_rgba(255,190,13,0.25)] transition-all ${
              isDark
                ? 'border-[#FFBE0D]/40 bg-neutral-900/95 text-white'
                : 'border-orange-300 bg-white text-neutral-900 shadow-2xl'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`rounded border border-[#FFBE0D]/30 bg-[#FFBE0D]/20 px-2 py-0.5 font-mono text-xs font-bold ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
                    {activeIntelGame.category}
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {activeIntelGame.genre} · {activeIntelGame.scheduleDay}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-black sm:text-2xl">{activeIntelGame.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveIntelGame(null)}
                className={`rounded-lg p-1.5 transition-colors ${
                  isDark ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className={`mb-5 text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              {activeIntelGame.description}
            </p>

            <div
              className={`mb-6 space-y-3 rounded-xl border p-4 ${
                isDark ? 'border-neutral-800 bg-black/50' : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <div>
                <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
                  Current Rank
                </span>
                <span className="text-sm font-semibold">{activeIntelGame.rankBadge}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Signature Loadout
                </span>
                <span className="text-sm">{activeIntelGame.loadout}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Community Squad
                </span>
                <span className="text-sm">{activeIntelGame.squadStatus}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <a
                href="https://kick.com/snnsei"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFBE0D] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[0_4px_20px_rgba(255,190,13,0.45)] transition-all hover:bg-[#E5A800] hover:shadow-[0_6px_25px_rgba(255,190,13,0.65)] active:scale-98"
              >
                <KickIcon className="w-4 h-4" />
                <span>Watch on Kick</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
