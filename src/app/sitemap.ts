import type { MetadataRoute } from 'next';
import { PUBLIC_PATHS, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PUBLIC_PATHS.map((path) => ({
    // The home page is written without a trailing slash everywhere (canonical, og:url, JSON-LD, sitemap) so tools see one address.
    url: path === '/' ? SITE_URL : SITE_URL + path,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.5,
  }));
}
