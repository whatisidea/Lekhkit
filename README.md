# LekhKit

A free LinkedIn post formatter. Write a post, style it, preview it the way it looks on LinkedIn, and copy it. Everything runs in the browser: no backend, no accounts, nothing is uploaded.

## Features

- **Text styles:** bold, italic, underline, strikethrough, plus script, fraktur, double-struck and monospace. Done with Unicode characters, so the result pastes straight into LinkedIn.
- **Lists and extras:** bulleted and numbered lists (Enter continues a list), emoji, mentions (preview only), clear formatting, undo and redo.
- **Live preview:** desktop and mobile, light and dark, a feed view, and the "…more" fold. Images (up to 20, in LinkedIn's grid layouts), a video, or a PDF or Office document can be added to the preview. PDFs render their real pages as a swipeable carousel.
- **Private by design:** the draft and your preview profile are saved in this browser only (localStorage). No cookies are set by the app.
- **Mobile and install:** a mobile copy bar, light and dark theme toggle in the navbar, and an installable web app manifest.

## Stack

Next.js 15 (App Router), React 18, TypeScript. Plain CSS with design tokens, Lucide icons, Inter via `next/font`. PDF pages are rendered with `pdfjs-dist` (loaded only when a PDF is added).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Unicode engine unit tests (vitest)
npm run build    # production build
```

## Environment

Copy `.env.example` to `.env.local`.

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID (`GTM-XXXXXXX`). Leave empty to load no analytics. |

`NEXT_PUBLIC_` variables are baked in at build time, so redeploy after changing one.

## Deploy

Import the repository on [Vercel](https://vercel.com/new). The site is fully static and needs no extra configuration. Add the environment variable above in Project Settings → Environment Variables.

## Project layout

- `src/lib/unicode.ts`: the Unicode styling engine (with `unicode.test.ts`). Strikethrough uses U+0335 because the older U+0336 draws at the baseline in Segoe UI, which is the font LinkedIn uses on Windows. Older text that used U+0336 is still recognised.
- `src/components/`: editor, toolbar, menus, preview card, attachment tray, dialogs.
- `src/app/globals.css`: design tokens (light and dark) and all styles.
