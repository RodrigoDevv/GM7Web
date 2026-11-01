import React, { useState } from 'react';
import { Calendar, Play, Trophy, Sparkles, Check, ArrowUpRight } from 'lucide-react';

interface FeaturesSectionProps {
  onPlayClip?: (title: string) => void;
  onRemindStream?: (title: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onPlayClip,
  onRemindStream,
}) => {
  const [activeDay, setActiveDay] = useState<'mon' | 'wed' | 'fri' | 'sun'>('mon');
  const [activeTier, setActiveTier] = useState<'free' | 'vip' | 'partner'>('vip');

  const scheduleData = {
    mon: {
      day: 'Monday',
      time: '5:00 PM UTC',
      title: 'Ranked Grind & Live UI Roasts',
      game: 'Competitive Apex + Figma Review',
      description: 'Starting the week with high-tier ranked lobbies followed by reviewing viewer design portfolios on live stream.',
      attendees: '2.4K planning to watch',
    },
    wed: {
      day: 'Wednesday',
      time: '4:30 PM UTC',
      title: 'Building a Micro-SaaS in 3 Hours',
      game: 'Live Coding & Kick Chat Challenges',
      description: 'Sensei builds a functional product from scratch live on stream while chat decides features, color schemes, and tech stack.',
      attendees: '3.1K planning to watch',
    },
    fri: {
      day: 'Friday',
      time: '6:00 PM UTC',
      title: 'Community Cup & Viewer 1v1s',
      game: 'Tournament Bracket + $1,000 Drops',
      description: 'Weekly open tournament on Kick with Discord voice integrations. Cash prize split and exclusive Sensei jacket emotes for winners.',
      attendees: '4.8K planning to watch',
    },
    sun: {
      day: 'Sunday',
      time: '3:00 PM UTC',
      title: 'Chill Lo-Fi & Open Discord Lounge',
      game: 'Creative Showcase & AMA',
      description: 'Casual Sunday chill stream with indie founders, sharing music, answering member questions, and reviewing week progress.',
      attendees: '1.9K planning to watch',
    },
  };

  const clips = [
    {
      id: 'clip-1',
      title: 'Sensei 1v4 Clutch in Tournament Finals',
      views: '42.8K views',
      duration: '0:48',
      tag: 'Gameplay',
    },
    {
      id: 'clip-2',
      title: 'Chat forces Sensei to write raw assembly',
      views: '68.2K views',
      duration: '1:12',
      tag: 'Coding',
    },
    {
      id: 'clip-3',
      title: 'Designing the GM7 Logo live in 20 minutes',
      views: '31.5K views',
      duration: '0:55',
      tag: 'Design',
    },
  ];

  const currentSchedule = scheduleData[activeDay];

  return (
    <section id="features" className="py-20 sm:py-28 bg-neutral-50/60 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FFBE0D]" />
              <span>Features & Broadcasts</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight">
              Interactive broadcasts, curated schedules & VIP perks.
            </h2>
          </div>
          <p className="text-sm text-neutral-600 max-w-sm">
            Everything in the GM7 universe is built around real-time community participation and creator-led entertainment.
          </p>
        </div>

        {/* 2-Column Bento: Interactive Stream Schedule on Left + Top Clips & Perks on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Schedule Planner (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFBE0D]/15 text-black flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4 text-neutral-900" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-[#171717]">
                      Kick Broadcast Schedule
                    </h3>
                    <p className="text-xs text-neutral-500">Live streams every week</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#FFBE0D] bg-black px-3 py-1 rounded-full">
                  GMT+0 / UTC
                </span>
              </div>

              {/* Day Selector Buttons */}
              <div className="grid grid-cols-4 gap-2 p-1.5 bg-neutral-100 rounded-2xl mb-8">
                {(['mon', 'wed', 'fri', 'sun'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${
                      activeDay === d
                        ? 'bg-white text-black shadow-xs font-extrabold'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {d === 'mon' ? 'Mon' : d === 'wed' ? 'Wed' : d === 'fri' ? 'Fri' : 'Sun'}
                  </button>
                ))}
              </div>

              {/* Day Details Card */}
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold text-[#B45309] bg-[#FFB800]/15 px-2.5 py-1 rounded-lg">
                    {currentSchedule.day} · {currentSchedule.time}
                  </span>
                  <span className="text-xs text-neutral-500 font-semibold">
                    {currentSchedule.attendees}
                  </span>
                </div>

                <h4 className="font-display text-lg sm:text-xl font-bold text-[#171717] mb-2">
                  {currentSchedule.title}
                </h4>

                <p className="text-xs font-bold text-neutral-700 mb-2">
                  Game / Focus: <span className="text-neutral-900 font-extrabold">{currentSchedule.game}</span>
                </p>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {currentSchedule.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <a
                href="https://kick.com/snnsei"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 rounded-xl bg-[#FFBE0D] hover:bg-[#E5A800] text-black font-extrabold text-xs shadow-xs transition-all flex items-center gap-2"
              >
                <span>Follow on Kick</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() =>
                  onRemindStream?.(`${currentSchedule.day} Stream: ${currentSchedule.title}`)
                }
                className="py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 transition-colors"
              >
                Set Reminder Notification
              </button>
            </div>
          </div>

          {/* Right: Top Clips & Tier Matrix (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Top Clips Widget */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-[#171717] flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#FFBE0D]" />
                  <span>Stream Highlights</span>
                </h3>
                <span className="text-xs font-semibold text-neutral-500">Trending</span>
              </div>

              <div className="space-y-3">
                {clips.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={() => onPlayClip?.(clip.title)}
                    className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-9 h-9 rounded-xl bg-[#171717] text-[#FFBE0D] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#171717] truncate group-hover:text-black">
                          {clip.title}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          {clip.views} · {clip.duration}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-neutral-700 bg-white border border-neutral-200 px-2 py-0.5 rounded-md shrink-0">
                      {clip.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensei VIP Perks Card */}
            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#FFB800]" />
                  <span className="font-display text-sm font-bold">Community Perks</span>
                </div>
                <span className="text-[11px] font-extrabold text-[#FFBE0D] bg-[#FFBE0D]/15 px-2.5 py-0.5 rounded-full">
                  Sensei Guild
                </span>
              </div>

              {/* Tier Switcher */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-800 rounded-xl mb-4 text-xs font-bold">
                <button
                  onClick={() => setActiveTier('free')}
                  className={`py-1.5 rounded-lg transition-colors ${
                    activeTier === 'free' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Member
                </button>
                <button
                  onClick={() => setActiveTier('vip')}
                  className={`py-1.5 rounded-lg transition-colors ${
                    activeTier === 'vip' ? 'bg-[#FFBE0D] text-black font-extrabold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  VIP Sub
                </button>
                <button
                  onClick={() => setActiveTier('partner')}
                  className={`py-1.5 rounded-lg transition-colors ${
                    activeTier === 'partner' ? 'bg-[#FFB800] text-black font-extrabold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Partner
                </button>
              </div>

              {/* Features list based on tier */}
              <ul className="space-y-2 text-xs text-neutral-300 mb-5">
                {activeTier === 'free' && (
                  <>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FFBE0D]" />
                      <span>Access to general Discord voice & chat</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FFBE0D]" />
                      <span>Kick stream chat & public giveaways</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FFBE0D]" />
                      <span>Weekly community highlights digest</span>
                    </li>
                  </>
                )}
                {activeTier === 'vip' && (
                  <>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FFBE0D]" />
                      <span>Sensei Red Jacket badge & custom Kick emotes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FFBE0D]" />
                      <span>Priority in viewer 1v1 lobbies & code reviews</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FFBE0D]" />
                      <span>Private VIP Discord lounge with Sensei</span>
                    </li>
                  </>
                )}
                {activeTier === 'partner' && (
                  <>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>Co-stream rights & GM7 creator badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>Direct channel raid priority on Kick</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>Sponsorship & tournament revenue sharing</span>
                    </li>
                  </>
                )}
              </ul>

              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Join VIP Tier in Discord</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
