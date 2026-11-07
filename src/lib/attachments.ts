/*
  Preview-only attachments. Nothing is uploaded: files become object URLs in this tab.
  LinkedIn rules mirrored here: a post holds ONE kind of media: up to 20 images, or one video, or one document.
*/
export type AttKind = 'image' | 'video' | 'doc';

export interface Attachment {
  id: string;
  kind: AttKind;
  name: string;
  url: string;
  ext: string; // upper-case, e.g. PDF
  size: number;
  pages?: number; // documents
  thumb?: string; // documents: first page as an image
  pageImgs?: string[]; // documents: every page rendered so far (the carousel), first page included
  duration?: number; // videos, in seconds
}

export const MAX_IMAGES = 20;
export const MAX_PAGES = 30; // pages rendered for the carousel preview
const DOC_EXT = ['pdf', 'doc', 'docx', 'ppt', 'pptx'];
export const ACCEPT_DOC = DOC_EXT.map((e) => '.' + e).join(',');

const extOf = (name: string) => (name.split('.').pop() || '').toLowerCase();

export function classify(f: File): AttKind | null {
  if (f.type.startsWith('image/')) return 'image';
  if (f.type.startsWith('video/')) return 'video';
  if (DOC_EXT.includes(extOf(f.name))) return 'doc';
  return null;
}

export function fmtSize(b: number): string {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return Math.max(1, Math.round(b / 1024)) + ' KB';
  return (b / 1048576).toFixed(b < 10485760 ? 1 : 0) + ' MB';
}

export function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return m + ':' + String(r).padStart(2, '0');
}

let uid = 0;

function videoDuration(url: string): Promise<number | undefined> {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    const done = (d?: number) => { v.removeAttribute('src'); v.load(); resolve(d); };
    const t = window.setTimeout(() => done(undefined), 4000);
    v.preload = 'metadata';
    v.onloadedmetadata = () => { window.clearTimeout(t); done(Number.isFinite(v.duration) ? v.duration : undefined); };
    v.onerror = () => { window.clearTimeout(t); done(undefined); };
    v.src = url;
  });
}

export interface PdfHooks {
  /** Called as more pages finish rendering. */
  onPages: (id: string, imgs: string[]) => void;
  /** Return false once the attachment was removed, so rendering stops. */
  alive: (id: string) => boolean;
}

type PdfDoc = { numPages: number; getPage: (n: number) => Promise<any>; destroy: () => Promise<void> }; // eslint-disable-line @typescript-eslint/no-explicit-any

async function renderPage(doc: PdfDoc, n: number): Promise<string> {
  const page = await doc.getPage(n);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: Math.min(2, 720 / base.width) });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no canvas');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL('image/jpeg', 0.8);
}

/** First page of a PDF (returned right away) and the page count. The other pages render in the background. */
async function pdfInfo(file: File, id: string, hooks?: PdfHooks): Promise<{ pages?: number; thumb?: string; pageImgs?: string[] }> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();
    const data = new Uint8Array(await file.arrayBuffer());
    const doc = (await pdfjs.getDocument({ data }).promise) as unknown as PdfDoc;
    const pages = doc.numPages;
    let first: string;
    try { first = await renderPage(doc, 1); } catch { await doc.destroy(); return { pages }; }
    if (pages > 1 && hooks) {
      void (async () => {
        const imgs = [first];
        try {
          for (let i = 2; i <= Math.min(pages, MAX_PAGES); i++) {
            if (!hooks.alive(id)) break;
            imgs.push(await renderPage(doc, i));
            hooks.onPages(id, imgs.slice());
          }
        } catch { /* keep the pages that rendered */ }
        await doc.destroy();
      })();
    } else {
      await doc.destroy();
    }
    return { pages, thumb: first, pageImgs: [first] };
  } catch {
    return {};
  }
}

export async function buildAttachment(kind: AttKind, file: File, hooks?: PdfHooks): Promise<Attachment> {
  const url = URL.createObjectURL(file);
  const base: Attachment = { id: 'a' + ++uid, kind, name: file.name, url, ext: extOf(file.name).toUpperCase(), size: file.size };
  if (kind === 'video') base.duration = await videoDuration(url);
  if (kind === 'doc' && base.ext === 'PDF') Object.assign(base, await pdfInfo(file, base.id, hooks));
  return base;
}

export function revoke(a: Attachment) {
  URL.revokeObjectURL(a.url);
}

/** Small square JPEG of a chosen profile photo, so it can be remembered in this browser without a server. */
export function photoToDataUrl(file: File, size = 160): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(url); reject(new Error('no canvas')); return; }
      ctx.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
    img.src = url;
  });
}
