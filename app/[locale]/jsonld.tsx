import type { Locale } from '@/lib/i18n';
import { LOCALE_META } from '@/lib/i18n';

const SITE = 'https://somang.revely.company';

export default function JsonLd({ locale }: { locale: Locale }) {
  const meta = LOCALE_META[locale];
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: locale === 'ko' ? '소망노트' : 'Somang Note',
    description:
      locale === 'ko'
        ? '막연한 꿈을 오늘의 한 걸음으로. AI가 큰 꿈을 오늘 할 일로 분해해 드리는 비전보드 + AI 코치.'
        : "Turn vague dreams into today's small step. A vision board + AI coach that breaks big dreams into doable actions.",
    url: `${SITE}/${locale}`,
    inLanguage: meta.htmlLang,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Revely',
      url: 'https://revely.company',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
