import Link from 'next/link';
import type { Metadata } from 'next';

const SITE = 'https://somang.revely.company';

export const metadata: Metadata = {
  title: '소망노트 응원 안내 — 영구 무료 + ☕ 커피 한 잔',
  description: '소망노트는 영구 무료입니다. 구독·월결제 없음. 응원하고 싶다면 ☕ 커피 한 잔 (₩1,000 / ₩3,000)으로 1년 광고를 제거할 수 있어요.',
  alternates: { canonical: `${SITE}/support` },
};

export default function Support() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-somang-ink leading-relaxed">
      <Link href="/ko" className="text-xs text-somang-stone hover:text-somang-bark transition">
        ← 뒤로
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-somang-bark">
        ☕ 응원하기 안내
      </h1>

      <section className="mt-8 bg-white/60 backdrop-blur rounded-2xl p-6 border border-somang-mist">
        <h2 className="font-semibold text-somang-bark mb-2">소망노트는 영구 무료입니다</h2>
        <p className="text-sm">
          구독·월결제·자동갱신 없습니다. 광고는 결과 직전과 결과 하단에만 (자연스러운 전환점). 자라는 도구가 자기 자신을 자라게 하지 못하면 안 되니까요.
        </p>
      </section>

      <section className="mt-6 bg-somang-sun/30 rounded-2xl p-6 border border-somang-sun">
        <h2 className="font-semibold text-somang-bark mb-2">☕ 커피 한 잔으로 응원해 주실래요?</h2>
        <ul className="text-sm space-y-2 mt-3 list-disc list-inside">
          <li><strong>실버 응원 ₩1,000</strong> — 1년 동안 광고 없이 사용하실 수 있어요</li>
          <li><strong>골드 응원 ₩3,000</strong> — 1년 광고 제거 + 더 깊은 응원의 기쁨 ✨</li>
        </ul>
        <p className="mt-3 text-xs text-somang-stone">
          한 번 응원하시면 1년이 지나야 다시 결제됩니다. "후원"이 아니라 "커피 한 잔"이에요.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-somang-bark mb-2">자주 묻는 질문</h2>
        <dl className="space-y-4 mt-4 text-sm">
          <div>
            <dt className="font-semibold text-somang-bark">환불은 가능한가요?</dt>
            <dd className="mt-1">결제 후 7일 이내 미사용 상태라면 환불 가능합니다. revely.company@gmail.com 으로 연락주세요.</dd>
          </div>
          <div>
            <dt className="font-semibold text-somang-bark">자동 결제인가요?</dt>
            <dd className="mt-1">아니요. 한 번만 결제됩니다. 자동 갱신 영구 없음.</dd>
          </div>
          <div>
            <dt className="font-semibold text-somang-bark">광고가 다시 보이면 어떻게 하나요?</dt>
            <dd className="mt-1">1년이 지나면 다시 표시됩니다. 새로 응원해 주시면 1년이 다시 시작돼요.</dd>
          </div>
          <div>
            <dt className="font-semibold text-somang-bark">계정을 지울 수 있나요?</dt>
            <dd className="mt-1">예. revely.company@gmail.com 으로 요청하시면 즉시 영구 삭제해 드립니다.</dd>
          </div>
        </dl>
      </section>

      <p className="text-xs text-somang-stone mt-12">
        Operated by Revely · revely.company
      </p>
    </main>
  );
}
