'use client';
import { motion } from 'framer-motion';
import type { WishStatus } from '@/lib/storage';

interface PostItProps {
  title: string;
  hint?: string;
  status: WishStatus;
  minutes?: number;
  onStart?: () => void;
  onComplete?: () => void;
  onReopen?: () => void;
  startLabel: string;
  completeLabel: string;
  reopenLabel: string;
  rotation?: number;
}

const STATUS_STYLE: Record<WishStatus, { bg: string; edge: string; text: string }> = {
  yellow: { bg: '#fff4a3', edge: '#e8d971', text: '#5a4a18' },
  blue:   { bg: '#bcd9f5', edge: '#7aaadc', text: '#1c3a55' },
  green:  { bg: '#bfe5b8', edge: '#74b46c', text: '#1f4d1c' },
};

export default function PostIt({
  title, hint, status, minutes,
  onStart, onComplete, onReopen,
  startLabel, completeLabel, reopenLabel,
  rotation = -2,
}: PostItProps) {
  const s = STATUS_STYLE[status];
  return (
    <motion.div
      layout
      initial={{ y: -30, opacity: 0, rotate: rotation - 6 }}
      animate={{ y: 0, opacity: 1, rotate: rotation }}
      whileHover={{ rotate: 0, scale: 1.04 }}
      transition={{
        type: 'spring',
        stiffness: 240,
        damping: 18,
        backgroundColor: { duration: 0.6 },
      }}
      style={{
        backgroundColor: s.bg,
        borderColor: s.edge,
        color: s.text,
      }}
      className="relative w-full sm:w-[220px] min-h-[120px] rounded-md border-2 px-4 py-3 shadow-md cursor-default"
    >
      {/* tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/60 border border-white/80 rotate-3 rounded-sm shadow-sm" />

      <div className="font-display text-base font-semibold leading-snug mb-1.5">{title}</div>
      {hint && <div className="text-xs leading-snug opacity-75 mb-2">{hint}</div>}
      {minutes != null && (
        <div className="text-[10px] uppercase tracking-wider opacity-60">{minutes} min</div>
      )}

      <div className="mt-3 flex gap-1.5 flex-wrap">
        {status === 'yellow' && onStart && (
          <button
            onClick={onStart}
            className="text-xs px-2.5 py-1 rounded-full bg-white/70 hover:bg-white border border-current/30 transition"
          >
            {startLabel}
          </button>
        )}
        {status === 'blue' && onComplete && (
          <button
            onClick={onComplete}
            className="text-xs px-2.5 py-1 rounded-full bg-white/70 hover:bg-white border border-current/30 transition"
          >
            {completeLabel}
          </button>
        )}
        {status === 'green' && onReopen && (
          <button
            onClick={onReopen}
            className="text-xs px-2.5 py-1 rounded-full bg-white/40 hover:bg-white/70 border border-current/20 transition"
          >
            {reopenLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}
