import { isSupportedLocale, LOCALE_META, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return [
    'ko', 'en', 'ja',
    'zh-CN', 'zh-TW',
    'es', 'pt-BR',
    'fr', 'de', 'it', 'ru',
    'ar', 'id', 'hi', 'vi', 'th',
  ].map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const meta = LOCALE_META[locale as Locale];
  return (
    <div dir={meta.dir} lang={meta.htmlLang}>
      {children}
    </div>
  );
}
