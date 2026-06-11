'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Messages } from '@/lib/i18n';
import type { TreeStats } from '@/lib/storage';

interface Props {
  msgs: Messages;
  season: TreeStats['season'];
}

const ICON: Record<TreeStats['season'], string> = {
  spring: '🌸',
  summer: '🌿',
  autumn: '🍂',
  winter: '❄️',
};

export default function SeasonToast({ msgs, season }: Props) {
  const prev = useRef<TreeStats['season'] | null>(null);
  const [show, setShow] = useState<{ from: TreeStats['season']; to: TreeStats['season'] } | null>(null);

  useEffect(() => {
    if (prev.current && prev.current !== season) {
      setShow({ from: prev.current, to: season });
      const t = setTimeout(() => setShow(null), 3200);
      return () => clearTimeout(t);
    }
    prev.current = season;
  }, [season]);

  const label = {
    spring: msgs.home.season_label_spring,
    summer: msgs.home.season_label_summer,
    autumn: msgs.home.season_label_autumn,
    winter: msgs.home.season_label_winter,
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur rounded-full px-5 py-3 shadow-lg border border-somang-mist"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 text-sm text-somang-bark">
            <span className="text-xl">{ICON[show.to]}</span>
            <span className="font-semibold">
              {msgs.tree.season_changed} — {label[show.to]}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
