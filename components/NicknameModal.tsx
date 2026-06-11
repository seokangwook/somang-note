'use client';
import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthProvider';
import type { Messages } from '@/lib/i18n';

export default function NicknameModal({ msgs }: { msgs: Messages }) {
  const { user, profile, refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Auto open if user logged in but no nickname (or default '소망지기')
  useEffect(() => {
    if (user && (!profile?.nickname || profile.nickname === '소망지기')) {
      setOpen(true);
      setValue('');
    }
  }, [user, profile?.nickname]);

  async function save() {
    const trimmed = value.trim();
    if (trimmed.length < 1 || trimmed.length > 12) {
      setErr(msgs.auth.nickname_error);
      return;
    }
    setSaving(true);
    try {
      const sb = getSupabaseBrowser();
      if (!sb) throw new Error('no supabase');
      const { error } = await sb.rpc('somang_set_nickname', { p_nickname: trimmed });
      if (error) {
        setErr(msgs.auth.nickname_error);
        setSaving(false);
        return;
      }
      await refresh();
      setOpen(false);
    } catch {
      setErr(msgs.auth.nickname_error);
    }
    setSaving(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-somang-cream rounded-3xl max-w-md w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-lg font-bold text-somang-bark mb-1">
          {msgs.auth.nickname_title}
        </h3>
        <p className="text-sm text-somang-stone mb-4">{msgs.auth.nickname_sub}</p>
        <input
          autoFocus
          maxLength={12}
          value={value}
          onChange={(e) => { setValue(e.target.value); setErr(null); }}
          placeholder={msgs.auth.nickname_placeholder}
          className="w-full px-4 py-3 rounded-xl bg-white border border-somang-mist focus:outline-none focus:ring-2 focus:ring-somang-leaf"
          onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
        />
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        <button
          onClick={save}
          disabled={saving}
          className="mt-4 w-full py-3 rounded-2xl bg-somang-bark text-somang-cream font-semibold disabled:opacity-50 hover:bg-somang-ink transition"
        >
          {saving ? '...' : msgs.auth.nickname_save}
        </button>
      </div>
    </div>
  );
}
