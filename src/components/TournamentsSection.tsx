import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Flame,
  Trophy,
  Sparkles,
  Share2,
  ExternalLink,
  Eye,
  Clock,
  Gamepad2,
  CheckCircle2,
  Target,
  MessageSquare,
  Heart,
  X,
  Swords,
  Radio,
  ArrowUpRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import apexHeroImg from '../assets/images/ps5_apex_hero_1791730950598.jpg';
import tacticalFpsImg from '../assets/images/ps5_tactical_fps_1791731000845.jpg';
import heistCityImg from '../assets/images/ps5_city_heist_1791730967151.jpg';
import soulsEldenImg from '../assets/images/ps5_souls_elden_1791730984139.jpg';
import soccerEsportsImg from '../assets/images/ps5_esports_soccer_1791731018539.jpg';
import kickBgImg from '../assets/images/discord.jpg';
import { KickIcon } from './BrandIcons';

interface TournamentsSectionProps {
  onToast?: (msg: string) => void;
}

interface Clip {
  id: string;
  title: string;
  category: 'Clutch' | 'Funny' | 'Ace' | 'Heist' | 'Challenge';
  game: string;
  thumbnail: string;
  duration: string;
  views: string;
  date: string;
  streamerChat: Array<{ user: string; text: string; badge?: string; color?: string }>;
  reactions: { fire: number; skull: number; target: number; goat: number };
  kickClipUrl: string;
  description: string;
}

interface Bounty {
  id: string;
  title: string;
  game: string;
  reward: string;
  status: 'ACTIVE' | 'CLAIMED' | 'NEXT STREAM';
  progress: string;
  rules: string;
}

const clipsData: Clip[] = [
  {
    id: 'kraber-clutch',
    title: '1v3 Blind Kraber Noscope in Final Ring (Kick Stream Moment)',
    category: 'Clutch',
    game: 'Apex Legends',
    thumbnail: apexHeroImg,
    duration: '0:34',
    views: '248.5K',
    date: '3 days ago',
    streamerChat: [
      { user: 'WraithMain_99', text: 'NO WAAYYYY', color: '#FFBE0D', badge: 'VIP' },
      { user: 'KiraFPS', text: 'HE DID NOT JUST HIT THAT 💀💀', color: '#ff4d4d' },
      { user: 'ApexPredator_NA', text: 'Clip that right now guys!!', color: '#00d2ff' },
      { user: 'Dojo_Disciple', text: 'Sensei is on demonic mode tonight 🐐', color: '#ffa500' },
    ],
    reactions: { fire: 1842, skull: 420, target: 890, goat: 1205 },
    kickClipUrl: 'https://kick.com/sensei-gm7/clips/kraber-1v3',
    description: 'Final ring squad wipe with 1 HP remaining against the #1 ranked predator trio.',
  },
  {
    id: 'valorant-sheriff-ace',
    title: 'Eco Round 5-Bullet Sheriff Clean Ace on Haven A Site',
    category: 'Ace',
    game: 'Valorant',
    thumbnail: tacticalFpsImg,
    duration: '0:28',
    views: '189.2K',
    date: '5 days ago',
    streamerChat: [
      { user: 'ViperMommy', text: 'Crisp clean headshots only 🎯', color: '#FFBE0D' },
      { user: 'RadiantSmurf', text: '5 bullets 5 heads check his PC rn', color: '#ff4d4d' },
      { user: 'KickSub_90', text: 'THE APM IS INHUMAN', color: '#ffa500' },
    ],
    reactions: { fire: 1420, skull: 110, target: 1650, goat: 980 },
    kickClipUrl: 'https://kick.com/sensei-gm7/clips/sheriff-ace-haven',
    description: 'Down 11-12 in overtime, single-handedly turning the match with flawless crosshair placement.',
  },
  {
    id: 'gta-yacht-heist',
    title: '4-Star Helicopter Stunt Escape with $1.2M Cash Bag',
    category: 'Heist',
    game: 'GTA RP',
    thumbnail: heistCityImg,
    duration: '0:52',
    views: '164.1K',
    date: '1 week ago',
    streamerChat: [
      { user: 'NoPixelCop_01', text: 'HOW DID HE DIVE UNDER THE BRIDGE', color: '#00d2ff' },
      { user: 'SyndicateBoss', text: 'Sensei the getaway god 🏎️', color: '#FFBE0D' },
      { user: 'RP_Lover', text: 'Best chase of the season hands down', color: '#ff9900' },
    ],
    reactions: { fire: 980, skull: 640, target: 430, goat: 810 },
    kickClipUrl: 'https://kick.com/sensei-gm7/clips/yacht-heist-dive',
    description: 'Threaded a Maverick helicopter through the pier pillars to lose 6 cop cruisers instantly.',
  },
  {
    id: 'elden-parry-king',
    title: 'Flawless Level 1 No-Hit Malenia Parry Run (Chat Bet Won)',
    category: 'Challenge',
    game: 'Action RPG',
    thumbnail: soulsEldenImg,
    duration: '0:45',
    views: '132.8K',
    date: '2 weeks ago',
    streamerChat: [
      { user: 'SoulsVeteran', text: 'Waterfowl dance parried point blank?!', color: '#FFBE0D' },
      { user: 'ChallengerX', text: 'I just lost 50,000 channel points 💀', color: '#ff4d4d' },
      { user: 'BladeMaster', text: 'Sensei never hesitates', color: '#ffa500' },
    ],
    reactions: { fire: 1530, skull: 580, target: 720, goat: 1140 },
    kickClipUrl: 'https://kick.com/sensei-gm7/clips/malenia-no-hit',
    description: 'Buckler parries only with zero armor to claim the 500-sub chat wager.',
  },
  {
    id: 'fifa-90th-minute-bicycle',
    title: '90+4th Min Bicycle Kick Winner in Weekend League Rank 1',
    category: 'Clutch',
    game: 'EA FC 26',
    thumbnail: soccerEsportsImg,
    duration: '0:31',
    views: '97.4K',
    date: '2 weeks ago',
    streamerChat: [
      { user: 'FUT_Champs', text: 'IN THE 94TH MINUTE ARE YOU KIDDING', color: '#FFBE0D' },
      { user: 'GoalMachine', text: 'Controller survived the celebration!', color: '#ff4d4d' },
      { user: 'KickingLive', text: '20-0 undefeated streak secured 🏆', color: '#00d2ff' },
    ],
    reactions: { fire: 890, skull: 210, target: 630, goat: 770 },
    kickClipUrl: 'https://kick.com/sensei-gm7/clips/bicycle-winner',
    description: 'Corner kick volley from outside the 18-yard box to seal the flawless 20-0 run.',
  },
  {
    id: 'setup-fail-moment',
    title: 'The Cat Swiped The Mouse During 1v1 Tourney Matchpoint',
    category: 'Funny',
    game: 'Apex Legends',
    thumbnail: kickBgImg,
    duration: '0:26',
    views: '312.0K',
    date: '3 weeks ago',
    streamerChat: [
      { user: 'CatLover', text: 'CAT TOOK OVER THE AIMBOT 😭💀', color: '#FFBE0D' },
      { user: 'MemeGod', text: 'Top 10 anime betrayals', color: '#ff4d4d' },
      { user: 'StreamClipper', text: 'Going straight to TikTok viral page', color: '#ffa500' },
    ],
    reactions: { fire: 670, skull: 3200, target: 210, goat: 890 },
    kickClipUrl: 'https://kick.com/sensei-gm7/clips/cat-mouse-swipe',
    description: 'Camera reveals the feline mastermind jumping onto the desk right as the enemy jumped.',
  },
];

const bountiesData: Bounty[] = [
  {
    id: 'bounty-1',
    title: 'Apex Legends: 20-Bomb Challenge Without Swapping Shields',
    game: 'Apex Legends',
    reward: '$500 Chat Giveaway',
    status: 'ACTIVE',
    progress: 'Attempt #4 tonight at 2:00 AM UTC',
    rules: 'White Evo shield only. All kills must be confirmed on Kick stream.',
  },
  {
    id: 'bounty-2',
    title: 'Community 1v1 Sniper Gulag: Beat Sensei for 100 Kick Subs',
    game: 'Valorant / CS2',
    reward: '100 Gifted Subs',
    status: 'NEXT STREAM',
    progress: 'Queues open in #gulag Discord channel',
    rules: 'First to 7 kills on Haven C Long / Dust2 mid. Discord screen share required.',
  },
  {
    id: 'bounty-3',
    title: 'GTA RP: Steal Sensei’s Getaway Car During Live Patrol',
    game: 'GTA RP',
    reward: '$250 Cash Bounty',
    status: 'CLAIMED',
    progress: 'Claimed by @GhostRider_RP last Friday',
    rules: 'Clean lockpick escape with no safezone camping.',
  },
];

export const TournamentsSection: React.FC<TournamentsSectionProps> = ({ onToast }) => {
  const { isDark } = useTheme();

  // Active filter tab
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Clutch' | 'Ace' | 'Heist' | 'Funny' | 'Bounties'>('All');
  
  // Featured clip state
  const [activeClip, setActiveClip] = useState<Clip>(clipsData[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playProgress, setPlayProgress] = useState<number>(35);
  
  // Theater modal
  const [modalClip, setModalClip] = useState<Clip | null>(null);

  // Reaction counters state per clip
  const [reactionsState, setReactionsState] = useState<Record<string, { fire: number; skull: number; target: number; goat: number }>>(() => {
    const init: Record<string, { fire: number; skull: number; target: number; goat: number }> = {};
    clipsData.forEach((c) => {
      init[c.id] = { ...c.reactions };
    });
    return init;
  });

  // Particle feedback animation state
  const [floatingParticles, setFloatingParticles] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  // Audio blip feedback
  const playSoundEffect = (type: 'blip' | 'cheer' = 'blip') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'blip') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1020, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch {
      // AudioContext unavailable
    }
  };

  // Simulated video playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1.8;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playSoundEffect('blip');
    setIsPlaying((prev) => !prev);
  };

  const handleReaction = (clipId: string, emojiType: 'fire' | 'skull' | 'target' | 'goat', e: React.MouseEvent) => {
    e.stopPropagation();
    playSoundEffect('cheer');

    // Increment reaction count
    setReactionsState((prev) => ({
      ...prev,
      [clipId]: {
        ...prev[clipId],
        [emojiType]: (prev[clipId]?.[emojiType] || 0) + 1,
      },
    }));

    // Spawn floating particle
    const rect = e.currentTarget.getBoundingClientRect();
    const emojiMap = { fire: '🔥', skull: '💀', target: '🎯', goat: '🐐' };
    const newParticle = {
      id: Date.now() + Math.random(),
      emoji: emojiMap[emojiType],
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
    setFloatingParticles((prev) => [...prev.slice(-8), newParticle]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 900);

    onToast?.(`Sent ${emojiMap[emojiType]} reaction to ${activeClip.game}!`);
  };

  const handleShareClip = (clip: Clip, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playSoundEffect('blip');
    navigator.clipboard?.writeText(clip.kickClipUrl);
    onToast?.(`Copied Kick clip link: "${clip.title.slice(0, 36)}..."`);
  };

  const openTheaterModal = (clip: Clip) => {
    playSoundEffect('blip');
    setModalClip(clip);
  };

  return (
    <section
      id="tournaments"
      className={`py-16 sm:py-24 relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#06080b] text-white border-t border-white/5'
          : 'bg-neutral-50 text-neutral-900 border-t border-neutral-200'
      }`}
    >
      {/* Precision Grid Background & Adaptive Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className={`absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_35%,#000_65%,transparent_100%)] ${
            isDark
              ? 'bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:44px_44px] opacity-75'
              : 'bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:40px_40px] opacity-80'
          }`}
        />
        <div className="absolute -top-24 right-1/4 w-[500px] h-[350px] bg-[#FFBE0D]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[450px] h-[300px] bg-[#00e5ff]/6 rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* Floating particles from reactions */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {floatingParticles.map((p) => (
          <span
            key={p.id}
            className="absolute text-2xl font-bold animate-float-fade"
            style={{ left: `${p.x}px`, top: `${p.y}px` }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <div className="max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Designer Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase mb-3 border backdrop-blur-sm shadow-sm transition-all ${
              isDark
                ? 'bg-neutral-900/90 text-[#FFBE0D] border-[#FFBE0D]/30 shadow-[0_0_12px_rgba(255,190,13,0.15)]'
                : 'bg-white text-[#8C6500] border-orange-300'
            }">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#FFBE0D]" />
              <span>Sensei's Stream Vault</span>
              <span className="opacity-30">•</span>
              <span className={isDark ? 'text-neutral-400 font-normal' : 'text-neutral-500 font-normal'}>
                Live Kick Broadcasts
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-3">
              Viral Clips & Arena Bounties
            </h2>
            <p className={`mt-2 text-sm sm:text-base max-w-2xl font-medium ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Relive the highest APM 1v3 clutches, viral Kick highlights, and active community chat bounties with real-time reaction counters.
            </p>
          </div>

          {/* Designer Filter Tabs */}
          <div className={`p-1.5 rounded-2xl flex items-center gap-1 border backdrop-blur-md self-start md:self-auto overflow-x-auto max-w-full ${
            isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}>
            {(['All', 'Clutch', 'Ace', 'Heist', 'Funny', 'Bounties'] as const).map((tab) => {
              const active = selectedFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    playSoundEffect('blip');
                    setSelectedFilter(tab);
                    if (tab !== 'Bounties' && tab !== 'All') {
                      const match = clipsData.find((c) => c.category === tab);
                      if (match) {
                        setActiveClip(match);
                        setIsPlaying(false);
                        setPlayProgress(0);
                      }
                    } else if (tab === 'All') {
                      setActiveClip(clipsData[0]);
                      setIsPlaying(false);
                      setPlayProgress(0);
                    }
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? isDark
                        ? 'bg-[#FFBE0D] text-black font-bold shadow-[0_0_15px_rgba(255,190,13,0.4)]'
                        : 'bg-[#8C6500] text-white font-bold shadow-md'
                      : isDark
                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {tab === 'Bounties' ? '🎯 Live Bounties' : tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: BOUNTIES ACTIVE VIEW                                  */}
        {/* ============================================================== */}
        {selectedFilter === 'Bounties' ? (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
              isDark
                ? 'bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border-[#FFBE0D]/30 shadow-2xl'
                : 'bg-white border-orange-200 shadow-xl'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-white/10">
                <div>
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#8C6500] dark:text-[#FFBE0D]">
                    COMMUNITY CHALLENGE ARENA
                  </span>
                  <h3 className="text-2xl font-black mt-1">Active Stream Bounties & Wagers</h3>
                  <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Sensei puts real cash and Kick gifted subs on the line during live streams. Chat members can claim rewards!
                  </p>
                </div>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onToast?.('Opening Sensei Dojo Discord community queue...')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#5865F2] hover:bg-[#4752c4] text-white transition-all shadow-md hover:scale-105"
                >
                  <Swords className="w-4 h-4" />
                  <span>Join Bounty Queue in Discord</span>
                </a>
              </div>

              {/* Bounty Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bountiesData.map((b) => (
                  <div
                    key={b.id}
                    className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                      isDark
                        ? 'bg-neutral-900/80 border-neutral-800 hover:border-[#FFBE0D]/50 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)]'
                        : 'bg-neutral-50/90 border-neutral-200 hover:border-orange-300 hover:shadow-lg'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#FFBE0D]/10 text-[#8C6500] dark:text-[#FFBE0D] font-bold">
                          {b.game}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            b.status === 'ACTIVE'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : b.status === 'CLAIMED'
                              ? 'bg-neutral-500/20 text-neutral-400'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold tracking-tight mb-2">
                        {b.title}
                      </h4>
                      <p className={`text-xs mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {b.rules}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-200 dark:border-white/10 mt-auto">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-mono text-neutral-400">Prize Pool</div>
                          <div className="text-lg font-black text-[#8C6500] dark:text-[#FFBE0D]">{b.reward}</div>
                        </div>
                        <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {b.progress}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW 2: MASTER FEATURED THEATER + VIRAL CLIPS GALLERY          */
          /* ============================================================== */
          <div className="space-y-8">
            
            {/* FEATURED HERO PLAYER CARD (Designer Craft) */}
            <div
              className={`rounded-3xl border overflow-hidden transition-all duration-300 relative ${
                isDark
                  ? 'bg-neutral-900/90 border-[#FFBE0D]/30 shadow-2xl shadow-black/80'
                  : 'bg-white border-neutral-300 shadow-xl'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Simulated High-Res Video Screen (Left 7.5 Cols) */}
                <div
                  className="lg:col-span-8 relative aspect-video bg-black overflow-hidden group cursor-pointer"
                  onClick={handleTogglePlay}
                >
                  <img
                    src={activeClip.thumbnail}
                    alt={activeClip.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isPlaying ? 'scale-105 brightness-95' : 'group-hover:scale-102 brightness-90'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Video Overlay Pills */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-mono font-bold text-[#FFBE0D] border border-[#FFBE0D]/30">
                        <KickIcon className="w-3 h-3 text-[#FFBE0D]" />
                        <span>KICK VERIFIED CLIP</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/80 border border-white/10">
                        1080p60 HDR
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSoundEffect('blip');
                        setIsMuted(!isMuted);
                      }}
                      className="p-2 rounded-full bg-black/70 hover:bg-black text-white pointer-events-auto backdrop-blur-md border border-white/10 transition-transform active:scale-95"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FFBE0D]" />}
                    </button>
                  </div>

                  {/* Centered Large Play/Pause Toggle Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                        isPlaying
                          ? 'bg-black/40 scale-75 opacity-0 group-hover:opacity-100'
                          : 'bg-[#FFBE0D] text-black shadow-[0_0_30px_rgba(255,190,13,0.6)] scale-100 group-hover:scale-110'
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-white fill-white" />
                      ) : (
                        <Play className="w-8 h-8 fill-black translate-x-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Video Bottom Scrub Bar & Playback HUD */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/95 to-transparent">
                    {/* Scrub line */}
                    <div className="w-full h-1.5 bg-white/20 rounded-full mb-3 overflow-hidden cursor-pointer">
                      <div
                        className="h-full bg-[#FFBE0D] transition-all duration-200"
                        style={{ width: `${playProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-white/90">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 font-bold">
                          {isPlaying && (
                            <span className="flex gap-0.5 items-end h-3">
                              <span className="w-0.5 h-3 bg-[#FFBE0D] animate-pulse" />
                              <span className="w-0.5 h-2 bg-[#FFBE0D] animate-pulse delay-75" />
                              <span className="w-0.5 h-3.5 bg-[#FFBE0D] animate-pulse delay-150" />
                            </span>
                          )}
                          {isPlaying ? 'PLAYING PREVIEW' : 'CLICK TO PREVIEW'}
                        </span>
                        <span className="text-white/50">•</span>
                        <span>{activeClip.duration}</span>
                        <span className="text-white/50">•</span>
                        <span className="flex items-center gap-1 text-neutral-300">
                          <Eye className="w-3.5 h-3.5" />
                          {activeClip.views}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openTheaterModal(activeClip);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white pointer-events-auto transition-colors"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Theater Mode</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Metadata & Real-Time Chat Replay (Right 4.5 Cols) */}
                <div className={`lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between ${
                  isDark ? 'bg-neutral-900/60' : 'bg-neutral-50/70'
                }`}>
                  <div>
                    {/* Game & Category Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#FFBE0D]/15 text-[#8C6500] dark:text-[#FFBE0D] uppercase">
                        {activeClip.game}
                      </span>
                      <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {activeClip.date}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 leading-snug">
                      {activeClip.title}
                    </h3>
                    <p className={`text-xs leading-relaxed mb-5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {activeClip.description}
                    </p>

                    {/* Chat Highlights Replay Box */}
                    <div className={`p-3.5 rounded-2xl border mb-5 ${
                      isDark ? 'bg-black/40 border-neutral-800' : 'bg-white border-neutral-200'
                    }`}>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-neutral-400 mb-2">
                        <MessageSquare className="w-3 h-3 text-[#FFBE0D]" />
                        <span>Live Kick Chat Replay</span>
                      </div>
                      <div className="space-y-2">
                        {activeClip.streamerChat.slice(0, 3).map((chat, idx) => (
                          <div key={idx} className="text-xs flex items-baseline gap-2">
                            <span
                              className="font-bold text-[11px] shrink-0 font-mono"
                              style={{ color: chat.color || '#FFBE0D' }}
                            >
                              {chat.user}:
                            </span>
                            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
                              {chat.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reaction Bar & Share Button */}
                  <div>
                    <div className="text-[10px] font-mono uppercase font-bold text-neutral-400 mb-2">
                      Live Reactions
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 mb-4">
                      {(['fire', 'skull', 'target', 'goat'] as const).map((rKey) => {
                        const icons = { fire: '🔥', skull: '💀', target: '🎯', goat: '🐐' };
                        const count = reactionsState[activeClip.id]?.[rKey] || 0;
                        return (
                          <button
                            key={rKey}
                            type="button"
                            onClick={(e) => handleReaction(activeClip.id, rKey, e)}
                            className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center border transition-all duration-200 cursor-pointer active:scale-95 ${
                              isDark
                                ? 'bg-neutral-800/80 hover:bg-neutral-700 border-neutral-700 hover:border-[#FFBE0D]/60'
                                : 'bg-white hover:bg-neutral-100 border-neutral-200 hover:border-orange-300 shadow-sm'
                            }`}
                          >
                            <span className="text-base select-none">{icons[rKey]}</span>
                            <span className="text-[10px] font-mono font-bold mt-0.5 text-neutral-400">
                              {count.toLocaleString()}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={activeClip.kickClipUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onToast?.(`Opening ${activeClip.title} on Kick...`)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FFBE0D] hover:bg-[#E5A800] text-black transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <KickIcon className="w-3.5 h-3.5 fill-black" />
                        <span>Watch on Kick</span>
                      </a>
                      <button
                        type="button"
                        onClick={(e) => handleShareClip(activeClip, e)}
                        title="Copy clip link"
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isDark
                            ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white'
                            : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-900 shadow-sm'
                        }`}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* THEATER MODE FULLSCREEN MODAL                                  */}
        {/* ============================================================== */}
        {modalClip && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={() => setModalClip(null)}
          >
            <div
              className={`w-full max-w-4xl rounded-3xl overflow-hidden border shadow-2xl relative ${
                isDark ? 'bg-[#0b0e14] border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setModalClip(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Theater Video Preview */}
              <div className="aspect-video relative bg-black">
                <img
                  src={modalClip.thumbnail}
                  alt={modalClip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <a
                    href={modalClip.kickClipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#FFBE0D] hover:bg-[#E5A800] text-black font-black text-sm uppercase tracking-wider shadow-2xl transition-all hover:scale-105"
                  >
                    <KickIcon className="w-5 h-5 fill-black" />
                    <span>Watch Full Clip on Kick</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                  </a>
                </div>
              </div>

              {/* Modal Details Footer */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#FFBE0D]/15 text-[#8C6500] dark:text-[#FFBE0D] uppercase">
                      {modalClip.game} • {modalClip.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-2">{modalClip.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono text-neutral-400">Total Views</div>
                    <div className="text-lg font-black text-[#FFBE0D]">{modalClip.views}</div>
                  </div>
                </div>

                <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {modalClip.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    {(['fire', 'skull', 'target', 'goat'] as const).map((rKey) => {
                      const icons = { fire: '🔥', skull: '💀', target: '🎯', goat: '🐐' };
                      const count = reactionsState[modalClip.id]?.[rKey] || 0;
                      return (
                        <button
                          key={rKey}
                          type="button"
                          onClick={(e) => handleReaction(modalClip.id, rKey, e)}
                          className="px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all bg-black/10 dark:bg-white/10"
                        >
                          <span>{icons[rKey]}</span>
                          <span>{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleShareClip(modalClip, e)}
                      className="px-4 py-2 rounded-xl text-xs font-bold font-mono border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Clip Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalClip(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold font-mono bg-neutral-200 dark:bg-neutral-800 hover:opacity-80 transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
