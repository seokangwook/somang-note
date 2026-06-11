'use client';
import { AnimatePresence } from 'framer-motion';
import PostIt from './PostIt';
import type { Messages } from '@/lib/i18n';
import type { WishNode } from '@/lib/storage';

interface ActionListProps {
  msgs: Messages;
  actions: WishNode[];
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onReopen: (id: string) => void;
}

export default function ActionList({ msgs, actions, onStart, onComplete, onReopen }: ActionListProps) {
  if (actions.length === 0) return null;

  // 첫 노랑(미시작) 액션 찾기 — 가장 작은 것 우선
  const firstAction = [...actions]
    .filter((a) => a.status === 'yellow')
    .sort((a, b) => (a.estimateMinutes ?? 60) - (b.estimateMinutes ?? 60))[0];

  return (
    <div>
      {firstAction && (
        <div className="mb-6 max-w-md mx-auto bg-somang-cream/90 backdrop-blur rounded-2xl p-5 border-2 border-somang-leaf/40 shadow-md text-center">
          <div className="text-[10px] uppercase tracking-widest text-somang-leaf font-bold">
            ✨ {firstAction.estimateMinutes ?? 5}분 · 오늘의 첫 한 걸음
          </div>
          <div className="mt-2 font-display text-lg font-bold text-somang-bark leading-snug">
            {firstAction.title}
          </div>
          {firstAction.hint && (
            <div className="mt-1 text-xs text-somang-stone">{firstAction.hint}</div>
          )}
          <button
            onClick={() => onStart(firstAction.id)}
            className="mt-3 px-5 py-2 rounded-full bg-somang-leaf text-white text-sm font-semibold hover:bg-green-600 transition"
            aria-label={msgs.wish.start_action}
          >
            {msgs.wish.start_action} →
          </button>
        </div>
      )}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold text-somang-bark">{msgs.wish.actions_title}</h2>
        <p className="text-sm text-somang-stone mt-0.5">{msgs.wish.actions_sub}</p>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <AnimatePresence>
          {actions.map((a, i) => (
            <PostIt
              key={a.id}
              title={a.title}
              hint={a.hint}
              status={a.status}
              minutes={a.estimateMinutes}
              onStart={() => onStart(a.id)}
              onComplete={() => onComplete(a.id)}
              onReopen={() => onReopen(a.id)}
              startLabel={msgs.wish.start_action}
              completeLabel={msgs.wish.complete_action}
              reopenLabel={msgs.wish.reopen_action}
              rotation={((i % 5) - 2) * 1.5}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
