import { describe, expect, it } from 'vitest';
import { CS, CS_LEGACY, CU, STYLES, enc, flagsOf, plainOf, sty, toggleBI, toggleComb, toggleStyle, type StyleId } from './unicode';

const SAMPLES = [
  'Hello World',
  'The quick brown fox jumps over the lazy dog 0123456789',
  'Mixed CASE and numbers 42',
  'Plain, punctuation! Does it survive? (yes) #tag @name',
  'Línea con acentos — ñandú',
];
const IDS = Object.keys(STYLES) as StyleId[];

describe('round trip: style then clear formatting returns the original', () => {
  for (const id of IDS) {
    it(`toggleStyle(${id})`, () => {
      for (const s of SAMPLES) {
        const styled = toggleStyle(s, id);
        expect(plainOf(styled)).toBe(s);
      }
    });
  }
  it('bold', () => { for (const s of SAMPLES) expect(plainOf(toggleBI(s, 'b'))).toBe(s); });
  it('italic', () => { for (const s of SAMPLES) expect(plainOf(toggleBI(s, 'i'))).toBe(s); });
  it('bold + italic together', () => {
    for (const s of SAMPLES) expect(plainOf(toggleBI(toggleBI(s, 'b'), 'i'))).toBe(s);
  });
  it('underline and strikethrough', () => {
    for (const s of SAMPLES) {
      expect(plainOf(toggleComb(s, 'u'))).toBe(s);
      expect(plainOf(toggleComb(s, 's'))).toBe(s);
      expect(plainOf(toggleComb(toggleComb(s, 'u'), 's'))).toBe(s);
    }
  });
  it('everything stacked', () => {
    for (const s of SAMPLES) {
      const all = toggleComb(toggleComb(toggleBI(toggleBI(s, 'b'), 'i'), 'u'), 's');
      expect(plainOf(all)).toBe(s);
    }
  });
});

describe('toggles', () => {
  it('bold twice returns the original', () => {
    expect(toggleBI(toggleBI('Hello 123', 'b'), 'b')).toBe('Hello 123');
  });
  it('italic twice returns the original', () => {
    expect(toggleBI(toggleBI('Hello', 'i'), 'i')).toBe('Hello');
  });
  it('underline twice returns the original', () => {
    expect(toggleComb(toggleComb('Hello world', 'u'), 'u')).toBe('Hello world');
  });
  it('same style twice returns the original', () => {
    for (const id of IDS) expect(toggleStyle(toggleStyle('Hello', id), id)).toBe('Hello');
  });
});

describe('known glyphs', () => {
  it('sans bold', () => { expect(sty('sansBold', 'Aa0')).toBe('\u{1D5D4}\u{1D5EE}\u{1D7EC}'); });
  it('sans italic leaves digits alone', () => { expect(sty('sansItalic', 'a1')).toBe('\u{1D622}1'); });
  it('serif italic h uses the reserved Planck constant', () => { expect(enc('serifItalic', 'h')).toBe('ℎ'); });
  it('script, fraktur and double-struck use their reserved letters', () => {
    expect(enc('script', 'B')).toBe('ℬ');
    expect(enc('fraktur', 'C')).toBe('ℭ');
    expect(enc('double', 'N')).toBe('ℕ');
  });
  it('underline marks every character including spaces, so the line is unbroken', () => {
    expect(toggleComb('a b', 'u')).toBe('a' + CU + ' ' + CU + 'b' + CU);
  });
  it('line breaks are never marked', () => {
    expect(toggleComb('a\nb', 's')).toBe('a' + CS + '\n' + 'b' + CS);
    expect(toggleComb(toggleComb('a b\nc d', 's'), 's')).toBe('a b\nc d');
  });
  it('strike spans a whole sentence and clears back to the original', () => {
    const s = 'A few small changes make yours easier to scan:';
    const struck = toggleComb(s, 's');
    expect(struck.split(CS).length - 1).toBe(s.length);
    expect(plainOf(struck)).toBe(s);
  });
  it('strikethrough uses U+0335, which is centred in Segoe UI (LinkedIn on Windows)', () => {
    expect(CS.codePointAt(0)).toBe(0x0335);
    expect(toggleComb('ab', 's')).toBe('a' + CS + 'b' + CS);
  });
  it('underline uses U+0332', () => {
    expect(CU.codePointAt(0)).toBe(0x0332);
  });
});

describe('older drafts that used U+0336 for strikethrough', () => {
  const old = 'a' + CS_LEGACY + 'b' + CS_LEGACY;
  it('is still recognised as struck', () => { expect(flagsOf(old).s).toBe(true); });
  it('clear formatting strips it', () => { expect(plainOf(old)).toBe('ab'); });
  it('toggling strikethrough removes it', () => { expect(toggleComb(old, 's')).toBe('ab'); });
  it('is rewritten with the new mark when another style is added', () => {
    const next = toggleComb(old, 'u');
    expect(next.includes(CS_LEGACY)).toBe(false);
    expect(next.includes(CS)).toBe(true);
    expect(plainOf(next)).toBe('ab');
  });
});

describe('flagsOf', () => {
  it('detects bold, italic, underline and strikethrough', () => {
    expect(flagsOf(toggleBI('Hi', 'b'))).toEqual({ b: true, i: false, u: false, s: false });
    expect(flagsOf(toggleBI('Hi', 'i'))).toEqual({ b: false, i: true, u: false, s: false });
    expect(flagsOf(toggleComb('Hi', 'u'))).toEqual({ b: false, i: false, u: true, s: false });
    expect(flagsOf(toggleComb('Hi', 's'))).toEqual({ b: false, i: false, u: false, s: true });
  });
  it('plain text has no flags', () => {
    expect(flagsOf('Hello')).toEqual({ b: false, i: false, u: false, s: false });
  });
});

describe('edge cases', () => {
  it('empty and whitespace-only strings are unchanged', () => {
    expect(toggleBI('', 'b')).toBe('');
    expect(toggleBI('   ', 'b')).toBe('   ');
    expect(toggleComb('  ', 'u')).toBe('  ');
  });
  it('text without letters or digits is unchanged by bold', () => {
    expect(toggleBI('!?—', 'b')).toBe('!?—');
  });
  it('emoji and astral characters survive', () => {
    const s = 'Launch 🚀 day';
    expect(plainOf(toggleBI(s, 'b'))).toBe(s);
  });
  it('switching bold to bold-italic keeps the sans family', () => {
    expect(toggleBI(toggleBI('Hi', 'b'), 'i')).toBe(sty('sansBoldItalic', 'Hi'));
  });
});
