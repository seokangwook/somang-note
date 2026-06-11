'use client';
import { useState } from 'react';
import type { Messages } from '@/lib/i18n';
import type { TreeStats } from '@/lib/storage';

interface Props {
  msgs: Messages;
  nickname: string;
  stats: TreeStats;
}

export default function ShareCard({ msgs, nickname, stats }: Props) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/api/share-card?n=${encodeURIComponent(nickname)}&done=${stats.done}&total=${stats.total}&s=${stats.season}`
    : '';
  const pageUrl = typeof window !== 'undefined' ? window.location.origin : '';

  async function share() {
    const text = msgs.share.caption;
    if (navigator.share && navigator.canShare?.({ text, url: pageUrl })) {
      try { await navigator.share({ text, url: pageUrl }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${pageUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  if (stats.total === 0) return null;

  return (
    <div className="mt-10 max-w-md mx-auto bg-white/60 backdrop-blur rounded-3xl p-5 border border-somang-mist shadow-sm">
      <div className="text-xs uppercase tracking-widest text-somang-stone mb-3">
        {msgs.share.cta}
      </div>
      <img
        src={url}
        alt="my tree share card"
        loading="lazy"
        className="w-full rounded-2xl border border-somang-mist"
      />
      <button
        onClick={share}
        className="mt-3 w-full py-3 rounded-2xl bg-somang-bark text-somang-cream font-semibold hover:bg-somang-ink transition"
      >
        {copied ? msgs.common.copied : msgs.common.share}
      </button>
    </div>
  );
}
