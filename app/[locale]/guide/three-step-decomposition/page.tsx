import { isSupportedLocale, getMessages, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

const SITE = 'https://somang.revely.company';

const CONTENT: Record<string, { title: string; intro: string; sections: { h: string; body: string }[]; cta: string }> = {
  ko: {
    title: '큰 꿈을 오늘 할 일로 — 3단 분해의 과학',
    intro:
      '"부자 되기" 같은 큰 꿈이 머릿속에서만 머무는 이유는 거리감 때문입니다. 인지심리학의 \"구성 수준 이론(Construal Level Theory)\"이 설명하듯, 멀리 있는 목표는 추상적으로 보이고, 추상적인 목표에는 실행 동기가 붙지 않아요. 오늘 행동으로 옮기려면, 큰 꿈을 가까운 구체로 \"끌어당기는\" 분해가 필요합니다. 소망노트가 1·2·3단 구조를 쓰는 이유입니다.',
    sections: [
      { h: '1단계 — 큰 꿈 (Why)', body: '\"건강해지기\", \"부자 되기\", \"좋은 사람 되기\". 이건 결과가 아니라 정체성입니다. 매일 보면 좋은 등대지만, 직접 따라가긴 어렵죠. 1단계는 적되 그대로 두세요. 지우지 마세요.' },
      { h: '2단계 — 구체적 소망 (What)', body: '\"체지방 15%\", \"월 매출 1억\", \"매일 한 명에게 친절\". 측정 가능, 시간 한정, 한 분기 안. SMART의 \"구체\"와 \"측정\". 이게 어디로 가야 할지 알려주는 GPS 핀입니다.' },
      { h: '3단계 — 오늘의 액션 (How)', body: '\"오늘 5층 계단 한 번\", \"오늘 한 명에게 안부 메시지\". 5분 안에 끝나야 합니다. BJ Fogg의 Tiny Habits, Gollwitzer의 Implementation Intention 모두 \"오늘 어떻게\"가 동력의 핵심임을 보여줘요.' },
      { h: '왜 5~7개여야 하나', body: '인지 부하 연구(Miller 1956: 7±2)는 일관됩니다. 한 번에 다룰 수 있는 청크는 5~9개. 액션이 너무 많으면 마비, 너무 적으면 추진력 부족. 소망노트는 5~8개로 분해합니다.' },
      { h: 'AI가 분해를 잘 하려면', body: '\"건강해지기 → 무엇\"이 아니라 \"건강해지기 → 오늘 어떤 5분짜리\"를 묻습니다. 소망노트의 시스템 프롬프트는 항상 첫 액션이 5분 안에 끝나도록 강제합니다. 시작이 작아야 시작합니다.' },
    ],
    cta: '내 큰 꿈을 분해해보기',
  },
  en: {
    title: 'Big Dream → Today\'s Task: The Science of 3-Step Decomposition',
    intro:
      'Big dreams like "be rich" stay stuck in your head because of psychological distance. Construal Level Theory shows: far goals appear abstract, abstract goals lack action motivation. To act today, pull the big dream closer via decomposition. That\'s why Somang Note uses 1·2·3 layers.',
    sections: [
      { h: 'Level 1 — Big Dream (Why)', body: '"Be healthy", "be rich", "be kind". These are identities, not outcomes. They make great lighthouses. Write them, but don\'t try to chase them directly. Keep them.' },
      { h: 'Level 2 — Concrete Wish (What)', body: '"Body fat 15%", "$100K monthly revenue", "kind to one person daily". Measurable, time-bound, one season. SMART\'s "Specific" and "Measurable". The GPS pin.' },
      { h: 'Level 3 — Today\'s Action (How)', body: '"One flight of stairs today", "send one kind message today". Must finish in 5 minutes. BJ Fogg\'s Tiny Habits + Gollwitzer\'s Implementation Intention both show: "today, how" is the engine.' },
      { h: 'Why 5–7 actions?', body: 'Cognitive load research (Miller 1956: 7±2) is consistent: 5–9 chunks at a time. Too many → paralysis. Too few → no momentum. Somang Note decomposes into 5–8.' },
      { h: 'Good AI decomposition', body: 'We don\'t ask "what for be healthy" — we ask "what 5-minute action for be healthy today". The system prompt forces the first action to fit in 5 minutes. Tiny start → start happens.' },
    ],
    cta: 'Decompose my big dream',
  },
  ja: {
    title: '大きな夢を今日のタスクに — 3段分解の科学',
    intro:
      '「お金持ちになる」のような大きな夢が頭の中だけにとどまるのは、心理的距離のせいです。構成水準理論(Construal Level Theory)が示すように、遠い目標は抽象的に見え、抽象的な目標には行動動機が乏しい。今日に引き寄せるには分解が必要。だからソマンノートは1·2·3段構造を採用しています。',
    sections: [
      { h: '段階1 — 大きな夢 (なぜ)', body: '「健康になる」「豊かになる」「優しくなる」。結果ではなくアイデンティティ。灯台として書き、追いかけず保管します。' },
      { h: '段階2 — 具体的な願い (何を)', body: '「体脂肪15%」「月100万売上」「1日1人に親切」。測定可能·期限付き·1四半期。SMARTの「具体性」「測定可能性」。GPSピン。' },
      { h: '段階3 — 今日の行動 (どう)', body: '「今日5階まで階段一度」「今日1通の親切メッセージ」。5分で終わる。BJ FoggのTiny Habits、GollwitzerのImplementation Intention、両方とも「今日どう」がエンジン。' },
      { h: 'なぜ5〜7個', body: '認知負荷研究(Miller 1956: 7±2):5〜9個。多すぎる→麻痺。少なすぎる→推進力なし。ソマンノートは5〜8個に分解。' },
      { h: 'AIにうまく分解させるには', body: '「健康になるには何」ではなく「健康になるために今日何の5分行動」を聞きます。最初の行動が必ず5分以内に収まるよう、システムプロンプトで強制。' },
    ],
    cta: '私の大きな夢を分解する',
  },
  'zh-CN': {
    title: '把大梦想化为今天的任务 — 三阶分解的科学',
    intro:
      '"变富有"这样的大梦想停留在脑中,是因为心理距离。建构水平理论(Construal Level Theory)表明:远的目标显得抽象,抽象目标缺乏行动动机。要今天行动,需要把大梦拉近,这就是分解。愿望笔记用1·2·3阶结构的原因。',
    sections: [
      { h: '第一阶 — 大梦想(为什么)', body: '"变健康""变富有""做善人"。这是身份,不是结果。当灯塔写下来,不要追,要保留。' },
      { h: '第二阶 — 具体愿望(做什么)', body: '"体脂15%""月入10万""每天善待一人"。可测量·有期限·一季度。SMART的"具体""可测"。GPS标记。' },
      { h: '第三阶 — 今天的行动(怎么做)', body: '"今天爬一次5层楼""今天发一条善意短信"。5分钟可完成。BJ Fogg 的 Tiny Habits + Gollwitzer 的执行意图都表明:"今天怎么做"是引擎。' },
      { h: '为什么5〜7个', body: '认知负荷研究(Miller 1956: 7±2):一次5〜9个。太多→瘫痪。太少→无推力。愿望笔记拆为5〜8个。' },
      { h: '让 AI 分解到位', body: '不问"为变健康做什么",问"为变健康今天做哪5分钟"。系统提示强制首个行动必在5分钟内。小开始→开始。' },
    ],
    cta: '分解我的大梦想',
  },
  'zh-TW': {
    title: '把大夢想化為今天的任務 — 三階分解的科學',
    intro:
      '「變富有」這樣的大夢想停留在腦中,是因為心理距離。建構水平理論(Construal Level Theory)表明:遠的目標顯得抽象,抽象目標缺乏行動動機。要今天行動,需要把大夢拉近,這就是分解。願望筆記用1·2·3階結構的原因。',
    sections: [
      { h: '第一階 — 大夢想(為什麼)', body: '「變健康」「變富有」「做善人」。這是身份,不是結果。當燈塔寫下來,不要追,要保留。' },
      { h: '第二階 — 具體願望(做什麼)', body: '「體脂15%」「月入10萬」「每天善待一人」。可測量·有期限·一季度。SMART的「具體」「可測」。GPS標記。' },
      { h: '第三階 — 今天的行動(怎麼做)', body: '「今天爬一次5層樓」「今天發一條善意短信」。5分鐘可完成。BJ Fogg 的 Tiny Habits + Gollwitzer 的執行意圖都表明:「今天怎麼做」是引擎。' },
      { h: '為什麼5〜7個', body: '認知負荷研究(Miller 1956: 7±2):一次5〜9個。太多→癱瘓。太少→無推力。願望筆記拆為5〜8個。' },
      { h: '讓 AI 分解到位', body: '不問「為變健康做什麼」,問「為變健康今天做哪5分鐘」。系統提示強制首個行動必在5分鐘內。小開始→開始。' },
    ],
    cta: '分解我的大夢想',
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
    alternates: { canonical: `${SITE}/${locale}/guide/three-step-decomposition` },
    openGraph: { title: c.title, description: c.intro.slice(0, 160), type: 'article' },
    twitter: { card: 'summary_large_image', title: c.title, description: c.intro.slice(0, 160) },
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

  const ld = {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Link href={`/${locale}`} className="text-xs text-somang-stone hover:text-somang-bark transition">
        ← {msgs.common.back}
      </Link>
      <article className="mt-6">
        <h1 className="text-3xl font-bold text-somang-bark leading-snug">{c.title}</h1>
        <p className="mt-4 text-base leading-relaxed">{c.intro}</p>
        {c.sections.map((s) => (
          <section key={s.h} className="mt-8">
            <h2 className="text-lg font-semibold text-somang-bark">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed">{s.body}</p>
          </section>
        ))}
        <Link
          href={`/${locale}`}
          className="mt-10 inline-block px-5 py-3 rounded-2xl bg-somang-bark text-somang-cream font-semibold hover:bg-somang-ink transition"
        >
          🌱 {c.cta}
        </Link>
      </article>
      <p className="text-xs text-somang-stone mt-12">{msgs.common.operated_by} · revely.company</p>
    </main>
  );
}
