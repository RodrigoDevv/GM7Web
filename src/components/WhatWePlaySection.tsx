import React, { useState } from 'react';
import { Gamepad2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import apexImage from '../assets/images/ps5_apex_hero_1791730950598.jpg';
import fpsImage from '../assets/images/ArcRiders.jpeg';
import soulsImage from '../assets/images/ps5_souls_elden_1791730984139.jpg';
import heistImage from '../assets/images/ps5_city_heist_1791730967151.jpg';
import soccerImage from '../assets/images/ps5_esports_soccer_1791731018539.jpg';
import kickStreamImg from '../assets/images/LastOfUs.jpg';
import senseiShowcaseImg from '../assets/images/play.png';

// Authentic Kick Icon
const KickIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h5.5v6.5h3V4h5.5v6h-3v4h3v6H11.5v-5.5h-3V21H3V3z" />
  </svg>
);

interface WhatWePlaySectionProps {
  onToast?: (msg: string) => void;
}

interface GameItem {
  id: string;
  title: string;
  genre: string;
  category: string;
  tag: string;
  image: string;
  scheduleDay: string;
  initialHypes: number;
  rankBadge: string;
  loadout: string;
  squadStatus: string;
  description: string;
}

const defaultGames: GameItem[] = [
  {
    id: 'apex',
    title: 'Ghost of Tsushima',
    genre: 'Action RPG',
    category: 'RPG',
    tag: 'Main Grind',
    image: apexImage,
    scheduleDay: 'Mon & Fri',
    initialHypes: 1240,
    rankBadge: 'Predator Top 500',
    loadout: 'Wingman + R-99 (Wraith / Octane)',
    squadStatus: 'Open for Community 1v1s & Trios',
    description: 'High APM movement tech, ranked drops, and 20-bomb challenges every Monday & Friday night.',
  },
  {
    id: 'tactical-fps',
    title: 'Arc Riders',
    genre: 'Tactical Shooter',
    category: 'FPS',
    tag: 'Ranked Demon',
    image: fpsImage,
    scheduleDay: 'Tue & Thu',
    initialHypes: 980,
    rankBadge: '22,500 Premier ELO / Radiant',
    loadout: 'Vandal / AK-47 One-Taps Only',
    squadStatus: '5-Stack Subscriber Queue',
    description: 'Tactical execute rounds, headshot accuracy practice, and high-stakes wager matches on stream.',
  },
  {
    id: 'elden-ring',
    title: 'Red Dead',
    genre: 'Action-adventure',
    category: 'Adventure',
    tag: 'No-Hit Runs',
    image: soulsImage,
    scheduleDay: 'Wednesdays',
    initialHypes: 1540,
    rankBadge: 'All Bosses RL1 Cleared',
    loadout: 'Naked Club / Dual Curved Swords',
    squadStatus: 'Chat Chooses Challenge Modifiers',
    description: 'Punishing challenge runs, DLC boss speedruns, and community co-op invasions.',
  },
  {
    id: 'gta-rp',
    title: 'GTA V RP',
    genre: 'Open World RP',
    category: 'RP',
    tag: 'Crime Boss',
    image: heistImage,
    scheduleDay: 'Saturdays',
    initialHypes: 1890,
    rankBadge: 'Most Wanted — $50M+ Earned',
    loadout: 'Custom Tuner + Suppressed SMG',
    squadStatus: 'Subscribers Join Bank Heist Crew',
    description: 'High-speed getaway chases, multi-million dollar bank heists, and legendary storylines.',
  },
  {
    id: 'fc26',
    title: 'EA Sports FC 27',
    genre: 'Competitive Football',
    category: 'Sports',
    tag: 'Champions',
    image: soccerImage,
    scheduleDay: 'Sundays',
    initialHypes: 820,
    rankBadge: 'Rank 1 / Elite Division',
    loadout: '4-3-2-1 Direct Passing Meta',
    squadStatus: 'Viewer 1v1 Friendlies & Squad Battles',
    description: 'Ultimate Team Champions finals, pack openings, and custom tactics breakdown with chat.',
  },
  {
    id: 'cs2',
    title: 'The Last Of Us',
    genre: 'Tactical Shooter',
    category: 'FPS',
    tag: 'Premier Grind',
    image: kickStreamImg,
    scheduleDay: 'Tuesdays',
    initialHypes: 1120,
    rankBadge: '15,000 Premier ELO',
    loadout: 'AK-47 One-Taps & AWP Holds',
    squadStatus: '5-Stack Subscriber Queue',
    description: 'Premier rank climbs, sharp utility executes, and clutch highlight rounds every Tuesday night.',
  },
];

export const WhatWePlaySection: React.FC<WhatWePlaySectionProps> = () => {
  const { isDark } = useTheme();
  const [activeIntelGame, setActiveIntelGame] = useState<GameItem | null>(null);

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
              · 6 Broadcast Titlesles
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
            {defaultGames.map((game) => {
              return (
                <div
                  key={game.id}
                  onClick={() => setActiveIntelGame(game)}
                  className={`group overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
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

                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

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
          </div>

          {/* Right: Sensei cutout with kinetic title BEHIND it (transparent PNG) */}
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5] lg:aspect-auto lg:min-h-[500px]">
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
              className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 h-[80%] w-auto object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>

        {/* Loadout & Squad Intel Modal with Glowing Border & Shadow */}
        {activeIntelGame && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
            onClick={() => setActiveIntelGame(null)}
          >
            <div
              className={`w-full max-w-lg rounded-2xl border p-6 relative transition-all shadow-[0_25px_60px_-10px_rgba(255,190,13,0.25)] ${
                isDark
                  ? 'bg-neutral-900/95 border-[#FFBE0D]/40 text-white'
                  : 'bg-white border-orange-300 text-neutral-900 shadow-2xl'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded bg-[#FFBE0D]/20 border border-[#FFBE0D]/30 font-mono ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
                      {activeIntelGame.category}
                    </span>
                    <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {activeIntelGame.genre} · {activeIntelGame.scheduleDay}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mt-2 text-neutral-900 dark:text-white">
                    {activeIntelGame.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIntelGame(null)}
                  className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'}`}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {activeIntelGame.description}
              </p>

              <div className={`p-4 rounded-xl border space-y-3 mb-6 ${
                isDark ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div>
                  <span className={`font-bold uppercase tracking-wider text-[10px] block ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>Current Rank</span>
                  <span className="font-semibold text-sm">{activeIntelGame.rankBadge}</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px] block">Signature Loadout</span>
                  <span className="text-sm">{activeIntelGame.loadout}</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px] block">Community Squad</span>
                  <span className="text-sm">{activeIntelGame.squadStatus}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <a
                  href="https://kick.com/snnsei"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FFBE0D] text-black hover:bg-[#E5A800] transition-all shadow-[0_4px_20px_rgba(255,190,13,0.45)] hover:shadow-[0_6px_25px_rgba(255,190,13,0.65)] active:scale-98"
                >
                  <KickIcon className="w-4 h-4" />
                  <span>Watch on Kick</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
