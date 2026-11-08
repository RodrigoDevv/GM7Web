import React, { useState } from 'react';
import { 
  Crown, 
  Heart, 
  Sparkles, 
  Award, 
  ExternalLink, 
  ShieldCheck, 
  Trophy, 
  Flame, 
  Star, 
  Gift, 
  Check, 
  Copy,
  ChevronRight,
  MessageSquareHeart,
  TrendingUp,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { KickIcon } from './BrandIcons';

interface SupportersSectionProps {
  onToast?: (msg: string) => void;
}

interface Supporter {
  id: string;
  name: string;
  kickHandle: string;
  avatar: string;
  tier: 'Diamond Whale' | 'Gold Patron' | 'Silver Legend' | 'OG Founder';
  giftedSubs: number;
  totalDonated: string;
  badge: string;
  badgeColor: string;
  rank: number;
  quote: string;
  isTopPodium?: boolean;
}

const supportersData: Supporter[] = [
  {
    id: 'sup-1',
    name: 'GhostApex',
    kickHandle: '@GhostApex_99',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80',
    tier: 'Diamond Whale',
    giftedSubs: 620,
    totalDonated: '$3,100',
    badge: '👑 All-Time Champion',
    badgeColor: 'bg-[#FFB800] text-black',
    rank: 1,
    quote: 'Sensei’s late night ranked grinds are unmatched. GM7 to the moon!',
    isTopPodium: true,
  },
  {
    id: 'sup-2',
    name: 'ValkyrieQueen',
    kickHandle: '@ValkQueen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tier: 'Diamond Whale',
    giftedSubs: 480,
    totalDonated: '$2,400',
    badge: '🥈 Top Gifter',
    badgeColor: 'bg-neutral-200 text-neutral-900',
    rank: 2,
    quote: 'Proud to sponsor the Friday night prize pools for the community.',
    isTopPodium: true,
  },
  {
    id: 'sup-3',
    name: 'KuroSniper',
    kickHandle: '@Kuro_FPS',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    tier: 'Diamond Whale',
    giftedSubs: 350,
    totalDonated: '$1,750',
    badge: '🥉 Bronze Legend',
    badgeColor: 'bg-amber-700 text-white',
    rank: 3,
    quote: 'Always hype in chat. GM7 squad community runs deep!',
    isTopPodium: true,
  },
  {
    id: 'sup-4',
    name: 'CyberRonin',
    kickHandle: '@CyberRoninX',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    tier: 'Gold Patron',
    giftedSubs: 210,
    totalDonated: '$1,050',
    badge: '⭐ Gold Patron',
    badgeColor: 'bg-amber-400/20 text-amber-400 border border-amber-400/30',
    rank: 4,
    quote: 'From day 1 on Kick. Best vibes and cleanest movement in Apex.',
  },
  {
    id: 'sup-5',
    name: 'NeonSakura',
    kickHandle: '@SakuraNeon',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    tier: 'Gold Patron',
    giftedSubs: 185,
    totalDonated: '$925',
    badge: '⭐ Gold Patron',
    badgeColor: 'bg-amber-400/20 text-amber-400 border border-amber-400/30',
    rank: 5,
    quote: 'Love the Friday customs and community voice comms.',
  },
  {
    id: 'sup-6',
    name: 'ApexVortex',
    kickHandle: '@VortexApex',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    tier: 'Gold Patron',
    giftedSubs: 160,
    totalDonated: '$800',
    badge: '⭐ Gold Patron',
    badgeColor: 'bg-amber-400/20 text-amber-400 border border-amber-400/30',
    rank: 6,
    quote: 'Always gifting subs when Sensei hits the 20-bomb!',
  },
  {
    id: 'sup-7',
    name: 'ZeroPing',
    kickHandle: '@ZeroPingOfficial',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    tier: 'Silver Legend',
    giftedSubs: 125,
    totalDonated: '$625',
    badge: '🛡️ Silver Legend',
    badgeColor: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
    rank: 7,
    quote: 'Hardware setup inspired by Sensei’s battle station!',
  },
  {
    id: 'sup-8',
    name: 'AuraBlaze',
    kickHandle: '@AuraBlaze',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    tier: 'Silver Legend',
    giftedSubs: 110,
    totalDonated: '$550',
    badge: '🛡️ Silver Legend',
    badgeColor: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
    rank: 8,
    quote: 'Daily 5 PM UTC viewer. GM7 is the only stream I sub to on Kick.',
  },
  {
    id: 'sup-9',
    name: 'EchoPhantom',
    kickHandle: '@Echo_Phantom',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    tier: 'OG Founder',
    giftedSubs: 95,
    totalDonated: '$475',
    badge: '🔥 OG Founder',
    badgeColor: 'bg-[#FFBE0D]/15 text-[#FFBE0D] border border-[#FFBE0D]/30',
    rank: 9,
    quote: 'Been here since stream #1. Sensei always shows love to the squad.',
  },
  {
    id: 'sup-10',
    name: 'KiraNova',
    kickHandle: '@KiraNova',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    tier: 'OG Founder',
    giftedSubs: 90,
    totalDonated: '$450',
    badge: '🔥 OG Founder',
    badgeColor: 'bg-[#FFBE0D]/15 text-[#FFBE0D] border border-[#FFBE0D]/30',
    rank: 10,
    quote: 'Tournament prize pool sponsor and permanent VIP.',
  },
  {
    id: 'sup-11',
    name: 'ShadowBlade',
    kickHandle: '@ShadowBlade_7',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    tier: 'Silver Legend',
    giftedSubs: 85,
    totalDonated: '$425',
    badge: '🛡️ Silver Legend',
    badgeColor: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
    rank: 11,
    quote: 'Love supporting the tournaments and Discord squad.',
  },
  {
    id: 'sup-12',
    name: 'LunarEcho',
    kickHandle: '@LunarEcho',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    tier: 'OG Founder',
    giftedSubs: 80,
    totalDonated: '$400',
    badge: '🔥 OG Founder',
    badgeColor: 'bg-[#FFBE0D]/15 text-[#FFBE0D] border border-[#FFBE0D]/30',
    rank: 12,
    quote: 'Greatest gaming community on Kick. GM7 forever!',
  },
];

export const SupportersSection: React.FC<SupportersSectionProps> = ({ onToast }) => {
  const { isDark } = useTheme();
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [cheeredIds, setCheeredIds] = useState<Record<string, number>>({});
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [supportAmount, setSupportAmount] = useState<string>('50');

  const filteredSupporters = selectedTier === 'all'
    ? supportersData
    : supportersData.filter((s) => s.tier.toLowerCase().includes(selectedTier.toLowerCase()));

  const topThree = supportersData.slice(0, 3);
  const remainingSupporters = filteredSupporters.filter((s) => !topThree.includes(s) || selectedTier !== 'all');

  const handleCheer = (supporter: Supporter, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = (cheeredIds[supporter.id] || 0) + 1;
    setCheeredIds({ ...cheeredIds, [supporter.id]: newCount });
    onToast?.(`❤️ You cheered for ${supporter.name}! (${newCount} cheers sent)`);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onToast?.(`🎉 Thank you! Redirecting to Kick to gift ${supportAmount} Subs to Sensei's channel...`);
    setTimeout(() => {
      setShowSupportModal(false);
      window.open('https://kick.com/snnsei', '_blank');
    }, 1200);
  };

  return (
    <section
      id="supporters"
      className={`py-16 sm:py-24 relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#07080a] text-white border-t border-white/5'
          : 'bg-white text-neutral-900 border-t border-neutral-200'
      }`}
    >
      {/* Precision Background Glow & Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className={`absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_65%,transparent_100%)] ${
            isDark
              ? 'bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:44px_44px] opacity-70'
              : 'bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:40px_40px] opacity-80'
          }`}
        />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[340px] bg-[#FFB800]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[480px] h-[320px] bg-[#FFBE0D]/8 rounded-full blur-[130px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16 text-center">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider mb-3 shadow-xs ${
              isDark
                ? 'bg-neutral-900 border border-neutral-700 text-[#FFB800]'
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>VIP PATRONS & COMMUNITY CHAMPIONS</span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 ${
              isDark ? 'text-white' : 'text-neutral-950'
            }`}
          >
            Big Supporters Wall
          </h2>

          <p
            className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Honoring the legendary community members who power Sensei's broadcasts, sponsor tournament cash prizes, and gift hundreds of subs on Kick.
          </p>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 max-w-4xl mx-auto">
            <div
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200 shadow-xs'
              }`}
            >
              <div className="text-xl sm:text-2xl font-black text-[#FFBE0D]">4,850+</div>
              <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Gifted Subs
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200 shadow-xs'
              }`}
            >
              <div className="text-xl sm:text-2xl font-black text-[#FFB800]">$24,000+</div>
              <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Prize Pools Funded
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200 shadow-xs'
              }`}
            >
              <div className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-neutral-950'}`}>142</div>
              <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                VIP Discord Badges
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200 shadow-xs'
              }`}
            >
              <div className="text-xl sm:text-2xl font-black text-orange-500">Tier 1 Whale</div>
              <div className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                GhostApex (620 Subs)
              </div>
            </div>
          </div>
        </div>

        {/* TOP 3 PODIUM DISPLAY (Large Circular Image Avatars with Rings) */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FFB800]">
              HALL OF FAME PODIUM
            </span>
            <h3 className={`text-xl sm:text-2xl font-black mt-0.5 ${isDark ? 'text-white' : 'text-neutral-950'}`}>
              Top 3 All-Time Gifting Legends
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
            
            {/* Rank 2 (Silver) */}
            <div
              className={`order-2 md:order-1 p-6 rounded-3xl border text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-xl ${
                isDark
                  ? 'bg-neutral-900/90 border-neutral-800 shadow-[0_12px_32px_rgba(0,0,0,0.5)]'
                  : 'bg-white border-neutral-200 shadow-lg'
              }`}
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
              
              <div className="relative inline-block mx-auto mb-4">
                {/* Circular Image Avatar */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-neutral-400 via-neutral-100 to-neutral-400 shadow-xl mx-auto relative">
                  <img
                    src={topThree[1].avatar}
                    alt={topThree[1].name}
                    className="w-full h-full rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-2 right-1/2 translate-x-1/2 px-2.5 py-0.5 rounded-full bg-neutral-300 text-neutral-900 text-xs font-mono font-black shadow-md border border-white">
                    #2
                  </div>
                </div>
              </div>

              {/* Name */}
              <h4 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                {topThree[1].name}
              </h4>
              <p className={`text-xs font-mono font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {topThree[1].kickHandle}
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-neutral-200 text-neutral-900">
                  {topThree[1].giftedSubs} Gifted Subs
                </span>
                <span className="text-xs font-bold text-[#FFBE0D] font-mono">
                  {topThree[1].totalDonated}
                </span>
              </div>

              <p className={`mt-3 text-xs italic line-clamp-2 px-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                "{topThree[1].quote}"
              </p>

              <button
                type="button"
                onClick={(e) => handleCheer(topThree[1], e)}
                className={`mt-4 w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white hover:border-[#FFBE0D]'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:text-black hover:border-black'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Cheer ({cheeredIds[topThree[1].id] || 84})</span>
              </button>
            </div>

            {/* Rank 1 (Gold / Champion - Elevated) */}
            <div
              className={`order-1 md:order-2 p-7 rounded-3xl border text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.03] shadow-2xl md:-translate-y-4 ${
                isDark
                  ? 'bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-950 border-[#FFB800]/50 shadow-[0_20px_45px_rgba(255,184,0,0.25)]'
                  : 'bg-gradient-to-b from-amber-50/50 via-white to-white border-amber-300 shadow-xl'
              }`}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FFB800] via-[#FFBE0D] to-[#FFB800]" />

              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Crown className="w-5 h-5 text-[#FFB800] animate-bounce" />
                <span className="text-xs font-mono font-black uppercase text-[#FFB800] tracking-wider">
                  ALL-TIME #1 PATRON
                </span>
              </div>
              
              <div className="relative inline-block mx-auto mb-4">
                {/* Large Circular Image Avatar */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-tr from-[#FFB800] via-[#FFBE0D] to-[#FFB800] shadow-[0_0_28px_rgba(255,184,0,0.5)] mx-auto relative">
                  <img
                    src={topThree[0].avatar}
                    alt={topThree[0].name}
                    className="w-full h-full rounded-full object-cover ring-2 ring-black"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-2.5 right-1/2 translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FFB800] text-black text-xs font-mono font-black shadow-lg border-2 border-white flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-black" />
                    <span>#1 CHAMPION</span>
                  </div>
                </div>
              </div>

              {/* Name */}
              <h4 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                {topThree[0].name}
              </h4>
              <p className={`text-xs font-mono font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {topThree[0].kickHandle}
              </p>

              <div className="mt-3.5 flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-[#FFBE0D] text-black shadow-sm">
                  {topThree[0].giftedSubs} Gifted Subs
                </span>
                <span className="text-sm font-black text-[#FFB800] font-mono">
                  {topThree[0].totalDonated}
                </span>
              </div>

              <p className={`mt-3 text-xs italic px-3 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                "{topThree[0].quote}"
              </p>

              <button
                type="button"
                onClick={(e) => handleCheer(topThree[0], e)}
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#FFB800] hover:bg-[#e5a600] text-black text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-black" />
                <span>Cheer Champion ({cheeredIds[topThree[0].id] || 156})</span>
              </button>
            </div>

            {/* Rank 3 (Bronze) */}
            <div
              className={`order-3 p-6 rounded-3xl border text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-xl ${
                isDark
                  ? 'bg-neutral-900/90 border-neutral-800 shadow-[0_12px_32px_rgba(0,0,0,0.5)]'
                  : 'bg-white border-neutral-200 shadow-lg'
              }`}
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
              
              <div className="relative inline-block mx-auto mb-4">
                {/* Circular Image Avatar */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-700 via-amber-500 to-amber-700 shadow-xl mx-auto relative">
                  <img
                    src={topThree[2].avatar}
                    alt={topThree[2].name}
                    className="w-full h-full rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-2 right-1/2 translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-700 text-white text-xs font-mono font-black shadow-md border border-white">
                    #3
                  </div>
                </div>
              </div>

              {/* Name */}
              <h4 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                {topThree[2].name}
              </h4>
              <p className={`text-xs font-mono font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {topThree[2].kickHandle}
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-700 text-white">
                  {topThree[2].giftedSubs} Gifted Subs
                </span>
                <span className="text-xs font-bold text-[#FFBE0D] font-mono">
                  {topThree[2].totalDonated}
                </span>
              </div>

              <p className={`mt-3 text-xs italic line-clamp-2 px-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                "{topThree[2].quote}"
              </p>

              <button
                type="button"
                onClick={(e) => handleCheer(topThree[2], e)}
                className={`mt-4 w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white hover:border-[#FFBE0D]'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:text-black hover:border-black'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Cheer ({cheeredIds[topThree[2].id] || 62})</span>
              </button>
            </div>

          </div>
        </div>

        {/* Filter Pills & Become a Supporter CTA Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl border flex-wrap">
            {[
              { id: 'all', label: 'All VIP Supporters' },
              { id: 'diamond', label: 'Diamond Whales' },
              { id: 'gold', label: 'Gold Patrons' },
              { id: 'founder', label: 'OG Founders' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedTier(tab.id);
                  onToast?.(`Showing ${tab.label}`);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedTier === tab.id
                    ? isDark
                      ? 'bg-[#FFBE0D] text-black shadow-xs'
                      : 'bg-neutral-900 text-white shadow-xs'
                    : isDark
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFBE0D] hover:bg-[#E5A800] text-black text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 cursor-pointer shrink-0"
          >
            <Gift className="w-4 h-4" />
            <span>Join Big Supporters</span>
          </button>
        </div>

        {/* FULL GRID OF SUPPORTERS: CIRCULAR IMAGE AVATARS & NAMES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {remainingSupporters.map((supporter) => {
            const cheerCount = (cheeredIds[supporter.id] || 0) + (supporter.rank * 7);

            return (
              <div
                key={supporter.id}
                className={`p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group ${
                  isDark
                    ? 'bg-neutral-900/80 border-neutral-800 hover:border-[#FFBE0D]/50 shadow-md'
                    : 'bg-white border-neutral-200 hover:border-[#FFBE0D] shadow-sm hover:shadow-lg'
                }`}
              >
                <div>
                  {/* Top: Rank badge and tier */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                        isDark ? 'bg-neutral-950 border border-neutral-800 text-neutral-400' : 'bg-neutral-100 border border-neutral-200 text-neutral-600'
                      }`}
                    >
                      #{supporter.rank} RANK
                    </span>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${supporter.badgeColor}`}>
                      {supporter.badge}
                    </span>
                  </div>

                  {/* Center: Prominent Circular Image Avatar & Name */}
                  <div className="flex flex-col items-center text-center mb-4">
                    {/* Circle Image Avatar */}
                    <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-[#FFBE0D] via-neutral-700 to-[#FFB800] shadow-lg">
                        <img
                          src={supporter.avatar}
                          alt={supporter.name}
                          className="w-full h-full rounded-full object-cover ring-2 ring-neutral-900"
                          loading="lazy"
                        />
                      </div>
                      <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-[#FFBE0D] border-2 border-neutral-950" title="Online VIP Supporter" />
                    </div>

                    {/* Supporter Name */}
                    <h4 className={`text-lg font-black tracking-tight group-hover:text-[#FFBE0D] transition-colors ${
                      isDark ? 'text-white' : 'text-neutral-950'
                    }`}>
                      {supporter.name}
                    </h4>

                    <span className={`text-xs font-mono font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {supporter.kickHandle}
                    </span>
                  </div>

                  {/* Stats Pill */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono mb-3 ${
                    isDark ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <div>
                      <span className={`text-[10px] block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Gifted Subs</span>
                      <strong className="text-[#FFBE0D] font-black">{supporter.giftedSubs} Subs</strong>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Total Contributed</span>
                      <strong className="text-[#FFB800] font-black">{supporter.totalDonated}</strong>
                    </div>
                  </div>

                  {/* Supporter Quote */}
                  <p className={`text-xs italic line-clamp-2 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    "{supporter.quote}"
                  </p>
                </div>

                {/* Footer action: Cheer button */}
                <div className="mt-4 pt-3 border-t border-neutral-800/40 flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {supporter.tier}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleCheer(supporter, e)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                      isDark
                        ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white hover:border-[#FFBE0D]'
                        : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:text-black hover:border-neutral-400'
                    }`}
                  >
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>{cheerCount}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner: How to become a Big Supporter */}
        <div
          className={`mt-12 p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${
            isDark
              ? 'bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border-neutral-800'
              : 'bg-gradient-to-r from-orange-50/40 via-white to-amber-50/40 border-neutral-200'
          }`}
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FFBE0D]/20 text-[#FFBE0D] flex items-center justify-center shrink-0 hidden sm:flex">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                Want your name & circular avatar on the Big Supporters Wall?
              </h3>
              <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Gift 50+ subs on Kick, sponsor a community tournament cup, or support the squad on Discord. Top 3 are honored on the podium!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[#FFBE0D] hover:bg-[#E5A800] text-black text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
            >
              <KickIcon className="w-4 h-4" />
              <span>Gift Subs on Kick</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Become a Supporter Modal */}
      {showSupportModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowSupportModal(false)}
        >
          <div
            className={`border rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative ${
              isDark ? 'bg-neutral-900 border-neutral-750 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FFB800] block mb-1">
                  OFFICIAL VIP PERK
                </span>
                <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                  Join the Big Supporters
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                  isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white' : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSupportSubmit} className="py-4 space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Select Gift Subs Tier
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['25', '50', '100'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSupportAmount(amt)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        supportAmount === amt
                          ? isDark
                            ? 'bg-[#FFBE0D] text-black border-[#FFBE0D] shadow-md font-black'
                            : 'bg-neutral-900 text-white border-neutral-900 shadow-md font-black'
                          : isDark
                          ? 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          : 'bg-neutral-50 border-neutral-300 text-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="text-base font-black">{amt} Subs</div>
                      <div className="text-[10px] opacity-80">${Number(amt) * 5}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
              }`}>
                <div className="font-bold text-[#FFB800] flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>VIP Perks Included:</span>
                </div>
                <ul className="space-y-1 text-[11px] list-disc list-inside text-neutral-400">
                  <li>Your image circle avatar & name featured on this wall</li>
                  <li>Golden VIP role in official GM7 Discord</li>
                  <li>Priority squad entry in Friday Cash Cups</li>
                  <li>Direct shoutout on Kick live broadcast</li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    isDark ? 'border-neutral-800 text-neutral-400 hover:text-white' : 'border-neutral-300 text-neutral-600 hover:text-black'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FFBE0D] hover:bg-[#E5A800] text-black text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <KickIcon className="w-3.5 h-3.5" />
                  <span>Proceed on Kick.com</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
