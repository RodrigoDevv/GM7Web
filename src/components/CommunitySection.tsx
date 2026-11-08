import React from 'react';
import { Users, Trophy, Bell, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { DiscordIcon } from './BrandIcons';

interface CommunitySectionProps {
  onToast?: (msg: string) => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({ onToast }) => {
  const { isDark } = useTheme();

  const handleClaimRole = () => {
    onToast?.('🎉 Role requested! Open Discord to link your Kick account for VIP queues.');
  };

  const perks = [
    {
      icon: Users,
      title: 'Active LFG Channels',
      description: 'Find ranked teammates 24/7 for Apex Legends, CS2, Valorant & EA FC 26.',
      tag: '48K+ Members',
    },
    {
      icon: Trophy,
      title: 'Weekly Tournaments',
      description: 'Exclusive community cups, custom 1v1 lobbies, and $1K Friday scrims.',
      tag: 'Every Friday',
    },
    {
      icon: Bell,
      title: 'Instant Stream Pings',
      description: 'Direct notification the second Sensei goes live with drop alerts and giveaways.',
      tag: 'Real-time',
    },
  ];

  return (
    <section
      id="community"
      className={`py-14 sm:py-20 relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#07080a] text-white border-t border-white/5'
          : 'bg-neutral-50 text-neutral-900 border-t border-neutral-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simple Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono mb-3 ${
              isDark
                ? 'bg-neutral-900 border border-[#FFBE0D]/30 text-[#FFBE0D]'
                : 'bg-[#FFBE0D]/15 border border-[#8C6500]/30 text-[#8C6500]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#FFBE0D]' : 'bg-[#8C6500]'} animate-pulse`} />
            GM7 SQUAD HUB
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 ${
              isDark ? 'text-white' : 'text-neutral-950'
            }`}
          >
            Join The Squad
          </h2>

          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Where the community hangs out off-stream. Squad up, share clips, participate in custom matches, and never game alone.
          </p>
        </div>

        {/* 3 Simple Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isDark
                    ? 'bg-neutral-900/90 border-neutral-800 hover:border-[#FFBE0D]/60 shadow-lg'
                    : 'bg-white border-neutral-200 hover:border-[#FFBE0D] shadow-md hover:shadow-xl'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isDark
                          ? 'bg-[#FFBE0D]/10 border border-[#FFBE0D]/30 text-[#FFBE0D]'
                          : 'bg-[#FFBE0D]/15 border border-[#8C6500]/25 text-[#8C6500]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isDark
                          ? 'bg-white/5 text-neutral-300 border border-white/10'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}
                    >
                      {perk.tag}
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-neutral-950'
                    }`}
                  >
                    {perk.title}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}
                  >
                    {perk.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean Call To Action Strip */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-5 ${
            isDark
              ? 'bg-gradient-to-r from-neutral-900 via-neutral-900 to-black border-neutral-800'
              : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 hidden sm:flex ${
                isDark ? 'bg-[#5865F2]/20 text-[#5865F2]' : 'bg-[#5865F2]/10 text-[#5865F2]'
              }`}
            >
              <DiscordIcon className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                Ready to squad up with Sensei?
              </div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Free to join • Instant role assignment • All platforms welcome
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => onToast?.('Opening Discord community invite...')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
            >
              <DiscordIcon className="w-4 h-4" />
              <span>Join Discord</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleClaimRole}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#FFBE0D]" />
              <span>Claim Role</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
