'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { SUPPORTED_LOCALES, LOCALE_META, type Locale } from '@/lib/i18n';

interface Props {
  current: Locale;
}

export default function LocaleSwitcher({ current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, start] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Locale;
    const segments = pathname?.split('/') ?? [];
    if (segments[1] && (SUPPORTED_LOCALES as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    start(() => router.push(segments.join('/') || `/${next}`));
  };

  return (
    <select
      value={current}
      onChange={onChange}
      className="text-xs px-2 py-1 rounded-md bg-white/60 backdrop-blur border border-somang-mist text-somang-stone focus:outline-none focus:ring-1 focus:ring-somang-leaf cursor-pointer"
      aria-label="Language"
    >
      {SUPPORTED_LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_META[l].flag} {LOCALE_META[l].nativeName}
        </option>
      ))}
    </select>
  );
}
