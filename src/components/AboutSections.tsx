import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Crosshair,
  Flame,
  Radio,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Reveal } from './Reveal';

import streamerShot from '../assets/images/read.png';
import founderShot from '../assets/images/hero-portrait.jpg';
import trophyShot from '../assets/images/sensei-trophy.jpg';
import communityShot from '../assets/images/discord.jpg';
import stageShot from '../assets/images/discord.jpg';
import aboutPortrait from '../assets/images/snnsei.png';
import teamPhoto from '../assets/images/team.png';

interface AboutSectionsProps {
  onToast?: (msg: string) => void;
  onNavigateHome?: (targetSection?: string) => void;
}

/* Shared building blocks                                             */

const SectionShell: React.FC<{
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}> = ({ children, className = '', divider = true }) => {
  const { isDark } = useTheme();
  return (
    <section
      className={`relative py-14 sm:py-20 ${
        divider ? (isDark ? 'border-t border-white/5' : 'border-t border-neutral-200') : ''
      } ${className}`}
    >
      {children}
    </section>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();
  return (
    <span
      className={`inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] ${
        isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#FFBE0D]" />
      {children}
    </span>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();
  return (
    <h2
      className={`mt-3 text-[clamp(1.6rem,3vw,2.6rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] ${
        isDark ? 'text-white' : 'text-neutral-950'
      }`}
      style={{ fontFamily: "'Inter', 'Arial Black', sans-serif" }}
    >
      {children}
    </h2>
  );
};

const SectionCopy: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();
  return (
    <p
      className={`mt-4 text-[13px] sm:text-[15px] leading-relaxed max-w-[52ch] ${
        isDark ? 'text-neutral-400' : 'text-neutral-600'
      }`}
    >
      {children}
    </p>
  );
};

const Typewriter: React.FC<{
  segments: Array<{ text: string; className?: string }>;
  speed?: number;
  startDelay?: number;
}> = ({ segments, speed = 24, startDelay = 200 }) => {
  const total = segments.reduce((sum, segment) => sum + segment.text.length, 0);
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let current = 0;
    let interval: number | undefined;
    const delay = window.setTimeout(() => {
      interval = window.setInterval(() => {
        current += 1;
        setVisible(current);
        if (current >= total && interval) {
          window.clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(delay);
      if (interval) window.clearInterval(interval);
    };
  }, [started, total, speed, startDelay]);

  let remaining = visible;

  return (
    <span ref={rootRef}>
      {segments.map((segment, index) => {
        const count = Math.max(0, Math.min(segment.text.length, remaining));
        remaining -= count;
        if (count === 0) return null;
        return (
          <span key={index} className={segment.className}>
            {segment.text.slice(0, count)}
          </span>
        );
      })}
      <span
        aria-hidden
        className={`ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.08em] bg-[#FFBE0D] ${
          visible >= total ? 'opacity-0' : 'animate-pulse'
        }`}
      />
    </span>
  );
};

/* 01 - Who we are                                                    */

export const AboutHeroSection: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <section className={`relative mb-12 flex min-h-[340px] items-center justify-center overflow-hidden border-b pb-10 sm:min-h-[460px] lg:min-h-[560px] ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
      <h1
        className={`pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap text-center font-poster leading-none tracking-[0.02em] text-[30vw] bg-gradient-to-b bg-clip-text text-transparent md:text-[24vw] ${
          isDark
            ? 'from-[#FFBE0D]/40 via-[#FFBE0D]/16 to-[#FFBE0D]/0 drop-shadow-[0_0_60px_rgba(255,190,13,0.25)]'
            : 'from-[#8C6500]/28 via-[#8C6500]/13 to-[#8C6500]/0'
        }`}
      >
        About Us
      </h1>
      <img
        src={teamPhoto}
        alt="Illustrated portrait of Snnsei"
        className="relative z-10 h-[320px] max-w-[82vw] object-contain object-bottom sm:h-[440px] lg:h-[540px]"
        loading="eager"
        decoding="async"
      />
    </section>
  );
};

export const AboutIntroSection: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <SectionShell>
      <div className="w-full max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <Reveal delay={80}>
          <div>
            <Eyebrow>Community &amp; play</Eyebrow>
            <h2
              className={`mt-5 max-w-[20ch] min-h-[6.5em] text-[clamp(2.15rem,4.1vw,3.7rem)] font-semibold leading-[1.03] tracking-[-0.04em] ${isDark ? 'text-white' : 'text-neutral-950'}`}
              style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="sr-only">
                GM7 is more than a stream—it’s a place to find your people. Competitive
                play, open lobbies and tournament nights bring players together beyond the
                match.
              </span>
              <span aria-hidden>
                <Typewriter
                  segments={[
                    { text: 'GM7 is more than a stream—it’s ' },
                    { text: 'a place to find your people.', className: `italic ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}` },
                    {
                      text: ' Competitive play, open lobbies and tournament nights bring players together beyond the match.',
                    },
                  ]}
                />
              </span>
            </h2>
          </div>
          </Reveal>

          <Reveal delay={180}>
          <div className="group relative isolate flex w-full max-w-[520px] items-center justify-center justify-self-center overflow-hidden lg:justify-self-end">
            <img
              src={streamerShot}
              alt="Illustrated portrait of Snnsei reading"
              loading="lazy"
              decoding="async"
              className="relative z-10 aspect-[9/10] w-full object-contain object-bottom"
            />
          </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
};

/* 02 - The streamer                                                  */

export const AboutStreamerSection: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <SectionShell>
      <div className="w-full max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          {/* Full bleed image panel */}
          <div className="relative overflow-hidden min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] -mx-4 sm:-mx-6 lg:-mx-8">
            <img
              src={streamerShot}
              alt="Snnsei at the battle station"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </div>

          <div>
            <Eyebrow>01 · The streamer</Eyebrow>
            <SectionTitle>
              Snnsei
            </SectionTitle>
            <SectionCopy>
              The voice and the aim behind every GM7 broadcast. Snnsei runs the lobby,
              calls the plays and refuses to throw a round — competitive FPS at a level
              that still feels like playing with friends.
            </SectionCopy>

            <div className="mt-8 space-y-4">
              {[
                { icon: Crosshair, label: 'Main game', value: 'Competitive FPS' },
                { icon: Radio, label: 'Broadcast', value: 'Nightly live sessions' },
                { icon: Target, label: 'Role', value: 'IGL / Team anchor' },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-4">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isDark
                          ? 'bg-white/5 border border-white/10 text-[#FFBE0D]'
                          : 'bg-neutral-100 border border-neutral-200 text-[#8C6500]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-[10px] font-mono uppercase tracking-[0.2em] ${
                          isDark ? 'text-neutral-500' : 'text-neutral-500'
                        }`}
                      >
                        {row.label}
                      </span>
                      <span
                        className={`block text-[13px] font-bold ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {row.value}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

/* 03 - The founder                                                   */

export const AboutFounderSection: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <SectionShell>
      <div className="w-full max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <Eyebrow>02 · The founder</Eyebrow>
            <SectionTitle>
              Hatim
              <br />
              Naji
            </SectionTitle>
            <SectionCopy>
              The architect behind GM7. Hatim builds the brand, directs the creative
              direction and keeps the machine running — from the broadcast rundown to
              the tournament bracket, every detail lands the same way: clean.
            </SectionCopy>

            <div className="mt-8 space-y-4">
              {[
                { icon: Target, label: 'Focus', value: 'Brand & creative direction' },
                { icon: Trophy, label: 'Role', value: 'Founder & showrunner' },
                { icon: Users, label: 'Team', value: 'Scrims, events & community' },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-4">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isDark
                          ? 'bg-white/5 border border-white/10 text-[#FFBE0D]'
                          : 'bg-neutral-100 border border-neutral-200 text-[#8C6500]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-[10px] font-mono uppercase tracking-[0.2em] ${
                          isDark ? 'text-neutral-500' : 'text-neutral-500'
                        }`}
                      >
                        {row.label}
                      </span>
                      <span
                        className={`block text-[13px] font-bold ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {row.value}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full bleed image panel */}
          <div className="relative order-1 lg:order-2 overflow-hidden min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] -mx-4 sm:-mx-6 lg:-mx-8">
            <img
              src={founderShot}
              alt="Hatim Naji"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

/* 04 - Pillars                                                        */

export const AboutPillarsSection: React.FC = () => {
  const { isDark } = useTheme();

  const pillars = [
    {
      icon: Crosshair,
      title: 'Competitive Integrity',
      body: 'No smurf lists, no staged lobbies, no excuses. Every scrim is played clean and every result is on the board.',
    },
    {
      icon: Users,
      title: 'Community First',
      body: 'Open lobbies, zero gatekeeping. The squad grows from the chat, and the chat is welcome the moment it joins.',
    },
    {
      icon: Flame,
      title: 'Relentless Consistency',
      body: 'Motivation fades, we do not. The schedule holds, the gear is ready and the stream starts at the same time every night.',
    },
  ];

  return (
    <SectionShell>
      <div className="w-full max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>What we build</Eyebrow>
          <SectionTitle>
            Three pillars
            <br />
            <span className={isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}>we never trade</span>
          </SectionTitle>
          <SectionCopy>
            Every layout, every lobby rule and every tournament format comes back to
            these three ideas. They are the reason people keep coming back.
          </SectionCopy>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200/70 dark:bg-white/10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`p-7 transition-colors duration-300 ${
                  isDark ? 'bg-[#07080a] hover:bg-white/[0.04]' : 'bg-white hover:bg-neutral-50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`} />
                <h3
                  className={`mt-5 text-base font-black uppercase tracking-tight ${
                    isDark ? 'text-white' : 'text-neutral-950'
                  }`}
                >
                  {pillar.title}
                </h3>
                <p
                  className={`mt-3 text-[13px] leading-relaxed ${
                    isDark ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  {pillar.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
};

/* 05 - Timeline                                                       */

export const AboutTimelineSection: React.FC = () => {
  const { isDark } = useTheme();

  const milestones = [
    { year: '2023', title: 'First light', body: 'One headset, one mic and a late night lobby that turned into a regular crew.' },
    { year: '2024', title: 'The squad forms', body: 'Community scrims, a packed Discord and the first self-made tournament bracket.' },
    { year: '2025', title: 'Full studio', body: 'The battle station was rebuilt, the schedule locked in, and the production got serious.' },
    { year: '2026', title: 'GM7 goes live', body: 'A proper stream house: nightly broadcasts, community nights and a brand built from scratch.' },
  ];

  return (
    <SectionShell>
      <div className="w-full max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] gap-10 lg:gap-16 items-start">
          <div>
            <Eyebrow>The road so far</Eyebrow>
            <SectionTitle>
              Milestones
            </SectionTitle>
            <SectionCopy>
              Nothing here was bought. Every step came from showing up and putting the
              hours in.
            </SectionCopy>

            <div className="relative mt-8 overflow-hidden min-h-[220px] sm:min-h-[280px]">
              <img
                src={trophyShot}
                alt="Tournament trophy"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <ol className="relative">
            {milestones.map((milestone, idx) => (
              <li key={milestone.year} className="relative pl-10 pb-10 last:pb-0">
                <span
                  className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-mono font-bold ${
                    isDark
                      ? 'border-[#FFBE0D]/50 bg-[#07080a] text-[#FFBE0D]'
                      : 'border-[#FFBE0D] bg-white text-[#8C6500]'
                  }`}
                >
                  {idx + 1}
                </span>
                {idx < milestones.length - 1 && (
                  <span
                    className={`absolute left-[13px] top-9 bottom-0 w-px ${
                      isDark ? 'bg-white/10' : 'bg-neutral-200'
                    }`}
                  />
                )}
                <div
                  className={`text-[11px] font-mono font-bold uppercase tracking-[0.25em] ${
                    isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'
                  }`}
                >
                  {milestone.year}
                </div>
                <h3
                  className={`mt-2 text-lg font-black uppercase tracking-tight ${
                    isDark ? 'text-white' : 'text-neutral-950'
                  }`}
                >
                  {milestone.title}
                </h3>
                <p
                  className={`mt-2 text-[13px] leading-relaxed max-w-[48ch] ${
                    isDark ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  {milestone.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
};

/* 06 - Community                                                      */

export const AboutCommunitySection: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <SectionShell>
      <div className="w-full max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <img
              src={communityShot}
              alt="GM7 community meetup"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </div>

          <div>
            <Eyebrow>The squad</Eyebrow>
            <SectionTitle>
              Built in the
              <br />
              <span className={isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}>chat</span>
            </SectionTitle>
            <SectionCopy>
              GM7 is not a broadcast you watch, it is a lobby you join. Community nights,
              viewer scrims and open mics turn viewers into regulars, and regulars into
              teammates.
            </SectionCopy>

            <div className="mt-8 grid grid-cols-2 gap-6">
              {[
                { value: '6K+', label: 'Community members' },
                { value: '120', label: 'Events hosted' },
                { value: '40+', label: 'Active moderators' },
                { value: '1', label: 'Shared goal' },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    className={`text-xl sm:text-2xl font-black tracking-tight ${
                      isDark ? 'text-white' : 'text-neutral-950'
                    }`}
                  >
                    {item.value}
                  </div>
                  <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-500">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wide stage image band */}
        <div className="relative mt-12 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden min-h-[220px] sm:min-h-[300px]">
          <img
            src={stageShot}
            alt="GM7 community event stage"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </SectionShell>
  );
};

/* 07 - CTA                                                            */

export const AboutCtaSection: React.FC<AboutSectionsProps> = ({ onToast, onNavigateHome }) => {
  const { isDark } = useTheme();

  return (
    <SectionShell>
      <div className="w-full max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative overflow-hidden p-8 sm:p-12 ${
            isDark
              ? 'bg-[radial-gradient(ellipse_at_top_left,rgba(255,190,13,0.18),transparent_60%)] border border-white/10'
              : 'bg-[radial-gradient(ellipse_at_top_left,rgba(255,190,13,0.22),transparent_60%)] border border-neutral-200'
          }`}
        >
          <div className="max-w-2xl">
            <Eyebrow>Join the crew</Eyebrow>
            <h2
              className={`mt-3 text-[clamp(1.6rem,3vw,2.6rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] ${
                isDark ? 'text-white' : 'text-neutral-950'
              }`}
              style={{ fontFamily: "'Inter', 'Arial Black', sans-serif" }}
            >
              Pull up a chair,
              <br />
              <span className={isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}>queue with us</span>
            </h2>
            <p
              className={`mt-4 text-[13px] sm:text-[15px] leading-relaxed max-w-[48ch] ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              Catch a live session, hop into the community lobby or just say hello. The
              next round starts the moment you walk in.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://kick.com/snnsei"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#FFBE0D] text-black text-[13px] font-black uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffd44d] active:translate-y-0 active:scale-95"
              >
                Watch live
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
              <button
                type="button"
                onClick={() => onNavigateHome?.('socials')}
                className={`inline-flex items-center gap-2 h-11 px-5 rounded-xl text-[13px] font-black uppercase tracking-wide transition-all duration-300 active:scale-95 ${
                  isDark
                    ? 'bg-white/5 border border-white/15 text-white hover:bg-white/10'
                    : 'bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                All socials
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
};


export const AboutSections: React.FC<AboutSectionsProps> = ({ onToast, onNavigateHome }) => {
  return (
    <div className="w-full">
      <AboutIntroSection />
    </div>
  );
};
