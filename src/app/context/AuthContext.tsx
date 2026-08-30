import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USERS, type User, type Role } from '../data/seed';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'department'>>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persistUser(user: User | null) {
  if (user) sessionStorage.setItem('upp_user', JSON.stringify(user));
  else sessionStorage.removeItem('upp_user');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('upp_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const account = MOCK_USERS[normalized];
    if (!account || account.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }
    const { password: _, ...userData } = account;
    setUser(userData);
    persistUser(userData);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<User, 'name' | 'department'>>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      persistUser(next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function roleDashboardPath(role: Role): string {
  return `/${role}/dashboard`;
}

export function roleProfilePath(role: Role): string {
  return `/${role}/profile`;
}
