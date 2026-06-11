import { isSupportedLocale, getMessages, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

const SITE = 'https://somang.revely.company';

const CONTENT: Record<string, { title: string; intro: string; sections: { h: string; body: string }[]; cta: string }> = {
  ko: {
    title: '신년 결심이 늘 무너지는 진짜 이유 — 그리고 무너지지 않는 5가지 방법',
    intro:
      "매년 1월 1일, 우리는 거대한 결심을 적습니다. \"올해는 꼭 운동을 시작할 거야.\" \"올해는 책 50권을 읽을 거야.\" 그런데 2월쯤이면 대부분이 사라지죠. 의지가 약해서가 아닙니다. 결심이 너무 추상적이기 때문이에요. 학술 연구에서 입증된, 무너지지 않는 결심의 비밀 5가지를 소개합니다.",
    sections: [
      {
        h: '1. \"운동하기\"가 아니라 \"화요일 저녁 7시 동네 한 바퀴\"로',
        body:
          '구체성은 의지보다 강합니다. 사회심리학자 Gollwitzer의 \"실행 의도(Implementation Intention)\" 연구는 \"언제·어디서·어떻게\"를 정한 사람의 목표 달성률이 그렇지 않은 사람보다 2~3배 높다는 것을 보여줍니다. \"운동하기\"는 결심이고, \"화요일 저녁 7시, 동네 한 바퀴\"는 실행입니다.',
      },
      {
        h: '2. 큰 꿈은 그대로 두고, 오늘 할 일만 5분짜리로',
        body:
          '\"건강해지기\"는 1단계 큰 꿈이에요. 그것을 \"체지방 15%\"라는 2단계 구체 소망으로, 다시 \"오늘 5층까지 계단으로 한 번\"이라는 3단계 액션으로 분해해야 합니다. 5분 안에 끝나는 일이 시작이고, 시작은 가속을 만듭니다 (BJ Fogg의 Tiny Habits 모델).',
      },
      {
        h: '3. 채찍 대신 시각화 — 색·나무·계절',
        body:
          'Habitica의 RPG 처벌 메커니즘은 학술적으로 역효과가 입증되었습니다 (Sailer et al., IJHCS 2019). 잃을 두려움보다 자라남의 보상이 강합니다. 포스트잇 색이 바뀌고, 나무가 봄에서 여름으로 변하는 시각화가 동기를 유지시켜줍니다.',
      },
      {
        h: '4. 모든 결심을 적지 마세요 — 한 시즌에 하나만',
        body:
          '심리학에서는 \"목표 충돌(Goal Conflict)\"이 있습니다. 동시에 여러 결심을 하면 서로 자원을 빼앗아 모두 실패합니다. 한 분기에 하나의 1단계 큰 꿈 → 하나의 2단계 구체 소망 → 5~7개의 3단계 액션. 이것이 무너지지 않는 구조입니다.',
      },
      {
        h: '5. 멈춰도 다시 시작할 수 있는 루트 — 빨강 X 대신 노랑 다시',
        body:
          '대부분의 앱은 멈춘 사용자에게 빨간 X를 줍니다. 그러면 다시 시작할 의지가 사라져요. 소망노트는 완료한 초록 포스트잇도 \"다시 열기\" 한 번이면 노랑으로 돌아갑니다. 멈춰도 괜찮습니다. 다시 시작이 노랑입니다.',
      },
    ],
    cta: '소망노트로 첫 한 걸음 시작하기',
  },
  en: {
    title: 'Why Your New Year Resolutions Fail — And 5 Research-Backed Ways They Don\'t',
    intro:
      'Every January 1st, we write big resolutions. "This year I\'ll exercise." "This year I\'ll read 50 books." By February, most are gone. It\'s not weak willpower — it\'s that resolutions are too abstract. Here are 5 research-backed ways to make them stick.',
    sections: [
      {
        h: '1. Replace "exercise" with "Tuesday 7pm, one lap around the block"',
        body:
          "Gollwitzer's research on Implementation Intentions shows people who specify when, where, and how achieve goals 2–3× more often. \"Exercise\" is a wish; \"Tuesday 7pm, one lap\" is an action.",
      },
      {
        h: '2. Keep the big dream — but make today\'s task 5 minutes',
        body:
          '"Be healthy" is the big dream. Break it into "body fat 15%" and then into "today: one flight of stairs." Five-minute tasks start. Starting creates momentum (BJ Fogg, Tiny Habits).',
      },
      {
        h: '3. Reward over punishment — colors, trees, seasons',
        body:
          "Habitica's RPG punishment was shown to backfire (Sailer et al., IJHCS 2019). Growth visualization beats fear of loss. Watching post-its turn green and a tree turn from spring to summer keeps motivation alive.",
      },
      {
        h: '4. Don\'t list everything — one big dream per season',
        body:
          'Goal Conflict in psychology: multiple simultaneous resolutions starve each other. One season, one Level-1 dream → one Level-2 wish → 5–7 Level-3 actions. That\'s the resilient structure.',
      },
      {
        h: '5. Pausing is okay — yellow comes back, never red',
        body:
          'Most apps slap a red X on paused users. Somang Note lets completed (green) post-its return to yellow with one tap. Pausing is okay. Restarting is yellow.',
      },
    ],
    cta: 'Start your first step with Somang Note',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const c = CONTENT[locale] ?? CONTENT.en;
  return {
    title: c.title,
    description: c.intro.slice(0, 160),
    alternates: { canonical: `${SITE}/${locale}/guide/new-year-resolution` },
    openGraph: {
      title: c.title,
      description: c.intro.slice(0, 160),
      type: 'article',
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const msgs = getMessages(locale as Locale);
  const c = CONTENT[locale] ?? CONTENT.en;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.title,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'Revely' },
    publisher: { '@type': 'Organization', name: 'Revely' },
    datePublished: '2026-06-11',
    description: c.intro.slice(0, 160),
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-somang-ink leading-relaxed">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Link
        href={`/${locale}`}
        className="text-xs text-somang-stone hover:text-somang-bark transition"
      >
        ← {msgs.common.back}
      </Link>

      <article className="mt-6">
        <h1 className="text-3xl font-bold text-somang-bark leading-snug">{c.title}</h1>
        <p className="mt-4 text-base text-somang-ink leading-relaxed">{c.intro}</p>

        {c.sections.map((s) => (
          <section key={s.h} className="mt-8">
            <h2 className="text-lg font-semibold text-somang-bark">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-somang-ink">{s.body}</p>
          </section>
        ))}

        <Link
          href={`/${locale}`}
          className="mt-10 inline-block px-5 py-3 rounded-2xl bg-somang-bark text-somang-cream font-semibold hover:bg-somang-ink transition"
        >
          🌱 {c.cta}
        </Link>
      </article>

      <p className="text-xs text-somang-stone mt-12">
        {msgs.common.operated_by} · revely.company
      </p>
    </main>
  );
}
