import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Radio, 
  Share2, 
  Users, 
  ShieldCheck, 
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Bell,
  Film,
  Calendar,
  Layers,
  Power
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { OptionalThirdPartyFrame } from '../context/PrivacyConsentContext';
import senseiImage from '../assets/images/chibi-sensei.png';
import { KickIcon } from './BrandIcons';

interface LiveKickSectionProps {
  onToast?: (msg: string) => void;
  defaultChannel?: string;
  initialOffline?: boolean;
}

interface HighlightVOD {
  id: string;
  title: string;
  game: string;
  duration: string;
  views: string;
  date: string;
  url: string;
}

const recentHighlights: HighlightVOD[] = [
  {
    id: 'vod-1',
    title: 'Ranked Apex Predator Clutch — 24 Kill Squad Wipe',
    game: 'Apex Legends',
    duration: '3h 42m',
    views: '14.2K',
    date: 'Yesterday',
    url: 'https://kick.com/snnsei/videos',
  },
  {
    id: 'vod-2',
    title: 'Friday Community Cup #13 Grand Finals Casting',
    game: 'Apex Legends',
    duration: '4h 15m',
    views: '22.8K',
    date: '3 days ago',
    url: 'https://kick.com/snnsei/videos',
  },
  {
    id: 'vod-3',
    title: 'Radiant Lobby Dominance & Community 5v5 Customs',
    game: 'Valorant',
    duration: '2h 50m',
    views: '9.6K',
    date: '5 days ago',
    url: 'https://kick.com/snnsei/videos',
  },
];

export const LiveKickSection: React.FC<LiveKickSectionProps> = ({ 
  onToast, 
  defaultChannel = 'snnsei',
  initialOffline = false
}) => {
  const { isDark } = useTheme();
  const [channel, setChannel] = useState<string>(defaultChannel);
  const [inputChannel, setInputChannel] = useState<string>(defaultChannel);
  const [isLive, setIsLive] = useState<boolean>(!initialOffline);
  const [forcePlayerWhenOffline, setForcePlayerWhenOffline] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(true);
  const [cinemaMode, setCinemaMode] = useState<boolean>(false);
  const [autoplay, setAutoplay] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(true);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(15480); // ~4h 18m
  const [viewerCount, setViewerCount] = useState<number>(3248);

  // Countdown timer to next stream (Tonight @ 5:00 PM UTC)
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 28, seconds: 45 });

  // Tickers
  useEffect(() => {
    const timer = setInterval(() => {
      if (isLive) {
        setUptimeSeconds((prev) => prev + 1);
      } else {
        setCountdown((prev) => {
          let { hours, minutes, seconds } = prev;
          if (seconds > 0) {
            seconds--;
          } else {
            seconds = 59;
            if (minutes > 0) {
              minutes--;
            } else {
              minutes = 59;
              if (hours > 0) hours--;
              else hours = 12; // loop back
            }
          }
          return { hours, minutes, seconds };
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isLive]);

  // Format uptime HH:MM:SS
  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleStatus = (newLiveState: boolean) => {
    setIsLive(newLiveState);
    if (newLiveState) {
      setReloadKey((k) => k + 1);
      onToast?.(`Stream status set to: 🔴 LIVE BROADCAST (@${channel})`);
    } else {
      onToast?.(`Stream status set to: ⚪ OFFLINE (Standby Mode)`);
    }
  };

  const handleRefresh = () => {
    setReloadKey((prev) => prev + 1);
    onToast?.(`Refreshing Kick feed for @${channel}...`);
  };

  const handleChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputChannel.trim().toLowerCase().replace('@', '');
    if (!clean) return;
    setChannel(clean);
    setReloadKey((prev) => prev + 1);
    onToast?.(`Switched live stream to Kick channel: @${clean}`);
  };

  const handleShare = () => {
    const url = `https://kick.com/${channel}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      onToast?.(`Copied Kick channel link: ${url}`);
    } else {
      onToast?.(`Channel link: ${url}`);
    }
  };

  const presetChannels = [
    { name: 'GM7 (Sensei)', tag: 'gm7' },
    { name: 'Apex Legends Pro', tag: 'apexlegends' },
    { name: 'xQc', tag: 'xqc' },
  ];

  return (
    <section
      id="live"
      className={`py-12 sm:py-20 relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#07080a] text-white border-t border-white/5'
          : 'bg-white text-neutral-900 border-t border-neutral-200'
      }`}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className={`absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_60%,transparent_100%)] ${
            isDark
              ? 'bg-[linear-gradient(to_right,#FFBE0D0d_1px,transparent_1px),linear-gradient(to_bottom,#FFBE0D0d_1px,transparent_1px)] bg-[size:44px_44px] opacity-70'
              : 'bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:40px_40px] opacity-80'
          }`}
        />
        <div className={`absolute top-10 right-1/4 w-[480px] h-[340px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
          isLive ? 'bg-[#FFBE0D]/12' : 'bg-[#FFB800]/10'
        }`} />
        <div className="absolute bottom-10 left-1/4 w-[420px] h-[300px] bg-neutral-800/10 rounded-full blur-[130px] pointer-events-none" />
      </div>

      <div className={`${cinemaMode ? 'max-w-[96vw]' : 'max-w-7xl 2xl:max-w-[90rem]'} mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-300`}>
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider shadow-xs ${
                  isLive
                    ? isDark
                      ? 'bg-neutral-900 border border-neutral-700 text-[#FFBE0D]'
                      : 'bg-[#FFBE0D]/15 border border-[#8C6500]/30 text-[#8C6500]'
                    : isDark
                    ? 'bg-neutral-900 border border-neutral-700 text-neutral-400'
                    : 'bg-neutral-100 border border-neutral-300 text-neutral-600'
                }`}
              >
                {isLive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#FFBE0D] animate-ping" />
                    <KickIcon className="w-3.5 h-3.5 text-[#FFBE0D]" />
                    <span className="font-bold">OFFICIAL LIVE KICK BROADCAST</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    <KickIcon className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-bold">KICK CHANNEL // STANDBY OFFLINE</span>
                  </>
                )}
              </div>

              {/* LIVE / OFFLINE Mode Switcher */}
              <div
                className={`inline-flex p-0.5 rounded-full border text-xs font-mono ${
                  isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                }`}
                title="Switch between Live stream player and Offline standby screen"
              >
                <button
                  type="button"
                  onClick={() => handleToggleStatus(true)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    isLive
                      ? 'bg-[#FFBE0D] text-black shadow-xs'
                      : isDark
                      ? 'text-neutral-400 hover:text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-black animate-pulse' : 'bg-neutral-400'}`} />
                  <span>Live</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(false)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    !isLive
                      ? isDark
                        ? 'bg-neutral-800 text-amber-300 shadow-xs'
                        : 'bg-white text-neutral-900 shadow-xs'
                      : isDark
                      ? 'text-neutral-400 hover:text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${!isLive ? 'bg-amber-400' : 'bg-neutral-400'}`} />
                  <span>Offline</span>
                </button>
              </div>
            </div>

            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-neutral-950'
              }`}
            >
              {isLive ? 'Watch Sensei Live' : 'Sensei Kick Broadcast'}
            </h2>

            <p
              className={`mt-2 text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              {isLive
                ? 'Tune in to daily high-octane ranked scrims, Friday community tournaments, and live chat interaction streaming direct from Kick.com.'
                : 'Sensei is currently offline. Stream goes live daily at 5:00 PM UTC. Catch recent VODs, highlight clips, or set a Discord go-live reminder.'}
            </p>
          </div>

          {/* Quick Channel Presets and Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-xs font-mono font-bold mr-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Channel:
              </span>
              {presetChannels.map((p) => (
                <button
                  key={p.tag}
                  type="button"
                  onClick={() => {
                    setChannel(p.tag);
                    setInputChannel(p.tag);
                    setReloadKey((prev) => prev + 1);
                    onToast?.(`Switched to @${p.tag}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                    channel === p.tag
                      ? isDark
                        ? 'bg-[#FFBE0D] text-black border-[#FFBE0D] shadow-[0_0_12px_rgba(255,190,13,0.4)]'
                        : 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : isDark
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:text-black'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Custom Channel Input */}
            <form onSubmit={handleChannelSubmit} className="flex items-center gap-1.5 w-full sm:w-auto">
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  @
                </span>
                <input
                  type="text"
                  value={inputChannel}
                  onChange={(e) => setInputChannel(e.target.value)}
                  placeholder="Kick username"
                  className={`pl-7 pr-3 py-1.5 rounded-xl text-xs font-mono border focus:outline-none w-36 sm:w-40 transition-colors ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-[#FFBE0D]'
                      : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-[#8C6500]'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#FFBE0D] hover:bg-[#E5A800] text-black text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                Load
              </button>
            </form>
          </div>
        </div>

        {/* Stream Status Banner (Dynamic for Live / Offline) */}
        <div
          className={`p-3.5 sm:p-4 rounded-2xl border mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg transition-all ${
            isDark
              ? 'bg-neutral-900/90 border-neutral-800 text-white'
              : 'bg-white border-neutral-200 text-neutral-900'
          }`}
        >
          {/* Left: Stream Title & Broadcaster */}
          <div className="flex items-center gap-3 min-w-0">
            {isLive ? (
              <div className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFBE0D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFBE0D]"></span>
              </div>
            ) : (
              <div className="relative flex h-3 w-3 shrink-0">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neutral-400"></span>
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {isLive ? (
                  <span className="text-xs font-mono font-black uppercase text-black bg-[#FFBE0D] px-2 py-0.5 rounded shadow-xs">
                    LIVE NOW
                  </span>
                ) : (
                  <span className="text-xs font-mono font-black uppercase text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                    STANDBY OFFLINE
                  </span>
                )}
                <h3 className={`text-sm sm:text-base font-black truncate ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                  {isLive
                    ? channel === 'snnsei' ? 'Sensei: Road to Apex Predator · Live on Kick' : `${channel} Live on Kick`
                    : channel === 'snnsei' ? 'Sensei (@snnsei) is currently offline' : `@${channel} is currently offline`}
                </h3>
              </div>
              <div className={`text-xs flex items-center gap-2 mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {isLive ? (
                  <>
                    <span className="font-semibold text-[#FFB800]">Apex Legends</span>
                    <span>•</span>
                    <span>Playing with GM7 Squad</span>
                    <span>•</span>
                    <span className="font-mono">1080p60 HDR</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-[#FFB800]">Next Broadcast:</span>
                    <span>Tonight @ 5:00 PM UTC</span>
                    <span>•</span>
                    <span className="font-mono">Ranked Grinds + Community Matches</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Metrics & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
            {isLive ? (
              <>
                {/* Live Viewers Pill */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#FFBE0D]" />
                  <span>{viewerCount.toLocaleString()} Viewers</span>
                </div>

                {/* Uptime Pill */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>{formatUptime(uptimeSeconds)}</span>
                </div>
              </>
            ) : (
              <>
                {/* Offline Community Pill */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>48K+ Community</span>
                </div>

                {/* Countdown to Next Stream Pill */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-[#FFB800]' : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>
                    In {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                  </span>
                </div>
              </>
            )}

            {/* Cinema Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                setCinemaMode(!cinemaMode);
                onToast?.(cinemaMode ? 'Exited Cinema Mode' : 'Entered Cinema Mode');
              }}
              title={cinemaMode ? 'Default View' : 'Cinema Mode'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                cinemaMode
                  ? 'bg-[#FFBE0D] text-black border-[#FFBE0D]'
                  : isDark
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:text-black'
              }`}
            >
              {cinemaMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Toggle Chat */}
            <button
              type="button"
              onClick={() => {
                setShowChat(!showChat);
                onToast?.(showChat ? 'Kick Chat Hidden' : 'Kick Chat Shown');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                showChat
                  ? isDark
                    ? 'bg-neutral-800 border-neutral-700 text-[#FFBE0D]'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-900'
                  : isDark
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:text-black'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showChat ? 'Hide Chat' : 'Show Chat'}</span>
            </button>

            {/* Refresh Feed */}
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh Stream"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:text-black hover:border-neutral-300'
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio helper notice (Only in Live mode) */}
        {isLive && (
          <div
            className={`mb-3 px-3.5 py-2 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              isDark
                ? 'bg-[#FFBE0D]/10 border-[#FFBE0D]/30 text-neutral-300'
                : 'bg-[#FFBE0D]/15 border-[#8C6500]/20 text-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#FFBE0D] shrink-0" />
              <span>
                <strong>Stream Audio:</strong> Browser safety starts embedded live video on mute. Click the speaker icon in the bottom right corner of the player to turn on sound.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMuted(!muted);
                  setReloadKey((k) => k + 1);
                  onToast?.(muted ? 'Embed reloaded with muted=false' : 'Embed reloaded with muted=true');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold underline cursor-pointer hover:opacity-80`}
              >
                {muted ? 'Try unmute parameter' : 'Re-mute'}
              </button>
            </div>
          </div>
        )}

        {/* Main Embed Stage Container */}
        <div
          className={`grid grid-cols-1 ${
            showChat ? 'lg:grid-cols-12' : 'grid-cols-1'
          } gap-4 rounded-3xl overflow-hidden border shadow-2xl p-2 sm:p-3 transition-all ${
            isDark
              ? 'bg-neutral-950 border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
              : 'bg-neutral-100 border-neutral-300 shadow-xl'
          }`}
        >
          {/* Main Video Screen Area (Col 8/9 or full 12) */}
          <div className={`${showChat ? 'lg:col-span-8 xl:col-span-9' : 'col-span-1'} flex flex-col`}>
            
            {/* Conditional Display: LIVE PLAYER or OFFLINE STANDBY SCREEN */}
            {isLive || forcePlayerWhenOffline ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner group">
                {/* Kick Live Embed Iframe */}
                <OptionalThirdPartyFrame
                  src={`https://player.kick.com/${channel}?autoplay=${autoplay}&muted=${muted}`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  title={`Kick live stream - ${channel}`}
                  className="w-full h-full border-0 rounded-2xl"
                />

                {/* Top overlay brand watermark */}
                <div className="absolute top-3 left-3 pointer-events-none z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white/90">
                  <KickIcon className="w-3 h-3 text-[#FFBE0D]" />
                  <span>KICK.COM/{channel.toUpperCase()}</span>
                </div>

                {!isLive && forcePlayerWhenOffline && (
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={() => setForcePlayerWhenOffline(false)}
                      className="px-2.5 py-1 rounded-md bg-black/80 hover:bg-black text-[11px] font-mono text-amber-400 border border-amber-400/30 cursor-pointer"
                    >
                      Show Offline Screen
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* DEDICATED OFFLINE STANDBY SCREEN */
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-950 via-[#0e1014] to-neutral-950 border border-neutral-800 shadow-2xl flex flex-col items-center justify-center p-6 text-center select-none">
                {/* High tech grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
                
                {/* Amber/Neon Backlight aura */}
                <div className="absolute w-72 h-72 rounded-full bg-[#FFB800]/10 blur-[90px] pointer-events-none" />
                <div className="absolute w-64 h-64 rounded-full bg-[#FFBE0D]/10 blur-[100px] pointer-events-none" />

                {/* Offline Watermark */}
                <div className="absolute top-3.5 left-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-500" />
                  <span className="text-[11px] font-mono font-bold text-neutral-400 tracking-wider uppercase">
                    KICK.COM/{channel.toUpperCase()} // OFFLINE
                  </span>
                </div>

                <div className="absolute top-3.5 right-4">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-amber-400">
                    NEXT STREAM TODAY @ 5 PM UTC
                  </span>
                </div>

                {/* Center Content: Sensei Avatar, Notice, Countdown */}
                <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
                  {/* Sensei Avatar Preview */}
                  <button type="button" className="relative mb-3 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" onClick={() => onToast?.('Sensei is prepping tonight’s ranked session!')}>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 p-1 flex items-center justify-center shadow-xl overflow-hidden relative">
                      <img
                        src={senseiImage}
                        alt="Sensei Offline"
                        className="w-full h-full object-contain filter grayscale-[30%] group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-neutral-950/20" />
                    </div>
                    <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-neutral-800 text-amber-300 border border-neutral-700">
                      OFF
                    </span>
                  </button>

                  {/* Title & Status */}
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {channel === 'gm7' ? 'Sensei is Currently Offline' : `@${channel} is Offline`}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md leading-relaxed">
                    The broadcast is resting. Daily ranked grinds and community custom matches return tonight at 5:00 PM UTC!
                  </p>

                  {/* Countdown Clock to Next Live Stream */}
                  <div className="mt-4 flex items-center gap-2 sm:gap-3">
                    <div className="flex flex-col items-center bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-2 min-w-[56px] shadow-md">
                      <span className="text-lg sm:text-xl font-black font-mono text-white">
                        {String(countdown.hours).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-mono font-semibold uppercase text-neutral-500">
                        Hours
                      </span>
                    </div>
                    <span className="text-neutral-500 font-bold font-mono text-lg">:</span>
                    <div className="flex flex-col items-center bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-2 min-w-[56px] shadow-md">
                      <span className="text-lg sm:text-xl font-black font-mono text-[#FFBE0D]">
                        {String(countdown.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-mono font-semibold uppercase text-neutral-500">
                        Mins
                      </span>
                    </div>
                    <span className="text-neutral-500 font-bold font-mono text-lg">:</span>
                    <div className="flex flex-col items-center bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-2 min-w-[56px] shadow-md">
                      <span className="text-lg sm:text-xl font-black font-mono text-[#FFB800]">
                        {String(countdown.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-mono font-semibold uppercase text-neutral-500">
                        Secs
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                    <a
                      href={`https://kick.com/${channel}/videos`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#FFBE0D] hover:bg-[#E5A800] text-black text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-98"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Watch Replays & VODs</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>

                    <a
                      href="https://discord.com"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => onToast?.('Opening Discord for go-live alerts & squad roles...')}
                      className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>Get Go-Live Alert</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setForcePlayerWhenOffline(true)}
                      className="px-3 py-2 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-xs font-mono transition-colors cursor-pointer"
                    >
                      Load Embed Player Anyway
                    </button>
                  </div>
                </div>

                {/* Bottom schedule banner */}
                <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span className="hidden sm:inline">Schedule: Mon-Sat @ 5:00 PM UTC</span>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(true)}
                    className="text-[#FFBE0D] hover:underline cursor-pointer ml-auto"
                  >
                    Simulate Live Stream →
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Stream Controls Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                <a
                  href={`https://kick.com/${channel}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#FFBE0D] hover:bg-[#E5A800] text-black text-xs font-black transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer active:scale-98"
                >
                  <KickIcon className="w-4 h-4" />
                  <span>Open On Kick.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleShare}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:text-black hover:border-neutral-300'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Feed</span>
                </button>

                {/* Instant toggle between live and offline */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(!isLive)}
                  className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isLive
                      ? isDark
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:text-black'
                      : 'bg-neutral-800 border-neutral-700 text-[#FFBE0D]'
                  }`}
                  title="Toggle between Live Feed and Offline Standby Screen"
                >
                  <Power className="w-3.5 h-3.5 text-rose-400" />
                  <span>{isLive ? 'Simulate Off' : 'Go Live'}</span>
                </button>
              </div>

              {/* Stream Quality Badges */}
              <div className="flex items-center gap-2 text-[11px] font-mono font-semibold">
                <span className={`px-2 py-1 rounded-lg border ${
                  isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-400' : 'bg-white border-neutral-200 text-neutral-600'
                }`}>
                  {isLive ? 'Low Latency Live' : 'Standby Cloud'}
                </span>
                <span className={`px-2 py-1 rounded-lg border ${
                  isDark ? 'bg-neutral-900 border-neutral-800 text-[#FFBE0D]' : 'bg-white border-neutral-200 text-[#8C6500]'
                }`}>
                  60 FPS Verified
                </span>
              </div>
            </div>
          </div>

          {/* Kick Live Chatroom Embed (Col 4 or 3) */}
          {showChat && (
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col h-[450px] sm:h-[520px] lg:h-auto min-h-[420px]">
              <div className={`p-3 rounded-t-2xl border-t border-x flex items-center justify-between text-xs font-bold ${
                isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
              }`}>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#FFBE0D]" />
                  <span>{isLive ? 'Kick Stream Chat' : 'Kick Chat (Offline Lounge)'}</span>
                </div>
                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                  isLive
                    ? 'text-[#FFBE0D] bg-[#FFBE0D]/15 border-[#FFBE0D]/30'
                    : 'text-amber-400 bg-amber-400/15 border-amber-400/30'
                }`}>
                  {isLive ? 'Connected' : 'Lounge'}
                </span>
              </div>

              {/* Chat Iframe */}
              <div className="flex-1 relative rounded-b-2xl overflow-hidden border border-t-0 bg-neutral-950 border-neutral-800">
                <OptionalThirdPartyFrame
                  src={`https://kick.com/${channel}/chatroom`}
                  title={`Kick chat - ${channel}`}
                  className="w-full h-full border-0"
                  scrolling="yes"
                />
              </div>

              {/* Chat quick tips */}
              <div className={`mt-2 text-[11px] px-2 flex items-center justify-between font-mono ${
                isDark ? 'text-neutral-500' : 'text-neutral-500'
              }`}>
                <span>{isLive ? 'Sign in on Kick to chat' : 'Community chat stays active'}</span>
                <a
                  href={`https://kick.com/${channel}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FFBE0D] hover:underline"
                >
                  Join Kick →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Offline VODs / Highlights Showcase (Especially valuable when offline!) */}
        {!isLive && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                  Recent Broadcast VODs & Highlights
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Missed yesterday's live session? Catch up on the highest energy moments.
                </p>
              </div>

              <a
                href={`https://kick.com/${channel}/videos`}
                target="_blank"
                rel="noreferrer"
                className={`text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                  isDark ? 'text-[#FFBE0D] hover:underline' : 'text-[#8C6500] hover:underline'
                }`}
              >
                <span>View All VODs on Kick</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentHighlights.map((vod) => (
                <a
                  key={vod.id}
                  href={vod.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] group ${
                    isDark
                      ? 'bg-neutral-900/70 border-neutral-800 hover:border-[#FFBE0D]/50'
                      : 'bg-white border-neutral-200 hover:border-[#FFBE0D] shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFBE0D]/15 text-[#FFBE0D] border border-[#FFBE0D]/30 font-bold">
                      {vod.game}
                    </span>
                    <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {vod.duration}
                    </span>
                  </div>

                  <h4 className={`text-xs sm:text-sm font-bold line-clamp-2 mb-3 group-hover:text-[#FFBE0D] transition-colors ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {vod.title}
                  </h4>

                  <div className={`flex items-center justify-between text-[11px] pt-2 border-t ${
                    isDark ? 'border-neutral-800 text-neutral-400' : 'border-neutral-100 text-neutral-500'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{vod.views} views</span>
                    </span>
                    <span>{vod.date}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Community Stream Perks & Schedule Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-neutral-900/70 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFBE0D]/20 text-[#FFBE0D] flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                Sub & Squad Benefits
              </h4>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Subscribing on Kick unlocks custom GM7 emote badges, priority queue in community Friday cups, and exclusive Discord voice rooms.
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-neutral-900/70 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFB800]/20 text-[#FFB800] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                Chat Guidelines
              </h4>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Keep it hype, respect team comms, and follow Sensei's mod team. No toxicity or backseat gaming during ranked finals.
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-neutral-900/70 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                Daily Schedule
              </h4>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Sensei broadcasts Monday through Saturday starting at 5:00 PM UTC. Check the schedule section below for special weekend tournaments.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
