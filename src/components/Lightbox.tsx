'use client';

import { useEffect, useRef } from 'react';
import Icon from './Icon';
import { useSwipe } from '@/lib/useSwipe';

interface Props {
  images: { url: string; name: string }[];
  /** null = closed */
  index: number | null;
  onChange: (i: number) => void;
  onClose: () => void;
}

/* Full-size viewer for the images in the preview: arrows, swipe, keyboard, counter. */
export default function Lightbox({ images, index, onChange, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const n = images.length;
  const i = Math.min(Math.max(index ?? 0, 0), Math.max(n - 1, 0));

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const close = () => onClose();
    d.addEventListener('close', close);
    return () => d.removeEventListener('close', close);
  }, [onClose]);

  const go = (dir: number) => { const next = i + dir; if (next >= 0 && next < n) onChange(next); };
  const swipe = useSwipe(() => go(1), () => go(-1));

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Image viewer"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      }}
      onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
    >
      {open && n > 0 && (
        <div className="lb-body">
          <div className="lb-top">
            <span className="lb-count" aria-live="polite">{n > 1 ? `${i + 1} of ${n}` : images[i].name}</span>
            <button type="button" className="lb-btn" aria-label="Close image viewer" onClick={() => ref.current?.close()}><Icon name="x" /></button>
          </div>
          <div className="lb-stage" {...swipe}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[i].url} alt={images[i].name} draggable={false} />
            {i > 0 && <button type="button" className="lb-btn lb-prev" aria-label="Previous image" onClick={() => go(-1)}><Icon name="chev" /></button>}
            {i < n - 1 && <button type="button" className="lb-btn lb-next" aria-label="Next image" onClick={() => go(1)}><Icon name="chev" /></button>}
          </div>
        </div>
      )}
    </dialog>
  );
}
