import { FaqList, LinkGrid, Sections } from './PageBody';
import { TOOL_PAGES, GUIDE_PAGES, type Faq, type Section } from '@/lib/pages';

/* The text under the editor on the home page: what the tool does, how to use it, answers, and links to every tool. */

const STEPS: Section = {
  h2: 'How to format a LinkedIn post',
  ordered: true,
  list: [
    'Write or paste your post in the editor. Select a word or a line.',
    'Pick a style: bold, italic, underline, strikethrough, a list or an emoji.',
    'Check the desktop and mobile preview, then press Copy post and paste it into LinkedIn.',
  ],
};

const FEATURES: Section = {
  h2: 'What you can do with LekhKit',
  list: [
    'Bold, italic, bold italic, underline and strikethrough text.',
    'Script, gothic, double-struck and monospace letters for a name or a short line.',
    'Bullet and numbered lists that keep their shape on LinkedIn.',
    'Emoji picker and a post preview that shows where "see more" cuts the text.',
    'A live count against the 3,000 character limit.',
    'Desktop and mobile views, in light and dark.',
  ],
};

export const HOME_FAQ: Faq[] = [
  { q: 'Why does LinkedIn not have a bold button?', a: 'The LinkedIn post box accepts plain text only. LekhKit swaps your letters for look-alike characters from the Unicode standard, which paste into a post like any other text.' },
  { q: 'Is LekhKit free?', a: 'Yes. There are no accounts, no ads and no limits on how much you format.' },
  { q: 'Is my text saved or uploaded?', a: 'No. Everything runs in your browser. Your draft is kept only on your own device so you can come back to it.' },
  { q: 'Does the formatting work in comments, messages and my headline?', a: 'Yes. The result is plain text, so you can paste it anywhere LinkedIn takes text.' },
  { q: 'Is it bad for accessibility or search?', a: 'Styled characters can be read oddly by some screen readers and may not match searches. Use them for a few words and keep key information in plain text.' },
];

export default function HomeBody() {
  return (
    <div className="wrap cp-below">
      <Sections sections={[STEPS, FEATURES]} />
      <LinkGrid title="Free LinkedIn text tools" items={TOOL_PAGES.map((p) => ({ href: '/' + p.slug, label: p.label }))} />
      <LinkGrid title="Guides" items={GUIDE_PAGES.map((p) => ({ href: '/' + p.slug, label: p.label }))} />
      <FaqList title="Frequently asked questions" items={HOME_FAQ} />
    </div>
  );
}
