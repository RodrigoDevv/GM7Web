import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { DiscordIcon, KickIcon, InstagramIcon } from './BrandIcons';

export const Footer: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <footer
      id="contact"
      className={`pt-16 pb-12 transition-colors duration-300 relative overflow-hidden ${
        isDark
          ? 'bg-[#050608] text-white border-t border-white/5'
          : 'bg-neutral-100 text-neutral-900 border-t border-neutral-200'
      }`}
    >
      {/* Precision Grid Background in Footer */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className={`absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_65%,transparent_100%)] ${
            isDark
              ? 'bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] opacity-60'
              : 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px] opacity-70'
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b ${
            isDark ? 'border-neutral-800/80' : 'border-neutral-300'
          }`}
        >
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
              }}
              aria-label="GM7 — l'Gamers Lmla7 home"
              className={`inline-flex items-center gap-0.5 font-display text-2xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-neutral-950'
              }`}
            >
              <span>GM</span>
              <span className={isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}>7</span>
            </a>

            <p className={`text-xs sm:text-sm max-w-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              The high-performance streaming collective and builder guild. Broadcasts live on Kick, operates 24/7 on Discord.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://discord.gg/MWdjQy4fBM"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 hover:border-[#5865F2] hover:text-[#5865F2] text-neutral-300 hover:shadow-[0_0_15px_rgba(88,101,242,0.4)]'
                    : 'bg-white border-neutral-300 hover:border-[#5865F2] hover:text-[#5865F2] text-neutral-700 shadow-xs'
                }`}
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a
                href="https://kick.com/snnsei"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kick"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 hover:border-[#FFBE0D] hover:text-[#FFBE0D] text-neutral-300 hover:shadow-[0_0_15px_rgba(255,190,13,0.5)]'
                    : 'bg-white border-neutral-300 hover:border-[#8C6500] hover:text-[#8C6500] text-neutral-700 shadow-xs'
                }`}
              >
                <KickIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/snnseii/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 hover:border-[#E1306C] hover:text-[#E1306C] text-neutral-300 hover:shadow-[0_0_15px_rgba(225,48,108,0.4)]'
                    : 'bg-white border-neutral-300 hover:border-[#E1306C] hover:text-[#E1306C] text-neutral-700 shadow-xs'
                }`}
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Navigation
            </h4>
            <ul className={`space-y-2 text-xs font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/';
                  }}
                  className={`transition-colors ${isDark ? 'hover:text-[#FFBE0D]' : 'hover:text-[#8C6500]'}`}
                >
                  Home
                </a>
              </li>
              <li>
                <a href="#what-we-play" className={`transition-colors ${isDark ? 'hover:text-[#FFBE0D]' : 'hover:text-[#8C6500]'}`}>
                  What We Play
                </a>
              </li>
              <li>
                <a href="/games" className={`transition-colors ${isDark ? 'hover:text-[#FFBE0D]' : 'hover:text-[#8C6500]'}`}>
                  All Games
                </a>
              </li>
              <li>
                <a href="#schedule" className={`transition-colors ${isDark ? 'hover:text-[#FFBE0D]' : 'hover:text-[#8C6500]'}`}>
                  When We Stream
                </a>
              </li>
              <li>
                <a href="#setup" className={`transition-colors ${isDark ? 'hover:text-[#FFBE0D]' : 'hover:text-[#8C6500]'}`}>
                  Sensei's Battle Station
                </a>
              </li>
              <li>
                <a href="/about" className={`transition-colors ${isDark ? 'hover:text-[#FFBE0D]' : 'hover:text-[#8C6500]'}`}>
                  About Snnsei & GM7
                </a>
              </li>
              <li>
                <a href="/socials" className={`transition-colors ${isDark ? 'hover:text-[#FFBE0D]' : 'hover:text-[#8C6500]'}`}>
                  Socials
                </a>
              </li>
              <li>
                <a href="/tournaments" className={`transition-colors ${isDark ? 'hover:text-[#FFBE0D]' : 'hover:text-[#8C6500]'}`}>
                  Tournaments
                </a>
              </li>
              <li>
                <a href="#socials" className={`transition-colors ${isDark ? 'hover:text-[#FFBE0D]' : 'hover:text-[#8C6500]'}`}>
                  Official Socials
                </a>
              </li>
              <li>
                <a
                  href="https://kick.com/snnsei"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors font-bold ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}
                >
                  Kick Channel ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Notification Signup */}
          
        </div>

        {/* Bottom bar with Senior UX Touches */}
        <div className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          isDark ? 'text-neutral-500' : 'text-neutral-500'
        }`}>
          

          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <span className="text-[#FFBE0D]" aria-label="love">❤</span>
            <span>by</span>
            <a
              href="https://emberlyn.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-bold transition-colors ${isDark ? 'text-neutral-300 hover:text-[#FFBE0D]' : 'text-neutral-700 hover:text-[#8C6500]'}`}
            >
              Emberlyn Team
            </a>
          </div>

          <address className="not-italic text-center text-xs">
            Operated by GM7 Community
          </address>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className={`font-mono text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              SHORTCUTS: <kbd className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">T</kbd> THEME · <kbd className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">1-7</kbd> JUMP
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
