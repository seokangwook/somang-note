import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="text-5xl">🌿</div>
      <h2 className="mt-4 text-xl font-bold text-somang-bark">
        길을 잃었나요?
      </h2>
      <p className="mt-3 text-sm text-somang-stone max-w-md">
        이 페이지는 존재하지 않아요. 내 나무로 돌아가서 새 소망을 적어볼까요?
      </p>
      <Link
        href="/ko"
        className="mt-6 px-5 py-3 rounded-2xl bg-somang-bark text-somang-cream font-semibold hover:bg-somang-ink transition"
      >
        🌱 내 나무로 돌아가기
      </Link>
    </main>
  );
}
