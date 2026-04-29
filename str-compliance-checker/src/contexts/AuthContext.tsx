import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Plan = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: Plan;
  checksThisMonth: number;
  checksResetAt: string;
  monthlyLimit: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, plan: Plan) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('str_token'));
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('str_token'));

  const fetchMe = async (t: string) => {
    const r = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${t}` } });
    if (!r.ok) throw new Error('Token invalid');
    const { user } = await r.json();
    setUser(user);
  };

  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    fetchMe(token)
      .catch(() => { localStorage.removeItem('str_token'); setToken(null); setUser(null); })
      .finally(() => setIsLoading(false));
  }, [token]);

  const save = (u: User, t: string) => {
    localStorage.setItem('str_token', t);
    setToken(t);
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error ?? 'Login failed');
    save(data.user, data.token);
  };

  const signup = async (name: string, email: string, password: string, plan: Plan) => {
    const r = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, plan }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error ?? 'Registration failed');
    save(data.user, data.token);
  };

  const logout = () => {
    localStorage.removeItem('str_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    await fetchMe(token);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
