import React, { useEffect, useRef, useState } from 'react';
import { Globe, Redo2, Undo2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AboutHeroSection, AboutSections } from './AboutSections';
import { DiscordIcon, InstagramIcon } from './BrandIcons';
import { startSmoothScroll, stopSmoothScroll } from '../lib/smoothScroll';

import snnseiImg from '../assets/images/snnsei.png';
import hatimImg from '../assets/images/hatim.png';
import communityMeetupImg from '../assets/images/discord.jpg';

interface AboutPageProps {
  onNavigateHome: (targetSection?: string) => void;
  onToast?: (msg: string) => void;
}

const profileLinks = {
  streamer: {
    website: 'https://gm7.ma',
    instagram: 'https://www.instagram.com/snnseii/',
  },
  founder: {
    website: 'https://www.hatimnaji.com/',
    instagram: 'https://www.instagram.com/hatimnajii/',
  },
} as const;

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome, onToast }) => {
  const { isDark } = useTheme();
  const [selectedProfile, setSelectedProfile] = useState<'streamer' | 'founder' | null>(null);
  const [isClosingProfile, setIsClosingProfile] = useState(false);

  const closeProfile = () => {
    if (!selectedProfile || isClosingProfile) return;
    setIsClosingProfile(true);
    window.setTimeout(() => {
      setSelectedProfile(null);
      setIsClosingProfile(false);
    }, 260);
  };
  const closeProfileRef = useRef(closeProfile);
  closeProfileRef.current = closeProfile;

  useEffect(() => {
    if (!selectedProfile) return;

    stopSmoothScroll();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeProfileRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      startSmoothScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProfile]);

  return (
    <div
      className={`min-h-[80vh] flex flex-col transition-colors duration-300 relative ${
        isDark ? 'bg-[#07080a] text-white' : 'bg-white text-neutral-900'
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,190,13,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,190,13,0.035) 1px, transparent 1px)'
            : 'linear-gradient(rgba(140,101,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(140,101,0,0.045) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
        }}
      />
      <div className="relative z-10 w-full flex-1 flex flex-col">
        <AboutHeroSection />

        <section className="mx-auto grid w-full max-w-7xl 2xl:max-w-[90rem] grid-cols-1 items-center gap-8 px-4 pb-16 sm:px-6 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800">
            <img
              src={communityMeetupImg}
              alt="GM7 community members gathered at a gaming meetup"
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          <div className="max-w-xl">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.28em] ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
              About The Community
            </span>
            <h2 className={`mt-3 text-3xl font-black uppercase leading-[0.98] tracking-[-0.04em] sm:text-4xl ${isDark ? 'text-white' : 'text-neutral-950'}`}>
              A community built around the game.
            </h2>
            <p className={`mt-5 text-sm leading-7 sm:text-base ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Lgames Lemla7 (GM7) is more than just a chat section or a discord server, it is a clean safe community built for gamers who demand quality. GM7 represents a shared space for enthusiasts across Morocco and beyond who value deep gameplay, high-production content, and genuine passion over shortcuts. As the backbone of the Snnsei ecosystem,
            </p>
            <p className={`mt-4 text-sm leading-7 sm:text-base ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              GM7 serves as the engine driving a new era for local gaming culture, proving that regional audiences appreciate and deserve content crafted at a global standard.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://discord.gg/gm7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#5865F2] px-4 text-xs font-black uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#4752C4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5865F2] focus-visible:ring-offset-2"
              >
                Join Discord <DiscordIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <div id="gm7-team" className="flex-1 grid grid-cols-1 lg:min-h-[620px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.9fr)_minmax(0,1.5fr)] gap-0 items-stretch">
          <div className="group relative overflow-hidden min-h-[420px] sm:min-h-[520px] lg:min-h-0">
            <img
              src={snnseiImg}
              alt="Snnsei (Hatim NAJI) — GM7 streamer portrait"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 items-center px-6 sm:px-10 lg:px-12 xl:px-16 py-14 lg:py-0 max-w-[980px] mx-auto w-full">
            <div className="flex flex-col items-end text-right gap-5 pl-6 md:pl-10 overflow-hidden">
              <div className="leading-none">
                <div className="relative">
                  <span className={"block text-[9px] font-mono font-bold uppercase tracking-[0.3em] mb-3 " + (isDark ? "text-[#FFBE0D]" : "text-[#8C6500]")}>
                    01 · The Streamer
                  </span>
                  <h2 aria-label="About Snnsei" className={"block text-[clamp(1.25rem,2vw,1.85rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] text-right " + (isDark ? "text-white" : "text-neutral-950")} style={{ fontFamily: "'Inter', 'Arial Black', sans-serif" }}>
                    THE
                  </h2>
                  <h2 className={"block text-[clamp(1.25rem,2vw,1.85rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] text-right " + (isDark ? "text-white" : "text-neutral-950")} style={{ fontFamily: "'Inter', 'Arial Black', sans-serif" }}>
                    STREAM<span className="text-[#FFBE0D]">ER</span>
                  </h2>
                </div>
              </div>
              <p className={"text-[11px] sm:text-[12px] font-normal leading-relaxed max-w-[22ch] text-right " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                Competitive FPS streamer sharing clutch matches, thoughtful gameplay and late-night lobbies with the community.
              </p>
              <button
                type="button"
                onClick={() => setSelectedProfile('streamer')}
                aria-label="More about Snnsei"
                className="group inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-[#FFB347] via-[#FF6B00] to-[#E03E00] text-white shadow-[0_6px_20px_rgba(255,107,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_10px_28px_rgba(255,107,0,0.55)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/70 focus-visible:ring-offset-2"
              >
                <Undo2 className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex flex-col items-start text-left gap-5 pl-6 md:pl-10 overflow-visible">
              <div className="leading-none">
                <div className="relative">
                  <span className={"block text-[9px] font-mono font-bold uppercase tracking-[0.3em] mb-3 " + (isDark ? "text-[#FFBE0D]" : "text-[#8C6500]")}>
                    02 · The Founder
                  </span>
                  <h2 aria-label="About Hatim NAJI" className={"block text-[clamp(1.25rem,2vw,1.85rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] " + (isDark ? "text-white" : "text-neutral-950")} style={{ fontFamily: "'Inter', 'Arial Black', sans-serif" }}>
                    THE
                  </h2>
                  <h2 className={"block text-[clamp(1.25rem,2vw,1.85rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] " + (isDark ? "text-white" : "text-neutral-950")} style={{ fontFamily: "'Inter', 'Arial Black', sans-serif" }}>
                    FOUND<span className="text-[#FFBE0D]">ER</span>
                  </h2>
                </div>
              </div>
              <p className={"text-[11px] sm:text-[12px] font-normal leading-relaxed max-w-[22ch] " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                Founder &amp; Creative Director guiding GM7’s brand, strategy and community-focused vision.
              </p>
              <button
                type="button"
                onClick={() => setSelectedProfile('founder')}
                aria-label="More about Hatim NAJI"
                className="group relative top-2.5 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-[#FFB347] via-[#FF6B00] to-[#E03E00] text-white shadow-[0_6px_20px_rgba(255,107,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_10px_28px_rgba(255,107,0,0.55)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/70 focus-visible:ring-offset-2"
              >
                <Redo2 className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="group relative overflow-hidden min-h-[420px] sm:min-h-[520px] lg:min-h-0">
            <img
              src={hatimImg}
              alt="Hatim NAJI — founder of GM7 and creative director"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
        {selectedProfile && (
          <button
            type="button"
            aria-label="Close profile information"
            onClick={closeProfile}
            className={`fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-[2px] ${isClosingProfile ? 'animate-profile-overlay-out' : 'animate-profile-overlay-in'}`}
          />
        )}

        {selectedProfile && (
          <div
            className={`fixed inset-y-0 z-50 flex w-full items-center p-0 sm:w-1/2 ${
              selectedProfile === 'streamer' ? 'left-0 justify-start' : 'right-0 justify-end'
            } ${isClosingProfile
              ? selectedProfile === 'streamer' ? 'animate-profile-out-left' : 'animate-profile-out-right'
              : selectedProfile === 'streamer' ? 'animate-profile-in-left' : 'animate-profile-in-right'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-card-title"
          >
            <div
              data-lenis-prevent
              className={`relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden overscroll-contain border p-7 shadow-2xl sm:p-12 ${
                isDark
                  ? 'border-neutral-800 bg-[#090a0d] text-white'
                  : 'border-neutral-200 bg-[#fafafa] text-neutral-900'
              }`}
            >
              <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-[#FFBE0D]/15" />
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[#FFBE0D]/10" />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#FFBE0D]/[0.08] via-transparent to-transparent' : 'bg-gradient-to-br from-[#FFBE0D]/[0.12] via-transparent to-transparent'}`} />
                <img
                  src={selectedProfile === 'streamer' ? snnseiImg : hatimImg}
                  alt=""
                  className="absolute bottom-0 right-0 h-[66%] w-[82%] object-contain object-right-bottom opacity-25 sm:h-[78%] sm:w-[72%]"
                />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-[#090a0d] via-[#090a0d]/90 to-transparent' : 'bg-gradient-to-r from-[#fafafa] via-[#fafafa]/90 to-transparent'}`} />
              </div>
              <button
                type="button"
                onClick={closeProfile}
                aria-label="Close profile information"
                className={`animate-profile-item absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:rotate-90 ${
                  isDark
                    ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#FFBE0D]/50 hover:bg-white/10 hover:text-white'
                    : 'border-neutral-300 bg-white/70 text-neutral-600 hover:border-[#FFBE0D] hover:text-neutral-900'
                }`}
                style={{ animationDelay: '0.05s' }}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative z-10 my-auto w-full max-w-xl">
                <div className="animate-profile-item mb-8 flex items-center gap-3" style={{ animationDelay: '0.08s' }}>
                  <span className="h-px w-8 bg-[#FFBE0D]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-[#8C6500] dark:text-[#FFBE0D]">
                    GM7 <span className="mx-1 text-neutral-500">/</span> Profile 0{selectedProfile === 'streamer' ? '1' : '2'}
                  </span>
                </div>

                <div className="animate-profile-item flex items-center gap-3" style={{ animationDelay: '0.14s' }}>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono font-bold ${
                      isDark
                        ? 'border-[#FFBE0D]/40 bg-[#FFBE0D]/10 text-[#FFBE0D]'
                        : 'border-[#8C6500]/30 bg-[#FFBE0D]/15 text-[#8C6500]'
                    }`}
                  >
                    0{selectedProfile === 'streamer' ? '1' : '2'}
                  </span>
                  <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {selectedProfile === 'streamer' ? 'The streamer' : 'The founder & creative director'}
                  </p>
                </div>

                <h2 id="profile-card-title" className="animate-profile-item mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.05em] sm:text-6xl lg:text-7xl" style={{ animationDelay: '0.2s' }}>
                  {selectedProfile === 'streamer' ? 'Snnsei' : 'Hatim'}
                  <span className={isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}>.</span>
                  <span className={`mt-3 flex items-center gap-3 text-2xl tracking-[-0.02em] sm:text-3xl ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
                    <span className={`hidden h-px w-8 shrink-0 sm:block ${isDark ? 'bg-[#FFBE0D]/60' : 'bg-[#8C6500]/50'}`} />
                    {selectedProfile === 'streamer' ? 'On the mic. In the game.' : 'Building the GM7 vision.'}
                  </span>
                </h2>

                <div className={`animate-profile-item mt-7 h-px w-full max-w-md ${isDark ? 'bg-gradient-to-r from-[#FFBE0D]/50 via-white/10 to-transparent' : 'bg-gradient-to-r from-[#8C6500]/40 via-neutral-200 to-transparent'}`} style={{ animationDelay: '0.3s' }} />

                <p className={`animate-profile-item mt-6 max-w-md text-sm leading-7 sm:text-base ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`} style={{ animationDelay: '0.36s' }}>
                  {selectedProfile === 'streamer'
                    ? 'Snnsei is a family friendly digital content creator and live streamer on a mission to elevate the Moroccan gaming landscape to compete against biggest contents worldwide. What began as a childhood obsession with video games has matured into a driving purpose: bringing elite, cinema grade production value to live streaming and walkthroughs gaming series. Combining an insider\'s passion for storytelling with professional visual and audio execution, Snnsei delivers top tier 4K resolution content, crisp audio engineering, and immersive single-player gameplay, setting a new benchmark for regional content creators. Above all, Snnsei is committed to continuous growth, constantly reinvesting back into his passion, technology, and community to ensure Moroccan gaming culture always gets the premier experience it deserves.'
                    : 'Hatim NAJI is a Morocco-based Film Director and Director of Photography specializing in cinematic narrative visualizers, music videos, commercial productions, and documentaries. Built on a foundation of strict technical precision, atmospheric lighting, and deliberate framing, his work focuses on turning concepts into compelling visual experiences. From music video productions for worldwide artists to high-end brand visuals, Hatim approaches every set with a commitment to storytelling, aesthetic depth, and uncompromising production standards.'}
                </p>

                <div className="animate-profile-item mt-7" style={{ animationDelay: '0.44s' }}>
                  <p className={`mb-3 text-[9px] font-mono font-bold uppercase tracking-[0.28em] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Links
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href={profileLinks[selectedProfile].website}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Website"
                      aria-label={`${selectedProfile === 'streamer' ? 'Snnsei' : 'Hatim NAJI'} website`}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                        isDark
                          ? 'border-white/10 bg-white/[0.04] text-neutral-300 hover:border-[#FFBE0D]/40 hover:text-white'
                          : 'border-neutral-200 bg-white/80 text-neutral-600 hover:border-[#FFBE0D] hover:text-neutral-900'
                      }`}
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                    <a
                      href={profileLinks[selectedProfile].instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram"
                      aria-label={`${selectedProfile === 'streamer' ? 'Snnsei' : 'Hatim NAJI'} on Instagram`}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                        isDark
                          ? 'border-white/10 bg-white/[0.04] text-neutral-300 hover:border-[#FFBE0D]/40 hover:text-white'
                          : 'border-neutral-200 bg-white/80 text-neutral-600 hover:border-[#FFBE0D] hover:text-neutral-900'
                      }`}
                    >
                      <InstagramIcon className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="mt-6 h-1 w-28 bg-gradient-to-r from-[#FFBE0D] to-transparent" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <AboutSections onToast={onToast} onNavigateHome={onNavigateHome} />
      </div>
    </div>
  );
};
