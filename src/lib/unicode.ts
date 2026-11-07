/*
  LekhKit Unicode engine. Ported from the original index.html. Strikethrough now uses U+0335 (see CS below).
  Styling = "Mathematical Alphanumeric" letters. Underline / strikethrough = combining
  characters U+0332 (underline) and U+0335 (strikethrough). Clear formatting reverses the map.
*/

export type StyleId =
  | 'sansBold' | 'sansItalic' | 'sansBoldItalic'
  | 'serifBold' | 'serifItalic' | 'serifBoldItalic'
  | 'script' | 'fraktur' | 'double' | 'mono';

interface StyleDef {
  A: number; a: number; d: number;
  b?: number; i?: number; f?: 'sans' | 'serif';
  ex?: Record<string, number>;
}

export const STYLES: Record<StyleId, StyleDef> = {
  sansBold: { A: 0x1D5D4, a: 0x1D5EE, d: 0x1D7EC, b: 1, i: 0, f: 'sans' },
  sansItalic: { A: 0x1D608, a: 0x1D622, d: 0, b: 0, i: 1, f: 'sans' },
  sansBoldItalic: { A: 0x1D63C, a: 0x1D656, d: 0, b: 1, i: 1, f: 'sans' },
  serifBold: { A: 0x1D400, a: 0x1D41A, d: 0x1D7CE, b: 1, i: 0, f: 'serif' },
  serifItalic: { A: 0x1D434, a: 0x1D44E, d: 0, b: 0, i: 1, f: 'serif', ex: { h: 0x210E } },
  serifBoldItalic: { A: 0x1D468, a: 0x1D482, d: 0, b: 1, i: 1, f: 'serif' },
  script: { A: 0x1D49C, a: 0x1D4B6, d: 0, ex: { B: 0x212C, E: 0x2130, F: 0x2131, H: 0x210B, I: 0x2110, L: 0x2112, M: 0x2133, R: 0x211B, e: 0x212F, g: 0x210A, o: 0x2134 } },
  fraktur: { A: 0x1D504, a: 0x1D51E, d: 0, ex: { C: 0x212D, H: 0x210C, I: 0x2111, R: 0x211C, Z: 0x2128 } },
  double: { A: 0x1D538, a: 0x1D552, d: 0x1D7D8, ex: { C: 0x2102, H: 0x210D, N: 0x2115, P: 0x2119, Q: 0x211A, R: 0x211D, Z: 0x2124 } },
  mono: { A: 0x1D670, a: 0x1D68A, d: 0x1D7F6 },
};

const BY_FLAGS: Record<'sans' | 'serif', Record<string, StyleId>> = {
  sans: { '10': 'sansBold', '01': 'sansItalic', '11': 'sansBoldItalic' },
  serif: { '10': 'serifBold', '01': 'serifItalic', '11': 'serifBoldItalic' },
};

const LET = /[A-Za-z]/;
const DIG = /[0-9]/;
const ALN = /[A-Za-z0-9]/;
export const CU = String.fromCharCode(0x0332); // combining low line (underline)
/** Strikethrough mark: U+0335 combining short stroke overlay. In Segoe UI (LinkedIn on Windows) the older
    U+0336 sits at the baseline and looks like an underline; U+0335 is centred in Segoe UI, Arial and Roboto. */
export const CS = String.fromCharCode(0x0335);
/** Older drafts used U+0336. It is still recognised (toggles off, clears) and is rewritten as U+0335 when re-applied. */
export const CS_LEGACY = String.fromCharCode(0x0336);

export function enc(id: StyleId, ch: string): string {
  const st = STYLES[id];
  const c = ch.charCodeAt(0);
  if (ch.length !== 1) return ch;
  if (c >= 65 && c <= 90) return String.fromCodePoint((st.ex && st.ex[ch]) || st.A + c - 65);
  if (c >= 97 && c <= 122) return String.fromCodePoint((st.ex && st.ex[ch]) || st.a + c - 97);
  if (c >= 48 && c <= 57 && st.d) return String.fromCodePoint(st.d + c - 48);
  return ch;
}

const REV = new Map<string, { plain: string; style: StyleId }>();
(Object.keys(STYLES) as StyleId[]).forEach((id) => {
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('').forEach((ch) => {
    const e = enc(id, ch);
    if (e !== ch) REV.set(e, { plain: ch, style: id });
  });
});

export function sty(id: StyleId, str: string): string {
  return Array.from(str).map((c) => enc(id, c)).join('');
}

interface Decomposed { c: string; plain: string; style: StyleId | null }

export function decompose(str: string): Decomposed[] {
  return Array.from(str).map((ch) => {
    const r = REV.get(ch);
    return r ? { c: ch, plain: r.plain, style: r.style } : { c: ch, plain: ch, style: null };
  });
}

interface Comb { c: string; u: boolean; s: boolean }

function parseComb(str: string): Comb[] {
  const out: Comb[] = [];
  Array.from(str).forEach((c) => {
    if (c === CU || c === CS || c === CS_LEGACY) {
      const last = out[out.length - 1];
      if (last) { if (c === CU) last.u = true; else last.s = true; }
    } else out.push({ c, u: false, s: false });
  });
  return out;
}

export function toggleBI(str: string, flag: 'b' | 'i'): string {
  const d = decompose(str);
  let probe = d.filter((x) => LET.test(x.plain));
  if (!probe.length) probe = d.filter((x) => DIG.test(x.plain));
  if (!probe.length) return str;
  const all = probe.every((x) => x.style && STYLES[x.style][flag]);
  return d.map((x) => {
    if (!ALN.test(x.plain)) return x.c;
    const s = x.style ? STYLES[x.style] : null;
    let b = s && s.b ? 1 : 0;
    let i = s && s.i ? 1 : 0;
    const f = (s && s.f) || 'sans';
    if (flag === 'b') b = all ? 0 : 1; else i = all ? 0 : 1;
    if (DIG.test(x.plain)) return b ? enc(f === 'serif' ? 'serifBold' : 'sansBold', x.plain) : x.plain;
    const id = BY_FLAGS[f]['' + b + i];
    return id ? enc(id, x.plain) : x.plain;
  }).join('');
}

export function toggleStyle(str: string, target: StyleId): string {
  const d = decompose(str);
  const st = d.filter((x) => LET.test(x.plain) || (DIG.test(x.plain) && STYLES[target].d));
  if (!st.length) return str;
  const all = st.every((x) => x.style === target);
  return d.map((x) => {
    if (!ALN.test(x.plain)) return x.c;
    return all ? x.plain : enc(target, x.plain);
  }).join('');
}

export function toggleComb(str: string, flag: 'u' | 's'): string {
  const p = parseComb(str);
  const el = p.filter((x) => !/\s/.test(x.c));
  if (!el.length) return str;
  const all = el.every((x) => x[flag]);
  return p.map((x) => {
    // Line breaks stay clean. Spaces ARE marked, so a struck or underlined line runs unbroken between words.
    if (x.c === '\n' || x.c === '\r') return x.c;
    const v = !all;
    const u = flag === 'u' ? v : x.u;
    const s = flag === 's' ? v : x.s;
    return x.c + (u ? CU : '') + (s ? CS : '');
  }).join('');
}

export function plainOf(str: string): string {
  return decompose(str).map((x) => x.plain).join('').split(CU).join('').split(CS).join('').split(CS_LEGACY).join('');
}

export function flagsOf(str: string) {
  const d = decompose(str);
  const L = d.filter((x) => LET.test(x.plain));
  const p = parseComb(str).filter((x) => !/\s/.test(x.c));
  return {
    b: !!L.length && L.every((x) => x.style && STYLES[x.style].b),
    i: !!L.length && L.every((x) => x.style && STYLES[x.style].i),
    u: !!p.length && p.every((x) => x.u),
    s: !!p.length && p.every((x) => x.s),
  };
}
