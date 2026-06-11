'use client';
import { useAuth } from '@/lib/AuthProvider';
import { signInWithGoogle, signOut } from '@/lib/auth';
import type { Messages } from '@/lib/i18n';

export default function AuthChip({ msgs }: { msgs: Messages }) {
  const { ready, enabled, user, profile } = useAuth();

  if (!enabled) {
    // Supabase env 미설정 — 트래픽 사이트 룰: CTA는 항상 표시 (clientside env wiring 전까지 stub)
    return null;
  }

  if (!ready) {
    return <div className="text-xs text-somang-stone opacity-50">…</div>;
  }

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="text-xs px-3 py-1.5 rounded-full bg-somang-bark text-somang-cream hover:bg-somang-ink transition"
      >
        {msgs.auth.login_cta}
      </button>
    );
  }

  const adFree = profile?.ad_free_until && new Date(profile.ad_free_until) > new Date();

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-somang-bark font-semibold">
        {profile?.nickname ?? '...'}
      </span>
      {adFree && (
        <span className="px-1.5 py-0.5 rounded bg-somang-sun/30 text-somang-bark text-[10px]">
          ☕
        </span>
      )}
      <button
        onClick={signOut}
        className="text-somang-stone hover:text-somang-bark transition"
      >
        {msgs.auth.logout}
      </button>
    </div>
  );
}
