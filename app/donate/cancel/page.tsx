import Link from 'next/link';

export default function DonateCancel() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="text-5xl">🌱</div>
      <h1 className="mt-4 text-2xl font-bold text-somang-bark">
        괜찮아요, 다음에 또
      </h1>
      <p className="mt-3 text-sm text-somang-stone max-w-md">
        결제가 취소되었어요. 응원은 마음만으로도 충분해요.
      </p>
      <Link
        href="/ko"
        className="mt-6 px-5 py-3 rounded-2xl bg-somang-bark text-somang-cream font-semibold hover:bg-somang-ink transition"
      >
        내 나무로 돌아가기
      </Link>
    </main>
  );
}
