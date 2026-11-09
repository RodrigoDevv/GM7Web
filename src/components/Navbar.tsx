import React, { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Trash2, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import type { Page } from '../types/navigation';
import { DiscordIcon, KickIcon, InstagramIcon } from './BrandIcons';

interface NavbarProps {
  currentPage?: Page;
  onNavigate?: (page: Page, targetSection?: string) => void;
  onToast?: (msg: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage = 'home', onNavigate, onToast }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, loading: authLoading, logout, deleteAccount } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close the mobile menu on navigation or when the viewport grows past the breakpoint.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (mq.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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
      icon: InstagramIcon,
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
      <div className="max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: GM7 brand logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.('home', 'hero');
          }}
          aria-label="GM7 — l'Gamers Lmla7 home"
          className="group flex shrink-0 items-center gap-2 cursor-pointer select-none"
        >
          <span className="flex flex-col justify-center leading-none">
            <span className="flex items-center gap-0.5 leading-none">
              <span
                className={`font-display text-[22px] font-black leading-none tracking-tight transition-colors ${
                  isDark ? 'text-white' : 'text-neutral-950'
                }`}
              >
                GM
              </span>
              <span className="bg-gradient-to-br from-[#FFD966] via-[#FFBE0D] to-[#D99A00] bg-clip-text font-display text-[22px] font-black leading-none tracking-tight text-transparent transition-transform duration-300 ease-out group-hover:scale-110">
                7
              </span>
            </span>
            <span
              className={`mt-1 hidden text-[8px] font-bold uppercase leading-none tracking-[0.28em] transition-colors sm:block ${
                isDark
                  ? 'text-neutral-500 group-hover:text-[#FFBE0D]'
                  : 'text-neutral-400 group-hover:text-[#8C6500]'
              }`}
            >
              Gamers Lmla7
            </span>
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
          <div className="hidden items-center gap-1.5 sm:flex">
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
                  <button
                    onClick={async () => {
                      if (!window.confirm('Delete your GM7 account and its stored profile? This cannot be undone.')) return;
                      try {
                        await deleteAccount();
                        setUserMenuOpen(false);
                        onToast?.('Your GM7 account data was deleted.');
                      } catch (error) {
                        onToast?.(error instanceof Error ? error.message : 'Could not delete the account.');
                      }
                    }}
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete account
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              isDark
                ? 'text-neutral-300 hover:text-[#FFBE0D] hover:bg-white/5'
                : 'text-neutral-700 hover:text-[#8C6500] hover:bg-neutral-100'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t animate-fade-in ${
            isDark ? 'border-white/5 bg-[#07080a]' : 'border-neutral-200 bg-white'
          }`}
        >
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-7xl 2xl:max-w-[90rem] flex-col gap-1 px-4 py-3 sm:px-6">
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
                    setMobileMenuOpen(false);
                    if (link.external) return;
                    e.preventDefault();
                    if (link.page !== 'home') {
                      onNavigate?.(link.page);
                    } else {
                      onNavigate?.('home', link.id);
                    }
                  }}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? isDark
                        ? 'bg-[#FFBE0D]/12 text-[#FFBE0D]'
                        : 'bg-orange-50 text-[#8C6500]'
                      : isDark
                      ? 'text-neutral-300 hover:bg-white/5'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-[#FFBE0D]' : 'bg-[#8C6500]'}`} />
                  )}
                </a>
              );
            })}
            <div className={`mt-2 flex items-center gap-2 border-t pt-3 ${isDark ? 'border-white/5' : 'border-neutral-200'}`}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border text-xs font-semibold transition-colors ${
                      isDark
                        ? 'border-white/10 text-neutral-300 hover:border-[#FFBE0D]/40 hover:text-[#FFBE0D]'
                        : 'border-neutral-200 text-neutral-600 hover:border-orange-300 hover:text-[#8C6500]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{social.name}</span>
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
