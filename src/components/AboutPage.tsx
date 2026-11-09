import React, { useEffect, useRef, useState } from 'react';
import { Redo2, Undo2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AboutHeroSection, AboutSections } from './AboutSections';
import { DiscordIcon } from './BrandIcons';

import snnseiImg from '../assets/images/snnsei.png';
import hatimImg from '../assets/images/hatim.png';
import communityMeetupImg from '../assets/images/discord.jpg';

interface AboutPageProps {
  onNavigateHome: (targetSection?: string) => void;
  onToast?: (msg: string) => void;
}

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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeProfileRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
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
              More than a stream
            </span>
            <h2 className={`mt-3 text-3xl font-black uppercase leading-[0.98] tracking-[-0.04em] sm:text-4xl ${isDark ? 'text-white' : 'text-neutral-950'}`}>
              A community built around the game.
            </h2>
            <p className={`mt-5 text-sm leading-7 sm:text-base ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              GM7 is a home for players who want more than a match. We bring people together through competitive FPS streams, open community lobbies and shared nights of play. Come to compete, meet teammates or enjoy the broadcast—there’s a place for you here.
            </p>
            <p className={`mt-4 text-sm leading-7 sm:text-base ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              The community shapes the energy of every session, turning each stream into a chance to learn, connect and play together.
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
              alt="Snnsei (Hatim Naji) — GM7 streamer portrait"
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
                className="group inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-[#FFB347] via-[#FF6B00] to-[#E03E00] text-white shadow-[0_6px_20px_rgba(255,107,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(255,107,0,0.55)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/70 focus-visible:ring-offset-2"
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
                  <h2 aria-label="About Hatim Naji" className={"block text-[clamp(1.25rem,2vw,1.85rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] " + (isDark ? "text-white" : "text-neutral-950")} style={{ fontFamily: "'Inter', 'Arial Black', sans-serif" }}>
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
                aria-label="More about Hatim Naji"
                className="group relative top-2.5 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-[#FFB347] via-[#FF6B00] to-[#E03E00] text-white shadow-[0_6px_20px_rgba(255,107,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(255,107,0,0.55)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/70 focus-visible:ring-offset-2"
              >
                <Redo2 className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="group relative overflow-hidden min-h-[420px] sm:min-h-[520px] lg:min-h-0">
            <img
              src={hatimImg}
              alt="Hatim Naji — founder of GM7 and creative director"
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
              className={`relative flex h-full w-full flex-col justify-center overflow-y-auto overflow-x-hidden border p-7 shadow-2xl sm:p-12 ${
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
                <div className="absolute bottom-0 left-0 h-1 w-28 bg-gradient-to-r from-[#FFBE0D] to-transparent" />
              </div>
              <button
                type="button"
                onClick={closeProfile}
                aria-label="Close profile information"
                className={`absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:rotate-90 ${
                  isDark
                    ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#FFBE0D]/50 hover:bg-white/10 hover:text-white'
                    : 'border-neutral-300 bg-white/70 text-neutral-600 hover:border-[#FFBE0D] hover:text-neutral-900'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative z-10 max-w-xl">
                <div className="mb-7 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#FFBE0D]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-[#8C6500] dark:text-[#FFBE0D]">
                    GM7 <span className="mx-1 text-neutral-500">/</span> Profile 0{selectedProfile === 'streamer' ? '1' : '2'}
                  </span>
                </div>
                <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {selectedProfile === 'streamer' ? 'The streamer' : 'The founder & creative director'}
                </p>
                <h2 id="profile-card-title" className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                  {selectedProfile === 'streamer' ? 'Snnsei' : 'Hatim'}
                  <span className={`mt-2 block text-2xl tracking-[-0.03em] sm:text-3xl ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
                    {selectedProfile === 'streamer' ? 'On the mic. In the game.' : 'Building the GM7 vision.'}
                  </span>
                </h2>
                <p className={`mt-7 max-w-md text-sm leading-7 sm:text-base ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {selectedProfile === 'streamer'
                  ? 'Snnsei is GM7’s competitive FPS streamer and full-time content creator. His broadcasts bring together focused gameplay, clutch matches and relaxed late-night lobbies, with the community welcome to join the action.'
                  : 'Hatim Naji is GM7’s Founder and Creative Director. He shapes the brand’s strategy and creative vision, bringing its ideas to life while keeping the community at the center of each project.'}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {(selectedProfile === 'streamer'
                    ? ['Competitive FPS', 'Live creator', 'Community lobbies']
                    : ['Creative direction', 'Brand strategy', 'Community first']
                  ).map((focus) => (
                    <span
                      key={focus}
                      className={`rounded-full border px-3.5 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.12em] ${
                        isDark
                          ? 'border-white/10 bg-white/[0.04] text-neutral-300'
                          : 'border-neutral-200 bg-white/80 text-neutral-600'
                      }`}
                    >
                      {focus}
                    </span>
                  ))}
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
