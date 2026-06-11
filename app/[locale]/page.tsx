import { isSupportedLocale, getMessages, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import HomeClient from './HomeClient';
import JsonLd from './jsonld';
import type { Metadata } from 'next';

const SITE = 'https://somang.revely.company';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const msgs = getMessages(locale as Locale);
  return {
    title: `${msgs.common.brand} · ${msgs.common.brand_tagline}`,
    description: msgs.home.hero_sub,
    alternates: {
      canonical: `${SITE}/${locale}`,
      languages: {
        ko: `${SITE}/ko`,
        en: `${SITE}/en`,
        ja: `${SITE}/ja`,
        'zh-CN': `${SITE}/zh-CN`,
        'zh-TW': `${SITE}/zh-TW`,
        'x-default': `${SITE}/en`,
      },
    },
    openGraph: {
      title: `${msgs.common.brand} — ${msgs.common.brand_tagline}`,
      description: msgs.home.hero_sub,
      url: `${SITE}/${locale}`,
      type: 'website',
      siteName: msgs.common.brand,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${msgs.common.brand} — ${msgs.common.brand_tagline}`,
      description: msgs.home.hero_sub,
    },
  };
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const msgs = getMessages(locale as Locale);
  return (
    <>
      <JsonLd locale={locale as Locale} />
      <HomeClient locale={locale as Locale} msgs={msgs} />
    </>
  );
}
