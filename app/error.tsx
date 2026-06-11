'use client';
import { useEffect } from 'react';

// 전역 에러 바운더리 — 사용자에 raw 에러 노출 X, 회복 CTA만.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[somang-note]', error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="text-5xl">🌱</div>
      <h2 className="mt-4 text-xl font-bold text-somang-bark">
        잠깐 멈춰 있어요
      </h2>
      <p className="mt-3 text-sm text-somang-stone max-w-md">
        새로고침하거나, 잠시 후 다시 시도해 주세요.
      </p>
      <button
        onClick={reset}
        className="mt-6 px-5 py-3 rounded-2xl bg-somang-bark text-somang-cream font-semibold hover:bg-somang-ink transition"
      >
        다시 시도
      </button>
    </main>
  );
}
