'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthProvider';
import type { Messages } from '@/lib/i18n';

// 응원 (츄르) 모달 - 영구 룰: "후원" X, "커피 한 잔" O
// Toss Payments 위젯은 NEXT_PUBLIC_TOSS_CLIENT_KEY 있을 때만 활성.
// 없으면 안내 메시지 (stub 모드).
export default function DonateButton({ msgs }: { msgs: Messages }) {
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState<null | 'silver' | 'gold'>(null);
  const [err, setErr] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  const adFree = Boolean(profile?.ad_free_until && new Date(profile.ad_free_until) > new Date());

  async function startPayment(tier: 'silver' | 'gold') {
    setErr(null);
    if (!user) {
      setErr(msgs.auth.login_cta);
      return;
    }
    if (!tossClientKey) {
      setErr('결제 모듈 설정 중이에요. 곧 사용 가능해질 거예요.');
      return;
    }
    setPaying(tier);
    try {
      // Toss Payments SDK 동적 로드
      const w = window as unknown as { TossPayments?: (k: string) => any };
      if (!w.TossPayments) {
        await new Promise<void>((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://js.tosspayments.com/v1/payment';
          s.onload = () => res();
          s.onerror = () => rej(new Error('toss sdk load failed'));
          document.head.appendChild(s);
        });
      }
      const tp = w.TossPayments!(tossClientKey);
      const amount = tier === 'silver' ? 1000 : 3000;
      const orderId = `somang-${tier}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await tp.requestPayment('카드', {
        amount,
        orderId,
        orderName: tier === 'silver' ? '소망노트 실버 응원' : '소망노트 골드 응원',
        customerName: profile?.nickname ?? '소망지기',
        successUrl: `${window.location.origin}/donate/success?tier=${tier}`,
        failUrl: `${window.location.origin}/donate/cancel`,
      });
    } catch (e) {
      setErr(msgs.errors.unknown);
    }
    setPaying(null);
  }

  if (adFree) {
    return (
      <span className="text-xs px-2 py-1 rounded-full bg-somang-sun/30 text-somang-bark">
        ☕ {msgs.donate.thanks}
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={msgs.donate.title}
        className="text-xs px-3 py-1.5 rounded-full bg-somang-sun/40 hover:bg-somang-sun/60 text-somang-bark border border-somang-sun/60 transition"
      >
        ☕ {msgs.donate.title}
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={msgs.donate.title}
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
              <button
                onClick={() => startPayment('silver')}
                disabled={paying !== null}
                aria-label={msgs.donate.silver}
                className="w-full py-3 rounded-2xl bg-white border border-somang-mist hover:border-somang-leaf transition text-somang-ink text-sm font-semibold disabled:opacity-50"
              >
                {paying === 'silver' ? '…' : msgs.donate.silver}
              </button>
              <button
                onClick={() => startPayment('gold')}
                disabled={paying !== null}
                aria-label={msgs.donate.gold}
                className="w-full py-3 rounded-2xl bg-somang-sun/40 border border-somang-sun hover:bg-somang-sun/60 transition text-somang-bark text-sm font-semibold disabled:opacity-50"
              >
                {paying === 'gold' ? '…' : msgs.donate.gold}
              </button>
            </div>
            {err && <p className="mt-3 text-xs text-red-600 text-center">{err}</p>}
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
