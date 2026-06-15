'use client';
import { getSupabaseBrowser } from './supabase';

export async function signInWithGoogle() {
  const supabase = getSupabaseBrowser();
  if (!supabase) return;
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      queryParams: { prompt: 'select_account' },
    },
  });
  if (error) console.error('Google OAuth error:', error.message);
}

export async function signOut() {
  const supabase = getSupabaseBrowser();
  if (!supabase) return;
  await supabase.auth.signOut();
}
