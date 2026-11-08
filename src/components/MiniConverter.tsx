'use client';

import { useState } from 'react';
import { sty, toggleComb, type StyleId } from '@/lib/unicode';
import type { Mode } from '@/lib/pages';

/* Small copy-and-paste converter for the SEO pages. Runs in the browser; the text is never sent anywhere. */

const SAMPLE: Record<Mode, string> = {
  bold: 'Five lessons from my first year',
  italic: 'Nobody tells you this at the start',
  bolditalic: 'The one habit that changed my week',
  underline: 'Read this before you post',
  strike: 'Old plan. New plan.',
  fonts: 'Your name here',
  bullets: 'Write the hook first\nKeep lines short\nEnd with a question',
};

const FONT_ROWS: { label: string; id: StyleId }[] = [
  { label: 'Bold', id: 'sansBold' },
  { label: 'Italic', id: 'sansItalic' },
  { label: 'Bold italic', id: 'sansBoldItalic' },
  { label: 'Serif bold', id: 'serifBold' },
  { label: 'Script', id: 'script' },
  { label: 'Gothic', id: 'fraktur' },
  { label: 'Double-struck', id: 'double' },
  { label: 'Monospace', id: 'mono' },
];
const BULLETS = ['•', '→', '✓', '▪'];

function CopyRow({ label, text, copyLabel, copiedLabel }: { label?: string; text: string; copyLabel: string; copiedLabel: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* nothing more to do */ }
      ta.remove();
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1500);
  };
  return (
    <div className="cp-out">
      <div className="cp-out-text">
        {label ? <span className="cp-out-label">{label}</span> : null}
        <span className="cp-out-value" translate="no">{text || '\u00a0'}</span>
      </div>
      <button type="button" className={'btn btn-primary cp-copy' + (done ? ' done' : '')} onClick={copy} disabled={!text}>
        {done ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

export interface ConverterLabels { yourText: string; oneItem: string; copy: string; copied: string; bulletStyle: string }

export default function MiniConverter({ mode, ui }: { mode: Mode; ui?: ConverterLabels }) {
  const L = { text: ui?.yourText ?? 'Your text', items: ui?.oneItem ?? 'One item per line', copy: ui?.copy ?? 'Copy', copied: ui?.copied ?? 'Copied', bullet: ui?.bulletStyle ?? 'Bullet style' };
  const [text, setText] = useState('');
  const [bullet, setBullet] = useState(BULLETS[0]);
  const src = text || '';

  let outputs: { label?: string; text: string }[] = [];
  if (mode === 'fonts') outputs = FONT_ROWS.map((r) => ({ label: r.label, text: sty(r.id, src) }));
  else if (mode === 'bold') outputs = [{ text: sty('sansBold', src) }];
  else if (mode === 'italic') outputs = [{ text: sty('sansItalic', src) }];
  else if (mode === 'bolditalic') outputs = [{ text: sty('sansBoldItalic', src) }];
  else if (mode === 'underline') outputs = [{ text: toggleComb(src, 'u') }];
  else if (mode === 'strike') outputs = [{ text: toggleComb(src, 's') }];
  else if (mode === 'bullets') {
    outputs = [{ text: src.split('\n').filter((l) => l.trim()).map((l) => bullet + ' ' + l.trim()).join('\n') }];
  }

  return (
    <div className="cp-tool card">
      <label className="cp-label" htmlFor="cp-input">{mode === 'bullets' ? L.items : L.text}</label>
      <textarea
        id="cp-input"
        className="cp-input"
        rows={mode === 'bullets' ? 5 : 3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={SAMPLE[mode]}
        spellCheck={false}
      />
      {mode === 'bullets' ? (
        <div className="cp-bullets" role="group" aria-label={L.bullet}>
          {BULLETS.map((b) => (
            <button key={b} type="button" className="cp-chip" aria-pressed={bullet === b} onClick={() => setBullet(b)}>{b}</button>
          ))}
        </div>
      ) : null}
      <div className="cp-outs" aria-live="polite">
        {outputs.map((o, i) => <CopyRow key={i} label={o.label} text={o.text} copyLabel={L.copy} copiedLabel={L.copied} />)}
      </div>
    </div>
  );
}
