import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  profile?: Record<string, unknown>;
  progress?: Record<string, unknown>;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  /** True only while the stored token is being revalidated on boot. */
  isRestoring: boolean;
  isSubmitting: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  saveState: (patch: { profile?: unknown; progress?: unknown }) => Promise<void>;
}

const TOKEN_KEY = 'tiltop_auth_token';

const AuthContext = createContext<AuthContextValue | null>(null);

async function postJson(path: string, body: unknown, token?: string | null) {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `So'rov bajarilmadi (${res.status})`);
  }
  return data;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Revalidate a stored token once on boot: a token in localStorage proves
  // nothing until the server confirms it is still signed and unexpired.
  useEffect(() => {
    if (!token) {
      setIsRestoring(false);
      return;
    }

    let cancelled = false;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user);
      })
      .catch(() => {
        // Network failure — keep the token so a reload can retry rather than
        // logging the user out because the server blipped.
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsRestoring(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const adopt = useCallback((data: { user: AuthUser; token: string }) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      adopt(await postJson('/api/auth/login', { email, password }));
    } finally {
      setIsSubmitting(false);
    }
  }, [adopt]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsSubmitting(true);
    try {
      adopt(await postJson('/api/auth/register', { name, email, password }));
    } finally {
      setIsSubmitting(false);
    }
  }, [adopt]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const saveState = useCallback(
    async (patch: { profile?: unknown; progress?: unknown }) => {
      if (!token) return;
      try {
        const res = await fetch('/api/auth/state', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(patch),
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        // Sync is best-effort; localStorage remains the source of truth offline.
      }
    },
    [token]
  );

  return (
    <AuthContext.Provider
      value={{ user, token, isRestoring, isSubmitting, login, register, logout, saveState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
