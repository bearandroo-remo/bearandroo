'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async (currentToken: string) => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'x-api-key': API_KEY ?? '',
        },
      });
      if (res.ok) {
        const data = (await res.json()) as User;
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
        });
      }
    } catch {
      // token geçersiz
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('customerToken');
    if (stored) {
      setToken(stored);
      void refreshUser(stored).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY ?? '',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Giriş başarısız');
    const data = (await res.json()) as { accessToken: string };
    localStorage.setItem('customerToken', data.accessToken);
    setToken(data.accessToken);
    await refreshUser(data.accessToken);
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY ?? '',
      },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error('Kayıt başarısız');
    const data = (await res.json()) as { accessToken: string };
    localStorage.setItem('customerToken', data.accessToken);
    setToken(data.accessToken);
    await refreshUser(data.accessToken);
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
