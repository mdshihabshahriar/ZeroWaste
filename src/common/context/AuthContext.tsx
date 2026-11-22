import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Role, User } from '../data/types';
import * as auth from '../services/authService';

interface AuthValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (input: { name: string; phone: string; email: string; password: string }) => Promise<User>;
  chooseRole: (role: Role) => Promise<User>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Every app start begins on the Welcome screen: clear any old saved session
  useEffect(() => {
    auth
      .logout()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const value: AuthValue = {
    user,
    loading,
    login: async (email, password) => {
      const u = await auth.login(email, password);
      setUser(u);
      return u;
    },
    signup: async (input) => {
      const u = await auth.signup(input);
      setUser(u);
      return u;
    },
    chooseRole: async (role) => {
      if (!user) throw new Error('Please log in first.');
      const u = await auth.setRole(user.id, role);
      setUser(u);
      return u;
    },
    refresh: async () => {
      setUser(await auth.getCurrentUser());
    },
    logout: async () => {
      await auth.logout();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
