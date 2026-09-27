import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Profile } from './types';
import { useAppData } from './AppContext';
import { DEMO_PASSWORDS, INITIAL_PROFILES } from './data';
import { calculateAge } from './format';

interface RegisterData {
  full_name: string;
  email: string;
  phone: string;
  birthdate: string;
  id_document_url?: string;
}

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const passwords = { ...DEMO_PASSWORDS };

export function AuthProvider({ children }: { children: ReactNode }) {
  const { profiles, updateProfile, addProfile } = useAppData();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('vph_uid');
    if (stored) setUserId(stored);
    setLoading(false);
  }, []);

  const user = userId ? (profiles.find((p) => p.id === userId) ?? null) : null;

  const login = async (email: string, password: string) => {
    const expected = passwords[email];
    if (!expected || expected !== password) {
      throw new Error('Incorrect email or password.');
    }
    const profile = profiles.find((p) => p.email === email);
    if (!profile) throw new Error('Account not found.');
    setUserId(profile.id);
    localStorage.setItem('vph_uid', profile.id);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('vph_uid');
  };

  const register = async (data: RegisterData, password: string) => {
    const age = calculateAge(data.birthdate);
    if (age < 18) {
      throw new Error(
        'You must be at least 18 years old to register. This is a legally required minimum age.',
      );
    }
    if (profiles.find((p) => p.email === data.email)) {
      throw new Error('An account with this email already exists.');
    }
    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      ...data,
      verification_status: 'pending',
      is_admin: false,
      created_at: new Date().toISOString(),
    };
    passwords[data.email] = password;
    addProfile(newProfile);
    setUserId(newProfile.id);
    localStorage.setItem('vph_uid', newProfile.id);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
