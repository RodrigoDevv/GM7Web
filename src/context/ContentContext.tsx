import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { GameItem } from '../data/games';
import type { AvailableTournament } from '../data/tournaments';
import type { SocialVideo } from '../data/socials';

export interface SiteContent {
  games: GameItem[] | null;
  tournaments: AvailableTournament[] | null;
  socials: SocialVideo[] | null;
}

interface ContentContextValue extends SiteContent {
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const EMPTY: SiteContent = { games: null, tournaments: null, socials: null };

const ContentContext = createContext<ContentContextValue>({
  ...EMPTY,
  loading: true,
  error: null,
  refresh: async () => {},
});

export const useContent = () => useContext(ContentContext);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/content', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      const data = (await response.json()) as Partial<SiteContent>;
      setContent({
        games: Array.isArray(data.games) ? data.games : null,
        tournaments: Array.isArray(data.tournaments) ? data.tournaments : null,
        socials: Array.isArray(data.socials) ? data.socials : null,
      });
      setError(null);
    } catch {
      setError('Could not load saved site content. Showing built-in defaults.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<ContentContextValue>(
    () => ({ ...content, loading, error, refresh }),
    [content, loading, error, refresh],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};
