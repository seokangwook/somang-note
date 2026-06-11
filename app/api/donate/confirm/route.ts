// Toss Payments confirm webhook stub.
// 실제 Toss 키는 환경변수로. 현재는 사용자 환경에서 TOSS_SECRET_KEY 미설정 시 stub 모드.
//
// 운영 시 흐름:
//   1) 클라이언트 → Toss 결제 위젯 (paymentKey + orderId 생성)
//   2) 결제 성공 후 confirm POST → 이 라우트
//   3) Toss API confirm → 결제 검증 → Supabase RPC somang_grant_chur 호출
//   4) 사용자 ad_free_until = now() + 365일

import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { paymentKey, orderId, amount, tier } = body as {
    paymentKey?: string;
    orderId?: string;
    amount?: number;
    tier?: 'silver' | 'gold';
  };

  if (!paymentKey || !orderId || !amount || !tier) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  // 가격 검증 (₩1,000 / ₩3,000)
  const expectedAmount = tier === 'silver' ? 1000 : 3000;
  if (amount !== expectedAmount) {
    return NextResponse.json({ error: 'amount_mismatch' }, { status: 400 });
  }

  const tossSecret = process.env.TOSS_SECRET_KEY;
  if (!tossSecret) {
    // stub 모드: 결제 실제 호출 X, 츄르 grant도 X (안전)
    return NextResponse.json({
      stub: true,
      message: 'TOSS_SECRET_KEY 미설정 — 결제 라우트 stub 모드',
    }, { status: 200 });
  }

  // 실제 Toss confirm
  const tossRes = await fetch(`https://api.tosspayments.com/v1/payments/confirm`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(tossSecret + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!tossRes.ok) {
    return NextResponse.json({ error: 'toss_failed' }, { status: 502 });
  }

  // Grant chur via Supabase RPC (서버 컴포넌트 쿠키 컨텍스트 사용)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const cookieStore = await cookies();
    const sb = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(c: { name: string; value: string; options?: CookieOptions }[]) {
            c.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          },
        },
      },
    );
    await sb.rpc('somang_grant_chur', { p_tier: tier });
  }

  return NextResponse.json({ ok: true });
}
