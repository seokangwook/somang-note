'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSupabaseBrowser, hasSupabase } from './supabase';

interface SomangProfile {
  uid: string;
  nickname: string;
  chur_silver: number;
  chur_gold: number;
  ad_free_until: string | null;
}

interface AuthValue {
  ready: boolean;
  enabled: boolean;
  user: { id: string; email?: string | null } | null;
  profile: SomangProfile | null;
  refresh: () => Promise<void>;
}

const AuthCtx = createContext<AuthValue>({
  ready: false,
  enabled: false,
  user: null,
  profile: null,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthValue['user']>(null);
  const [profile, setProfile] = useState<SomangProfile | null>(null);
  const [ready, setReady] = useState(false);
  const enabled = hasSupabase();

  async function loadProfile() {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const { data: { user: u } } = await sb.auth.getUser();
    setUser(u ? { id: u.id, email: u.email } : null);
    if (u) {
      const { data } = await sb.rpc('somang_get_profile');
      setProfile((data as SomangProfile) ?? null);
    } else {
      setProfile(null);
    }
  }

  useEffect(() => {
    if (!enabled) {
      setReady(true);
      return;
    }
    loadProfile().finally(() => setReady(true));
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const { data: sub } = sb.auth.onAuthStateChange(() => {
      loadProfile();
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [enabled]);

  return (
    <AuthCtx.Provider value={{ ready, enabled, user, profile, refresh: loadProfile }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
