import { NextResponse } from 'next/server';
import { decompose, buildFallback } from '@/lib/decompose';
import { isSupportedLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const level1 = typeof body?.level1 === 'string' ? body.level1.trim() : '';
    const level2 = typeof body?.level2 === 'string' ? body.level2.trim() : '';
    const rawLocale = typeof body?.locale === 'string' ? body.locale : DEFAULT_LOCALE;
    const locale: Locale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

    if (level1.length < 2 || level2.length < 2) {
      return NextResponse.json(
        { error: 'missing_fields' },
        { status: 400 },
      );
    }

    if (level1.length > 120 || level2.length > 200) {
      return NextResponse.json(
        { error: 'too_long' },
        { status: 400 },
      );
    }

    const result = await decompose({ level1, level2, locale });
    return NextResponse.json(result);
  } catch (e) {
    // Last-resort fallback — never leak 500 to user
    const result = buildFallback({
      level1: '...',
      level2: '...',
      locale: DEFAULT_LOCALE,
    });
    return NextResponse.json(result);
  }
}
