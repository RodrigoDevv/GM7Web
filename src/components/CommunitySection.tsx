import React from 'react';
import { Users, Trophy, Bell, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Authentic Discord Icon
const DiscordIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

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
