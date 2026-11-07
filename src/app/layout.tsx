import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/GoogleTagManager';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });

const title = 'LekhKit — LinkedIn Post Formatter';
const description =
  'Free LinkedIn post formatter. Bold, italic, underline, strikethrough, lists and emoji, with a live desktop and mobile preview. Runs in your browser. Nothing is uploaded.';

export const metadata: Metadata = {
  title,
  description,
  applicationName: 'LekhKit',
  appleWebApp: { capable: true, title: 'LekhKit', statusBarStyle: 'default' },
  keywords: ['LinkedIn post formatter', 'LinkedIn bold text', 'LinkedIn italic text', 'unicode text generator'],
  openGraph: { title, description, type: 'website', siteName: 'LekhKit' },
  twitter: { card: 'summary', title, description },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1b1f23' },
  ],
};

const themeScript = "try{var t=localStorage.getItem('ltf.theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
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
