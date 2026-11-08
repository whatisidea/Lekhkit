import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/ContentPage';
import { PAGES, PAGE_BY_SLUG } from '@/lib/pages';
import { IS_INDEXABLE, SITE_NAME, SITE_URL } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGE_BY_SLUG[slug];
  if (!page) return {};
  const url = `${SITE_URL}/${page.slug}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    robots: IS_INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { title: page.title, description: page.description, type: page.kind === 'guide' ? 'article' : 'website', siteName: SITE_NAME, url, locale: 'en_US' },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGE_BY_SLUG[slug];
  if (!page) notFound();
  return <ContentPage page={page} />;
}
