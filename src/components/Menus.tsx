'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon, { type IconName } from './Icon';
import { BULLETS, EMOJI, STYLE_LIST, emojiList, store, type EmojiItem } from '@/lib/data';
import { decompose, enc, type StyleId } from '@/lib/unicode';

export type MenuName = 'styles' | 'bullets' | 'numbers' | 'attach' | 'mention' | 'emoji';

interface Props {
  name: MenuName;
  trigger: HTMLElement;
  wrap: HTMLElement;
  bullet: string;
  delim: string;
  currentStyle: () => StyleId | null;
  onClose: (returnFocus?: boolean) => void;
  onStyle: (id: StyleId) => void;
  onPlain: () => void;
  onBullet: (marker: string) => void;
  onNumber: (delim: string) => void;
  onAttach: (kind: 'image' | 'video' | 'doc') => void;
  onInsert: (text: string) => void;
}

function recents(): EmojiItem[] {
  try { return JSON.parse(store.get('ltf.emoji') || '[]'); } catch { return []; }
}
function pushRecent(item: EmojiItem) {
  const r = recents().filter((x) => x.e !== item.e);
  r.unshift(item);
  store.set('ltf.emoji', JSON.stringify(r.slice(0, 16)));
}

export default function MenuLayer(p: Props) {
  const box = useRef<HTMLDivElement>(null);

  /* Place under the trigger, kept inside the toolbar's width. Then move focus into the menu. */
  useLayoutEffect(() => {
    const m = box.current;
    if (!m) return;
    const wrap = p.wrap.getBoundingClientRect();
    const t = p.trigger.getBoundingClientRect();
    const maxLeft = wrap.width - m.offsetWidth - 8;
    m.style.left = Math.max(8, Math.min(t.left - wrap.left, maxLeft)) + 'px';
    m.style.top = (t.bottom - wrap.top + 6) + 'px';
    const first = (m.querySelector('input') || m.querySelector('[aria-checked="true"]') || m.querySelector('button')) as HTMLElement | null;
    first?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const down = (e: PointerEvent) => {
      const t = e.target as Element;
      if (t.closest('.menu') || t.closest('[data-menu]')) return;
      p.onClose();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); p.onClose(true); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const m = box.current;
        if (!m || m.querySelector('.egrid')) return;
        const items = Array.from(m.querySelectorAll<HTMLElement>('.mi'));
        if (!items.length) return;
        e.preventDefault();
        const i = items.indexOf(document.activeElement as HTMLElement);
        items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
      }
    };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key, true);
    return () => {
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('keydown', key, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const base = 'menu' + (p.name === 'mention' ? ' mention' : p.name === 'emoji' ? ' emoji' : '');
  const role = p.name === 'mention' || p.name === 'emoji' ? 'dialog' : 'menu';
  const label = { styles: 'Text styles', bullets: 'Bullet style', numbers: 'Number style', attach: 'Add to preview', mention: 'Mention preview', emoji: 'Emoji' }[p.name];

  return (
    <div ref={box} className={base} role={role} aria-label={label}>
      {p.name === 'styles' && <StylesMenu {...p} />}
      {p.name === 'bullets' && <BulletsMenu {...p} />}
      {p.name === 'numbers' && <NumbersMenu {...p} />}
      {p.name === 'attach' && <AttachMenu {...p} />}
      {p.name === 'mention' && <MentionMenu {...p} />}
      {p.name === 'emoji' && <EmojiMenu {...p} />}
    </div>
  );
}

function StylesMenu(p: Props) {
  const cur = p.currentStyle();
  return (
    <>
      <h3>Applies to selected text</h3>
      {STYLE_LIST.map(([id, name]) => (
        <button key={id} type="button" className="mi" role="menuitemradio" aria-checked={cur === id}
          onClick={() => { p.onClose(); p.onStyle(id); }}>
          <span>{name}</span>
          <span className="smp" aria-hidden="true">{enc(id, 'A') + enc(id, 'a')}</span>
        </button>
      ))}
      <div className="msep" />
      <button type="button" className="mi" role="menuitem" onClick={() => { p.onClose(); p.onPlain(); }}><span>Plain text</span></button>
      <p className="mnote">Styled text is made of special characters. It is not searchable and some screen readers read it badly.</p>
    </>
  );
}

function BulletsMenu(p: Props) {
  return (
    <>
      <h3>Bullet style</h3>
      {BULLETS.map(([m, name]) => (
        <button key={m} type="button" className="mi" role="menuitemradio" aria-checked={p.bullet === m}
          onClick={() => { p.onClose(); p.onBullet(m); }}>
          <span className="gl" aria-hidden="true">{m}</span><span>{name}</span>
        </button>
      ))}
      <p className="mnote">Applies to the selected lines, or the line you are on. Choose the same style again to remove it.</p>
    </>
  );
}

function NumbersMenu(p: Props) {
  return (
    <>
      <h3>Number style</h3>
      {([['.', '1. 2. 3.'], [')', '1) 2) 3)']] as const).map(([d, name]) => (
        <button key={d} type="button" className="mi" role="menuitemradio" aria-checked={p.delim === d}
          onClick={() => { p.onClose(); p.onNumber(d); }}>
          <span>{name}</span>
        </button>
      ))}
      <p className="mnote">Applies to the selected lines, or the line you are on.</p>
    </>
  );
}

function AttachMenu(p: Props) {
  const items: ['image' | 'video' | 'doc', IconName, string][] = [['image', 'image', 'Images'], ['video', 'video', 'Video'], ['doc', 'doc', 'Document']];
  return (
    <>
      <h3>Add to preview</h3>
      {items.map(([kind, icon, name]) => (
        <button key={kind} type="button" className="mi" role="menuitem" onClick={() => { p.onClose(); p.onAttach(kind); }}>
          <Icon name={icon} /><span>{name}</span>
        </button>
      ))}
      <p className="mnote">Preview only. Nothing is uploaded, and copying carries text, not media. Add the file inside LinkedIn.</p>
    </>
  );
}

function MentionMenu(p: Props) {
  const [v, setV] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const go = () => {
    const name = v.trim().replace(/^@/, '');
    if (!name) { input.current?.focus(); return; }
    p.onClose();
    p.onInsert('@' + name + ' ');
  };
  return (
    <>
      <h3 style={{ paddingLeft: 0 }}>Mention (preview only)</h3>
      <input ref={input} className="field" type="text" maxLength={40} placeholder="Type a name" autoComplete="off" aria-label="Name to mention"
        value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } }} />
      <button type="button" className="btn btn-primary" onClick={go}>Add to post</button>
      <p className="mnote" style={{ paddingLeft: 0, paddingRight: 0 }}>This shows how a name looks in the post. To tag someone for real, add the mention inside LinkedIn.</p>
    </>
  );
}

function EmojiMenu(p: Props) {
  const [recent] = useState(recents);
  const [group, setGroup] = useState(recent.length ? 'Recent' : 'Faces');
  const [q, setQ] = useState('');
  const names = (recent.length ? ['Recent'] : []).concat(Object.keys(EMOJI));
  let list: EmojiItem[];
  if (q) {
    list = Object.keys(EMOJI).flatMap((g) => emojiList(g)).filter((x) => x.n.indexOf(q) !== -1);
  } else {
    list = group === 'Recent' ? recent : emojiList(group);
  }
  return (
    <>
      <input className="field" type="text" placeholder="Search emoji" aria-label="Search emoji" autoComplete="off"
        value={q} onChange={(e) => setQ(e.target.value.trim().toLowerCase())} />
      <div className="etabs" role="tablist" aria-label="Emoji groups">
        {names.map((g) => (
          <button key={g} type="button" className="etab" role="tab" aria-selected={!q && g === group} onClick={() => { setQ(''); setGroup(g); }}>{g}</button>
        ))}
      </div>
      <div className="egrid" role="group" aria-label="Emoji">
        {!list.length && <div className="eempty">No emoji found.</div>}
        {list.map((x) => (
          <button key={x.e + x.n} type="button" aria-label={x.n} title={x.n} onClick={() => { pushRecent(x); p.onClose(); p.onInsert(x.e); }}>{x.e}</button>
        ))}
      </div>
    </>
  );
}

/** Which style a selection currently has, if it is one single style. */
export function styleOfSelection(sel: string): StyleId | null {
  const d = decompose(sel).filter((x) => x.style);
  if (d.length && d.every((x) => x.style === d[0].style)) return d[0].style;
  return null;
}
