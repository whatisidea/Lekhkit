'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

/*
  Textarea state + undo/redo history. Same rules as the original:
  consecutive typing within 800 ms merges into one step, commands are always their own step,
  history is capped at 300 steps.
*/
interface Snap { v: string; s: number; e: number; k: string }

export function useEditor() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');
  const hist = useRef<Snap[]>([{ v: '', s: 0, e: 0, k: 'init' }]);
  const hi = useRef(0);
  const lastType = useRef(0);
  const pendingSel = useRef<[number, number] | null>(null);
  const [, force] = useState(0);

  useLayoutEffect(() => {
    const sel = pendingSel.current;
    const ta = ref.current;
    if (sel && ta) {
      ta.focus();
      ta.setSelectionRange(sel[0], sel[1]);
      pendingSel.current = null;
    }
  });

  const push = useCallback((kind: string, v: string, s: number, e: number) => {
    const snap = { v, s, e, k: kind };
    const now = Date.now();
    const h = hist.current;
    if (kind === 'type' && h[hi.current].k === 'type' && hi.current === h.length - 1 && now - lastType.current < 800) {
      h[hi.current] = snap;
    } else {
      const next = h.slice(0, hi.current + 1);
      next.push(snap);
      hist.current = next;
      hi.current = next.length - 1;
      if (next.length > 300) { next.shift(); hi.current--; }
    }
    lastType.current = now;
  }, []);

  /** Replace the whole text and put the caret/selection where asked, as one history step. */
  const commit = useCallback((val: string, s: number, e: number, kind = 'cmd') => {
    pendingSel.current = [s, e];
    setText(val);
    push(kind, val, s, e);
    force((n) => n + 1);
  }, [push]);

  const onInput = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const t = ev.target;
    const native = ev.nativeEvent as InputEvent;
    const kind = native.inputType === 'insertFromPaste' || native.inputType === 'deleteByCut' ? 'cmd' : 'type';
    setText(t.value);
    push(kind, t.value, t.selectionStart, t.selectionEnd);
  }, [push]);

  const restore = useCallback((i: number) => {
    hi.current = i;
    const s = hist.current[i];
    pendingSel.current = [s.s, s.e];
    setText(s.v);
    force((n) => n + 1);
  }, []);

  const undo = useCallback(() => { if (hi.current > 0) restore(hi.current - 1); }, [restore]);
  const redo = useCallback(() => { if (hi.current < hist.current.length - 1) restore(hi.current + 1); }, [restore]);

  /** Load a saved draft: replaces the text and starts a fresh history. */
  const reset = useCallback((v: string) => {
    hist.current = [{ v, s: v.length, e: v.length, k: 'init' }];
    hi.current = 0;
    setText(v);
    force((n) => n + 1);
  }, []);

  return {
    ref, text, commit, onInput, undo, redo, reset,
    canUndo: hi.current > 0,
    canRedo: hi.current < hist.current.length - 1,
  };
}
