import type { MetadataRoute } from 'next';
import { PAGES } from '@/lib/pages';
import { INTL_PAGES } from '@/lib/i18n';
import { languageAlternates, pagePath } from '@/components/ContentPage';
import { SITE_URL } from '@/lib/site';

/* The home page plus every page in src/lib/pages.ts, pages-more.ts and i18n.ts. lastModified comes from each page's own date, so it only changes when the content does. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date('2026-11-08'), changeFrequency: 'monthly', priority: 1 },
    ...[...PAGES, ...INTL_PAGES].map((p) => {
      const languages = languageAlternates(p);
      return {
        url: SITE_URL + pagePath(p),
        lastModified: new Date(p.updated),
        changeFrequency: 'monthly' as const,
        priority: p.kind === 'tool' ? 0.8 : p.kind === 'guide' ? 0.6 : 0.3,
        ...(languages ? { alternates: { languages } } : {}),
      };
    }),
  ];
}
