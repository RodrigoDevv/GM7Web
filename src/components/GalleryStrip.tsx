import React from 'react';
import { Camera } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import eventStageImg from '../assets/images/community_event_stage_1791557420746.jpg';
import trophyImg from '../assets/images/sensei_tournament_trophy_1792363736711.jpg';
import meetupImg from '../assets/images/sensei_community_meetup_1792363736995.jpg';
import cinematicImg from '../assets/images/sensei_cinematic_hero_1792265647557.jpg';
import portraitImg from '../assets/images/hero_protagonist_portrait_1792266030682.jpg';
import keyboardImg from '../assets/images/setup_keyboard_full_1792241681896.jpg';
import mouseImg from '../assets/images/setup_mouse_amber_1792241663282.jpg';
import headsetImg from '../assets/images/setup_headset_white_1792241634540.jpg';
import ambientImg from '../assets/images/showcase_project_ambient_1791557391148.jpg';
import canvasImg from '../assets/images/showcase_project_ai_canvas_1791557402342.jpg';
import ecoImg from '../assets/images/showcase_project_eco_hardware_1791557411923.jpg';
import apexImg from '../assets/images/ps5_apex_hero_1791730950598.jpg';

const galleryItems = [
  { src: eventStageImg, label: 'Community Nights', meta: 'Live stage events' },
  { src: apexImg, label: 'Ranked Grind', meta: 'Apex Predator push' },
  { src: trophyImg, label: 'Trophy Case', meta: 'Cups & bounties won' },
  { src: portraitImg, label: 'Sensei GM7', meta: 'Studio portrait' },
  { src: meetupImg, label: 'Dojo Meetup', meta: '150K+ members IRL' },
  { src: cinematicImg, label: 'Cinematic Reels', meta: 'AI highlight cuts' },
  { src: keyboardImg, label: 'Keystrokes', meta: 'Full-size switches' },
  { src: mouseImg, label: 'Aim Arsenal', meta: 'Amber glow loadout' },
  { src: headsetImg, label: 'Comms Check', meta: 'Clean white setup' },
  { src: ambientImg, label: 'Ambient Builds', meta: 'Side projects' },
  { src: canvasImg, label: 'AI Canvas', meta: 'Creative experiments' },
  { src: ecoImg, label: 'Eco Hardware', meta: 'Green rigs' },
];

export const GalleryStrip: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <section
      id="gallery"
      className={`py-16 sm:py-24 transition-colors duration-200 border-b relative overflow-hidden ${
        isDark
          ? 'bg-[#07080a] text-neutral-100 border-neutral-800/80'
          : 'bg-white text-neutral-900 border-neutral-200'
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[360px] bg-[#FFBE0D]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isDark
                  ? 'bg-[#FFBE0D]/10 border-[#FFBE0D]/30 text-[#FFBE0D] shadow-[0_0_15px_rgba(255,190,13,0.15)]'
                  : 'bg-orange-50 border-orange-300 text-orange-800 shadow-xs'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Gallery</span>
            </span>
            <span className={`text-xs font-mono font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              · Streams, trophies & the setup
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Inside the Dojo</h2>
          <p
            className={`mt-2.5 text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Match days, trophy lifts, meetups, and the gear behind every broadcast.
          </p>
        </div>
      </div>

      {/* Infinite Marquee */}
      <div
        className="relative z-10 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      >
        <div className="gallery-track flex gap-4 w-max">
          {[...galleryItems, ...galleryItems].map((item, i) => (
            <figure
              key={`${item.label}-${i}`}
              className={`group relative shrink-0 w-60 sm:w-72 h-44 rounded-xl overflow-hidden border transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(255,190,13,0.25)] ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              }`}
            >
              <img
                src={item.src}
                alt={item.label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <figcaption className="absolute left-3.5 right-3.5 bottom-3.5">
                <div className="text-xs font-black uppercase tracking-wider text-white drop-shadow-md">
                  {item.label}
                </div>
                <div className="text-[10px] font-mono font-bold text-[#FFBE0D] mt-0.5 drop-shadow-md">
                  {item.meta}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
