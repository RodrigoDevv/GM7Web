import React from 'react';
import { ArrowUpRight, Instagram, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import discordImg from '../assets/images/discordBanner.jpg';
import kickImg from '../assets/images/KickBanner.jpg';
import instaImg from '../assets/images/instaBanner.jpg';

const DiscordIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const KickIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h5.5v6.5h3V4h5.5v6h-3v4h3v6H11.5v-5.5h-3V21H3V3z" />
  </svg>
);

interface SocialsSectionProps {
  onToast?: (msg: string) => void;
}

export const SocialsSection: React.FC<SocialsSectionProps> = ({ onToast }) => {
  const { isDark } = useTheme();

  const socials = [
    {
      id: 'discord',
      platform: 'Discord',
      name: 'Discord Community',
      handle: 'discord.gg/gm7',
      url: 'https://discord.gg/MWdjQy4fBM',
      stats: '3,000+ members',
      icon: DiscordIcon,
      color: '#5865F2',
      image: discordImg,
      description: 'Squad matchmaking, scrim channels, and subscriber-only roles.',
      actionLabel: 'Join Discord',
    },
    {
      id: 'kick',
      platform: 'Kick',
      name: 'Kick Live Stream',
      handle: 'kick.com/snnsei',
      url: 'https://kick.com/snnsei',
      stats: 'Live daily · 5 PM UTC',
      icon: KickIcon,
      color: '#53FC18',
      image: kickImg,
      description: 'Ranked broadcasts, giveaways, and viewer lobbies every night.',
      actionLabel: 'Watch Live',
      isLive: true,
    },
    {
      id: 'instagram',
      platform: 'Instagram',
      name: 'Instagram Clips',
      handle: '@Snnsei',
      url: 'https://www.instagram.com/snnseii/',
      stats: 'Daily reels & highlights',
      icon: Instagram,
      color: '#E1306C',
      gradient: 'linear-gradient(135deg, #833AB4 0%, #E1306C 55%, #F77737 100%)',
      image: instaImg,
      description: 'Clutch reels, setup updates, and tournament announcements.',
      actionLabel: 'Follow',
    },
  ];

  return (
    <section
      id="socials"
      className={`relative overflow-hidden border-b py-16 transition-colors duration-200 sm:py-24 ${
        isDark
          ? 'border-neutral-800/80 bg-[#080a0d] text-neutral-100'
          : 'border-neutral-200 bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Soft ambient tint */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
        <div
          className={`absolute inset-x-0 top-0 h-px ${
            isDark
              ? 'bg-gradient-to-r from-transparent via-[#FFBE0D]/40 to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#FFBE0D]/60 to-transparent'
          }`}
        />
        <div className="absolute -top-24 left-1/2 h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-[#FFBE0D]/8 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 max-w-2xl sm:mb-14">
          <div
            className={`mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              isDark
                ? 'border-[#FFBE0D]/30 bg-[#FFBE0D]/10 text-[#FFBE0D]'
                : 'border-orange-300 bg-orange-50 text-orange-800'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official Channels</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Official Community & Socials
          </h2>
          <p
            className={`mt-2.5 text-sm leading-relaxed sm:text-base ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Join 48,000+ members in Discord, catch live broadcasts on Kick, and watch daily clips on
            Instagram.
          </p>
        </div>

        {/* Social cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-7">
          {socials.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'border-white/8 bg-[#0b0d11] hover:border-white/15'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
                style={{
                  boxShadow: isDark
                    ? '0 18px 40px -30px rgba(0,0,0,0.95)'
                    : '0 18px 40px -32px rgba(15, 23, 42, 0.35)',
                }}
              >
                {/* Brand hairline */}
                <span
                  className="absolute inset-x-0 top-0 z-30 h-[3px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                  }}
                  aria-hidden="true"
                />

                {/* Banner */}
                <div className="relative h-44 shrink-0 overflow-hidden sm:h-48">
                  <img
                    src={card.image}
                    alt={`${card.name} banner`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />

                  <div className="absolute left-5 top-5 flex items-center gap-2">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-md"
                      style={{
                        borderColor: `${card.color}66`,
                        backgroundColor: `${card.color}26`,
                        color: card.color,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white/85 backdrop-blur-md">
                      {card.platform}
                    </span>
                  </div>

                  {card.isLive && (
                    <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-[#53FC18]/40 bg-black/55 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#53FC18] backdrop-blur-md">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#53FC18] opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#53FC18]" />
                      </span>
                      Live
                    </span>
                  )}

                  <div className="absolute inset-x-5 bottom-4">
                    <h3 className="text-lg font-black tracking-tight text-white sm:text-xl">
                      {card.name}
                    </h3>
                    <p
                      className="mt-0.5 font-mono text-[11px] font-bold"
                      style={{ color: card.color }}
                    >
                      {card.handle}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p
                    className={`text-xs leading-relaxed ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}
                  >
                    {card.description}
                  </p>

                  <div
                    className={`mt-5 flex items-center justify-between gap-3 border-t pt-4 ${
                      isDark ? 'border-white/8' : 'border-neutral-100'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wide ${
                        isDark ? 'text-neutral-500' : 'text-neutral-500'
                      }`}
                    >
                      {card.stats}
                    </span>

                    <a
                      href={card.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => onToast?.(`Opening ${card.name}`)}
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-wide transition-all duration-200 hover:gap-2.5 active:scale-95"
                      style={{
                        background: card.gradient ?? card.color,
                        color: card.id === 'kick' ? '#0a0a0a' : '#ffffff',
                        boxShadow: `0 8px 22px -12px ${card.color}`,
                      }}
                    >
                      {card.actionLabel}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
