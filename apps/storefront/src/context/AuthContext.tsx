'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
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
  register: (email: string, password: string, name: string) => Promise<void>;
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

  useEffect(() => {
    const stored = localStorage.getItem('customerToken');
    if (stored) {
      setToken(stored);
      const payload = JSON.parse(atob(stored.split('.')[1])) as User & {
        sub: string;
      };
      setUser({
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      });
    }
    setIsLoading(false);
  }, []);

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
    const payload = JSON.parse(atob(data.accessToken.split('.')[1])) as User & {
      sub: string;
    };
    setUser({
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    });
  };

  const register = async (email: string, password: string, name: string) => {
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
    const payload = JSON.parse(atob(data.accessToken.split('.')[1])) as User & {
      sub: string;
    };
    setUser({
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    });
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
