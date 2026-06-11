import { notFound } from 'next/navigation';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Metadata } from 'next';

const SITE = 'https://somang.revely.company';

interface PublicTree {
  nickname: string;
  total: number;
  done: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

async function fetchPublic(nickname: string): Promise<PublicTree | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
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

  // Lookup profile by nickname (RLS allows public read of nickname-only view? — 단순화: PoC는 anon select 불가, 향후 view 필요)
  // Phase 1: anon이면 빈 트리만 보여주는 fallback (실제 트리 공개는 사용자 opt-in 후 v3에서)
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ nickname: string }>;
}): Promise<Metadata> {
  const { nickname } = await params;
  const decoded = decodeURIComponent(nickname);
  return {
    title: `${decoded}님의 소망 나무 · 소망노트`,
    description: `${decoded}님의 비전보드입니다. 막연한 꿈을 오늘의 한 걸음으로 자라게 하는 중.`,
    alternates: { canonical: `${SITE}/u/${encodeURIComponent(decoded)}` },
    openGraph: {
      title: `${decoded}님의 소망 나무`,
      description: `${decoded}님의 비전보드를 응원해주세요. 🌱`,
      type: 'profile',
    },
    robots: { index: false, follow: false }, // 비공개 기본 (영구 룰 [[feedback_moi_private_by_default]] 참고)
  };
}

export default async function PublicProfile({
  params,
}: {
  params: Promise<{ nickname: string }>;
}) {
  const { nickname } = await params;
  const decoded = decodeURIComponent(nickname);
  if (decoded.length < 1 || decoded.length > 24) notFound();

  const data = await fetchPublic(decoded);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="max-w-md w-full">
        <div className="text-xs uppercase tracking-widest text-somang-stone mb-3">
          🌱 소망노트
        </div>
        <h1 className="font-display text-2xl font-bold text-somang-bark leading-snug">
          {decoded}님의 비전보드
        </h1>
        <p className="mt-4 text-sm text-somang-stone leading-relaxed">
          이 페이지는 {decoded}님의 비공개 비전보드입니다.<br />
          본인이 직접 공개하기 전까지는 내용을 볼 수 없어요.
        </p>

        <div className="mt-6 bg-white/60 backdrop-blur rounded-2xl p-5 border border-somang-mist">
          <p className="text-sm text-somang-ink">
            나만의 소망 나무를 키우고 싶나요?
          </p>
          <Link
            href="/ko"
            className="mt-3 inline-block px-5 py-3 rounded-2xl bg-somang-bark text-somang-cream font-semibold hover:bg-somang-ink transition"
          >
            🌱 내 소망 나무 시작하기
          </Link>
        </div>

        <p className="mt-10 text-xs text-somang-stone opacity-70">
          Operated by Revely · revely.company
        </p>
      </div>
    </main>
  );
}
