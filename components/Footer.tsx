import Link from 'next/link';
import type { Messages, Locale } from '@/lib/i18n';

interface Props {
  msgs: Messages;
  locale?: Locale;
}

export default function Footer({ msgs, locale = 'ko' }: Props) {
  return (
    <footer className="mt-16 py-8 text-center text-xs text-somang-stone">
      <nav className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        <Link href={`/${locale}/guide/new-year-resolution`} className="hover:text-somang-bark transition">
          🌱 신년결심 가이드
        </Link>
        <Link href={`/${locale}/guide/three-step-decomposition`} className="hover:text-somang-bark transition">
          📚 3단 분해의 과학
        </Link>
        <Link href="/support" className="hover:text-somang-bark transition">
          ☕ 응원 안내
        </Link>
        <Link href={`/${locale}/privacy`} className="hover:text-somang-bark transition">
          개인정보
        </Link>
      </nav>
      <div className="font-semibold">{msgs.common.brand} · revely.company</div>
      <div className="mt-1 opacity-70">{msgs.common.brand_tagline}</div>
    </footer>
  );
}
