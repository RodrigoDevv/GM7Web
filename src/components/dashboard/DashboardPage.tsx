import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { AudienceIcon, GamesIcon, OverviewIcon, SetupIcon, TournamentIcon, VisitsIcon } from './DashboardIcons';
import { useTheme } from '../../context/ThemeContext';
import { useContent } from '../../context/ContentContext';
import { defaultGames, type GameItem } from '../../data/games';
import { defaultAvailableTournaments, type AvailableTournament } from '../../data/tournaments';
import { defaultSetup, type SetupContent } from '../../data/setup';
import { GameEditor } from './GameEditor';
import { SetupEditor } from './SetupEditor';
import { TournamentEditor } from './TournamentEditor';
import { AdminButton, Field, TextInput } from './fields';

interface DashboardPageProps {
  onNavigateHome: (targetSection?: string) => void;
  onToast?: (msg: string) => void;
}

type TabKey = 'overview' | 'tournaments' | 'games' | 'setup';
type SectionKey = 'tournaments' | 'games' | 'setup';

interface AdminSession {
  loading: boolean;
  authenticated: boolean;
  usingDefaultPassword: boolean;
  authDisabled: boolean;
}

const TABS: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'overview', label: 'Overview', icon: OverviewIcon },
  { key: 'tournaments', label: 'Tournaments', icon: TournamentIcon },
  { key: 'games', label: 'What We Play', icon: GamesIcon },
  { key: 'setup', label: 'Setup', icon: SetupIcon },
];

interface AnalyticsStats {
  visits7d: number;
  visitsAllTime: number;
  pageViews7d: number;
  days: Array<{ date: string; visits: number; pageViews: number }>;
  popularPages: Array<{ page: string; views: number }>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateHome, onToast }) => {
  const { isDark } = useTheme();
  const { games, tournaments, setup, loading: contentLoading, refresh } = useContent();

  const [session, setSession] = useState<AdminSession>({
    loading: true,
    authenticated: false,
    usingDefaultPassword: false,
    authDisabled: false,
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [gameDraft, setGameDraft] = useState<GameItem[]>([]);
  const [tournamentDraft, setTournamentDraft] = useState<AvailableTournament[]>([]);
  const [setupDraft, setSetupDraft] = useState<SetupContent>(defaultSetup);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [savingSection, setSavingSection] = useState<SectionKey | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        setSession({
          loading: false,
          authenticated: Boolean(data.authenticated),
          usingDefaultPassword: Boolean(data.usingDefaultPassword),
          authDisabled: Boolean(data.authDisabled),
        });
      })
      .catch(() => {
        if (!cancelled) {
          setSession({ loading: false, authenticated: false, usingDefaultPassword: false, authDisabled: false });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!session.authenticated || contentLoading || initialized) return;
    setGameDraft(games ?? defaultGames);
    setTournamentDraft(tournaments ?? defaultAvailableTournaments);
    setSetupDraft(setup ?? defaultSetup);
    setInitialized(true);
  }, [session.authenticated, contentLoading, initialized, games, tournaments, setup]);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch('/api/admin/stats', { cache: 'no-store' });
      if (!response.ok) throw new Error('Stats unavailable');
      setStats(await response.json() as AnalyticsStats);
    } catch {
      onToast?.('Could not load visitor statistics.');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (session.authenticated) void loadStats();
  }, [session.authenticated]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 429) {
          setAuthError(data.error || 'Too many failed login attempts. Please wait 15 minutes.');
        } else if (response.status >= 500) {
          setAuthError('Could not reach the API server. Start it with `npm run dev:server` and try again.');
        } else {
          setAuthError(data.error || 'Incorrect username or password.');
        }
        return;
      }
      setSession({
        loading: false,
        authenticated: true,
        usingDefaultPassword: Boolean(data.usingDefaultPassword),
        authDisabled: Boolean(data.authDisabled),
      });
      setPassword('');
      setInitialized(false);
      onToast?.('Admin mode unlocked. Welcome to GM7 Control Room.');
    } catch {
      setAuthError('Could not reach the server. Is it running?');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setSession((previous) => ({ ...previous, authenticated: false }));
    setInitialized(false);
    setUsername('');
    setPassword('');
    setGameDraft([]);
    setTournamentDraft([]);
    setSetupDraft(defaultSetup);
    onToast?.('Logged out of the dashboard.');
  };

  const commit = async (section: SectionKey, next: unknown): Promise<boolean> => {
    setSavingSection(section);
    try {
      const response = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [section]: next }),
      });
      if (response.status === 401) {
        setSession((previous) => ({ ...previous, authenticated: false }));
        setInitialized(false);
        onToast?.('Your admin session expired. Please log in again.');
        return false;
      }
      if (!response.ok) throw new Error('Save failed');
      const data = (await response.json()) as Record<string, unknown>;
      if (section === 'games' && Array.isArray(data.games)) setGameDraft(data.games as GameItem[]);
      if (section === 'tournaments' && Array.isArray(data.tournaments)) setTournamentDraft(data.tournaments as AvailableTournament[]);
      if (section === 'setup' && data.setup && typeof data.setup === 'object') setSetupDraft(data.setup as SetupContent);
      await refresh();
      const labels: Record<SectionKey, string> = {
        games: 'Game cards',
        tournaments: 'Tournaments',
        setup: 'Setup',
      };
      onToast?.(`${labels[section]} saved.`);
      return true;
    } catch {
      onToast?.('Could not save changes. Check that the server is running and try again.');
      return false;
    } finally {
      setSavingSection(null);
    }
  };

  if (session.loading) {
    return (
      <div className={`flex min-h-[70vh] items-center justify-center ${isDark ? 'bg-[#07080a] text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Loader2 className="h-5 w-5 animate-spin text-[#FFBE0D]" />
          Checking admin session…
        </div>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <div
        className="relative min-h-[92vh] w-full flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden text-white"
        style={{
          background:
            'radial-gradient(circle at 50% 28%, rgba(255, 190, 13, 0.12) 0%, rgba(255, 190, 13, 0.02) 42%, transparent 70%), radial-gradient(ellipse 60% 50% at 10% 92%, rgba(255, 190, 13, 0.07) 0%, transparent 65%), #07080a',
        }}
      >
        {/* Top Header: Back Button & GM7 Brand */}
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigateHome()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#FFBE0D]/40 text-neutral-300 hover:text-[#FFBE0D] text-xs font-semibold transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1 font-display text-lg font-black tracking-tight">
            <span>GM</span>
            <span className="text-[#FFBE0D]">7</span>
          </div>
        </div>

        {/* Center Auth Container */}
        <div className="w-full max-w-[360px] mx-auto my-auto flex flex-col items-center text-center">
          {/* Heading */}
          <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-white mb-2 font-display">
            Yooo, welcome back!
          </h1>

          {/* Clean Subtitle */}
          <p className="text-xs sm:text-sm text-neutral-400 mb-7">
            Enter your username and password to unlock the dashboard.
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="w-full space-y-3.5">
            {/* Username Field */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
                autoFocus
                className="w-full h-12 pl-10 pr-4 rounded-2xl bg-[#0f1117] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFBE0D] focus:ring-4 focus:ring-[#FFBE0D]/15 transition-all font-sans"
              />
            </div>

            {/* Password Field */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => setCapsLockActive(Boolean(e.getModifierState && e.getModifierState('CapsLock')))}
                onKeyDown={(e) => setCapsLockActive(Boolean(e.getModifierState && e.getModifierState('CapsLock')))}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full h-12 pl-10 pr-11 rounded-2xl bg-[#0f1117] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFBE0D] focus:ring-4 focus:ring-[#FFBE0D]/15 transition-all font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-[#FFBE0D] transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {capsLockActive && (
              <p className="text-[11px] text-[#FFBE0D] text-left font-mono">
                ⚠️ Caps Lock is on
              </p>
            )}

            {authError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300 text-left flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </div>
            )}

            {/* Primary Sign In Button in GM7 Gold (#FFBE0D) */}
            <button
              type="submit"
              disabled={authBusy || !username.trim() || !password.trim()}
              className="w-full h-12 rounded-2xl bg-[#FFBE0D] hover:bg-[#E5A800] active:scale-[0.99] text-black font-black uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(255,190,13,0.35)] hover:shadow-[0_6px_25px_rgba(255,190,13,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authBusy ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Checking…</span>
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Unlock Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Empty bottom space to balance vertical center */}
        <div className="h-6" />
      </div>
    );
  }

  const weekVisits = stats?.days ?? [];
  const maxVisits = Math.max(1, ...weekVisits.map((day) => day.visits));
  const maxPageViews = Math.max(1, ...weekVisits.map((day) => day.pageViews));
  const upcomingTournaments = tournamentDraft.filter((item) => {
    const start = Date.parse(item.startIso);
    return Number.isFinite(start) && start >= Date.now();
  }).length;
  const pageLabels: Record<string, string> = {
    home: 'Home', about: 'About', socials: 'Socials', tournaments: 'Tournaments',
    games: 'Games', legal: 'Legal pages',
  };

  return (
    <div className={`min-h-[80vh] transition-colors duration-300 ${isDark ? 'bg-[#0b0b0b] text-white' : 'bg-[#f5f4f0] text-neutral-900'}`}>
      <div className="mx-auto grid w-full max-w-[1500px] gap-4 px-3 py-5 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8 lg:py-7">
        <aside className={`flex flex-col rounded-2xl border p-4 sm:p-5 lg:min-h-[680px] ${isDark ? 'border-white/[0.09] bg-[#111]' : 'border-black/[0.08] bg-white'}`}>
          <div className="flex items-center gap-3 px-2 py-2">
            
            <div><p className="font-black tracking-wide">GM7</p><p className={`text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Control room</p></div>
          </div>
          <p className={`mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Menu</p>
          <nav aria-label="Dashboard sections" className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              const count = tab.key === 'games' ? gameDraft.length : tab.key === 'tournaments' ? tournamentDraft.length : tab.key === 'setup' ? setupDraft.items.length : null;
              return (
                <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} aria-current={active ? 'page' : undefined} className={`flex min-h-10 w-full items-center gap-3 border-l-2 px-3 text-left text-sm font-medium transition-colors ${active ? 'border-[#FFBE0D] text-[#FFBE0D]' : `border-transparent ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'}`}`}>
                  <Icon className="h-4 w-4 shrink-0" /><span className="flex-1">{tab.label}</span>
                  {count !== null && <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? 'bg-white/20' : isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`}>{count}</span>}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto space-y-2 pt-8">
            <button type="button" onClick={() => onNavigateHome()} className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold ${isDark ? 'text-neutral-400 hover:bg-neutral-900 hover:text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}><ArrowLeft className="h-4 w-4" />Back to website</button>
            {!session.authDisabled && <button type="button" onClick={handleLogout} className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold ${isDark ? 'text-neutral-400 hover:bg-neutral-900 hover:text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}><LogOut className="h-4 w-4" />Log out</button>}
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <header className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-5 py-5 sm:px-7 ${isDark ? 'border-white/[0.09] bg-[#111]' : 'border-black/[0.08] bg-white'}`}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88a00] dark:text-[#FFBE0D]">GM7 / Admin</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{activeTab === 'overview' ? 'Website overview' : activeTab === 'games' ? 'What We Play' : activeTab === 'setup' ? 'Setup' : 'Tournaments'}</h1>
              <p className={`mt-1 text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            {activeTab === 'overview' && <AdminButton variant="ghost" onClick={loadStats} disabled={statsLoading}><RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />Refresh stats</AdminButton>}
          </header>

          {session.authDisabled && <div className={`flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs ${isDark ? 'border-sky-500/30 bg-sky-500/10 text-sky-200' : 'border-sky-300 bg-sky-50 text-sky-800'}`}><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /><p>Dashboard login is disabled. Anyone with this page can edit website content. Set <code>ADMIN_AUTH_DISABLED=false</code> to require a password.</p></div>}
          {!session.authDisabled && session.usingDefaultPassword && <div className={`flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs ${isDark ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-amber-300 bg-amber-50 text-amber-800'}`}><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /><p>Change the default dashboard password before launch by setting <code>ADMIN_PASSWORD</code> in <code>.env</code>.</p></div>}

          {!initialized ? (
            <div className={`flex min-h-72 items-center justify-center rounded-[28px] ${isDark ? 'bg-neutral-950' : 'bg-white'}`}><Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-600" />Loading dashboard data…</div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-5">
              <section aria-label="Key statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Visits · last 7 days', value: stats?.visits7d ?? 0, icon: AudienceIcon, accent: true },
                  { label: 'Visits · all time', value: stats?.visitsAllTime ?? 0, icon: VisitsIcon },
                  { label: 'Games in library', value: gameDraft.length, icon: GamesIcon },
                  { label: 'Upcoming tournaments', value: upcomingTournaments, icon: TournamentIcon },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.label} className={`border-l-2 py-1 pl-4 ${item.accent ? 'border-[#FFBE0D]' : isDark ? 'border-white/15' : 'border-black/15'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{item.label}</p>
                          <p className="mt-1 text-2xl font-semibold tabular-nums">{Number(item.value).toLocaleString()}</p>
                        </div>
                        <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${item.accent ? 'border-[#FFBE0D]/30 bg-[#FFBE0D]/10 text-[#d99c00]' : isDark ? 'border-white/10 bg-white/5 text-neutral-300' : 'border-black/10 bg-black/[0.04] text-neutral-600'}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
                <article className={`rounded-2xl border p-5 sm:p-6 ${isDark ? 'border-white/[0.09] bg-[#111]' : 'border-black/[0.08] bg-white'}`}>
                  <div><h2 className="text-base font-semibold">Traffic overview</h2><p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Daily visits and page views for the last 7 days</p></div>
                  <div role="img" aria-label={`Daily visits and page views for the last seven days: ${weekVisits.map((day) => `${day.date}, ${day.visits} visits, ${day.pageViews} page views`).join('; ')}`} className="mt-7 grid h-52 grid-cols-7 items-end gap-3 border-b border-dashed border-neutral-300/50 pb-2 sm:gap-5">
                    {weekVisits.map((day) => <div key={day.date} className="flex h-full flex-col items-center justify-end gap-2"><div className="flex h-full w-full items-end justify-center gap-1"><div title={`${day.visits} visits`} className="w-3 rounded-t-md bg-[#d99c00] sm:w-5" style={{ height: `${day.visits ? Math.max(5, day.visits / maxVisits * 100) : 2}%` }} /><div title={`${day.pageViews} page views`} className={`w-3 rounded-t-md sm:w-5 ${isDark ? 'bg-[#80651e]' : 'bg-[#f5d889]'}`} style={{ height: `${day.pageViews ? Math.max(5, day.pageViews / maxPageViews * 100) : 2}%` }} /></div><span className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' })}</span></div>)}
                  </div>
                  <div className={`mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#d99c00]" />Visits</span><span className="inline-flex items-center gap-2"><i className={`h-2.5 w-2.5 rounded-full ${isDark ? 'bg-[#80651e]' : 'bg-[#f5d889]'}`} />Page views</span><span className="ml-auto">{(stats?.pageViews7d ?? 0).toLocaleString()} page views this week</span></div>
                  <p className={`mt-4 text-[10px] leading-relaxed ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Counts are aggregate browser visits and page views. Reloading the site counts as another visit; this dashboard does not identify unique people.</p>
                </article>

                <article className={`rounded-2xl border p-5 sm:p-6 ${isDark ? 'border-white/[0.09] bg-[#111]' : 'border-black/[0.08] bg-white'}`}>
                  <div><h2 className="text-base font-semibold">Popular pages</h2><p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Page views since tracking started</p></div>
                  <div className="mt-5 divide-y divide-neutral-500/15">{stats?.popularPages.length ? stats.popularPages.map((item) => <div key={item.page} className="flex items-center justify-between gap-3 py-2.5 text-sm"><span>{pageLabels[item.page] ?? item.page}</span><span className={`tabular-nums ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{item.views.toLocaleString()}</span></div>) : <p className={`py-6 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>No page views recorded yet.</p>}</div>
                  <div className={`mt-5 border-t pt-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}><p className="text-xs font-semibold">Tracking status</p><p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{statsLoading ? 'Updating aggregate statistics…' : (stats?.visitsAllTime ?? 0) === 0 ? 'Tracking starts with this release; earlier visits were not recorded.' : 'Daily totals only; no visitor IDs or IP addresses are stored.'}</p></div>
                </article>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                {[
                  { key: 'tournaments' as const, title: 'Manage tournaments', description: `${tournamentDraft.length} tournament entries · ${upcomingTournaments} upcoming`, icon: TournamentIcon },
                  { key: 'games' as const, title: 'Edit What We Play', description: `${gameDraft.length} games in the library`, icon: GamesIcon },
                  { key: 'setup' as const, title: 'Edit Setup', description: `${setupDraft.items.length} markers on the battle station`, icon: SetupIcon },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button type="button" key={item.key} onClick={() => setActiveTab(item.key)} className={`flex min-h-16 items-center justify-between gap-4 border-y py-3 text-left transition-colors ${isDark ? 'border-white/10 hover:text-[#FFBE0D]' : 'border-black/10 hover:text-[#8c6500]'}`}>
                      <span className="flex min-w-0 items-center gap-3">
                        <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${isDark ? 'border-white/10 bg-white/5 text-neutral-300' : 'border-black/10 bg-black/[0.04] text-neutral-600'}`}><Icon className="h-4 w-4" /></span>
                        <span className="min-w-0"><strong className="block text-sm font-semibold">{item.title}</strong><span className={`mt-1 block text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{item.description}</span></span>
                      </span>
                      <span aria-hidden="true" className="text-lg">→</span>
                    </button>
                  );
                })}
              </section>
            </div>
          ) : (
              <section className={`rounded-2xl border p-4 sm:p-6 ${isDark ? 'border-white/[0.09] bg-[#111]' : 'border-black/[0.08] bg-white'}`}>
              {activeTab === 'tournaments' ? <TournamentEditor items={tournamentDraft} onCommit={(next) => commit('tournaments', next)} saving={savingSection === 'tournaments'} onToast={onToast} /> : activeTab === 'setup' ? <SetupEditor setup={setupDraft} onCommit={(next) => commit('setup', next)} saving={savingSection === 'setup'} onToast={onToast} /> : <GameEditor items={gameDraft} onCommit={(next) => commit('games', next)} saving={savingSection === 'games'} onToast={onToast} />}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
