import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { GOOGLE_VERIFICATION, IS_INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/GoogleTagManager';

/*
  Shared <html> shell. The site has two root layouts so every page can carry its own <html lang>:
    src/app/(en)/layout.tsx           English pages, lang="en"
    src/app/(intl)/[lang]/layout.tsx  translated pages, lang="es" | "pt" | ...
*/

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });

const title = SITE_TITLE;
const description = SITE_DESCRIPTION;

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: 'default' },
  keywords: ['LinkedIn post formatter', 'LinkedIn bold text', 'LinkedIn italic text', 'unicode text generator'],
  robots: IS_INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { title, description, type: 'website', siteName: SITE_NAME, url: '/', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title, description },
  ...(GOOGLE_VERIFICATION ? { verification: { google: GOOGLE_VERIFICATION } } : {}),
};

export const baseViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1b1f23' },
  ],
};

const themeScript = "try{var t=localStorage.getItem('ltf.theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}";

export function RootShell({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Applies a saved theme before first paint so there is no flash of the wrong colours. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <GoogleTagManagerNoScript />
        {children}
        <GoogleTagManager />
      </body>
    </html>
  );
}
