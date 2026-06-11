// i18n 코어 - 16개국 + ko 우선. zenmind 패턴 재사용.

export const SUPPORTED_LOCALES = [
  'ko', 'en', 'ja',
  'zh-CN', 'zh-TW',
  'es', 'pt-BR',
  'fr', 'de', 'it', 'ru',
  'ar', 'id', 'hi', 'vi', 'th',
] as const;

export type Locale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: Locale = 'ko';

export const LOCALE_META: Record<Locale, {
  code: Locale;
  nativeName: string;
  englishName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  geminiName: string;
  htmlLang: string;
}> = {
  ko:      { code: 'ko',      nativeName: '한국어',           englishName: 'Korean',                 flag: '🇰🇷', dir: 'ltr', geminiName: 'Korean (한국어)',                 htmlLang: 'ko' },
  en:      { code: 'en',      nativeName: 'English',          englishName: 'English',                flag: '🇺🇸', dir: 'ltr', geminiName: 'English',                          htmlLang: 'en' },
  ja:      { code: 'ja',      nativeName: '日本語',            englishName: 'Japanese',               flag: '🇯🇵', dir: 'ltr', geminiName: 'Japanese (日本語)',                htmlLang: 'ja' },
  'zh-CN': { code: 'zh-CN',   nativeName: '简体中文',          englishName: 'Chinese (Simplified)',   flag: '🇨🇳', dir: 'ltr', geminiName: 'Simplified Chinese (简体中文)',   htmlLang: 'zh-CN' },
  'zh-TW': { code: 'zh-TW',   nativeName: '繁體中文',          englishName: 'Chinese (Traditional)',  flag: '🇹🇼', dir: 'ltr', geminiName: 'Traditional Chinese (繁體中文)',  htmlLang: 'zh-TW' },
  es:      { code: 'es',      nativeName: 'Español',          englishName: 'Spanish',                flag: '🇪🇸', dir: 'ltr', geminiName: 'Spanish (Español)',                htmlLang: 'es' },
  'pt-BR': { code: 'pt-BR',   nativeName: 'Português (BR)',   englishName: 'Portuguese (Brazil)',    flag: '🇧🇷', dir: 'ltr', geminiName: 'Brazilian Portuguese',             htmlLang: 'pt-BR' },
  fr:      { code: 'fr',      nativeName: 'Français',         englishName: 'French',                 flag: '🇫🇷', dir: 'ltr', geminiName: 'French (Français)',                htmlLang: 'fr' },
  de:      { code: 'de',      nativeName: 'Deutsch',          englishName: 'German',                 flag: '🇩🇪', dir: 'ltr', geminiName: 'German (Deutsch)',                 htmlLang: 'de' },
  it:      { code: 'it',      nativeName: 'Italiano',         englishName: 'Italian',                flag: '🇮🇹', dir: 'ltr', geminiName: 'Italian (Italiano)',               htmlLang: 'it' },
  ru:      { code: 'ru',      nativeName: 'Русский',          englishName: 'Russian',                flag: '🇷🇺', dir: 'ltr', geminiName: 'Russian (Русский)',                htmlLang: 'ru' },
  ar:      { code: 'ar',      nativeName: 'العربية',          englishName: 'Arabic',                 flag: '🇸🇦', dir: 'rtl', geminiName: 'Arabic (العربية)',                 htmlLang: 'ar' },
  id:      { code: 'id',      nativeName: 'Bahasa Indonesia', englishName: 'Indonesian',             flag: '🇮🇩', dir: 'ltr', geminiName: 'Indonesian (Bahasa Indonesia)',    htmlLang: 'id' },
  hi:      { code: 'hi',      nativeName: 'हिन्दी',             englishName: 'Hindi',                  flag: '🇮🇳', dir: 'ltr', geminiName: 'Hindi (हिन्दी)',                     htmlLang: 'hi' },
  vi:      { code: 'vi',      nativeName: 'Tiếng Việt',       englishName: 'Vietnamese',             flag: '🇻🇳', dir: 'ltr', geminiName: 'Vietnamese (Tiếng Việt)',          htmlLang: 'vi' },
  th:      { code: 'th',      nativeName: 'ไทย',              englishName: 'Thai',                   flag: '🇹🇭', dir: 'ltr', geminiName: 'Thai (ไทย)',                       htmlLang: 'th' },
};

export function isSupportedLocale(s: string): s is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(s);
}

export function pickLocaleFromHeader(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  const parts = header.split(',').map((p) => {
    const [tag, q = 'q=1'] = p.trim().split(';');
    const quality = parseFloat(q.replace('q=', '')) || 1;
    return { tag: tag.trim(), quality };
  }).sort((a, b) => b.quality - a.quality);

  for (const { tag } of parts) {
    if (isSupportedLocale(tag)) return tag as Locale;
    const lower = tag.toLowerCase();
    const upperRegion = lower.replace(/^([a-z]{2})-([a-z]{2,3})$/, (_m, a, b) =>
      `${a}-${b.toUpperCase()}`,
    );
    if (isSupportedLocale(upperRegion)) return upperRegion as Locale;
    const base = lower.split('-')[0];
    if (base === 'zh') {
      if (lower.includes('tw') || lower.includes('hk') || lower.includes('hant')) return 'zh-TW';
      return 'zh-CN';
    }
    if (base === 'pt') return 'pt-BR';
    if (isSupportedLocale(base)) return base as Locale;
  }
  return DEFAULT_LOCALE;
}

import koMsgs from '@/messages/ko.json';
import enMsgs from '@/messages/en.json';
import jaMsgs from '@/messages/ja.json';
import zhCNMsgs from '@/messages/zh-CN.json';
import zhTWMsgs from '@/messages/zh-TW.json';
import esMsgs from '@/messages/es.json';
import ptBRMsgs from '@/messages/pt-BR.json';
import frMsgs from '@/messages/fr.json';
import deMsgs from '@/messages/de.json';
import itMsgs from '@/messages/it.json';
import ruMsgs from '@/messages/ru.json';
import arMsgs from '@/messages/ar.json';
import idMsgs from '@/messages/id.json';
import hiMsgs from '@/messages/hi.json';
import viMsgs from '@/messages/vi.json';
import thMsgs from '@/messages/th.json';

const MESSAGES: Record<Locale, Messages> = {
  ko: koMsgs as Messages,
  en: enMsgs as Messages,
  ja: jaMsgs as Messages,
  'zh-CN': zhCNMsgs as Messages,
  'zh-TW': zhTWMsgs as Messages,
  es: esMsgs as Messages,
  'pt-BR': ptBRMsgs as Messages,
  fr: frMsgs as Messages,
  de: deMsgs as Messages,
  it: itMsgs as Messages,
  ru: ruMsgs as Messages,
  ar: arMsgs as Messages,
  id: idMsgs as Messages,
  hi: hiMsgs as Messages,
  vi: viMsgs as Messages,
  th: thMsgs as Messages,
};

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
}

export interface Messages {
  common: {
    brand: string;
    brand_tagline: string;
    operated_by: string;
    next: string;
    back: string;
    save: string;
    cancel: string;
    delete: string;
    loading: string;
    retry: string;
    share: string;
    copied: string;
  };
  home: {
    hero_title_a: string;
    hero_title_b: string;
    hero_sub: string;
    cta_start: string;
    cta_login: string;
    empty_title: string;
    empty_sub: string;
    feature1_title: string;
    feature1_sub: string;
    feature2_title: string;
    feature2_sub: string;
    feature3_title: string;
    feature3_sub: string;
    season_label_spring: string;
    season_label_summer: string;
    season_label_autumn: string;
    season_label_winter: string;
  };
  wish: {
    level1_title: string;
    level1_sub: string;
    level1_placeholder: string;
    level2_title: string;
    level2_sub: string;
    level2_placeholder: string;
    decompose_cta: string;
    decompose_loading: string;
    actions_title: string;
    actions_sub: string;
    status_yellow: string;
    status_blue: string;
    status_green: string;
    start_action: string;
    complete_action: string;
    reopen_action: string;
    example_dream_1: string;
    example_dream_2: string;
    example_dream_3: string;
    example_dream_4: string;
  };
  tree: {
    title: string;
    sub: string;
    stat_total: string;
    stat_done: string;
    stat_progress: string;
    season_changed: string;
  };
  share: {
    caption: string;
    cta: string;
  };
  errors: {
    missing_fields: string;
    ai_failed: string;
    unknown: string;
    fallback_notice: string;
  };
  ads: {
    label: string;
  };
  auth: {
    login_cta: string;
    login_title: string;
    login_sub: string;
    google_login: string;
    continue_guest: string;
    nickname_title: string;
    nickname_sub: string;
    nickname_placeholder: string;
    nickname_save: string;
    nickname_error: string;
    logout: string;
  };
  donate: {
    title: string;
    sub: string;
    silver: string;
    gold: string;
    thanks: string;
  };
}

export function t(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}
