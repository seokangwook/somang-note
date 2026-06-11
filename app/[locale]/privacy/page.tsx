import { isSupportedLocale, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const CONTENT: Record<string, { title: string; sections: { h: string; body: string }[] }> = {
  ko: {
    title: '개인정보 처리방침',
    sections: [
      { h: '1. 수집 항목', body: 'Google 로그인 시 이메일·표시 이름·프로필 사진. 사용자 입력 소망 텍스트 (1·2·3단계). 익명 사용 통계 (Vercel Analytics).' },
      { h: '2. 이용 목적', body: '소망 데이터 저장 및 동기화. AI 분해 결과 제공 (Google Gemini API). 서비스 개선 및 통계.' },
      { h: '3. 보관 기간', body: '계정 삭제 요청 시 즉시 영구 삭제. 로그아웃 후에도 데이터는 유지(재로그인 시 복구).' },
      { h: '4. 광고', body: 'Google AdSense를 사용합니다. 쿠키 기반 맞춤 광고가 표시될 수 있으며, https://adssettings.google.com 에서 거부 가능.' },
      { h: '5. 문의', body: 'revely.company@gmail.com' },
    ],
  },
  en: {
    title: 'Privacy Policy',
    sections: [
      { h: '1. Information Collected', body: 'On Google sign-in: email, display name, profile photo. User-entered wish text (level 1·2·3). Anonymous usage stats (Vercel Analytics).' },
      { h: '2. Purpose of Use', body: 'Save and sync your wishes. Provide AI decomposition (Google Gemini API). Service improvement.' },
      { h: '3. Retention', body: 'Deleted immediately on account-deletion request. Data persists across logout (restored on re-login).' },
      { h: '4. Advertising', body: 'We use Google AdSense. Cookie-based personalized ads may be shown. You can opt out at https://adssettings.google.com.' },
      { h: '5. Contact', body: 'revely.company@gmail.com' },
    ],
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const c = CONTENT[locale] ?? CONTENT.en;

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-somang-ink leading-relaxed">
      <Link href={`/${locale}`} className="text-xs text-somang-stone hover:text-somang-bark transition">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold text-somang-bark">{c.title}</h1>
      {c.sections.map((s) => (
        <section key={s.h} className="mt-6">
          <h2 className="font-semibold text-somang-bark">{s.h}</h2>
          <p className="mt-2 text-sm">{s.body}</p>
        </section>
      ))}
      <p className="text-xs text-somang-stone mt-10">Operated by Revely · revely.company</p>
    </main>
  );
}
