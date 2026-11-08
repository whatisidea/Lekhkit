'use client';

import { SiteFooter } from './ContentPage';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import TooltipLayer from './Tooltips';
import MenuLayer, { styleOfSelection, type MenuName } from './Menus';
import PostCard from './PostCard';
import SiteThemeToggle from './SiteThemeToggle';
import { FeedDialog, ProfileDialog } from './Dialogs';
import { useEditor } from '@/lib/useEditor';
import AttachmentTray from './AttachmentTray';
import { ACCEPT_DOC, MAX_IMAGES, buildAttachment, classify, revoke, type AttKind, type PdfHooks } from '@/lib/attachments';
import { DEFAULT_PROFILE, LIMIT, SAMPLE, fmtNum, store, type Attachment, type Profile } from '@/lib/data';
import { flagsOf, plainOf, toggleBI, toggleComb, toggleStyle, type StyleId } from '@/lib/unicode';

type Device = 'mobile' | 'desktop';
type Theme = 'light' | 'dark';
interface ToastState { msg: string; ok?: boolean; action?: () => void; label?: string }

const BUL_RE = /^[•▪–➤✓→★] /;
const NUM_RE = /^\d+[.)] /;

export default function LekhKit() {
  const ed = useEditor();
  const { ref: taRef, text, commit, undo, redo } = ed;

  const [device, setDevice] = useState<Device>('desktop');
  const [theme, setTheme] = useState<Theme>('light');
  const [expanded, setExpanded] = useState(false);
  const [bullet, setBullet] = useState('•');
  const [delim, setDelim] = useState('.');
  const [atts, setAtts] = useState<Attachment[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const attsRef = useRef<Attachment[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [menu, setMenu] = useState<{ name: MenuName; trigger: HTMLElement } | null>(null);
  const [feedOpen, setFeedOpen] = useState(false);
  const [profOpen, setProfOpen] = useState(false);
  const [flags, setFlags] = useState({ b: false, i: false, u: false, s: false });
  const [tick, setTick] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [copied, setCopied] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [copyVisible, setCopyVisible] = useState(true);
  const [live, setLive] = useState('');

  const wrapRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const ready = useRef(false);
  const toastTimer = useRef(0);
  const copyTimer = useRef(0);
  const fImg = useRef<HTMLInputElement>(null);
  const fVid = useRef<HTMLInputElement>(null);
  const fDoc = useRef<HTMLInputElement>(null);

  /* ---------- toast ---------- */
  const showToast = useCallback((msg: string, opts: Omit<ToastState, 'msg'> = {}) => {
    setToast({ msg, ...opts });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), opts.action ? 6000 : 2600);
  }, []);

  /* ---------- boot: saved draft, profile, device ---------- */
  useEffect(() => {
    try {
      const p = JSON.parse(store.get('ltf.profile') || 'null');
      if (p && p.name) setProfile((cur) => ({ ...cur, name: p.name, headline: p.headline || '', photo: typeof p.photo === 'string' ? p.photo : '' }));
    } catch { /* ignore a corrupt saved profile */ }
    const draft = store.get('ltf.draft');
    ed.reset(draft === null ? SAMPLE : draft);
    if (window.matchMedia('(max-width: 700px)').matches) setDevice('mobile');
    ready.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- text changed: autosave. "…more" stays open while you edit; it only resets for a fresh, empty post. ---------- */
  useEffect(() => {
    if (!text.trim()) setExpanded(false);
    if (!ready.current) return;
    const t = window.setTimeout(() => store.set('ltf.draft', text), 300);
    return () => window.clearTimeout(t);
  }, [text]);

  const updateActive = useCallback(() => {
    const t = taRef.current;
    if (!t) return;
    const v = t.value;
    let s = t.selectionStart, e = t.selectionEnd;
    if (s === e) {
      let a = s, b = e;
      while (a > 0 && !/\s/.test(v[a - 1])) a--;
      while (b < v.length && !/\s/.test(v[b])) b++;
      s = a; e = b;
    }
    const f = s === e ? { b: false, i: false, u: false, s: false } : flagsOf(v.slice(s, e));
    setFlags((cur) => (cur.b === f.b && cur.i === f.i && cur.u === f.u && cur.s === f.s ? cur : f));
  }, [taRef]);

  useEffect(() => { updateActive(); }, [text, updateActive]);
  useEffect(() => {
    const on = () => { if (document.activeElement === taRef.current) updateActive(); };
    document.addEventListener('selectionchange', on);
    return () => document.removeEventListener('selectionchange', on);
  }, [taRef, updateActive]);

  /* ---------- formatting commands ---------- */
  const withRange = (fn: (x: string) => string) => {
    const t = taRef.current;
    if (!t) return;
    const v = t.value;
    let s = t.selectionStart, e = t.selectionEnd;
    if (s === e) {
      let a = s, b = e;
      while (a > 0 && !/\s/.test(v[a - 1])) a--;
      while (b < v.length && !/\s/.test(v[b])) b++;
      if (a === b) { showToast('Select some text first, then choose a style.'); return; }
      s = a; e = b;
    }
    const sub = v.slice(s, e);
    const out = fn(sub);
    if (out === sub) return;
    commit(v.slice(0, s) + out + v.slice(e), s, s + out.length);
  };

  const clearFormatting = () => {
    const t = taRef.current;
    if (!t) return;
    const v = t.value;
    let s = t.selectionStart, e = t.selectionEnd;
    if (s === e) { s = 0; e = v.length; }
    const sub = v.slice(s, e);
    const out = plainOf(sub);
    if (out === sub) { showToast('Nothing to clear.'); return; }
    commit(v.slice(0, s) + out + v.slice(e), s, s + out.length);
    showToast('Formatting cleared', { action: undo });
  };

  const clearAll = () => {
    if (!text) return;
    commit('', 0, 0);
    showToast('Post cleared', { action: undo });
  };

  /* ---------- lists ---------- */
  const applyLines = (fn: (lines: string[]) => string[]) => {
    const t = taRef.current;
    if (!t) return;
    const v = t.value;
    const s = t.selectionStart, e = t.selectionEnd;
    const collapsed = s === e;
    const endPos = e > s && v[e - 1] === '\n' ? e - 1 : e;
    const a = v.lastIndexOf('\n', s - 1) + 1;
    let b = v.indexOf('\n', endPos);
    if (b === -1) b = v.length;
    const block = v.slice(a, b);
    const out = fn(block.split('\n')).join('\n');
    if (out === block) return;
    commit(v.slice(0, a) + out + v.slice(b), collapsed ? a + out.length : a, a + out.length);
  };

  const toggleBullets = (marker: string) => {
    setBullet(marker);
    applyLines((lines) => {
      const ne = lines.filter((l) => l.trim());
      if (!ne.length) return lines.map((l) => marker + ' ' + l);
      const same = ne.every((l) => l.indexOf(marker + ' ') === 0);
      return lines.map((l) => {
        if (!l.trim()) return l;
        const base = l.replace(BUL_RE, '').replace(NUM_RE, '');
        return same ? base : marker + ' ' + base;
      });
    });
  };

  const toggleNumbers = (d: string) => {
    setDelim(d);
    applyLines((lines) => {
      const ne = lines.filter((l) => l.trim());
      if (!ne.length) return lines.map((l) => '1' + d + ' ' + l);
      const re = new RegExp('^\\d+' + (d === '.' ? '\\.' : '\\)') + ' ');
      const same = ne.every((l) => re.test(l));
      let n = 0;
      return lines.map((l) => {
        if (!l.trim()) return l;
        const base = l.replace(BUL_RE, '').replace(NUM_RE, '');
        if (same) return base;
        n++;
        return n + d + ' ' + base;
      });
    });
  };

  /* Enter inside a list continues it; Enter on an empty item ends it. */
  const onEnter = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const t = taRef.current;
    if (!t) return;
    if (ev.shiftKey || ev.ctrlKey || ev.metaKey || ev.altKey || ev.nativeEvent.isComposing) return;
    if (t.selectionStart !== t.selectionEnd) return;
    const v = t.value;
    const p = t.selectionStart;
    const a = v.lastIndexOf('\n', p - 1) + 1;
    const line = v.slice(a, p);
    let next: string | null = null;
    let empty = false;
    let m = line.match(/^([•▪–➤✓→★]) ([\s\S]*)$/);
    if (m) { next = m[1] + ' '; empty = m[2] === ''; }
    else {
      const n = line.match(/^(\d+)([.)]) ([\s\S]*)$/);
      if (n) { next = (+n[1] + 1) + n[2] + ' '; empty = n[3] === ''; }
    }
    if (next === null) return;
    ev.preventDefault();
    if (empty) commit(v.slice(0, a) + v.slice(p), a, a);
    else {
      const ins = '\n' + next;
      commit(v.slice(0, p) + ins + v.slice(p), p + ins.length, p + ins.length);
    }
  };

  const insertAtCaret = (str: string) => {
    const t = taRef.current;
    if (!t) return;
    const v = t.value, s = t.selectionStart, e = t.selectionEnd;
    commit(v.slice(0, s) + str + v.slice(e), s + str.length, s + str.length);
  };

  const ACTIONS: Record<string, () => void> = {
    undo, redo,
    bold: () => withRange((x) => toggleBI(x, 'b')),
    italic: () => withRange((x) => toggleBI(x, 'i')),
    underline: () => withRange((x) => toggleComb(x, 'u')),
    strike: () => withRange((x) => toggleComb(x, 's')),
    bullets: () => toggleBullets(bullet),
    numbers: () => toggleNumbers(delim),
    clearfmt: clearFormatting,
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.ctrlKey || e.metaKey;
    const k = e.key.toLowerCase();
    if (mod && k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
    else if (mod && k === 'y') { e.preventDefault(); redo(); }
    else if (mod && k === 'b') { e.preventDefault(); ACTIONS.bold(); }
    else if (mod && k === 'i') { e.preventDefault(); ACTIONS.italic(); }
    else if (mod && k === 'u') { e.preventDefault(); ACTIONS.underline(); }
    else if (mod && e.key === 'Enter') { e.preventDefault(); doCopy(); }
    else if (e.key === 'Enter') onEnter(e);
  };

  /* ---------- toolbar + menus ---------- */
  const closeMenus = useCallback((returnFocus?: boolean) => {
    setMenu((cur) => {
      if (cur && returnFocus) cur.trigger.focus();
      return null;
    });
  }, []);

  const onToolbarClick = (e: React.MouseEvent) => {
    const b = (e.target as Element).closest('button');
    if (!b || b.disabled) return;
    const name = b.dataset.menu as MenuName | undefined;
    if (name) { setMenu((cur) => (cur && cur.name === name ? null : { name, trigger: b })); return; }
    closeMenus();
    const act = b.dataset.act;
    if (act && ACTIONS[act]) ACTIONS[act]();
  };

  const currentStyle = (): StyleId | null => {
    const t = taRef.current;
    if (!t || t.selectionStart === t.selectionEnd) return null;
    return styleOfSelection(t.value.slice(t.selectionStart, t.selectionEnd));
  };

  const pickFile = (kind: 'image' | 'video' | 'doc') => {
    ({ image: fImg, video: fVid, doc: fDoc })[kind].current?.click();
  };

  /* ---------- attachments (preview only) ---------- */
  const setAttachments = (next: Attachment[]) => { attsRef.current = next; setAtts(next); };

  /* PDF pages beyond the first render in the background. Removed attachments stop rendering. */
  const removed = useRef(new Set<string>());
  const pendingPages = useRef(new Map<string, string[]>());
  const drop = (a: Attachment) => { removed.current.add(a.id); pendingPages.current.delete(a.id); revoke(a); };
  const pdfHooks: PdfHooks = {
    alive: (id) => !removed.current.has(id),
    onPages: (id, imgs) => {
      pendingPages.current.set(id, imgs);
      if (attsRef.current.some((a) => a.id === id)) setAttachments(attsRef.current.map((a) => (a.id === id ? { ...a, pageImgs: imgs } : a)));
    },
  };

  /* LinkedIn holds one kind of media per post: up to 20 images, or one video, or one document.
     Images add to existing images. A video or document replaces whatever was there. */
  const addFiles = async (files: File[], force?: AttKind) => {
    const items = files.map((f) => ({ f, kind: force ?? classify(f) }));
    const supported = items.filter((i): i is { f: File; kind: AttKind } => i.kind !== null);
    if (items.length > supported.length) showToast('That file type is not supported. Use an image, a video, or a PDF or Office document.');
    if (!supported.length) return;
    const kind = supported[0].kind;
    const chosen = supported.filter((i) => i.kind === kind).slice(0, kind === 'image' ? MAX_IMAGES : 1);
    setBusy(true);
    try {
      const built = await Promise.all(chosen.map((i) => buildAttachment(kind, i.f, pdfHooks)));
      built.forEach((b) => { const p = pendingPages.current.get(b.id); if (p) b.pageImgs = p; });
      const cur = attsRef.current;
      if (kind === 'image' && cur.every((a) => a.kind === 'image')) {
        const merged = [...cur, ...built];
        merged.slice(MAX_IMAGES).forEach(drop);
        setAttachments(merged.slice(0, MAX_IMAGES));
        showToast(
          merged.length > MAX_IMAGES ? 'LinkedIn allows up to ' + MAX_IMAGES + ' images.' : 'Added ' + built.length + (built.length === 1 ? ' image' : ' images') + ' to the preview.',
          { ok: merged.length <= MAX_IMAGES },
        );
      } else {
        const replaced = cur.length > 0;
        cur.forEach(drop);
        setAttachments(built);
        showToast(replaced ? 'A LinkedIn post holds one kind of media, so this replaced the earlier attachment.' : 'Added to the preview.', { ok: !replaced });
      }
    } finally {
      setBusy(false);
    }
  };
  const removeAtt = (id: string) => {
    const a = attsRef.current.find((x) => x.id === id);
    if (a) drop(a);
    setAttachments(attsRef.current.filter((x) => x.id !== id));
  };
  const clearAtts = () => { attsRef.current.forEach(drop); setAttachments([]); };
  useEffect(() => () => { attsRef.current.forEach(drop); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Drop files onto the editor, or paste an image. Both are extras: the paperclip menu does the same job. */
  const hasFiles = (e: React.DragEvent) => Array.from(e.dataTransfer?.types || []).includes('Files');
  const onDragOver = (e: React.DragEvent) => { if (hasFiles(e)) { e.preventDefault(); setDragging(true); } };
  const onDrop = (e: React.DragEvent) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    setDragging(false);
    void addFiles(Array.from(e.dataTransfer.files));
  };
  const onPaste = (e: React.ClipboardEvent) => {
    const files = Array.from(e.clipboardData.files || []);
    if (files.length && !e.clipboardData.getData('text')) { e.preventDefault(); void addFiles(files); }
  };

  /* ---------- counter ---------- */
  const n = text.length;
  let st: 'ok' | 'near' | 'over' = 'ok';
  let countTxt = fmtNum(n) + ' / 3,000 characters';
  if (n > LIMIT) { st = 'over'; countTxt += ' · ' + fmtNum(n - LIMIT) + ' over the limit'; }
  else if (n >= 2700) { st = 'near'; countTxt += ' · Close to the limit'; }

  useEffect(() => { setLive(st === 'ok' ? '' : countTxt); /* announce only when the state changes */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st]);

  /* ---------- copy ---------- */
  const doCopy = () => {
    const ta = taRef.current;
    const btn = copyRef.current;
    if (btn && !btn.style.minWidth) btn.style.minWidth = btn.offsetWidth + 'px';
    const ok = () => {
      showToast('Copied. Paste it into LinkedIn.', { ok: true });
      if ('vibrate' in navigator) navigator.vibrate(12); // a light tap on phones that support it
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    };
    const fallback = () => {
      if (!ta) return;
      const s = ta.selectionStart, e = ta.selectionEnd;
      try {
        ta.focus(); ta.select();
        const done = document.execCommand('copy');
        ta.setSelectionRange(s, e);
        if (done) { ok(); return; }
      } catch { /* fall through to the message */ }
      showToast('Copy did not work. Select the text and copy it by hand.');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
    else fallback();
  };

  /* ---------- mobile quick-copy bar ---------- */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 980px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    const el = copyRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((en) => setCopyVisible(en[0].isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const dockOn = narrow && !copyVisible && !!text.trim();
  useEffect(() => {
    document.body.classList.toggle('dock-on', dockOn);
    return () => document.body.classList.remove('dock-on');
  }, [dockOn]);

  /* ---------- re-measure the fold on resize ---------- */
  useEffect(() => {
    let t = 0;
    const on = () => { window.clearTimeout(t); t = window.setTimeout(() => setTick((x) => x + 1), 150); };
    window.addEventListener('resize', on);
    return () => { window.clearTimeout(t); window.removeEventListener('resize', on); };
  }, []);

  const scrollToPreview = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelector('.preview')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  const insertSample = () => commit(SAMPLE, SAMPLE.length, SAMPLE.length);
  const expand = () => setExpanded(true);
  const collapse = () => setExpanded(false);
  const dark = theme === 'dark';

  return (
    <>
      <a className="skip" href="#main">Skip to the editor</a>
      <header className="top">
        <div className="wrap">
          <a className="brand" href="/" aria-label="LekhKit, home">
            <svg className="mark" viewBox="0 0 64 64" aria-hidden="true">
              <defs><linearGradient id="lkg" x1="8" y1="0" x2="56" y2="64" gradientUnits="userSpaceOnUse"><stop stopColor="#2B86E8" /><stop offset="1" stopColor="#0A57B8" /></linearGradient></defs>
              <rect width="64" height="64" rx="16" fill="url(#lkg)" />
              <path d="M16.5 13.5H28.5V38.5H48V50.5H16.5Z" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
              <path className="caret" d="M37 18h9M41.5 18v12.5M37 30.5h9" stroke="#FFB21E" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            </svg>
            <span className="wm" translate="no">Lekh<b>Kit</b></span>
          </a>
          <SiteThemeToggle />
        </div>
      </header>

      <main className="wrap" id="main">
        <section className="intro">
          <h1>Format your LinkedIn post</h1>
          <ul className="trust" aria-label="Privacy">
            <li><Icon name="check" />Free, no sign-up</li>
            <li><Icon name="check" />Runs in your browser</li>
            <li><Icon name="check" />Nothing is uploaded</li>
          </ul>
        </section>

        <div className="grid">
          {/* EDITOR */}
          <section
            className={'card editor' + (dragging ? ' dragging' : '')}
            aria-label="Editor"
            onDragOver={onDragOver}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false); }}
            onDrop={onDrop}
          >
            <div className="toolwrap" ref={wrapRef}>
              <div className="toolbar" role="toolbar" aria-label="Formatting" onMouseDown={(e) => { if ((e.target as Element).closest('button')) e.preventDefault(); }} onClick={onToolbarClick}>
                <button type="button" className="tb" data-act="undo" data-tip="Undo" data-keys="Mod+Z" aria-label="Undo" disabled={!ed.canUndo}><Icon name="undo" /></button>
                <button type="button" className="tb" data-act="redo" data-tip="Redo" data-keys="Mod+Shift+Z" aria-label="Redo" disabled={!ed.canRedo}><Icon name="redo" /></button>
                <span className="sep" role="separator" />
                <span className="grp"><button type="button" className="tb" data-act="bold" data-tip="Bold" data-keys="Mod+B" aria-label="Bold" aria-pressed={flags.b}>B</button>
                <button type="button" className="tb" data-act="italic" data-tip="Italic" data-keys="Mod+I" aria-label="Italic" aria-pressed={flags.i}><span className="i">I</span></button>
                <button type="button" className="tb" data-act="underline" data-tip="Underline" data-keys="Mod+U" aria-label="Underline" aria-pressed={flags.u}><span className="u">U</span></button>
                <button type="button" className="tb" data-act="strike" data-tip="Strikethrough" aria-label="Strikethrough" aria-pressed={flags.s}><span className="s">S</span></button>
                <button type="button" className="tb aa" data-menu="styles" data-tip="More text styles" aria-label="More text styles" aria-haspopup="menu" aria-expanded={menu?.name === 'styles'}><span className="aa-t">Aa</span><Icon name="chev" className="ic-sm" /></button></span>
                <span className="sep sep-br" role="separator" />
                <button type="button" className="tb" data-act="bullets" data-tip="Bulleted list" aria-label="Bulleted list"><Icon name="list" /></button>
                <button type="button" className="tb caret" data-menu="bullets" data-tip="Bullet style" aria-label="Bullet style" aria-haspopup="menu" aria-expanded={menu?.name === 'bullets'}><Icon name="chev" className="ic-sm" /></button>
                <button type="button" className="tb" data-act="numbers" data-tip="Numbered list" aria-label="Numbered list"><Icon name="olist" /></button>
                <button type="button" className="tb caret" data-menu="numbers" data-tip="Number style" aria-label="Number style" aria-haspopup="menu" aria-expanded={menu?.name === 'numbers'}><Icon name="chev" className="ic-sm" /></button>
                <span className="sep" role="separator" />
                <button type="button" className="tb" data-menu="emoji" data-tip="Emoji" aria-label="Emoji" aria-haspopup="dialog" aria-expanded={menu?.name === 'emoji'}><Icon name="smile" /></button>
                <button type="button" className="tb" data-menu="attach" data-tip="Add to preview: image, video or document" aria-label="Add attachment to preview" aria-haspopup="menu" aria-expanded={menu?.name === 'attach'}><Icon name="clip" /></button>
                <button type="button" className="tb" data-menu="mention" data-tip="Mention (preview only)" aria-label="Mention, preview only" aria-haspopup="dialog" aria-expanded={menu?.name === 'mention'}><Icon name="at" /></button>
                <span className="sep" role="separator" />
                <button type="button" className="tb" data-act="clearfmt" data-tip="Clear formatting" aria-label="Clear formatting"><Icon name="nofmt" /></button>
              </div>
              {menu && wrapRef.current && (
                <MenuLayer
                  key={menu.name}
                  name={menu.name}
                  trigger={menu.trigger}
                  wrap={wrapRef.current}
                  bullet={bullet}
                  delim={delim}
                  currentStyle={currentStyle}
                  onClose={closeMenus}
                  onStyle={(id) => withRange((x) => toggleStyle(x, id))}
                  onPlain={clearFormatting}
                  onBullet={toggleBullets}
                  onNumber={toggleNumbers}
                  onAttach={pickFile}
                  onInsert={insertAtCaret}
                />
              )}
            </div>

            <AttachmentTray
              atts={atts}
              busy={busy}
              canAddImages={atts.length > 0 && atts.every((a) => a.kind === 'image') && atts.length < MAX_IMAGES}
              onRemove={removeAtt}
              onAddImages={() => pickFile('image')}
              onClearAll={clearAtts}
            />
            {dragging && <div className="drop-hint" aria-hidden="true">Drop images, a video or a document to add it to the preview</div>}

            <label className="sr" htmlFor="ed">Post editor</label>
            <textarea
              id="ed"
              ref={taRef}
              value={text}
              spellCheck
              suppressHydrationWarning
              placeholder="Write your LinkedIn post here, or paste an existing post to format it…"
              onChange={ed.onInput}
              onPaste={onPaste}
              onKeyDown={onKeyDown}
              onSelect={updateActive}
              onKeyUp={updateActive}
              onMouseUp={updateActive}
              onTouchEnd={updateActive}
            />
            <div className="foot">
              <div className="foot-l">
                <span className="count" data-s={st}>
                  <span>{st !== 'ok' && <Icon name="warn" />}</span>
                  <span>{countTxt}</span><span className="meter" aria-hidden="true"><i style={{ width: Math.min(100, (n / LIMIT) * 100) + '%' }} /></span>
                </span>
                <button type="button" className="btn btn-ghost" data-tip="Clear all text" aria-label="Clear all text" onClick={clearAll} disabled={!text}><Icon name="trash" /><span>Clear all</span></button>
              </div>
              <div className="foot-r">
                <button type="button" className={'btn btn-primary' + (copied ? ' done' : '')} ref={copyRef} onClick={doCopy} disabled={!text.trim()} data-tip="Copy post" data-keys="Mod+Enter">
                  <Icon name={copied ? 'check' : 'copy'} className={copied ? 'pop-in' : undefined} /><span>{copied ? 'Copied' : 'Copy post'}</span>
                </button>
              </div>
            </div>
            <span className="sr" role="status">{live}</span>

            <p className="hint">Select text, then pick a style. Nothing is selected? The word at your cursor is styled.</p>
            <details className="know">
              <summary><Icon name="info" />Good to know<Icon name="chev" className="chev" /></summary>
              <ul>
                <li>Styled text is made of special characters. It pastes into LinkedIn as it looks here, but it is not searchable and some screen readers read it badly. Use it for emphasis, not whole posts.</li>
                <li>Attachments and mentions are preview only. Copying carries text, so add media and tag people inside LinkedIn.</li>
                <li>The counter counts each styled letter as 2 characters to stay on the safe side. LinkedIn’s own count may differ.</li>
              </ul>
            </details>
          </section>

          {/* PREVIEW */}
          <aside className="card preview" aria-label="Post preview">
            <div className="pv-head">
              <h2>Preview</h2>
              <div className="pv-ctl">
                <div className="seg" role="group" aria-label="Preview size">
                  <button type="button" aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}><Icon name="phone" />Mobile</button>
                  <button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}><Icon name="monitor" />Desktop</button>
                </div>
                <div className="seg" role="group" aria-label="Preview appearance">
                  <button type="button" aria-pressed={!dark} aria-label="Preview in light mode" data-tip="Preview in light mode" onClick={() => setTheme('light')}><Icon name="sun" /></button>
                  <button type="button" aria-pressed={dark} aria-label="Preview in dark mode" data-tip="Preview in dark mode" onClick={() => setTheme('dark')}><Icon name="moon" /></button>
                </div>
                <button type="button" className="sq" data-tip="See it in a feed" aria-label="See it in a feed" aria-haspopup="dialog" onClick={() => setFeedOpen(true)}><Icon name="expand" /></button>
              </div>
            </div>
            <div className="pv" data-pv={theme}>
              <div className="pv-canvas">
                <PostCard device={device} text={text} atts={atts} profile={profile} expanded={expanded} onExpand={expand} onCollapse={collapse} onSample={insertSample} tick={tick} />
              </div>
            </div>
            <div className="pv-foot">
              <p>A close preview. Styled text can look slightly different on LinkedIn.</p>
              <button type="button" className="linkbtn" onClick={() => setProfOpen(true)}>Previewing as {profile.name || 'you'} · Edit</button>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />

      <div className={'dock' + (dockOn ? ' on' : '')} aria-label="Quick copy">
        <span className="count" aria-hidden="true">{countTxt.replace(' characters', '')}</span>
        <button type="button" className="btn btn-ghost" onClick={scrollToPreview}>Preview</button>
        <button type="button" className={'btn btn-primary' + (copied ? ' done' : '')} onClick={doCopy}><Icon name={copied ? 'check' : 'copy'} className={copied ? 'pop-in' : undefined} /><span>{copied ? 'Copied' : 'Copy post'}</span></button>
      </div>

      <FeedDialog
        open={feedOpen} onClose={() => setFeedOpen(false)}
        device={device} setDevice={setDevice} theme={theme} setTheme={setTheme}
        text={text} atts={atts} profile={profile} expanded={expanded} onExpand={expand} onCollapse={collapse} onSample={insertSample} tick={tick}
      />
      <ProfileDialog open={profOpen} onClose={() => setProfOpen(false)} profile={profile} setProfile={setProfile} />

      <TooltipLayer />
      <div id="toast" role="status" hidden={!toast}>
        {toast?.ok && <Icon name="check" />}
        {toast && <span>{toast.msg}</span>}
        {toast?.action && <button type="button" onClick={() => { const a = toast.action; setToast(null); a?.(); }}>{toast.label || 'Undo'}</button>}
      </div>
      <input ref={fImg} type="file" accept="image/*" multiple hidden onChange={(e) => { const f = Array.from(e.target.files || []); e.target.value = ''; void addFiles(f, 'image'); }} />
      <input ref={fVid} type="file" accept="video/*" hidden onChange={(e) => { const f = Array.from(e.target.files || []); e.target.value = ''; void addFiles(f, 'video'); }} />
      <input ref={fDoc} type="file" accept={ACCEPT_DOC} hidden onChange={(e) => { const f = Array.from(e.target.files || []); e.target.value = ''; void addFiles(f, 'doc'); }} />
    </>
  );
}
