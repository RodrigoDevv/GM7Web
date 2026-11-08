import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { OptionalContentConsent, PrivacyConsentProvider } from './context/PrivacyConsentContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutPage } from './components/AboutPage';
import { WhatWePlaySection } from './components/WhatWePlaySection';
import { StreamScheduleSection } from './components/StreamScheduleSection';
import { SetupSection } from './components/SetupSection';
import { SocialsPage } from './components/SocialsPage';
import { TournamentPage } from './components/TournamentPage';
import { GamesPage } from './components/GamesPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { SocialsSection } from './components/SocialsSection';
import { Footer } from './components/Footer';
import { LegalPage } from './components/LegalPage';
import { SitePasswordGate } from './components/SitePasswordGate';
import { Reveal } from './components/Reveal';
import { useSeo } from './lib/seo';
import type { Page } from './types/navigation';
import { CheckCircle2, ArrowUp, ArrowRight } from 'lucide-react';

import senseiPortraitImg from './assets/images/sensei_portrait_studio_1792363735846.jpg';
import aboutTeaserBgImg from './assets/images/sensei_cinematic_hero_1792265647557.jpg';

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/+$/, '');
const ABOUT_PATH = `${BASE_PATH}/about`;
const SOCIALS_PATH = `${BASE_PATH}/socials`;
const TOURNAMENTS_PATH = `${BASE_PATH}/tournaments`;
const GAMES_PATH = `${BASE_PATH}/games`;
const DASHBOARD_PATH = `${BASE_PATH}/dashboard`;
const LEGAL_PATH = `${BASE_PATH}/legal`;
const HOME_PATH = `${BASE_PATH}/`;

function resolvePage(): Page {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  const hash = window.location.hash.toLowerCase();
  // Keep supporting the old hash URLs while preferring clean page URLs.
  if (pathname === ABOUT_PATH.toLowerCase() || pathname.endsWith('/about')) return 'about';
  if (pathname === SOCIALS_PATH.toLowerCase() || pathname.endsWith('/socials') || pathname.endsWith('/feed')) return 'socials';
  if (pathname === TOURNAMENTS_PATH.toLowerCase() || pathname.endsWith('/tournaments')) return 'tournaments';
  if (pathname === GAMES_PATH.toLowerCase() || pathname.endsWith('/games')) return 'games';
  if (pathname === DASHBOARD_PATH.toLowerCase() || pathname.endsWith('/dashboard')) return 'dashboard';
  if (pathname.startsWith(LEGAL_PATH.toLowerCase()) || pathname.includes('/legal/')) return 'legal';
  if (hash === '#/about' || hash === '#about') return 'about';
  if (hash === '#/socials' || hash === '#/feed' || hash === '#feed') return 'socials';
  if (hash === '#/tournaments' || hash === '#tournaments') return 'tournaments';
  if (hash === '#/games' || hash === '#games') return 'games';
  if (hash === '#/dashboard' || hash === '#dashboard') return 'dashboard';
  return 'home';
}

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const { user, loading: authLoading, notice, clearNotice } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Client-side page router.
  const [currentPage, setCurrentPage] = useState<Page>(resolvePage);

  useSeo(currentPage);

  // Store daily aggregate counts only: no IP address, cookie, or visitor ID is recorded.
  useEffect(() => {
    if (currentPage === 'dashboard') return;
    fetch('/api/analytics/visit', { method: 'POST', keepalive: true, credentials: 'omit' }).catch(() => {});
  }, []);

  useEffect(() => {
    if (currentPage === 'dashboard') return;
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: currentPage }),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => {});
  }, [currentPage]);

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
            : nextPage === 'tournaments'
              ? TOURNAMENTS_PATH
              : nextPage === 'games'
                ? GAMES_PATH
                : nextPage === 'dashboard'
                  ? DASHBOARD_PATH
                  : window.location.pathname;
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
    if (page === 'legal') {
      const path = window.location.pathname.startsWith(LEGAL_PATH) ? window.location.pathname : `${LEGAL_PATH}/privacy`;
      if (window.location.pathname !== path) window.history.pushState({ page }, '', path);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'about' || page === 'socials' || page === 'tournaments' || page === 'games' || page === 'dashboard') {
      const path =
        page === 'about'
          ? ABOUT_PATH
          : page === 'socials'
            ? SOCIALS_PATH
            : page === 'tournaments'
              ? TOURNAMENTS_PATH
              : page === 'games'
                ? GAMES_PATH
                : DASHBOARD_PATH;
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
        ) : currentPage === 'games' ? (
          /* ============================================================== */
          /* INDEPENDENT GAMES LIBRARY PAGE                                 */
          /* ============================================================== */
          <Reveal>
            <GamesPage
              onNavigateHome={(target) => navigateTo('home', target)}
              onToast={showToast}
            />
          </Reveal>
        ) : currentPage === 'dashboard' ? (
          /* ============================================================== */
          /* ADMIN CONTENT DASHBOARD                                        */
          /* ============================================================== */
          <DashboardPage
            onNavigateHome={(target) => navigateTo('home', target)}
            onToast={showToast}
          />
        ) : currentPage === 'legal' ? (
          <LegalPage document={(window.location.pathname.split('/').filter(Boolean).at(-1) || 'privacy') as 'privacy' | 'terms' | 'cookies'} />
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
              <WhatWePlaySection onToast={showToast} onSeeMore={() => navigateTo('games')} />
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
        <Footer />
      </Reveal>
      {currentPage !== 'dashboard' && <OptionalContentConsent />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SitePasswordGate>
          <PrivacyConsentProvider>
            <ContentProvider>
              <AppContent />
            </ContentProvider>
          </PrivacyConsentProvider>
        </SitePasswordGate>
      </ThemeProvider>
    </AuthProvider>
  );
}
