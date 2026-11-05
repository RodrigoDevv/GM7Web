import React, { useState, useEffect } from 'react';
import { Instagram, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import type { Page } from '../types/navigation';

// Authentic Discord Icon
const DiscordIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// Authentic Kick Streaming Icon
const KickIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h5.5v6.5h3V4h5.5v6h-3v4h3v6H11.5v-5.5h-3V21H3V3z" />
  </svg>
);

interface NavbarProps {
  currentPage?: Page;
  onNavigate?: (page: Page, targetSection?: string) => void;
  onToast?: (msg: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage = 'home', onNavigate, onToast }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, loading: authLoading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Scrollspy to detect active viewport section (active when on home page)
  useEffect(() => {
    if (currentPage !== 'home') return;
    const sectionIds = ['hero', 'what-we-play', 'schedule', 'setup', 'socials'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleToggle = () => {
    toggleTheme();
    onToast?.(isDark ? '☀️ Switched to White (Light) Mode' : '🌙 Switched to Dark Mode');
  };

  // Close the user menu when clicking outside of it
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('#navbar-user-menu')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [userMenuOpen]);

  const navLinks: Array<{
    id: string;
    label: string;
    href: string;
    page: Page;
    external?: boolean;
  }> = [
    { id: 'hero', label: 'Home', href: '#hero', page: 'home' as const },
    { id: 'about', label: 'About', href: '/about', page: 'about' as const },
    { id: 'socials-page', label: 'Socials', href: '/socials', page: 'socials' as const },
    { id: 'tournaments', label: 'Tournament', href: '/tournaments', page: 'tournaments' as const },
  ];

  const socialLinks = [
    {
      name: 'Discord',
      href: 'https://discord.com',
      icon: DiscordIcon,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: Instagram,
    },
    {
      name: 'Kick',
      href: 'https://kick.com/snnsei',
      icon: KickIcon,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-300 backdrop-blur-md ${
        isDark
          ? 'bg-[#07080a]/85 border-b border-white/5 text-white'
          : 'bg-white/90 border-b border-neutral-200/80 text-neutral-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: GM7 Logo with live indicator */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.('home', 'hero');
          }}
          className="flex items-center gap-1.5 font-display text-2xl font-black tracking-tight whitespace-nowrap shrink-0 group cursor-pointer"
        >
          <span
            className={`text-white ${
              isDark
                ? '[-webkit-text-stroke:1.5px_#ffffff]'
                : '[-webkit-text-stroke:1.5px_#0a0a0a]'
            }`}
          >
            GM
          </span>
          <span
            className="text-[#FFBE0D] [-webkit-text-stroke:1.5px_#FFBE0D] group-hover:scale-110 transition-transform"
          >
            7
          </span>
         
        </a>

        {/* Center: Navigation Links with Scrollspy & Page Routing */}
        <nav
          className={`hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold ${
            isDark ? 'text-neutral-300' : 'text-neutral-600'
          }`}
        >
          {navLinks.map((link) => {
            const isActive = link.page !== 'home'
              ? currentPage === link.page
              : currentPage === 'home' && activeSection === link.id && !link.external;

            return (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (link.external) return;
                  e.preventDefault();
                  if (link.page !== 'home') {
                    onNavigate?.(link.page);
                  } else {
                    onNavigate?.('home', link.id);
                  }
                }}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'text-[#FFBE0D] font-bold'
                      : 'text-[#8C6500] font-bold'
                    : isDark
                    ? 'hover:text-[#FFBE0D]'
                    : 'hover:text-[#8C6500]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      isDark ? 'bg-[#FFBE0D]' : 'bg-[#8C6500]'
                    }`}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Theme Toggle & Social Media Icons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Simple Theme Toggle Icon with shortcut hint */}
          <button
            onClick={handleToggle}
            type="button"
            aria-label={isDark ? 'Switch to Light Mode (Press T)' : 'Switch to Dark Mode (Press T)'}
            title={isDark ? 'Switch to Light Mode [T]' : 'Switch to Dark Mode [T]'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer group ${
              isDark
                ? 'text-neutral-300 hover:text-amber-400 hover:bg-white/5 active:bg-white/10'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200'
            }`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Social Icons */}
          <div className="flex items-center gap-1.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border ${
                    isDark
                      ? 'text-neutral-300 hover:text-[#FFBE0D] hover:bg-[#FFBE0D]/15 border-transparent hover:border-[#FFBE0D]/30'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100 border-transparent hover:border-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {/* User Menu */}
          {!authLoading && user && (
            <div className="relative" id="navbar-user-menu">
              <button
                onClick={() => setUserMenuOpen((open) => !open)}
                type="button"
                title={user.name}
                className={`flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isDark
                    ? 'border-white/10 hover:border-[#FFBE0D]/50 bg-white/5 hover:bg-white/10'
                    : 'border-neutral-200 hover:border-[#FFBE0D] bg-neutral-100 hover:bg-neutral-200'
                }`}
              >
                <img
                  src={user.avatarUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-lg bg-neutral-300 object-cover"
                />
                <span
                  className={`hidden sm:inline text-xs font-bold max-w-[9ch] truncate ${
                    isDark ? 'text-neutral-200' : 'text-neutral-800'
                  }`}
                >
                  {user.name}
                </span>
              </button>

              {userMenuOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border p-2 shadow-2xl z-50 animate-fade-in ${
                    isDark
                      ? 'bg-neutral-900 border-white/10 text-white'
                      : 'bg-white border-neutral-200 text-neutral-900'
                  }`}
                >
                  <div className="px-3 py-2 border-b border-inherit mb-1">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className={`text-xs truncate ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      @{user.handle}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      onToast?.('👋 Signed out of Discord');
                    }}
                    type="button"
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      isDark
                        ? 'hover:bg-red-500/15 hover:text-red-400'
                        : 'hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
