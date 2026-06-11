'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Messages } from '@/lib/i18n';

const KEY = 'somang-welcomed-v1';

export default function WelcomeBanner({ msgs }: { msgs: Messages }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(KEY)) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    try { localStorage.setItem(KEY, '1'); } catch {}
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 max-w-md mx-auto bg-white/80 backdrop-blur rounded-2xl px-4 py-3 border border-somang-leaf/30 shadow-sm flex items-start gap-3"
          role="status"
        >
          <div className="text-2xl">🌱</div>
          <div className="flex-1 text-sm text-somang-ink leading-relaxed">
            {msgs.home.hero_sub}
          </div>
          <button
            onClick={dismiss}
            aria-label="dismiss"
            className="text-somang-stone hover:text-somang-bark transition text-lg leading-none"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
