'use client';
import { useState } from 'react';
import type { Messages } from '@/lib/i18n';

// 응원 (츄르) 모달 - 영구 룰: "후원" X, "커피 한 잔" O
// 결제 wiring은 Toss Payments 등 별도 (Phase 6 이후)
export default function DonateButton({ msgs }: { msgs: Messages }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-3 py-1.5 rounded-full bg-somang-sun/40 hover:bg-somang-sun/60 text-somang-bark border border-somang-sun/60 transition"
      >
        ☕ {msgs.donate.title}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-somang-cream rounded-3xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-bold text-somang-bark mb-1">
              {msgs.donate.title}
            </h3>
            <p className="text-sm text-somang-stone mb-5">{msgs.donate.sub}</p>
            <div className="space-y-2">
              <button className="w-full py-3 rounded-2xl bg-white border border-somang-mist hover:border-somang-leaf transition text-somang-ink text-sm font-semibold">
                {msgs.donate.silver}
              </button>
              <button className="w-full py-3 rounded-2xl bg-somang-sun/40 border border-somang-sun hover:bg-somang-sun/60 transition text-somang-bark text-sm font-semibold">
                {msgs.donate.gold}
              </button>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-xs text-somang-stone hover:text-somang-bark transition"
            >
              {msgs.common.cancel}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
