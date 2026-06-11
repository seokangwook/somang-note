// 추상 소망 → 구체 액션 분해. Gemini Flash-Lite + graceful fallback.
// Gemini 크레딧 소진(2026-06-11) 상태에서도 사용자에 에러 노출 X.

import { LOCALE_META, Locale } from './i18n';
import { callGemini, GeminiQuotaError } from './gemini';

export interface DecomposeInput {
  level1: string; // 큰 꿈
  level2: string; // 구체 소망
  locale: Locale;
}

export interface DecomposedAction {
  title: string;
  hint: string;
  estimateMinutes: number;
}

export interface DecomposeOutput {
  actions: DecomposedAction[];
  summary: string;
  encouragement: string;
  source: 'ai' | 'fallback';
}

function buildSystemPrompt(targetLanguage: string): string {
  return `You are 소망노트 (Somang Note) — a warm, grounded life coach that turns abstract dreams into concrete, kind, doable actions.

Output a STRICT JSON object (no markdown, no commentary outside JSON):
{
  "summary": "<1-2 sentence reflection on the user's dream — kind, encouraging, in target language>",
  "encouragement": "<1 short line that names what is beautiful about this wish>",
  "actions": [
    { "title": "<concise action, present tense, max 40 chars>", "hint": "<one specific tip / when-where, max 80 chars>", "estimateMinutes": <integer 5-120> },
    ... 5 to 8 actions total
  ]
}

RULES:
- Write EVERY string in ${targetLanguage}.
- Voice: warm, present, encouraging. Avoid drill-sergeant tone. NO punishment language.
- Actions must be TINY first → larger later. The first action should be doable in under 10 minutes.
- Actions must be CONCRETE: name a place, time, or object when possible.
- Avoid generic advice ("study hard", "be consistent"). Replace with a specific micro-task.
- estimateMinutes must reflect the action — quick wins (5-15) early, deeper work (30-120) later.
- 5 to 8 actions total. Never fewer than 5, never more than 8.

Output ONLY the JSON object.`;
}

function buildUserPrompt(input: DecomposeInput): string {
  return `Decompose this wish into actionable steps.

LEVEL 1 (big dream): ${input.level1}
LEVEL 2 (concrete wish): ${input.level2}

The user is at zero — give them a kind, tiny first step they can do today. Build from there.

Output the strict JSON now.`;
}

// ── Fallback: rule-based template (Gemini credits depleted 안전망) ──
const FALLBACK_TEMPLATES_KO = (level1: string, level2: string): DecomposeOutput => ({
  summary: `'${level1}'를 향한 '${level2}'는 충분히 의미 있는 소망이에요. 오늘 작은 한 걸음부터 시작해 볼까요.`,
  encouragement: '이 마음을 적었다는 것 자체가 이미 시작이에요.',
  source: 'fallback',
  actions: [
    { title: '소망을 종이에 한 줄로 적기', hint: '책상 위 잘 보이는 곳에 붙여 두세요', estimateMinutes: 5 },
    { title: '관련 자료 1개 찾아보기', hint: '유튜브·블로그 어디든 30분 안에 보이는 것 하나', estimateMinutes: 30 },
    { title: '이미 잘하는 사람 1명 관찰하기', hint: 'SNS 팔로우 또는 책 한 권 검색', estimateMinutes: 15 },
    { title: '오늘 할 수 있는 가장 작은 행동 하나', hint: '5분 안에 끝나는 것으로 골라요', estimateMinutes: 5 },
    { title: '내 주변에 함께 갈 사람 찾기', hint: '혼자가 아니어도 되는 길을 만들어요', estimateMinutes: 20 },
    { title: '한 주 뒤 점검 알람 맞추기', hint: '캘린더에 "소망 체크" 한 줄', estimateMinutes: 5 },
  ],
});

const FALLBACK_TEMPLATES_EN = (level1: string, level2: string): DecomposeOutput => ({
  summary: `Your wish "${level2}" toward "${level1}" is meaningful. Let's start with the smallest first step today.`,
  encouragement: 'Writing this wish down is already the beginning.',
  source: 'fallback',
  actions: [
    { title: 'Write the wish on paper', hint: 'Stick it where you can see it daily', estimateMinutes: 5 },
    { title: 'Find one related resource', hint: 'A YouTube video or article within 30 min', estimateMinutes: 30 },
    { title: 'Observe one person who does this well', hint: 'Follow on social or pick one book', estimateMinutes: 15 },
    { title: 'Take the tiniest action today', hint: 'Something that fits in 5 minutes', estimateMinutes: 5 },
    { title: 'Find someone to walk with', hint: 'A friend, a community, anyone', estimateMinutes: 20 },
    { title: 'Set a weekly check-in reminder', hint: 'One line in your calendar', estimateMinutes: 5 },
  ],
});

const FALLBACK_TEMPLATES_JA = (level1: string, level2: string): DecomposeOutput => ({
  summary: `「${level1}」に向けた「${level2}」という願いは、とても意味があります。今日、いちばん小さな一歩から始めましょう。`,
  encouragement: 'この願いを書き留めたこと自体が、もう始まりです。',
  source: 'fallback',
  actions: [
    { title: '願いを紙に一行で書く', hint: '机の見える場所に貼っておきましょう', estimateMinutes: 5 },
    { title: '関連する資料を1つ探す', hint: 'YouTube・ブログ何でもOK、30分以内', estimateMinutes: 30 },
    { title: '上手な人を1人観察する', hint: 'SNSフォローまたは本1冊', estimateMinutes: 15 },
    { title: '今日できる一番小さな行動', hint: '5分で終わるものを選びましょう', estimateMinutes: 5 },
    { title: '一緒に歩む人を見つける', hint: '友達・コミュニティ・誰でも', estimateMinutes: 20 },
    { title: '一週間後の点検アラーム', hint: 'カレンダーに「願いチェック」', estimateMinutes: 5 },
  ],
});

export function buildFallback(input: DecomposeInput): DecomposeOutput {
  const l = input.locale;
  if (l === 'ko') return FALLBACK_TEMPLATES_KO(input.level1, input.level2);
  if (l === 'ja') return FALLBACK_TEMPLATES_JA(input.level1, input.level2);
  return FALLBACK_TEMPLATES_EN(input.level1, input.level2);
}

export async function decompose(input: DecomposeInput): Promise<DecomposeOutput> {
  const meta = LOCALE_META[input.locale];
  const system = buildSystemPrompt(meta.geminiName);
  const userPrompt = buildUserPrompt(input);

  try {
    const raw = await callGemini(userPrompt, {
      systemInstruction: system,
      temperature: 0.85,
      maxOutputTokens: 1800,
      responseMimeType: 'application/json',
    });

    const cleaned = raw
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned) as Omit<DecomposeOutput, 'source'>;

    if (!Array.isArray(parsed.actions) || parsed.actions.length < 3) {
      return buildFallback(input);
    }
    if (!parsed.summary || parsed.summary.length < 10) {
      return buildFallback(input);
    }

    return {
      summary: parsed.summary,
      encouragement: parsed.encouragement ?? '',
      actions: parsed.actions
        .filter((a) => a && typeof a.title === 'string')
        .slice(0, 8)
        .map((a) => ({
          title: String(a.title).slice(0, 80),
          hint: String(a.hint ?? '').slice(0, 160),
          estimateMinutes: Math.max(5, Math.min(120, Math.round(Number(a.estimateMinutes) || 15))),
        })),
      source: 'ai',
    };
  } catch (e) {
    // Quota / API error / parse error → fallback (silent, user never sees raw error)
    if (e instanceof GeminiQuotaError) {
      console.warn('[decompose] Gemini quota — falling back to template');
    } else {
      console.warn('[decompose] AI failure — falling back:', (e as Error).message);
    }
    return buildFallback(input);
  }
}
