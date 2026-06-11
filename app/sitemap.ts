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
  // Guide pages — 신년 결심 SEO 콘텐츠
  for (const l of ['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const) {
    entries.push({
      url: `${SITE}/${l}/guide/new-year-resolution`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    });
  }
  for (const l of ['ko', 'en'] as const) {
    entries.push({
      url: `${SITE}/${l}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    });
  }
  return entries;
}
