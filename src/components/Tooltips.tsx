'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/* One tooltip for every [data-tip] element. Hover (after 250 ms) and keyboard focus. Optional [data-keys]. */
function fmtKeys(k: string, mac: boolean) {
  return k.split('+').map((p) => {
    if (p === 'Mod') return mac ? '⌘' : 'Ctrl';
    if (p === 'Shift') return mac ? '⇧' : 'Shift';
    return p;
  }).join(mac ? '' : '+');
}

interface Tip { label: string; keys: string; el: HTMLElement; warm: boolean }

export default function TooltipLayer() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [mac, setMac] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || ''));
    let timer = 0;
    let lastHide = 0;
    let visible = false;
    /* Emil Kowalski: wait before the first tooltip, then switch instantly between neighbours. */
    const show = (el: HTMLElement) => {
      const label = el.getAttribute('data-tip');
      if (!label) return;
      const warm = visible || Date.now() - lastHide < 450;
      visible = true;
      setTip({ label, keys: el.dataset.keys || '', el, warm });
    };
    const hide = () => { window.clearTimeout(timer); if (visible) lastHide = Date.now(); visible = false; setTip(null); };
    const closest = (t: EventTarget | null) => (t instanceof Element ? (t.closest('[data-tip]') as HTMLElement | null) : null);

    const over = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const el = closest(e.target);
      if (!el) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => show(el), visible || Date.now() - lastHide < 450 ? 0 : 250);
    };
    const out = (e: PointerEvent) => { if (closest(e.target)) hide(); };
    const focus = (e: FocusEvent) => {
      const el = closest(e.target);
      if (el && el.matches(':focus-visible')) show(el);
    };
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerout', out);
    document.addEventListener('pointerdown', hide, true);
    document.addEventListener('focusin', focus);
    document.addEventListener('focusout', hide);
    window.addEventListener('scroll', hide, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerout', out);
      document.removeEventListener('pointerdown', hide, true);
      document.removeEventListener('focusin', focus);
      document.removeEventListener('focusout', hide);
      window.removeEventListener('scroll', hide, true);
    };
  }, []);

  useLayoutEffect(() => {
    const b = box.current;
    if (!tip || !b) return;
    const r = tip.el.getBoundingClientRect();
    const tw = b.offsetWidth, th = b.offsetHeight;
    const x = Math.max(8, Math.min(window.innerWidth - tw - 8, r.left + r.width / 2 - tw / 2));
    let y = r.top - th - 8;
    if (y < 8) y = r.bottom + 8;
    b.style.left = x + 'px';
    b.style.top = y + 'px';
  }, [tip]);

  return (
    <div id="tip" role="tooltip" ref={box} hidden={!tip} className={tip?.warm ? 'warm' : undefined}>
      {tip && <span>{tip.label}</span>}
      {tip && tip.keys && <kbd>{fmtKeys(tip.keys, mac)}</kbd>}
    </div>
  );
}
