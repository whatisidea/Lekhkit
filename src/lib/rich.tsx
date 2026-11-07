import type { ReactNode } from 'react';

/* Links, #hashtags and @mentions are tinted in the preview, like LinkedIn does. */
const RICH_SRC = '(https?:\\/\\/[^\\s]+|www\\.[^\\s]+|#[\\p{L}\\p{N}_]+|@[\\p{L}\\p{N}_.]+(?: \\p{Lu}[\\p{L}\\p{N}_.]*)?)';

/* The preview draws the real characters in LinkedIn's own font stack, so underline and strikethrough look
   exactly as they will on LinkedIn (no CSS lines that LinkedIn would not draw). */
export function richNodes(text: string): ReactNode[] {
  const re = new RegExp(RICH_SRC, 'gu');
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<span key={m.index} className="pv-tag">{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Same thing as real DOM nodes, used only to measure where the "…more" fold falls. */
export function richInto(el: HTMLElement, text: string) {
  const re = new RegExp(RICH_SRC, 'gu');
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) el.append(document.createTextNode(text.slice(last, m.index)));
    const span = document.createElement('span');
    span.className = 'pv-tag';
    span.textContent = m[0];
    el.append(span);
    last = m.index + m[0].length;
  }
  if (last < text.length) el.append(document.createTextNode(text.slice(last)));
}
