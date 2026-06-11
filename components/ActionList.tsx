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

  return (
    <div>
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
