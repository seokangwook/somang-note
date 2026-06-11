import { isSupportedLocale, getMessages, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import HomeClient from './HomeClient';

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const msgs = getMessages(locale as Locale);
  return <HomeClient locale={locale as Locale} msgs={msgs} />;
}
