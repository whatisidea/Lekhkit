'use client';

import { useRef } from 'react';

/*
  Horizontal swipe for touch and pen. Mouse is left alone (it uses the arrows and keyboard), and the
  element should set `touch-action: pan-y` so vertical scrolling still works: one primary gesture per region.
*/
export function useSwipe(onNext: () => void, onPrev: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      start.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? onNext : onPrev)();
    },
    onPointerCancel: () => { start.current = null; },
  };
}
