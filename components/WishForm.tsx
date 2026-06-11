'use client';
import { useState } from 'react';
import type { Messages } from '@/lib/i18n';

interface WishFormProps {
  msgs: Messages;
  onSubmit: (level1: string, level2: string) => void;
  loading?: boolean;
}

export default function WishForm({ msgs, onSubmit, loading }: WishFormProps) {
  const [level1, setLevel1] = useState('');
  const [level2, setLevel2] = useState('');

  const canSubmit = level1.trim().length >= 2 && level2.trim().length >= 2 && !loading;

  const examples = [
    msgs.wish.example_dream_1,
    msgs.wish.example_dream_2,
    msgs.wish.example_dream_3,
    msgs.wish.example_dream_4,
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      <section className="bg-white/70 backdrop-blur rounded-2xl p-5 border border-somang-mist shadow-sm">
        <h3 className="text-sm font-semibold text-somang-bark mb-1">{msgs.wish.level1_title}</h3>
        <p className="text-xs text-somang-stone mb-3">{msgs.wish.level1_sub}</p>
        <input
          value={level1}
          onChange={(e) => setLevel1(e.target.value)}
          placeholder={msgs.wish.level1_placeholder}
          maxLength={60}
          className="w-full px-4 py-3 rounded-xl bg-somang-cream border border-somang-mist focus:outline-none focus:ring-2 focus:ring-somang-leaf text-somang-ink"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setLevel1(ex)}
              className="text-[11px] px-2 py-0.5 rounded-full bg-somang-mist/60 text-somang-stone hover:bg-somang-mist transition"
            >
              {ex}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white/70 backdrop-blur rounded-2xl p-5 border border-somang-mist shadow-sm">
        <h3 className="text-sm font-semibold text-somang-bark mb-1">{msgs.wish.level2_title}</h3>
        <p className="text-xs text-somang-stone mb-3">{msgs.wish.level2_sub}</p>
        <input
          value={level2}
          onChange={(e) => setLevel2(e.target.value)}
          placeholder={msgs.wish.level2_placeholder}
          maxLength={80}
          className="w-full px-4 py-3 rounded-xl bg-somang-cream border border-somang-mist focus:outline-none focus:ring-2 focus:ring-somang-leaf text-somang-ink"
        />
      </section>

      <button
        onClick={() => onSubmit(level1.trim(), level2.trim())}
        disabled={!canSubmit}
        className="w-full py-4 rounded-2xl bg-somang-bark text-somang-cream font-semibold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-somang-ink active:scale-[0.98] transition shadow-md"
      >
        {loading ? msgs.wish.decompose_loading : msgs.wish.decompose_cta}
      </button>
    </div>
  );
}
