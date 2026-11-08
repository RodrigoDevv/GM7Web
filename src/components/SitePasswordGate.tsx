import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SITE_PASSWORD = 'snnsei2345';
const STORAGE_KEY = 'gm7_site_unlocked';

export const SitePasswordGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus();
  }, [unlocked]);

  if (unlocked) return <>{children}</>;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (value === SITE_PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* Unlock remains for this page view only. */
      }
      setError('');
      setUnlocked(true);
      return;
    }
    setError('Incorrect password. Try again.');
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <div className={`flex min-h-screen items-center justify-center px-4 ${isDark ? 'bg-[#080a0d] text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
      <form onSubmit={submit} className={`w-full max-w-sm rounded-3xl border p-8 shadow-2xl ${isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-white'}`}>
        <div className="mb-6">
          <p className="text-lg font-black tracking-tight">GM7 is locked</p>
          <p className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Private preview</p>
        </div>
        <p className={`mb-4 text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          This site is temporarily private. Enter the password to continue.
        </p>
        <label htmlFor="site-password" className="sr-only">Password</label>
        <input
          id="site-password"
          ref={inputRef}
          type="password"
          autoComplete="current-password"
          value={value}
          onChange={(event) => { setValue(event.target.value); if (error) setError(''); }}
          placeholder="Password"
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#FFBE0D] focus:ring-2 focus:ring-[#FFBE0D]/30 ${isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-100 placeholder:text-neutral-600' : 'border-neutral-300 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400'}`}
        />
        {error && <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>}
        <button
          type="submit"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFBE0D] px-4 py-3 text-sm font-bold text-black transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFBE0D]/50"
        >
          Enter site
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
