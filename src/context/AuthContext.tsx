import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export type AuthNoticeType = 'login' | 'signup' | 'error' | 'config';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  notice: AuthNoticeType | null;
  clearNotice: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  deleteAccount: async () => {},
  notice: null,
  clearNotice: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<AuthNoticeType | null>(null);

  useEffect(() => {
    // The server redirects back with ?auth=login | signup | error | config.
    const params = new URLSearchParams(window.location.search);
    const auth = params.get('auth');
    if (auth === 'login' || auth === 'signup' || auth === 'error' || auth === 'config') {
      params.delete('auth');
      const qs = params.toString();
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`,
      );
      setNotice(auth);
    }

    let cancelled = false;
    fetch('/api/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!cancelled) setUser(data.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(() => {
    window.location.href = '/auth/discord';
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore network errors — clear local state anyway
    }
    setUser(null);
  }, []);

  const deleteAccount = useCallback(async () => {
    const response = await fetch('/api/me', { method: 'DELETE' });
    if (!response.ok) throw new Error('Could not delete the account. Please try again.');
    setUser(null);
  }, []);

  const clearNotice = useCallback(() => setNotice(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, deleteAccount, notice, clearNotice }}>
      {children}
    </AuthContext.Provider>
  );
};
