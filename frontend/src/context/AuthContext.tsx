'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getUserProfile, login as loginRequest, register as registerRequest } from '@/lib/api';

type User = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrateUser = async (storedToken: string) => {
    try {
      const profile = await getUserProfile();
      setUser(profile as User);
      setToken(storedToken);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setLoading(false);
      return;
    }

    hydrateUser(storedToken)
      .catch(() => {
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = (await loginRequest({ email, password })) as {
        token: string;
        user?: User;
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
      }
      setToken(response.token);
      if (response.user) {
        setUser(response.user);
      } else {
        await hydrateUser(response.token);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = (await registerRequest({ name, email, password })) as {
        token: string;
        user?: User;
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
      }
      setToken(response.token);
      if (response.user) {
        setUser(response.user);
      } else {
        await hydrateUser(response.token);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setToken(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
