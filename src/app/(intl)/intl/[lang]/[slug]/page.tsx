import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentPage, { languageAlternates, pagePath } from '@/components/ContentPage';
import { INTL_PAGES, LANGS, intlPage } from '@/lib/i18n';
import { IS_INDEXABLE, SITE_NAME, SITE_URL } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return INTL_PAGES.map((p) => ({ lang: p.lang as string, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = intlPage(lang, slug);
  if (!page) return {};
  const url = SITE_URL + pagePath(page);
  const locale = LANGS.find((l) => l.code === lang)?.locale;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url, languages: languageAlternates(page) },
    robots: IS_INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { title: page.title, description: page.description, type: 'website', siteName: SITE_NAME, url, locale },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const page = intlPage(lang, slug);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
