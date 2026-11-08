import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';

type ConsentChoice = 'accepted' | 'rejected' | null;

interface PrivacyConsentValue {
  choice: ConsentChoice;
  setChoice: (choice: Exclude<ConsentChoice, null>) => void;
  openSettings: () => void;
}

const PrivacyConsentContext = createContext<PrivacyConsentValue>({ choice: null, setChoice: () => {}, openSettings: () => {} });
const STORAGE_KEY = 'gm7_optional_content_consent';

export const usePrivacyConsent = () => useContext(PrivacyConsentContext);

export const PrivacyConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [choice, setChoiceState] = useState<ConsentChoice>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'accepted' || stored === 'rejected' ? stored : null;
    } catch {
      return null;
    }
  });

  const setChoice = (next: Exclude<ConsentChoice, null>) => {
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Consent remains for this page view. */ }
    setChoiceState(next);
  };

  const openSettings = () => setChoiceState(null);

  return <PrivacyConsentContext.Provider value={{ choice, setChoice, openSettings }}>{children}</PrivacyConsentContext.Provider>;
};

export const OptionalContentConsent: React.FC = () => {
  const { choice, setChoice } = usePrivacyConsent();
  const { isDark } = useTheme();
  // Font CSS only loads after an affirmative choice.
  useEffect(() => {
    const id = 'gm7-google-fonts';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (choice === 'accepted' && !link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@400..700&family=Kaushan+Script&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@400..800&display=swap';
      document.head.appendChild(link);
    }
    if (choice !== 'accepted') link?.remove();
  }, [choice]);

  if (choice !== null) return null;
  return (
    <aside role="region" aria-label="Optional content preferences" className={`fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border p-4 shadow-2xl sm:inset-x-6 ${isDark ? 'border-neutral-700 bg-neutral-950 text-white' : 'border-neutral-300 bg-white text-neutral-900'}`}>
      <h2 className="text-sm font-bold">Optional third-party content</h2>
      <p className={`mt-1 text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
        Google Fonts and embedded Kick player or chat content can connect your browser to those services. Choose whether to load them. Required sign-in and security cookies are only set when you use those features. See the <a className="underline underline-offset-2" href="/legal/cookies">draft cookie notice</a>.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setChoice('accepted')} className="min-h-10 rounded-lg bg-[#FFBE0D] px-4 text-sm font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">Accept optional content</button>
        <button type="button" onClick={() => setChoice('rejected')} className={`min-h-10 rounded-lg border px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isDark ? 'border-neutral-600' : 'border-neutral-400'}`}>Reject optional content</button>
      </div>
    </aside>
  );
};

export const OptionalThirdPartyFrame: React.FC<{
  src: string;
  title: string;
  className?: string;
  allow?: string;
  allowFullScreen?: boolean;
  scrolling?: 'auto' | 'yes' | 'no';
}> = ({ src, title, className = '', allow = 'fullscreen; picture-in-picture', allowFullScreen = true, scrolling = 'no' }) => {
  return <iframe src={src} title={title} className={className} allow={allow} allowFullScreen={allowFullScreen} scrolling={scrolling} referrerPolicy="no-referrer" />;
};
