import React from 'react';
import { Target, Users, Flame, Quote } from 'lucide-react';

interface PhilosophySectionProps {
  onToast?: (msg: string) => void;
}

const principles = [
  {
    icon: Target,
    title: 'Discipline Over Luck',
    tagline: 'Precision & Accountability',
    description:
      'We never blame the meta, the ping, or the drop. Every defeat is analyzed, every mechanic is refined. High APM and cold focus beat blind luck every time.',
  },
  {
    icon: Users,
    title: 'Community Without Ego',
    tagline: 'Open Lobbies, Zero Gatekeeping',
    description:
      'No VIP paywalls or closed circles. The squad is built together through nightly viewer matches, custom scrims, and real chat connection.',
  },
  {
    icon: Flame,
    title: 'Relentless Consistency',
    tagline: '5:00 PM UTC • Every Single Night',
    description:
      'Showing up when motivation fades is the real cheat code. Streaming is our craft, and consistency is our unbroken commitment to the community.',
  },
];

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({ onToast }) => {
  return (
    <section id="philosophy" className="py-14 sm:py-20 bg-white text-neutral-900 relative">
      <div className="max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-800 mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#FFBE0D] ring-2 ring-orange-500/20 animate-pulse" />
            OUR CREED
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 mb-4">
            The GM7 Philosophy
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Streaming isn’t just background noise — it’s a commitment to mastery, respect for the audience, and pure love of the game.
          </p>
        </div>

        {/* 3 Core Principle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                onClick={() => onToast?.(`Philosophy #${idx + 1}: ${item.title}`)}
                className="group relative rounded-2xl bg-white border border-neutral-200 p-7 sm:p-8 hover:border-neutral-900 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top indicator & icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 group-hover:bg-[#FFBE0D] group-hover:border-[#FFBE0D] text-neutral-900 group-hover:text-black flex items-center justify-center transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-neutral-400 group-hover:text-neutral-900 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-extrabold text-neutral-950 tracking-tight group-hover:text-black transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 mt-1 mb-3">
                    {item.tagline}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subtle bottom bar accent */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-medium">
                  <span>Core Pillar</span>
                  <span className="text-neutral-900 font-semibold group-hover:translate-x-1 transition-transform">
                    Explore →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Quote Banner */}
        <div className="mt-12 sm:mt-16 rounded-2xl bg-neutral-50 border border-neutral-200 p-6 sm:p-8 text-center max-w-3xl mx-auto">
          <Quote className="w-6 h-6 text-neutral-400 mx-auto mb-3" />
          <blockquote className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight leading-snug">
            “Play with intent. Win with discipline. Never fake the grind.”
          </blockquote>
          <p className="mt-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
            — Sensei • GM7 Founder
          </p>
        </div>

      </div>
    </section>
  );
};
