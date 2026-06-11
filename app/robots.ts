import type { MetadataRoute } from 'next';

const SITE = 'https://somang.revely.company';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
