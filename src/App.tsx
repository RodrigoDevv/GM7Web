import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutPage } from './components/AboutPage';
import { WhatWePlaySection } from './components/WhatWePlaySection';
import { StreamScheduleSection } from './components/StreamScheduleSection';
import { SetupSection } from './components/SetupSection';
import { SocialsPage } from './components/SocialsPage';
import { TournamentPage } from './components/TournamentPage';
import { SocialsSection } from './components/SocialsSection';
import { Footer } from './components/Footer';
import { Reveal } from './components/Reveal';
import { useSeo } from './lib/seo';
import type { Page } from './types/navigation';
import { CheckCircle2, Sun, Moon, ArrowUp, ArrowRight } from 'lucide-react';

import senseiPortraitImg from './assets/images/sensei_portrait_studio_1792363735846.jpg';
import aboutTeaserBgImg from './assets/images/sensei_cinematic_hero_1792265647557.jpg';

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/+$/, '');
const ABOUT_PATH = `${BASE_PATH}/about`;
const SOCIALS_PATH = `${BASE_PATH}/socials`;
const TOURNAMENTS_PATH = `${BASE_PATH}/tournaments`;
const HOME_PATH = `${BASE_PATH}/`;

function resolvePage(): Page {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  const hash = window.location.hash.toLowerCase();
  // Keep supporting the old hash URLs while preferring clean page URLs.
  if (pathname === ABOUT_PATH.toLowerCase() || pathname.endsWith('/about')) return 'about';
  if (pathname === SOCIALS_PATH.toLowerCase() || pathname.endsWith('/socials') || pathname.endsWith('/feed')) return 'socials';
  if (pathname === TOURNAMENTS_PATH.toLowerCase() || pathname.endsWith('/tournaments')) return 'tournaments';
  if (hash === '#/about' || hash === '#about') return 'about';
  if (hash === '#/socials' || hash === '#/feed' || hash === '#feed') return 'socials';
  if (hash === '#/tournaments' || hash === '#tournaments') return 'tournaments';
  return 'home';
}

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const { user, loading: authLoading, notice, clearNotice } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Client-side Page Router: 'home' | 'about' | 'socials' | 'tournaments'
  const [currentPage, setCurrentPage] = useState<Page>(resolvePage);

  useSeo(currentPage);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Auth redirect notices (?auth=login | signup | error | config)
  useEffect(() => {
    if (!notice) return;
    if (notice === 'error') {
      showToast('😞 Discord login failed or was cancelled. Please try again.');
      clearNotice();
    } else if (notice === 'config') {
      showToast(
        '⚠️ Discord login is not configured yet — set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in .env.',
      );
      clearNotice();
    } else if (!authLoading && user) {
      showToast(
        notice === 'signup'
          ? `🎉 Welcome, ${user.name}! Your account has been created with Discord.`
          : `✅ Logged in with Discord as ${user.name}`,
      );
      clearNotice();
    }
  }, [notice, user, authLoading, clearNotice]);

  const handleToggle = () => {
    toggleTheme();
    showToast(isDark ? '☀️ Switched to White (Light) Mode' : '🌙 Switched to Dark Mode');
  };

  // Synchronize browser history with clean path-based routing (/about, /socials, /tournaments)
  useEffect(() => {
    const syncPage = () => {
      const nextPage = resolvePage();
      setCurrentPage(nextPage);

      const hash = window.location.hash.toLowerCase();
      if (nextPage !== 'home') {
        const pagePath = nextPage === 'about'
          ? ABOUT_PATH
          : nextPage === 'socials'
            ? SOCIALS_PATH
            : TOURNAMENTS_PATH;
        if (
          hash === `#/${nextPage}` ||
          hash === `#${nextPage}` ||
          hash === '#/feed' ||
          hash === '#feed' ||
          window.location.pathname.toLowerCase().endsWith('/feed')
        ) {
          window.history.replaceState({}, '', pagePath);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Normalize a legacy hash URL such as /#/about or /#/tournaments on first load.
    syncPage();

    window.addEventListener('hashchange', syncPage);
    window.addEventListener('popstate', syncPage);
    return () => {
      window.removeEventListener('hashchange', syncPage);
      window.removeEventListener('popstate', syncPage);
    };
  }, []);

  const navigateTo = useCallback((page: Page, targetSection?: string) => {
    if (page === 'about' || page === 'socials' || page === 'tournaments') {
      const path = page === 'about' ? ABOUT_PATH : page === 'socials' ? SOCIALS_PATH : TOURNAMENTS_PATH;
      if (window.location.pathname !== path) {
        window.history.pushState({ page }, '', path);
      }
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetPath =
        targetSection && targetSection !== 'hero' ? `${HOME_PATH}#${targetSection}` : HOME_PATH;
      window.history.pushState({ page: 'home' }, '', targetPath);
      setCurrentPage('home');
      if (targetSection && targetSection !== 'hero') {
        setTimeout(() => {
          document.getElementById(targetSection)?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  // Scroll tracking for progress bar and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
      setShowBackToTop(window.scrollY > 380);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 't' || e.key === 'T') {
        toggleTheme();
        showToast(isDark ? '☀️ Switched to White Mode [T]' : '🌙 Switched to Dark Mode [T]');
      } else if (e.key === '1') {
        navigateTo('home', 'hero');
      } else if (e.key === '2' || e.key === 'a' || e.key === 'A') {
        navigateTo('about');
      } else if (e.key === '3') {
        navigateTo('home', 'what-we-play');
      } else if (e.key === '4') {
        navigateTo('home', 'schedule');
      } else if (e.key === '5') {
        navigateTo('socials');
      } else if (e.key === '6') {
        navigateTo('home', 'setup');
      } else if (e.key === '7') {
        navigateTo('home', 'socials');
      } else if (e.key === '8') {
        navigateTo('tournaments');
      } else if (e.key === 'Escape' && currentPage !== 'home') {
        navigateTo('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDark, toggleTheme, currentPage, navigateTo]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen font-sans selection:bg-[#FFBE0D] selection:text-black flex flex-col transition-colors duration-300 relative ${
        isDark ? 'bg-[#07080a] text-white' : 'bg-white text-neutral-900'
      }`}
    >
      {/* Hairline Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none origin-left transition-all duration-75"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: '#FFBE0D',
          boxShadow: '0 0 10px #FFBE0D, 0 0 4px #FFBE0D',
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 animate-slide-up flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-semibold max-w-md border transition-all ${
            isDark
              ? 'bg-neutral-900 text-white border-white/10'
              : 'bg-white text-neutral-900 border-neutral-200 shadow-xl'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Bottom Dock (Theme Switcher + Keyboard Shortcut Pill) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          onClick={handleToggle}
          type="button"
          aria-label={isDark ? 'Switch to White (Light) Mode' : 'Switch to Dark Mode'}
          title={isDark ? 'Switch to White (Light) Mode [T]' : 'Switch to Dark Mode [T]'}
          className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-2xl border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isDark
              ? 'bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 border-neutral-700/80 shadow-[0_0_20px_rgba(0,0,0,0.6)]'
              : 'bg-white/95 hover:bg-neutral-50 text-neutral-800 border-neutral-200 shadow-[0_8px_25px_rgba(0,0,0,0.12)]'
          }`}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span className="text-xs font-mono font-bold text-neutral-200">White Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-neutral-700 group-hover:-rotate-12 transition-transform" />
              <span className="text-xs font-mono font-bold text-neutral-800">Dark Mode</span>
            </>
          )}
          <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-neutral-500 dark:text-neutral-400 ml-1">
            T
          </span>
        </button>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          title="Back to top"
          aria-label="Back to top"
          className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-xl border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer animate-fade-in ${
            isDark
              ? 'bg-neutral-900/90 hover:bg-neutral-800 text-white border-neutral-700 hover:text-[#FFBE0D]'
              : 'bg-white/95 hover:bg-neutral-100 text-neutral-900 border-neutral-200 hover:text-[#8C6500]'
          }`}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Navbar with page routing & scrollspy */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onToast={showToast}
      />

      {/* Main Content Router */}
      <main className="flex-1 flex flex-col">
        {currentPage === 'about' ? (
          /* ============================================================== */
          /* INDEPENDENT ABOUT PAGE                                         */
          /* ============================================================== */
          <Reveal>
            <AboutPage
              onNavigateHome={(target) => navigateTo('home', target)}
              onToast={showToast}
            />
          </Reveal>
        ) : currentPage === 'socials' ? (
          /* ============================================================== */
          /* INDEPENDENT SOCIALS PAGE                                       */
          /* ============================================================== */
          <Reveal>
            <SocialsPage
              onNavigateHome={(target) => navigateTo('home', target)}
              onToast={showToast}
            />
          </Reveal>
        ) : currentPage === 'tournaments' ? (
          /* ============================================================== */
          /* INDEPENDENT TOURNAMENTS PAGE                                   */
          /* ============================================================== */
          <Reveal>
            <TournamentPage
              onNavigateHome={(target) => navigateTo('home', target)}
              onToast={showToast}
            />
          </Reveal>
        ) : (
          /* ============================================================== */
          /* HOME STREAM HUB EXPERIENCE                                     */
          /* ============================================================== */
          <>
            {/* Hero Section */}
            <Reveal>
              <Hero onToast={showToast} />
            </Reveal>



            {/* What We Play Section */}
            <Reveal>
              <WhatWePlaySection onToast={showToast} />
            </Reveal>

            {/* When We Stream Schedule Section */}
            <Reveal>
              <StreamScheduleSection onToast={showToast} />
            </Reveal>

            {/* Sensei's Battle Station & Hardware Setup */}
            <Reveal>
              <SetupSection onToast={showToast} />
            </Reveal>

            {/* Official Socials Section */}
            <Reveal>
              <SocialsSection onToast={showToast} />
            </Reveal>
          </>
        )}
      </main>

      {/* Footer */}
      <Reveal>
        <Footer onToast={showToast} />
      </Reveal>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
