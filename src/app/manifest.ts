import type { MetadataRoute } from 'next';

/* Lets phones and desktops install LekhKit like an app ("Add to Home screen" / "Install"). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LekhKit — LinkedIn Post Formatter',
    short_name: 'LekhKit',
    description: 'Format LinkedIn posts with bold, italic, lists and emoji. Free, private, runs in your browser.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f3f2ef',
    theme_color: '#ffffff',
    categories: ['productivity', 'social'],
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
