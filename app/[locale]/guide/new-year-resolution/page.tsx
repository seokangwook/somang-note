import { isSupportedLocale, getMessages, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

const SITE = 'https://somang.revely.company';

const CONTENT: Record<string, { title: string; intro: string; sections: { h: string; body: string }[]; cta: string }> = {
  ja: {
    title: '新年の決意がいつも崩れる本当の理由 — 崩れない5つの方法',
    intro:
      '毎年1月1日、私たちは大きな決意を書きます。「今年は運動を始めるぞ。」「今年は本を50冊読むぞ。」けれど2月にはほとんど消えています。意志が弱いからではありません。決意が抽象的すぎるからです。学術研究に裏打ちされた、崩れない5つの方法を紹介します。',
    sections: [
      { h: '1. 「運動する」ではなく「火曜19時、近所一周」に', body: 'Gollwitzerの実行意図(Implementation Intention)研究によれば、いつ・どこで・どうやってを明確にした人は目標達成率が2〜3倍高い。「運動する」は願い、「火曜19時、近所一周」は行動です。' },
      { h: '2. 大きな夢はそのまま — 今日のタスクは5分', body: '「健康になる」は段階1の大きな夢。それを「体脂肪15%」という段階2、さらに「今日5階まで階段で一度」という段階3の行動に分解する。5分で終わるタスクは始まり、始まりは加速を生みます (BJ Fogg, Tiny Habits)。' },
      { h: '3. 鞭ではなく視覚化 — 色・木・季節', body: 'Habiticaの罰メカニズムは学術的に逆効果が実証されました (Sailer et al., IJHCS 2019)。失う恐怖より育つ報酬の方が強い。付箋の色が変わり、木が春から夏へ変わる視覚化が動機を保ちます。' },
      { h: '4. 全部書かない — 1シーズンに1つだけ', body: '心理学にゴール・コンフリクトがあります。同時に複数の決意は互いに資源を奪い合います。1四半期に1つの段階1 → 1つの段階2 → 5〜7つの段階3行動。これが崩れない構造です。' },
      { h: '5. 止まっても再開できる — 赤いXではなく黄色に戻る', body: 'ほとんどのアプリは止まったユーザーに赤いXを与えます。再開する意欲が消えます。ソマンノートは緑の完了付箋も「再開」一回で黄色に戻ります。止まっていい。再開は黄色です。' },
    ],
    cta: 'ソマンノートで最初の一歩を始める',
  },
  'zh-CN': {
    title: '新年决心总是崩塌的真正原因 — 5个不崩塌的科学方法',
    intro:
      '每年1月1日,我们写下宏大决心:"今年一定要开始运动。""今年要读50本书。"可到了2月,大多消失了。不是意志薄弱,是决心太抽象。介绍5个有学术研究支撑、不崩塌的方法。',
    sections: [
      { h: '1. 不要"运动",要"周二晚7点,小区一圈"', body: 'Gollwitzer 的执行意图研究表明,明确何时·何地·如何的人,目标完成率是2〜3倍。"运动"是愿望,"周二晚7点,小区一圈"是行动。' },
      { h: '2. 大梦想保持原样,今天的任务只5分钟', body: '"变健康"是第一阶大梦想,拆为"体脂15%"第二阶,再拆为"今天爬5层楼"第三阶行动。5分钟可完成才是开始,开始带来加速 (BJ Fogg, Tiny Habits)。' },
      { h: '3. 用奖励而非惩罚 — 颜色、树、季节', body: 'Habitica 的惩罚机制学术上被证明适得其反 (Sailer et al., IJHCS 2019)。失去的恐惧 < 成长的奖励。便利贴变色、树从春到夏的视觉化维持动力。' },
      { h: '4. 不要全部列出 — 一季度一个', body: '心理学有目标冲突。同时多个决心会相互抢夺资源。一季度一个第一阶 → 一个第二阶 → 5〜7个第三阶行动,这是不崩的结构。' },
      { h: '5. 停下也可以再开始 — 绿色可回黄色,不是红X', body: '大多app给停下的用户红X,消磨重启的意愿。愿望笔记里完成的绿色便利贴一键回到黄色。停下没关系,重新开始是黄色。' },
    ],
    cta: '用愿望笔记开始你的第一步',
  },
  'zh-TW': {
    title: '新年決心總是崩塌的真正原因 — 5個不崩塌的科學方法',
    intro:
      '每年1月1日,我們寫下宏大決心。「今年一定要開始運動。」「今年要讀50本書。」可到了2月,大多消失了。不是意志薄弱,是決心太抽象。介紹5個有學術研究支撐、不崩塌的方法。',
    sections: [
      { h: '1. 不要「運動」,要「週二晚7點,社區一圈」', body: 'Gollwitzer 的執行意圖研究表明,明確何時·何地·如何的人,目標完成率是2〜3倍。「運動」是願望,「週二晚7點,社區一圈」是行動。' },
      { h: '2. 大夢想保持原樣,今天的任務只5分鐘', body: '「變健康」是第一階大夢想,拆為「體脂15%」第二階,再拆為「今天爬5層樓」第三階行動。5分鐘可完成才是開始,開始帶來加速 (BJ Fogg, Tiny Habits)。' },
      { h: '3. 用獎勵而非懲罰 — 顏色、樹、季節', body: 'Habitica 的懲罰機制學術上被證明適得其反 (Sailer et al., IJHCS 2019)。失去的恐懼 < 成長的獎勵。便利貼變色、樹從春到夏的視覺化維持動力。' },
      { h: '4. 不要全部列出 — 一季度一個', body: '心理學有目標衝突。同時多個決心會相互搶奪資源。一季度一個第一階 → 一個第二階 → 5〜7個第三階行動,這是不崩的結構。' },
      { h: '5. 停下也可以再開始 — 綠色可回黃色,不是紅X', body: '大多app給停下的用戶紅X,消磨重啟的意願。願望筆記裡完成的綠色便利貼一鍵回到黃色。停下沒關係,重新開始是黃色。' },
    ],
    cta: '用願望筆記開始你的第一步',
  },
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
