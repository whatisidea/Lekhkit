import { notFound } from 'next/navigation';
import { RootShell, baseMetadata, baseViewport } from '@/lib/shell';
import { LANGS } from '@/lib/i18n';

export const metadata = baseMetadata;
export const viewport = baseViewport;
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((l) => ({ lang: l.code }));
}

export default async function IntlLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LANGS.some((l) => l.code === lang)) notFound();
  return <RootShell lang={lang}>{children}</RootShell>;
}
