import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Clock,
  Heart,
  Target,
  Swords,
  Sparkles,
  Award,
  Calendar,
  Compass,
  Zap,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import senseiPortraitImg from '../assets/images/sensei_portrait_studio_1792363735846.jpg';
import trophyStageImg from '../assets/images/sensei_tournament_trophy_1792363736711.jpg';
import communityMeetupImg from '../assets/images/sensei_community_meetup_1792363736995.jpg';

interface AboutSectionProps {
  onToast?: (msg: string) => void;
}

interface Milestone {
  year: string;
  title: string;
  category: string;
  description: string;
  badge: string;
}

const careerMilestones: Milestone[] = [
  {
    year: '2020',
    title: 'The College Dorm Beginnings',
    category: 'Genesis',
    description: 'Started streaming from a single-monitor dorm room setup with an entry-level graphics card and 7 dedicated viewers. Grinded 12-hour weekends mastering FPS tracking.',
    badge: 'Dorm Setup',
  },
  {
    year: '2021',
    title: 'Top 20 Global Apex Predator',
    category: 'Competitive',
    description: 'Achieved Global Predator Rank #18 solo-queuing in Apex Legends Season 9. Clipped the viral 1v3 Kraber noscope that sparked initial esports recognition.',
    badge: 'Rank #18 Global',
  },
  {
    year: '2023',
    title: 'Verified Kick Streaming Partnership',
    category: 'Milestone',
    description: 'Joined Kick as one of the platform’s foundational gaming creators. Reached 1,000 concurrent subscribers within 90 days and founded the official Dojo community.',
    badge: 'Kick Verified',
  },
  {
    year: '2024',
    title: 'Inaugural Dojo Invitational',
    category: 'Community',
    description: 'Organized and hosted the first $10,000 community esports invitational, bringing together top creators, chat members, and rising amateur competitors.',
    badge: '$10K Prize Pool',
  },
  {
    year: '2025',
    title: '$45,000 Charity Marathon',
    category: 'Philanthropy',
    description: 'Completed a 24-hour charity broadcast raising over $45,000 for youth gaming accessibility and mental health organizations across the globe.',
    badge: '$45K Raised',
  },
  {
    year: '2026',
    title: '150,000 Dojo Members & Arena Meetup',
    category: 'Current',
    description: 'The Dojo expands into a premier multi-game competitive and casual hub with daily broadcasts, community tournaments, and in-person convention gatherings.',
    badge: '150K+ Strong',
  },
];

const dojoPillars = [
  {
    id: 'precision',
    title: 'Precision APM & Mechanical Discipline',
    subtitle: 'Crosshair Mastery',
    icon: Target,
    desc: 'Victory is forged in daily micro-drills. We practice deliberate crosshair placement, movement tech, and split-second tactical decision-making over pure luck.',
  },
  {
    id: 'resilience',
    title: 'Relentless Resilience & VOD Reviews',
    subtitle: 'Learn Every Defeat',
    icon: Swords,
    desc: 'No rage quits, no finger-pointing. Every eliminated round is analyzed for positioning and utility mistakes. The true Dojo warrior embraces tough losses as fuel.',
  },
  {
    id: 'community',
    title: 'Zero-Toxicity, Inclusive Arena',
    subtitle: 'All Ranks Welcome',
    icon: ShieldCheck,
    desc: 'Whether you are a bronze newcomer or an apex predator, the stream chat is a home for positive competitive banter, learning together, and hyping each other up.',
  },
  {
    id: 'philanthropy',
    title: 'Elevate Others & Give Back',
    subtitle: 'Impact Beyond Screens',
    icon: Heart,
    desc: 'Gaming is a bridge to make real-world differences. Through annual charity marathons and mentorship, Sensei and the chat continually support youth causes.',
  },
];

const dailyRegimenItems = [
  { time: '12:00 PM', task: 'KovaaK’s & Aimlabs Warmup', detail: '45 mins of tracking, flicking, and micro-correction routines.' },
  { time: '01:00 PM', task: 'Hardware & Calibration Check', detail: '0.1mm Rapid Trigger calibration, mouse DPI zeroing, 360Hz test.' },
  { time: '02:00 PM', task: 'Competitive Rank Grind', detail: 'Apex Predator / Valorant Radiant queues with squad voice comms.' },
  { time: '06:00 PM', task: 'Community & Chat Bounties', detail: '1v1 Gulag with viewers, bounty challenges, and Kick chat giveaways.' },
  { time: '08:30 PM', task: 'VOD Review & Clip Curation', detail: 'Analyzing matchplay footage and uploading high-APM vault highlights.' },
];

export const AboutSection: React.FC<AboutSectionProps> = ({ onToast }) => {
  const { isDark } = useTheme();

  // Active Story Tab: 'story' | 'timeline' | 'pillars' | 'regimen'
  const [activeTab, setActiveTab] = useState<'story' | 'timeline' | 'pillars' | 'regimen'>('story');

  // Selected Milestone in Timeline
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone>(careerMilestones[careerMilestones.length - 1]);

  // Audio blip feedback
  const playSound = (type: 'blip' | 'quote' = 'blip') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'blip') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        osc.start();
        osc.stop(ctx.currentTime + 0.07);
      } else {
        // Multi-tone inspirational chime
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          g.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + idx * 0.08);
          o.stop(ctx.currentTime + idx * 0.08 + 0.3);
        });
      }
    } catch {
      // Audio fallback
    }
  };

  const handlePlayMotto = () => {
    playSound('quote');
    onToast?.('Sensei’s Motto: "Speed is nothing without discipline. Respect the game, elevate your squad."');
  };

  return (
    <section
      id="about"
      className={`py-16 sm:py-24 relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#080a0e] text-white border-t border-white/5'
          : 'bg-neutral-50 text-neutral-900 border-t border-neutral-200'
      }`}
    >
      {/* Precision Background Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className={`absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_35%,#000_65%,transparent_100%)] ${
            isDark
              ? 'bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:44px_44px] opacity-75'
              : 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px] opacity-80'
          }`}
        />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[350px] bg-[#FFBE0D]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[300px] bg-[#00e5ff]/6 rounded-full blur-[130px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ============================================================== */}
        {/* SECTION HEADER                                                 */}
        {/* ============================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#FFBE0D] animate-pulse shadow-[0_0_8px_#FFBE0D]" />
              <span className="text-[#8C6500] dark:text-[#FFBE0D] font-bold uppercase tracking-wider">
                About Sensei GM7
              </span>
              <span className="text-neutral-400">·</span>
              <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
                Verified Kick Creator & Esports Competitor
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              The Story Behind The Dojo
            </h2>
            <p className={`mt-2 text-sm sm:text-base max-w-2xl font-medium ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              From a single-monitor dorm room grind to leading a 150,000+ member gaming family. Discover Sensei’s competitive roots, training philosophy, and community values.
            </p>
          </div>

          {/* Interactive Chapter Switcher Tabs */}
          <div className={`p-1.5 rounded-2xl flex items-center gap-1 border backdrop-blur-md self-start md:self-auto overflow-x-auto max-w-full ${
            isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}>
            {[
              { id: 'story', label: 'Biography' },
              { id: 'timeline', label: 'Career Timeline' },
              { id: 'pillars', label: 'Dojo Creed' },
              { id: 'regimen', label: 'Daily Routine' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playSound('blip');
                  setActiveTab(tab.id as unknown as 'story');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-[#FFBE0D] text-black font-bold shadow-[0_0_15px_rgba(255,190,13,0.35)]'
                      : 'bg-[#8C6500] text-white font-bold shadow-md'
                    : isDark
                    ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: BIOGRAPHY & STUDIO PORTRAIT                             */}
        {/* ============================================================== */}
        {activeTab === 'story' && (
          <div className="space-y-8">
            <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
              isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200 shadow-xl'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left 5 Cols: Cinematic Studio Portrait */}
                <div className="lg:col-span-5 relative aspect-4/3 lg:aspect-auto bg-black overflow-hidden group min-h-[380px] lg:min-h-[500px]">
                  <img
                    src={senseiPortraitImg}
                    alt="Sensei GM7 in official Kick streaming studio"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Corner Brand Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-mono font-bold text-[#FFBE0D] border border-[#FFBE0D]/30">
                      OFFICIAL STUDIO PORTRAIT
                    </span>
                  </div>

                  {/* Bottom Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white z-20">
                    <div className="text-xl font-black font-display tracking-tight">Alex "Sensei GM7"</div>
                    <div className="text-xs font-mono text-neutral-300 mt-0.5">
                      Kick Verified Partner · Pro FPS Competitor · Dojo Founder
                    </div>
                  </div>
                </div>

                {/* Right 7 Cols: Detailed Bio, Mission & Motto */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                      <div>
                        <span className="text-xs font-mono font-bold uppercase text-[#8C6500] dark:text-[#FFBE0D]">
                          COMPETITIVE ORIGINS
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                          Built on Precision, Community & Respect
                        </h3>
                      </div>

                      {/* Interactive Motto Button */}
                      <button
                        type="button"
                        onClick={handlePlayMotto}
                        title="Hear Sensei's Motto"
                        className="p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95 shrink-0 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border-neutral-300 dark:border-neutral-700"
                      >
                        <Volume2 className="w-4 h-4 text-[#8C6500] dark:text-[#FFBE0D]" />
                        <span className="text-xs font-mono font-bold hidden sm:inline">Play Motto</span>
                      </button>
                    </div>

                    <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${
                      isDark ? 'text-neutral-300' : 'text-neutral-700'
                    }`}>
                      <p>
                        Sensei GM7 began his esports journey in local underground LAN centers, grinding 10,000 hours in tactical shooters and battle royales before ever turning on a camera. What started as competitive curiosity quickly evolved into a dedicated mission: proving that high-tier APM mechanics can coexist with a supportive, zero-toxicity gaming space.
                      </p>
                      <p>
                        Known for razor-sharp sniper tracking in Apex Legends, surgical site-retakes in Valorant, and cinematic police chases in GTA RP, Sensei broadcasts 6 days a week to an energetic community nicknamed <strong>The Dojo</strong>. Every stream blends tournament-grade focus with community games, giveaways, and genuine chat connection.
                      </p>
                      <p>
                        Behind the highlight reels sits a relentless training routine. Mornings begin with aim trainers and VOD reviews, afternoons are reserved for ranked grinds and scrim blocks, and evenings shift toward community lobbies where viewers are invited to queue alongside the squad. That balance between elite competition and open-door accessibility is what turned a solo dorm stream into a full-time creative studio.
                      </p>
                      <p>
                        Over the years the channel has grown into a multi-title destination. From high-stakes battle royale finals to relaxed GTA RP story arcs, every broadcast is built around the same promise: sharp gameplay, honest commentary, and an environment where newcomers feel welcome from their very first message in chat. The Dojo is less a fanbase and more a training hall — one that celebrates improvement as loudly as it celebrates victory.
                      </p>
                    </div>

                    {/* Quick Metadata Spec Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono">
                      <div>
                        <div className="text-neutral-400 uppercase text-[10px]">Main Role</div>
                        <div className="font-bold font-sans text-sm mt-0.5">Entry Fragger</div>
                      </div>
                      <div>
                        <div className="text-neutral-400 uppercase text-[10px]">Peak Rank</div>
                        <div className="font-bold text-[#8C6500] dark:text-[#FFBE0D] text-sm mt-0.5">Apex Predator #18</div>
                      </div>
                      <div>
                        <div className="text-neutral-400 uppercase text-[10px]">Broadcast Engine</div>
                        <div className="font-bold font-sans text-sm mt-0.5">1080p60 HDR</div>
                      </div>
                      <div>
                        <div className="text-neutral-400 uppercase text-[10px]">Platform Status</div>
                        <div className="font-bold font-sans text-sm mt-0.5">Kick Verified</div>
                      </div>
                    </div>
                  </div>

                  {/* Quote Callout Banner */}
                  <div className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
                    isDark ? 'bg-black/40 border-neutral-800' : 'bg-neutral-100/80 border-neutral-200'
                  }`}>
                    <p className="text-xs sm:text-sm font-medium italic text-neutral-600 dark:text-neutral-300">
                      "A true warrior doesn't blame the lag or the meta. We analyze the angle, adjust the crosshair, and elevate the squad next round."
                    </p>
                    <div className="mt-2 text-xs font-mono font-bold text-[#8C6500] dark:text-[#FFBE0D] flex items-center gap-1.5">
                      <span>— Sensei GM7</span>
                      <span className="text-neutral-400 font-normal">· Streamer & Mentor</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Strengths Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: Sparkles,
                  title: 'Tournament-Grade Focus',
                  desc: 'Ranked grinds, scrim blocks, and bracket runs are streamed with full comms and live tactical breakdowns for anyone watching to learn from.',
                },
                {
                  icon: Compass,
                  title: 'Open-Door Community',
                  desc: 'Viewer lobbies, 1v1 bounties, and Discord scrims run every week — no rank requirement, no gatekeeping, just a seat in the dojo.',
                },
                {
                  icon: Award,
                  title: 'Built To Give Back',
                  desc: 'Annual charity marathons, mentorship sessions, and youth gaming access programs keep the community focused on impact beyond the screen.',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                      isDark
                        ? 'bg-neutral-900/80 border-neutral-800 hover:border-[#FFBE0D]/40 shadow-md'
                        : 'bg-white border-neutral-200 hover:border-orange-300 shadow-sm'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#FFBE0D]/15 flex items-center justify-center text-[#8C6500] dark:text-[#FFBE0D] mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base sm:text-lg font-black tracking-tight mb-1.5">{item.title}</h4>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Lifetime Impact Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Dojo Community', val: '150,000+', sub: 'Global Fans & Members', icon: Users },
                { label: 'Hours Broadcast', val: '4,200+', sub: 'Live on Air Since 2020', icon: Clock },
                { label: 'Charity Raised', val: '$45,000+', sub: 'Youth Gaming & Mental Health', icon: Heart },
                { label: 'Tournament Wins', val: '38 Podiums', sub: 'Regional & Online Championships', icon: Trophy },
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div
                    key={i}
                    className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                      isDark
                        ? 'bg-neutral-900/80 border-neutral-800 hover:border-[#FFBE0D]/50 shadow-md'
                        : 'bg-white border-neutral-200 hover:border-orange-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                        {m.label}
                      </span>
                      <Icon className="w-5 h-5 text-[#8C6500] dark:text-[#FFBE0D]" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black font-display tracking-tight text-[#8C6500] dark:text-[#FFBE0D]">
                        {m.val}
                      </div>
                      <div className="text-xs font-mono text-neutral-500 mt-1">
                        {m.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CAREER TIMELINE & TROPHY ARENA                          */}
        {/* ============================================================== */}
        {activeTab === 'timeline' && (
          <div className="space-y-8">
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200 shadow-xl'
            }`}>
              
              {/* Header with Trophy Banner */}
              <div className="relative aspect-21/9 rounded-2xl overflow-hidden bg-black mb-8 border border-neutral-700 shadow-xl">
                <img
                  src={trophyStageImg}
                  alt="Esports tournament grand final stage with championship trophy"
                  className="w-full h-full object-cover brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#FFBE0D] text-black uppercase tracking-wider">
                      CHAMPIONSHIP ROADMAP
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">
                      6 Years of Competitive Milestones
                    </h3>
                  </div>
                  <div className="text-xs font-mono text-neutral-300">
                    Click any year below to inspect the milestone
                  </div>
                </div>
              </div>

              {/* Year Button Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                {careerMilestones.map((ms) => {
                  const isSelected = selectedMilestone.year === ms.year;
                  return (
                    <button
                      key={ms.year}
                      type="button"
                      onClick={() => {
                        playSound('blip');
                        setSelectedMilestone(ms);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? isDark
                            ? 'bg-neutral-800 border-[#FFBE0D] ring-2 ring-[#FFBE0D]/30 shadow-lg'
                            : 'bg-white border-[#8C6500] ring-2 ring-orange-500/20 shadow-md'
                          : isDark
                          ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-600'
                          : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="text-xl sm:text-2xl font-black font-mono" style={{ color: isSelected ? '#FFBE0D' : undefined }}>
                        {ms.year}
                      </div>
                      <div className="text-xs font-bold truncate mt-1">{ms.title}</div>
                      <div className="text-[10px] font-mono text-neutral-400 mt-0.5">{ms.category}</div>
                    </button>
                  );
                })}
              </div>

              {/* Milestone Spotlight Card */}
              <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                isDark ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-[#8C6500] dark:text-[#FFBE0D]">
                      {selectedMilestone.year}
                    </span>
                    <div>
                      <span className="text-xs font-mono font-bold uppercase text-neutral-400">
                        {selectedMilestone.category}
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black tracking-tight">
                        {selectedMilestone.title}
                      </h4>
                    </div>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#FFBE0D]/15 text-[#8C6500] dark:text-[#FFBE0D] border border-[#FFBE0D]/30">
                    {selectedMilestone.badge}
                  </span>
                </div>

                <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  {selectedMilestone.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: THE DOJO CREED (4 PILLARS)                              */}
        {/* ============================================================== */}
        {activeTab === 'pillars' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dojoPillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.id}
                    className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                      isDark
                        ? 'bg-neutral-900/90 border-neutral-800 hover:border-[#FFBE0D]/40 shadow-lg'
                        : 'bg-white border-neutral-200 hover:border-orange-300 shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFBE0D]/15 flex items-center justify-center text-[#8C6500] dark:text-[#FFBE0D]">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono font-bold text-neutral-400">
                          PILLAR 0{idx + 1}
                        </span>
                      </div>

                      <div className="text-xs font-mono font-bold text-[#8C6500] dark:text-[#FFBE0D] uppercase tracking-wider mb-1">
                        {pillar.subtitle}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-3">
                        {pillar.title}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {pillar.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-xs font-mono text-neutral-400">
                      <CheckCircle2 className="w-4 h-4 text-[#FFBE0D]" />
                      <span>Strictly enforced in stream chat and Discord</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: DAILY ROUTINE & TRAINING REGIMEN                        */}
        {/* ============================================================== */}
        {activeTab === 'regimen' && (
          <div className="space-y-8">
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200 shadow-xl'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-[#8C6500] dark:text-[#FFBE0D]">
                    A DAY IN THE LIFE
                  </span>
                  <h3 className="text-2xl font-black mt-1">Sensei’s Daily Training & Stream Regimen</h3>
                  <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Consistency breeds dominance. Peek behind the curtain at the 6-step routine that keeps Sensei at peak APM performance.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-black/5 dark:bg-white/5 text-xs font-mono">
                  <Flame className="w-4 h-4 text-[#FFBE0D]" />
                  <span>6 Days / Week Schedule</span>
                </div>
              </div>

              {/* Routine Timeline Schedule */}
              <div className="space-y-4 mb-8">
                {dailyRegimenItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isDark ? 'bg-black/40 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-20 sm:w-24 px-3 py-1.5 rounded-xl font-mono font-bold text-xs text-center bg-[#FFBE0D]/15 text-[#8C6500] dark:text-[#FFBE0D] border border-[#FFBE0D]/30 shrink-0">
                        {item.time}
                      </span>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold tracking-tight">{item.task}</h4>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {item.detail}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-neutral-400 self-end sm:self-center">
                      Step 0{idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Community Fan Gathering Spotlight Banner */}
              <div className="relative aspect-21/9 rounded-2xl overflow-hidden bg-black border border-neutral-700 shadow-xl">
                <img
                  src={communityMeetupImg}
                  alt="Dojo stream fans and community members gathered at gaming convention"
                  className="w-full h-full object-cover brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#FFBE0D] text-black uppercase">
                      DOJO ARENA COMMUNITY
                    </span>
                    <h4 className="text-xl sm:text-3xl font-black mt-2">
                      Meet the Gamers Who Power Every Broadcast
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
                      The heart of Sensei GM7 is the chat. From Discord scrims to annual charity relays, the community is always at the center of the action.
                    </p>
                  </div>
                  <a
                    href="https://discord.gg/MWdjQy4fBM"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onToast?.('Joining Sensei Dojo Discord community...')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs uppercase tracking-wider transition-transform hover:scale-105 active:scale-95 shrink-0 shadow-lg"
                  >
                    <span>Join The Dojo Discord</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
