'use client';
import { useEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-4128588337803742';

interface AdSlotProps {
  placement: 'after-result' | 'result-bottom' | 'home-bottom' | string;
  className?: string;
}

// 영구 룰 (feedback_ads_placement_strategic): 자동광고 X, 수동 AdSlot only.
// 결과직전 인터스티셜 5초, 홈/헤더/진행중 금지.
export default function AdSlot({ placement, className = '' }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current || !ref.current) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {}
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        data-ad-slot={placement}
        className={`mx-auto max-w-2xl rounded-2xl border border-somang-mist/60 bg-white/30 backdrop-blur-sm px-4 py-3 text-center text-xs text-somang-stone ${className}`}
      >
        <span className="opacity-60">광고 · {placement}</span>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
