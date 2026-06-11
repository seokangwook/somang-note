import type { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

const SITE = 'https://somang.revely.company';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((l) => ({
    url: `${SITE}/${l}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  entries.push({
    url: `${SITE}/privacy`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  });
  return entries;
}
