import Link from 'next/link';

export default function DonateSuccess() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="text-5xl">☕</div>
      <h1 className="mt-4 text-2xl font-bold text-somang-bark">
        커피 한 잔 잘 마셨어요!
      </h1>
      <p className="mt-3 text-sm text-somang-stone max-w-md">
        응원해주셔서 정말 고마워요.<br />
        1년 동안 광고 없이 소망노트를 사용하실 수 있어요. 🌱
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
