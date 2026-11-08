/*
  Site-wide constants, read from the environment (see .env.example):
    NEXT_PUBLIC_SITE_URL                      the live address, e.g. https://lekhkit.com
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION      Search Console token (with or without the "google-site-verification=" prefix)
*/
const FALLBACK_URL = 'https://lekhkit.com';

function origin(value?: string): string {
  try {
    return new URL((value || '').trim()).origin;
  } catch {
    return FALLBACK_URL;
  }
}

export const SITE_URL = origin(process.env.NEXT_PUBLIC_SITE_URL);
export const SITE_NAME = 'LekhKit';
export const SITE_TITLE = 'LekhKit — LinkedIn Post Formatter';
export const SITE_DESCRIPTION =
  'Free LinkedIn post formatter and text generator. Make bold, italic, underline and strikethrough text, add bullet lists and emoji, and preview your post on desktop and mobile before you publish.';

function verificationToken(value?: string): string | undefined {
  const token = (value || '').trim().replace(/^google-site-verification=/, '');
  return /^[A-Za-z0-9_-]{20,}$/.test(token) ? token : undefined;
}
export const GOOGLE_VERIFICATION = verificationToken(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);

/** Only the production deployment should be indexed. Vercel preview deployments must not compete with it. */
export const IS_INDEXABLE = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';


