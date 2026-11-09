import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  Gamepad2,
  Medal,
  Radio,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import {
  defaultAvailableTournaments,
  defaultRecentTournaments,
  type AvailableTournament,
  type RecentTournament,
  type RegistrationStatus,
} from '../data/tournaments';

import discordImg from '../assets/images/discord.jpg';

interface TournamentPageProps {
  onNavigateHome: (targetSection?: string) => void;
  onToast?: (msg: string) => void;
}

const seasonStats = [
  { label: 'Tournaments hosted', value: '24', hint: 'Across 6 game titles', icon: Trophy },
  { label: 'Prize pool awarded', value: '$18,400', hint: 'Paid out to the community', icon: Sparkles },
  { label: 'Players competed', value: '1,286', hint: 'Unique bracket entrants', icon: Users },
  { label: 'Champions crowned', value: '24', hint: 'Season 2026 so far', icon: Crown },
];

function useCountdown(targetIso: string) {
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, new Date(targetIso).getTime() - Date.now()),
  );

  useEffect(() => {
    const tick = () => setRemainingMs(Math.max(0, new Date(targetIso).getTime() - Date.now()));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [targetIso]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (value: number) => String(value).padStart(2, '0');

const statusStyles: Record<RegistrationStatus, { dark: string; light: string }> = {
  'Registration Open': {
    dark: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    light: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  },
  'Closing Soon': {
    dark: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    light: 'bg-amber-50 text-amber-700 border-amber-300',
  },
  Waitlist: {
    dark: 'bg-neutral-500/15 text-neutral-300 border-neutral-500/30',
    light: 'bg-neutral-100 text-neutral-600 border-neutral-300',
  },
};

export const TournamentPage: React.FC<TournamentPageProps> = ({ onNavigateHome, onToast }) => {
  const { isDark } = useTheme();
  const { tournaments: contentTournaments } = useContent();
  const availableTournaments = contentTournaments ?? defaultAvailableTournaments;
  const recentTournaments = defaultRecentTournaments;
  const [registrationTournament, setRegistrationTournament] = useState<AvailableTournament | null>(null);
  const [registrationDetails, setRegistrationDetails] = useState<{ playerName: string; discordHandle: string; squadName: string } | null>(null);
  const featured = availableTournaments.find((tournament) => tournament.featured) ?? availableTournaments[0] ?? null;
  const countdown = useCountdown(featured?.startIso ?? new Date().toISOString());
  const featuredProgress = featured ? Math.round((featured.filledSlots / Math.max(1, featured.maxSlots)) * 100) : 0;

  useEffect(() => {
    if (!registrationTournament) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setRegistrationTournament(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [registrationTournament]);

  const handleRegister = (tournament: AvailableTournament) => {
    setRegistrationDetails(null);
    setRegistrationTournament(tournament);
  };

  const handleRegistrationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setRegistrationDetails({
      playerName: String(formData.get('playerName') ?? ''),
      discordHandle: String(formData.get('discordHandle') ?? ''),
      squadName: String(formData.get('squadName') ?? ''),
    });
  };
  const handleShare = (tournament: RecentTournament) => {
    navigator.clipboard?.writeText(`${tournament.name} — winner: ${tournament.winner.name}`);
    onToast?.(`Copied ${tournament.name} results to clipboard.`);
  };

  return (
    <div
      className={`relative min-h-[80vh] transition-colors duration-300 ${
        isDark ? 'bg-[#07080a] text-white' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[420px] w-[420px] rounded-full bg-[#FFBE0D]/12 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[380px] w-[380px] rounded-full bg-[#00e5ff]/8 blur-[140px]" />
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_20%,#000_60%,transparent_100%)]'
              : 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_20%,#000_60%,transparent_100%)]'
          }`}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl 2xl:max-w-[90rem] px-4 pb-16 pt-8 sm:px-6 sm:pb-24 lg:px-8">
        {/* Page bar */}
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateHome()}
              aria-label="Back to Stream Hub"
              title="Back to Stream Hub"
              className={`group inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
                isDark
                  ? 'border-neutral-700 bg-neutral-900 hover:border-[#FFBE0D]/60 hover:bg-neutral-800'
                  : 'border-neutral-300 bg-white hover:border-orange-400 hover:bg-neutral-100'
              }`}
            >
              <ArrowLeft
                className="h-4 w-4 text-[#8C6500] transition-transform duration-200 group-hover:-translate-x-0.5 dark:text-[#FFBE0D]"
                strokeWidth={2.5}
              />
            </button>
            <div>
              <p className={`text-[10px] font-mono font-bold uppercase tracking-[0.28em] ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
                GM7 Competitive
              </p>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Brackets, bounties and bragging rights
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
              isDark
                ? 'border-neutral-800 bg-neutral-900/70 text-neutral-400'
                : 'border-neutral-200 bg-white text-neutral-600'
            }`}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FFBE0D]" />
            Tournament HQ
          </span>
        </div>

        {/* Announcement hero */}
        {featured ? (
        <section
          aria-labelledby="available-tournament-heading"
          className={`relative overflow-hidden rounded-3xl border shadow-2xl ${
            isDark ? 'border-[#FFBE0D]/25 bg-neutral-950' : 'border-orange-200 bg-white'
          }`}
        >
          <img
            src={discordImg}
            alt="GM7 community gathered at a Discord meetup"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div
            className={`absolute inset-0 ${
              isDark
                ? 'bg-gradient-to-r from-[#07080a] via-[#07080a]/90 to-[#07080a]/40'
                : 'bg-gradient-to-r from-white via-white/95 to-white/40'
            }`}
          />

          <div className="relative z-10 grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.45fr_1fr] lg:items-center">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#FFBE0D]/40 bg-[#FFBE0D]/10 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C6500] dark:text-[#FFBE0D]">
                  <Radio className="h-3.5 w-3.5 animate-pulse" />
                  Announcing · {featured.status}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isDark ? 'border-white/10 bg-white/5 text-neutral-300' : 'border-neutral-200 bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <Flame className="h-3.5 w-3.5 text-[#FFBE0D]" />
                  Flagship event
                </span>
              </div>

              <h1
                id="available-tournament-heading"
                className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl"
              >
                {featured.name}
              </h1>
              <p className={`mt-3 max-w-2xl text-sm leading-relaxed sm:text-base ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {featured.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${isDark ? 'border-neutral-800 bg-black/40 text-neutral-200' : 'border-neutral-200 bg-neutral-50 text-neutral-700'}`}>
                  <CalendarDays className="h-4 w-4 text-[#FFBE0D]" />
                  {featured.dateLabel}
                </span>
                <span className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${isDark ? 'border-neutral-800 bg-black/40 text-neutral-200' : 'border-neutral-200 bg-neutral-50 text-neutral-700'}`}>
                  <Gamepad2 className="h-4 w-4 text-[#FFBE0D]" />
                  {featured.game}
                </span>
                <span className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${isDark ? 'border-neutral-800 bg-black/40 text-neutral-200' : 'border-neutral-200 bg-neutral-50 text-neutral-700'}`}>
                  <Swords className="h-4 w-4 text-[#FFBE0D]" />
                  {featured.format}
                </span>
                <span className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${isDark ? 'border-neutral-800 bg-black/40 text-neutral-200' : 'border-neutral-200 bg-neutral-50 text-neutral-700'}`}>
                  <ShieldCheck className="h-4 w-4 text-[#FFBE0D]" />
                  {featured.platform}
                </span>
              </div>

              <div className="mt-7 max-w-md">
                <div className="mb-2 flex items-center justify-between text-xs font-mono">
                  <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
                    Slots filled
                  </span>
                  <span className="font-bold text-[#8C6500] dark:text-[#FFBE0D]">
                    {featured.filledSlots} / {featured.maxSlots}
                  </span>
                </div>
                <div className={`h-2 overflow-hidden rounded-full ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FFBE0D] to-[#FF8A00] shadow-[0_0_12px_rgba(255,190,13,0.6)]"
                    style={{ width: `${featuredProgress}%` }}
                  />
                </div>
                <p className={`mt-2 text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  {featured.maxSlots - featured.filledSlots} slots left · {featured.entry}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleRegister(featured)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFBE0D] px-5 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_8px_24px_rgba(255,190,13,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#E5A800] active:scale-95"
                >
                  <Trophy className="h-4 w-4" />
                  Register your squad
                  <ArrowUpRight className="h-4 w-4 stroke-[3]" />
                </button>
                <button
                  type="button"
                  onClick={() => onToast?.(`${featured.name} ruleset: ${featured.format}. Full rules are pinned in the GM7 Discord.`)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 ${
                    isDark
                      ? 'border-neutral-700 bg-neutral-900/80 text-neutral-200 hover:border-[#FFBE0D]/50'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-orange-400'
                  }`}
                >
                  <Target className="h-4 w-4 text-[#FFBE0D]" />
                  View ruleset
                </button>
              </div>
            </div>

            {/* Countdown panel */}
            <div
              className={`rounded-2xl border p-5 backdrop-blur-md sm:p-6 ${
                isDark
                  ? 'border-white/10 bg-black/50 shadow-[0_20px_60px_rgba(0,0,0,0.5)]'
                  : 'border-neutral-200 bg-white/80 shadow-xl'
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  <Clock className="h-3.5 w-3.5 text-[#FFBE0D]" />
                  Bracket goes live in
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-red-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                  Live
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Mins', value: countdown.minutes },
                  { label: 'Secs', value: countdown.seconds },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className={`rounded-xl border py-3 text-center ${
                      isDark ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-neutral-50'
                    }`}
                  >
                    <div className="font-mono text-xl font-black tabular-nums text-[#8C6500] dark:text-[#FFBE0D] sm:text-2xl">
                      {pad(unit.value)}
                    </div>
                    <div className={`mt-0.5 text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`mt-5 space-y-2.5 border-t pt-4 text-xs ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Prize pool</span>
                  <span className="text-base font-black text-[#8C6500] dark:text-[#FFBE0D]">{featured.prizePool}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Entry</span>
                  <span className="font-semibold">{featured.entry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Broadcast</span>
                  <span className="font-semibold">Live on Kick</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        ) : (
          <section
            className={`relative overflow-hidden rounded-3xl border p-8 text-center sm:p-12 ${
              isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-white shadow-sm'
            }`}
          >
            <Trophy className="mx-auto h-10 w-10 text-[#FFBE0D]" />
            <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">No tournaments announced yet</h1>
            <p className={`mx-auto mt-2 max-w-md text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              New cups are added from the dashboard. Check back soon or join the Discord for early bracket drops.
            </p>
          </section>
        )}

        {/* Available tournaments */}
        <section aria-labelledby="open-tournaments-heading" className="mt-12 sm:mt-16">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.25em] ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
                Open registrations
              </span>
              <h2 id="open-tournaments-heading" className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Available Tournaments
              </h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Lock in your slot before brackets close. Every cup is free to enter and streamed live.
              </p>
            </div>
            <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'border-neutral-800 bg-neutral-900/70 text-neutral-300' : 'border-neutral-200 bg-white text-neutral-600'}`}>
              <Zap className="h-3.5 w-3.5 text-[#FFBE0D]" />
              {availableTournaments.length} events taking sign-ups
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {availableTournaments.map((tournament) => {
              const progress = Math.round((tournament.filledSlots / tournament.maxSlots) * 100);
              return (
                <article
                  key={tournament.id}
                  className={`group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                    isDark
                      ? 'border-neutral-800 bg-neutral-900/70 hover:border-[#FFBE0D]/50 hover:shadow-[0_18px_40px_rgba(0,0,0,0.55)]'
                      : 'border-neutral-200 bg-white hover:border-orange-300 hover:shadow-xl'
                  }`}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={tournament.image}
                      alt={`${tournament.game} tournament artwork`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span
                      className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[9px] font-mono font-black uppercase tracking-wider ${
                        isDark ? statusStyles[tournament.status].dark : statusStyles[tournament.status].light
                      }`}
                    >
                      {tournament.status}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#FFBE0D]">{tournament.game}</p>
                      <h3 className="text-base font-black leading-tight text-white">{tournament.name}</h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {tournament.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                      <div className={`rounded-lg border p-2 ${isDark ? 'border-neutral-800 bg-black/30' : 'border-neutral-200 bg-neutral-50'}`}>
                        <span className={`block font-mono uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Date</span>
                        <span className="font-semibold">{tournament.dateLabel}</span>
                      </div>
                      <div className={`rounded-lg border p-2 ${isDark ? 'border-neutral-800 bg-black/30' : 'border-neutral-200 bg-neutral-50'}`}>
                        <span className={`block font-mono uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Prize</span>
                        <span className="font-bold text-[#8C6500] dark:text-[#FFBE0D]">{tournament.prizePool}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between text-[10px] font-mono">
                        <span className={isDark ? 'text-neutral-500' : 'text-neutral-500'}>
                          {tournament.filledSlots}/{tournament.maxSlots} slots
                        </span>
                        <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>{progress}%</span>
                      </div>
                      <div className={`h-1.5 overflow-hidden rounded-full ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                        <div className="h-full rounded-full bg-[#FFBE0D]" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => handleRegister(tournament)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#FFBE0D] px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-black transition-all hover:bg-[#E5A800] active:scale-95"
                      >
                        <Swords className="h-3.5 w-3.5" />
                        {tournament.status === 'Waitlist' ? 'Join waitlist' : 'Register'}
                      </button>
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${isDark ? 'border-neutral-800 bg-neutral-900 text-neutral-400' : 'border-neutral-200 bg-neutral-50 text-neutral-500'}`}>
                        <Users className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Season stats */}
        <section aria-labelledby="tournament-stats-heading" className="mt-14 sm:mt-20">
          <div className="mb-6">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.25em] ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
              Season 2026 · By the numbers
            </span>
            <h2 id="tournament-stats-heading" className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              Tournament Stats
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {seasonStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`relative overflow-hidden rounded-2xl border p-5 ${
                    isDark ? 'border-neutral-800 bg-neutral-900/70' : 'border-neutral-200 bg-white shadow-sm'
                  }`}
                >
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[#FFBE0D]/10 blur-2xl" />
                  <Icon className="h-5 w-5 text-[#FFBE0D]" />
                  <div className="mt-3 text-3xl font-black tracking-tight text-[#8C6500] dark:text-[#FFBE0D]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
                  <div className={`mt-1 text-[11px] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{stat.hint}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent tournaments */}
        <section aria-labelledby="recent-tournaments-heading" className="mt-14 sm:mt-20">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.25em] ${isDark ? 'text-[#FFBE0D]' : 'text-[#8C6500]'}`}>
                Results archive
              </span>
              <h2 id="recent-tournaments-heading" className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Recent Tournaments
              </h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Final brackets, player counts, prize payouts, and the champions who took it all.
              </p>
            </div>
            <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'border-neutral-800 bg-neutral-900/70 text-neutral-300' : 'border-neutral-200 bg-white text-neutral-600'}`}>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {recentTournaments.length} completed events
            </span>
          </div>

          <div className="space-y-4">
            {recentTournaments.map((tournament) => (
              <article
                key={tournament.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900/70 hover:border-[#FFBE0D]/40'
                    : 'border-neutral-200 bg-white shadow-sm hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className="grid gap-0 lg:grid-cols-[220px_1fr_300px]">
                  {/* Thumbnail */}
                  <div className="relative h-36 overflow-hidden lg:h-full lg:min-h-[180px]">
                    <img
                      src={tournament.image}
                      alt={`${tournament.game} recent tournament artwork`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/10 lg:to-black/60" />
                    <div className="absolute bottom-3 left-3 lg:hidden">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#FFBE0D]">{tournament.game}</p>
                      <h3 className="text-base font-black text-white">{tournament.name}</h3>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-col justify-between p-5">
                    <div>
                      <div className="hidden items-center gap-2 lg:flex">
                        <span className="rounded-full bg-[#FFBE0D]/15 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C6500] dark:text-[#FFBE0D]">
                          {tournament.game}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                          <CalendarDays className="h-3.5 w-3.5" />
                          {tournament.dateLabel}
                        </span>
                      </div>
                      <h3 className="mt-2 hidden text-xl font-black tracking-tight lg:block">{tournament.name}</h3>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className={`rounded-xl border p-2.5 ${isDark ? 'border-neutral-800 bg-black/30' : 'border-neutral-200 bg-neutral-50'}`}>
                        <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                          <Users className="h-3 w-3" />
                          Players
                        </div>
                        <div className="mt-0.5 text-sm font-black">{tournament.participants}</div>
                      </div>
                      <div className={`rounded-xl border p-2.5 ${isDark ? 'border-neutral-800 bg-black/30' : 'border-neutral-200 bg-neutral-50'}`}>
                        <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                          <Swords className="h-3 w-3" />
                          Matches
                        </div>
                        <div className="mt-0.5 text-sm font-black">{tournament.matches}</div>
                      </div>
                      <div className={`rounded-xl border p-2.5 ${isDark ? 'border-neutral-800 bg-black/30' : 'border-neutral-200 bg-neutral-50'}`}>
                        <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                          <Trophy className="h-3 w-3" />
                          Prize
                        </div>
                        <div className="mt-0.5 text-sm font-black text-[#8C6500] dark:text-[#FFBE0D]">{tournament.prizePool}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        <Sparkles className="h-3.5 w-3.5 text-[#FFBE0D]" />
                        MVP: {tournament.mvp}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleShare(tournament)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${isDark ? 'text-neutral-400 hover:text-[#FFBE0D]' : 'text-neutral-500 hover:text-[#8C6500]'}`}
                      >
                        Share results
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Winner panel */}
                  <div
                    className={`border-t p-5 lg:border-l lg:border-t-0 ${
                      isDark ? 'border-neutral-800 bg-[#0d1016]' : 'border-neutral-200 bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C6500] dark:text-[#FFBE0D]">
                        <Crown className="h-4 w-4" />
                        Champion
                      </span>
                      <Medal className="h-4 w-4 text-neutral-400" />
                    </div>
                    <h4 className="mt-2 text-lg font-black leading-tight">{tournament.winner.name}</h4>
                    <p className={`mt-0.5 truncate text-[11px] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {tournament.winner.handle}
                    </p>
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-[#FFBE0D]/30 bg-[#FFBE0D]/10 px-3 py-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6500] dark:text-[#FFBE0D]">
                        Winner payout
                      </span>
                      <span className="text-sm font-black text-[#8C6500] dark:text-[#FFBE0D]">
                        {tournament.winner.prize}
                      </span>
                    </div>
                    <div className={`mt-3 flex items-center gap-1.5 text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Runner-up</span>
                      <span className="truncate font-semibold">{tournament.runnerUp.name}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section
          className={`mt-12 overflow-hidden rounded-2xl border p-6 sm:mt-16 sm:p-8 ${
            isDark
              ? 'border-[#FFBE0D]/25 bg-gradient-to-r from-neutral-900 to-neutral-950'
              : 'border-orange-200 bg-gradient-to-r from-orange-50 to-white'
          }`}
        >
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">Think you can take the next cup?</h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Join the GM7 Discord to register, find teammates, and get bracket announcements before anyone else.
              </p>
            </div>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onToast?.('Opening the GM7 Discord tournament hub…')}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#5865F2] px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-[#4752c4] active:scale-95"
            >
              <Trophy className="h-4 w-4" />
              Join the bracket
              <ArrowUpRight className="h-4 w-4 stroke-[3]" />
            </a>
          </div>
        </section>

        {registrationTournament && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setRegistrationTournament(null)}
            role="presentation"
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="registration-dialog-title"
              className={`relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8 ${
                isDark
                  ? 'border-neutral-700 bg-[#101114] text-white'
                  : 'border-neutral-200 bg-white text-neutral-900'
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setRegistrationTournament(null)}
                aria-label="Close registration form"
                className={`absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  isDark
                    ? 'border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    : 'border-neutral-200 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <X className="h-4 w-4" />
              </button>

              {registrationDetails ? (
                <div className="pt-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  <p className="mt-5 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#8C6500] dark:text-[#FFBE0D]">
                    Details ready
                  </p>
                  <h2 id="registration-dialog-title" className="mt-2 pr-8 text-2xl font-black tracking-tight sm:text-3xl">
                    Finish in GM7 Discord
                  </h2>
                  <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Your details are ready for {registrationTournament.name}. Continue to Discord to complete your registration.
                  </p>
                  <div className={`mt-5 space-y-2 rounded-2xl border p-4 text-sm ${isDark ? 'border-neutral-800 bg-black/20' : 'border-neutral-200 bg-neutral-50'}`}>
                    <p><span className="font-semibold">Player:</span> {registrationDetails.playerName}</p>
                    <p><span className="font-semibold">Discord:</span> {registrationDetails.discordHandle}</p>
                    {registrationDetails.squadName && <p><span className="font-semibold">Squad:</span> {registrationDetails.squadName}</p>}
                  </div>
                  <a
                    href="https://discord.gg/gm7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#5865F2] px-5 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#4752c4]"
                  >
                    Continue to Discord <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <>
                  <p className="pr-12 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#8C6500] dark:text-[#FFBE0D]">
                    Tournament registration
                  </p>
                  <h2 id="registration-dialog-title" className="mt-2 pr-8 text-2xl font-black tracking-tight sm:text-3xl">
                    {registrationTournament.name}
                  </h2>
                  <p className={`mt-2 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {registrationTournament.game} <span className="mx-1 text-neutral-500">·</span> {registrationTournament.dateLabel}
                  </p>
                  <form onSubmit={handleRegistrationSubmit} className="mt-6 space-y-4">
                    <label className="block text-xs font-semibold">
                      Player or captain name
                      <input
                        name="playerName"
                        required
                        autoComplete="name"
                        className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:border-[#FFBE0D] focus:ring-2 focus:ring-[#FFBE0D]/20 ${isDark ? 'border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500' : 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400'}`}
                        placeholder="Your name"
                      />
                    </label>
                    <label className="block text-xs font-semibold">
                      Discord username
                      <input
                        name="discordHandle"
                        required
                        autoComplete="username"
                        className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:border-[#FFBE0D] focus:ring-2 focus:ring-[#FFBE0D]/20 ${isDark ? 'border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500' : 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400'}`}
                        placeholder="name or @name"
                      />
                    </label>
                    <label className="block text-xs font-semibold">
                      Squad name <span className={`font-normal ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>(optional)</span>
                      <input
                        name="squadName"
                        autoComplete="organization"
                        className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:border-[#FFBE0D] focus:ring-2 focus:ring-[#FFBE0D]/20 ${isDark ? 'border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500' : 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400'}`}
                        placeholder="Your team name"
                      />
                    </label>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                      You’ll review these details and finish registration in the GM7 Discord.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FFBE0D] px-5 text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-[#ffd44d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFBE0D] focus-visible:ring-offset-2"
                    >
                      Continue <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </form>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
