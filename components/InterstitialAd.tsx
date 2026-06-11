'use client';
import { useEffect, useState } from 'react';
import AdSlot from './AdSlot';
import type { Messages } from '@/lib/i18n';

interface Props {
  msgs: Messages;
  adFree: boolean; // 츄르 후원자 광고 제외
  onComplete: () => void;
}

// 결과 직전 5초 인터스티셜 (feedback_ads_placement_strategic 룰)
export default function InterstitialAd({ msgs, adFree, onComplete }: Props) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (adFree) {
      onComplete();
      return;
    }
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(t);
          onComplete();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [adFree, onComplete]);

  if (adFree) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-somang-cream rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-somang-stone">{msgs.ads.label}</span>
          <span className="text-xs text-somang-bark font-mono">
            {count > 0 ? `${count}s` : ''}
          </span>
        </div>
        <AdSlot placement="interstitial-before-result" />
        <p className="mt-4 text-center text-xs text-somang-stone">
          {msgs.wish.decompose_loading}
        </p>
      </div>
    </div>
  );
}
