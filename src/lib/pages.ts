/*
  Hardcoded SEO pages. Everything on these pages is plain text written here, so it is fully crawlable and needs no backend.
  To add a page: add an entry below. It is picked up by the route, the sitemap, the related links and the footer automatically.
*/

export type Mode = 'bold' | 'italic' | 'bolditalic' | 'underline' | 'strike' | 'fonts' | 'bullets';

export interface Section { h2: string; paras?: string[]; list?: string[]; ordered?: boolean }
export interface Faq { q: string; a: string }
export interface SeoPage {
  slug: string;
  /** Language code. English pages leave this out. */
  lang?: string;
  /** Pages in different languages with the same group are translations of each other (used for hreflang). */
  group?: string;
  kind: 'tool' | 'guide' | 'info';
  /** <title> tag, about 50-60 characters. */
  title: string;
  h1: string;
  /** Meta description, about 150 characters. */
  description: string;
  /** Short label used in link lists. */
  label: string;
  intro: string;
  /** Adds a small live converter above the text. */
  mode?: Mode;
  sections: Section[];
  faq?: Faq[];
  related?: string[];
  updated: string;
}

const UPDATED = '2026-11-08';

export const PAGES: SeoPage[] = [
  {
    slug: 'linkedin-bold-text-generator',
    group: 'bold',
    kind: 'tool',
    title: 'LinkedIn Bold Text Generator: Free, Copy and Paste | LekhKit',
    h1: 'LinkedIn Bold Text Generator',
    label: 'Bold text generator',
    description: 'Make bold text for LinkedIn posts, comments and your headline. Type, copy and paste. Free, no sign-up, and your text never leaves your browser.',
    intro: 'LinkedIn has no bold button in the post box. This free generator turns your words into bold characters you can paste straight into a post, a comment or your headline.',
    mode: 'bold',
    sections: [
      {
        h2: 'How to make bold text on LinkedIn',
        ordered: true,
        list: [
          'Type or paste your words into the box above.',
          'Copy the bold result.',
          'Paste it into your LinkedIn post, comment, headline or About section.',
        ],
      },
      {
        h2: 'Why LinkedIn posts have no bold button',
        paras: [
          'The LinkedIn post editor only accepts plain text. Bold, italic and underline are not part of it, so tools like this one use a different trick: Unicode has whole sets of letters that are drawn in a bold style, and they paste anywhere plain text is allowed.',
          'To LinkedIn these are ordinary characters, which is why the styling survives posting. It is not formatting in the word-processor sense, so it will not carry over if someone copies your post into a document that swaps fonts.',
        ],
      },
      {
        h2: 'When bold works well',
        list: [
          'A short hook on the first line, so people stop scrolling.',
          'Two or three key phrases inside a longer post. Bold everything and nothing stands out.',
          'Section labels in a list-style post, such as the step numbers.',
          'A single keyword in your headline.',
        ],
      },
      {
        h2: 'Things to watch for',
        list: [
          'Screen readers may read bold Unicode letters one by one, so keep bold for short phrases and never for a whole post.',
          'Bold letters are different characters from normal ones, so a LinkedIn search for the plain word may not match them.',
          'Only English letters and digits have bold versions. Accents and other alphabets stay as typed.',
        ],
      },
    ],
    faq: [
      { q: 'Does bold text work in LinkedIn comments and messages?', a: 'Yes. Because the characters are plain text, they paste into comments, messages, your headline and your About section as well as posts.' },
      { q: 'Is it free?', a: 'Yes. LekhKit is free, has no accounts and no ads.' },
      { q: 'Is my text saved anywhere?', a: 'No. The conversion happens in your browser. Nothing you type is uploaded.' },
      { q: 'Will it look the same on every phone?', a: 'Almost always. Modern phones and computers include fonts for these characters. Very old devices may show empty boxes.' },
    ],
    related: ['linkedin-italic-text-generator', 'linkedin-fonts-generator', 'how-to-bold-text-on-linkedin', 'linkedin-formatting-accessibility'],
    updated: UPDATED,
  },
  {
    slug: 'linkedin-italic-text-generator',
    group: 'italic',
    kind: 'tool',
    title: 'LinkedIn Italic Text Generator: Free Copy and Paste | LekhKit',
    h1: 'LinkedIn Italic Text Generator',
    label: 'Italic text generator',
    description: 'Create italic text for LinkedIn posts and comments. Type, copy, paste. Free, private, and nothing is uploaded from your browser.',
    intro: 'Italics are a quiet way to add emphasis, a quote or an aside to a LinkedIn post. Type below and copy the italic version.',
    mode: 'italic',
    sections: [
      {
        h2: 'How to write in italics on LinkedIn',
        ordered: true,
        list: [
          'Enter your text above.',
          'Copy the italic result.',
          'Paste it where you want it on LinkedIn: post, comment, headline or About.',
        ],
      },
      {
        h2: 'Good uses for italic text',
        list: [
          'Quotes and short pull-lines inside a story.',
          'Titles of books, articles or podcasts.',
          'A soft aside, such as a side thought in brackets.',
          'A closing question to your readers.',
        ],
      },
      {
        h2: 'Bold italic and mixing styles',
        paras: [
          'Bold italic is available too, and you can mix styles inside one post. Use the full LekhKit editor to bold one word and italicise another without retyping, with a live preview of how the post will look on desktop and mobile.',
        ],
      },
      {
        h2: 'Keep it readable',
        paras: [
          'Italic Unicode letters are harder to read in long stretches and are read out letter by letter by many screen readers. A line or two is plenty. Keep the main message in normal text.',
        ],
      },
    ],
    faq: [
      { q: 'Why does italic text on LinkedIn need a generator?', a: 'The LinkedIn post box accepts plain text only. The generator swaps each letter for the matching italic character from the Unicode standard.' },
      { q: 'Can I use italics and bold together?', a: 'Yes. LekhKit supports bold, italic, bold italic, underline and strikethrough, and you can mix them in one post.' },
      { q: 'Does it work on numbers?', a: 'Italic styles cover letters only. Numbers stay as they are, while bold has its own digits.' },
    ],
    related: ['linkedin-bold-text-generator', 'linkedin-fonts-generator', 'linkedin-underline-text', 'linkedin-formatting-accessibility'],
    updated: UPDATED,
  },
  {
    slug: 'linkedin-strikethrough-text-generator',
    group: 'strike',
    kind: 'tool',
    title: 'LinkedIn Strikethrough Text Generator: Free | LekhKit',
    h1: 'LinkedIn Strikethrough Text Generator',
    label: 'Strikethrough generator',
    description: 'Cross out words in LinkedIn posts and comments. Free strikethrough text generator: type, copy, paste. Runs in your browser, nothing uploaded.',
    intro: 'Strikethrough lets you show a correction, a changed plan or a joke without deleting the original words. Type below and copy the crossed-out text.',
    mode: 'strike',
    sections: [
      {
        h2: 'How to strike through text on LinkedIn',
        ordered: true,
        list: [
          'Type or paste your text above.',
          'Copy the crossed-out version.',
          'Paste it into your post or comment.',
        ],
      },
      {
        h2: 'What people use it for',
        list: [
          'Before and after statements, such as a crossed-out old belief followed by the new one.',
          'Showing a corrected number or date.',
          'A light, humorous aside.',
          'Lists of things you stopped doing.',
        ],
      },
      {
        h2: 'How it works',
        paras: [
          'Strikethrough here uses a combining character: a small stroke that sits over each letter. Because it is attached to normal text, the words stay readable and searchable in most places.',
          'The line may look slightly different between Windows, Mac, iPhone and Android because each draws the character with its own font. LekhKit uses the stroke that sits in the middle of the letters on the most common fonts.',
        ],
      },
    ],
    faq: [
      { q: 'Will the line show on every device?', a: 'On current phones and computers, yes. The thickness and height of the line can vary a little by font.' },
      { q: 'Can I undo it?', a: 'In the LekhKit editor you can toggle strikethrough off again, or clear all formatting in one click.' },
      { q: 'Is it free to use?', a: 'Yes. No sign-up, no ads, and the text is processed in your browser.' },
    ],
    related: ['linkedin-underline-text', 'linkedin-bold-text-generator', 'linkedin-fonts-generator'],
    updated: UPDATED,
  },
  {
    slug: 'linkedin-underline-text',
    group: 'underline',
    kind: 'tool',
    title: 'LinkedIn Underline Text Generator: Free Copy and Paste | LekhKit',
    h1: 'LinkedIn Underline Text Generator',
    label: 'Underline text generator',
    description: 'Underline words in LinkedIn posts, comments and headlines. Free generator: type, copy and paste. Private and runs in your browser.',
    intro: 'Underline a word or a line in your LinkedIn post. Type below, copy the result and paste it where you need it.',
    mode: 'underline',
    sections: [
      {
        h2: 'How to underline text on LinkedIn',
        ordered: true,
        list: [
          'Enter your words in the box above.',
          'Copy the underlined text.',
          'Paste it into LinkedIn.',
        ],
      },
      {
        h2: 'A word of caution',
        paras: [
          'On the web, an underline usually means a link. Readers may try to click underlined words, so use it sparingly. Bold or italics are often a better way to add emphasis to a line.',
        ],
      },
      {
        h2: 'Where underline helps',
        list: [
          'A section title in a long post.',
          'One key term you want people to remember.',
          'A call to action at the end, such as the word you want people to comment.',
        ],
      },
    ],
    faq: [
      { q: 'Is the underline a real format?', a: 'It is made with a combining character that attaches a line under each letter. It pastes as text, so LinkedIn keeps it.' },
      { q: 'Can I combine underline with bold?', a: 'Yes. In the full LekhKit editor you can stack bold, italic, underline and strikethrough on the same words.' },
    ],
    related: ['linkedin-strikethrough-text-generator', 'linkedin-bold-text-generator', 'linkedin-italic-text-generator'],
    updated: UPDATED,
  },
  {
    slug: 'linkedin-bullet-points',
    group: 'bullets',
    kind: 'tool',
    title: 'LinkedIn Bullet Points: Copy and Paste Lists | LekhKit',
    h1: 'LinkedIn Bullet Points and List Maker',
    label: 'Bullet points',
    description: 'Add bullet points to LinkedIn posts. Paste one item per line, pick a bullet, copy the list. Free, private, no sign-up.',
    intro: 'LinkedIn does not turn dashes into lists. Put one item on each line below, pick a bullet style and copy a clean list for your post.',
    mode: 'bullets',
    sections: [
      {
        h2: 'How to add bullet points on LinkedIn',
        ordered: true,
        list: [
          'Write one item per line in the box above.',
          'Choose a bullet style.',
          'Copy the list and paste it into your post.',
        ],
      },
      {
        h2: 'Bullet styles that work',
        list: [
          'The round bullet is the safest and looks the same everywhere.',
          'Arrows suit steps and next actions.',
          'Check marks suit benefits and results.',
          'Numbers suit ordered steps. You can type them by hand.',
        ],
      },
      {
        h2: 'Make lists easy to scan',
        list: [
          'Keep each item to one line where you can.',
          'Start every item the same way, for example with a verb.',
          'Leave a blank line before and after the list.',
          'Five to seven items is plenty. Long lists lose readers.',
        ],
      },
    ],
    faq: [
      { q: 'Why not use a hyphen?', a: 'A hyphen works, but a real bullet character is easier to see and reads as a list at a glance.' },
      { q: 'Do bullets work on mobile?', a: 'Yes. These are normal characters, so they display on the LinkedIn app and the website.' },
    ],
    related: ['linkedin-post-preview', 'linkedin-bold-text-generator', 'linkedin-post-character-limit'],
    updated: UPDATED,
  },
  {
    slug: 'linkedin-fonts-generator',
    kind: 'tool',
    title: 'LinkedIn Fonts Generator: Script, Gothic and More | LekhKit',
    h1: 'LinkedIn Fonts Generator',
    label: 'Fonts generator',
    description: 'Generate fancy LinkedIn fonts: script, gothic, double-struck and monospace. Free, copy and paste, and nothing leaves your browser.',
    intro: 'You cannot change the font in a LinkedIn post, but you can paste letters that look like different fonts. Type below to see every style at once and copy the one you like.',
    mode: 'fonts',
    sections: [
      {
        h2: 'The styles available',
        list: [
          'Script: a flowing, handwritten look.',
          'Fraktur (gothic): old-style blackletter.',
          'Double-struck: outlined letters, often used in maths.',
          'Monospace: typewriter letters, good for code-like lines.',
          'Bold, italic and bold italic in sans and serif.',
        ],
      },
      {
        h2: 'Use fancy fonts with care',
        paras: [
          'Decorative styles are harder to read than plain text, and screen readers handle them poorly. They suit a name, a short title or a single line. For the body of a post, keep normal text and add bold or italic only where it helps.',
          'Business profiles and professional posts usually read best with bold and italic. Save script and gothic for personality posts.',
        ],
      },
      {
        h2: 'How it works',
        paras: [
          'Unicode includes sets of mathematical letters that look like different fonts. They are real text characters, so they paste into LinkedIn. They are not fonts, which is why they only cover English letters and some digits.',
        ],
      },
    ],
    faq: [
      { q: 'Can I change the actual font on LinkedIn?', a: 'No. LinkedIn shows all posts in its own font. Look-alike Unicode letters are the only option in a post.' },
      { q: 'Do the fancy letters work in my name?', a: 'They can, but some systems and search tools may not match them to your real name. Think twice before using them in your name field.' },
    ],
    related: ['linkedin-bold-text-generator', 'linkedin-italic-text-generator', 'linkedin-formatting-accessibility'],
    updated: UPDATED,
  },
  {
    slug: 'linkedin-post-preview',
    kind: 'tool',
    title: 'LinkedIn Post Preview: Desktop and Mobile | LekhKit',
    h1: 'LinkedIn Post Preview Tool',
    label: 'Post preview',
    description: 'Preview a LinkedIn post before you publish. See where "see more" cuts your text on desktop and mobile. Free, no sign-up.',
    intro: 'See your post as readers will see it before you publish. The LekhKit preview shows the post card on desktop and mobile, including where the text folds behind "see more".',
    sections: [
      {
        h2: 'Why preview a post',
        list: [
          'Only the first few lines are visible before "see more", so your hook has to land there.',
          'Line breaks and spacing can look different on mobile.',
          'Emoji and special characters can render differently between devices.',
          'You catch typos while nothing is live.',
        ],
      },
      {
        h2: 'What the LekhKit preview shows',
        list: [
          'A LinkedIn-style post card for desktop and for mobile.',
          'Light and dark views.',
          'A live character count against the 3,000 limit.',
          'Your formatting exactly as it will paste.',
        ],
      },
      {
        h2: 'Get the most from the first lines',
        paras: [
          'Put the main point and a reason to continue in the first two lines. Use a short bold phrase only if it earns the space. Then leave a line break and tell the story.',
        ],
      },
    ],
    faq: [
      { q: 'Is the preview exact?', a: 'It is a close visual match, not an official LinkedIn product. The "see more" point can vary slightly by device and screen width.' },
      { q: 'Do I need to sign in?', a: 'No. Open LekhKit, write your post and the preview updates as you type.' },
    ],
    related: ['linkedin-post-character-limit', 'linkedin-bullet-points', 'linkedin-bold-text-generator'],
    updated: UPDATED,
  },
  {
    slug: 'how-to-bold-text-on-linkedin',
    kind: 'guide',
    title: 'How to Bold Text on LinkedIn (Posts, Comments, Headline) | LekhKit',
    h1: 'How to Bold Text on LinkedIn',
    label: 'How to bold text on LinkedIn',
    description: 'A short guide to bold text on LinkedIn: posts, comments, headline and About. The easy way, plus what to avoid so your post stays readable.',
    intro: 'The LinkedIn post box has no bold button. Here is how people get bold text into posts, comments and profiles, and how to use it well.',
    mode: 'bold',
    sections: [
      {
        h2: 'The quick way',
        ordered: true,
        list: [
          'Open LekhKit, or use the box above.',
          'Type your words and select the part you want in bold.',
          'Copy the result.',
          'Paste it into LinkedIn and post.',
        ],
      },
      {
        h2: 'Where bold works on LinkedIn',
        list: [
          'Posts: yes, as pasted text.',
          'Comments and replies: yes.',
          'Headline and About: yes, but keep it light.',
          'Articles and newsletters: these have their own built-in bold, so you do not need a generator.',
        ],
      },
      {
        h2: 'Using bold well',
        list: [
          'Bold the first phrase of your hook, not the whole line.',
          'Limit yourself to two or three bold spots per post.',
          'Use bold for labels in lists, then plain text for the detail.',
          'Read the post on your phone before posting.',
        ],
      },
      {
        h2: 'What can go wrong',
        paras: [
          'Bold letters from a generator are special characters. Some screen readers announce them awkwardly and search may not match them to plain words. A little goes a long way: bold the few words that matter and keep the rest plain.',
        ],
      },
    ],
    faq: [
      { q: 'Is there a shortcut like Ctrl+B on LinkedIn?', a: 'Not in the standard post editor. Ctrl+B does nothing there, which is why a formatter is needed.' },
      { q: 'Will my followers see the bold?', a: 'Yes, on any current device. It travels with the text because it is made of normal characters.' },
    ],
    related: ['linkedin-bold-text-generator', 'linkedin-formatting-accessibility', 'linkedin-post-preview'],
    updated: UPDATED,
  },
  {
    slug: 'linkedin-formatting-accessibility',
    kind: 'guide',
    title: 'Does Unicode Bold Text Hurt LinkedIn Accessibility? | LekhKit',
    h1: 'Is Bold and Italic Text on LinkedIn Accessible?',
    label: 'Formatting and accessibility',
    description: 'Unicode bold and italic can be awkward for screen readers and search. Learn the trade-offs and how to use LinkedIn formatting responsibly.',
    intro: 'Bold and italic text from a generator is made of special Unicode characters. That affects how some people and some tools read it. Here is a plain summary and a few safe habits.',
    sections: [
      {
        h2: 'What the issue is',
        paras: [
          'A generator replaces normal letters with look-alike characters from the mathematical alphabet. To the eye they look bold. To software they are different characters.',
          'Some screen readers read these characters by name or skip them, and plain-text search will not treat them as the normal word. Behaviour varies by tool and version, so this is a risk to manage rather than a certainty.',
        ],
      },
      {
        h2: 'Safe habits',
        list: [
          'Format a few words, not whole paragraphs.',
          'Never put key information, links or names only in styled characters.',
          'Keep the important message readable in plain text.',
          'Avoid decorative styles such as script and gothic for anything essential.',
          'Add emphasis with structure too: short lines, clear breaks and simple lists.',
        ],
      },
      {
        h2: 'What to avoid',
        list: [
          'A fully styled post. It is harder to read for everyone.',
          'Styled hashtags. They may not work as hashtags.',
          'Styled text for email addresses, links or numbers people need to copy.',
        ],
      },
    ],
    faq: [
      { q: 'Should I stop using formatted text?', a: 'No. Used lightly it helps readers scan a post. Just do not rely on it to carry the meaning.' },
      { q: 'Do hashtags work in bold?', a: 'Treat them as plain text. Write hashtags in normal characters so LinkedIn can recognise them.' },
    ],
    related: ['linkedin-bold-text-generator', 'linkedin-fonts-generator', 'how-to-bold-text-on-linkedin'],
    updated: UPDATED,
  },
  {
    slug: 'linkedin-post-character-limit',
    kind: 'guide',
    title: 'LinkedIn Post Character Limit and "See More" Cutoff | LekhKit',
    h1: 'LinkedIn Post Character Limit',
    label: 'Character limit guide',
    description: 'How long can a LinkedIn post be? The 3,000 character limit, where "see more" cuts the text, and how to write a strong first two lines.',
    intro: 'A LinkedIn post can hold up to 3,000 characters. What readers see before tapping "see more" is far shorter, so the opening matters most.',
    sections: [
      {
        h2: 'The numbers',
        list: [
          'Post text: up to 3,000 characters.',
          'Comments: shorter than posts, and limited separately.',
          'Headline: 220 characters.',
          'About section: 2,600 characters.',
        ],
      },
      {
        h2: 'The "see more" cutoff',
        paras: [
          'LinkedIn shows only the first few lines of a long post, followed by "see more". The exact point depends on the device, window width and line breaks, and it is usually around the first two to three lines. Treat those lines as your headline.',
          'Special characters and emoji can count as more than one character, so a formatted post can use up the limit faster than it looks. The LekhKit counter shows the length as you type.',
        ],
      },
      {
        h2: 'Writing the opening',
        list: [
          'Lead with the point or a question, not a greeting.',
          'Keep the first line short enough to fit on a phone.',
          'Add a line break after the hook.',
          'Check it in the preview before you publish.',
        ],
      },
    ],
    faq: [
      { q: 'Do formatted characters count more?', a: 'They can. Many styled letters are stored as two code units, which can make the count higher than the number of visible letters. Use the counter in LekhKit to check.' },
      { q: 'Do these limits change?', a: 'LinkedIn can change limits at any time, so check them on LinkedIn if exact numbers matter for you.' },
    ],
    related: ['linkedin-post-preview', 'linkedin-bullet-points', 'how-to-bold-text-on-linkedin'],
    updated: UPDATED,
  },
  {
    slug: 'about',
    kind: 'info',
    title: 'About LekhKit: Free LinkedIn Post Formatter',
    h1: 'About LekhKit',
    label: 'About',
    description: 'LekhKit is a free LinkedIn post formatter that runs in your browser. Learn what it does, how it works and why it keeps your text private.',
    intro: 'LekhKit is a free tool for writing LinkedIn posts that are easier to read. It adds bold, italic, underline, strikethrough, lists and emoji, and shows a live preview.',
    sections: [
      {
        h2: 'What LekhKit does',
        list: [
          'Formats text with bold, italic, underline and strikethrough.',
          'Shows desktop and mobile previews with the "see more" fold.',
          'Counts characters against LinkedIn limits.',
          'Helps with bullet lists and emoji.',
        ],
      },
      {
        h2: 'Private by design',
        paras: [
          'Everything runs in your browser. The text you write is not sent to a server and there are no accounts. See the privacy page for details.',
        ],
      },
      {
        h2: 'Not affiliated with LinkedIn',
        paras: [
          'LekhKit is an independent tool. It is not made, endorsed or sponsored by LinkedIn. LinkedIn is a trademark of its owner.',
        ],
      },
    ],
    related: ['privacy', 'linkedin-bold-text-generator', 'linkedin-post-preview'],
    updated: UPDATED,
  },
  {
    slug: 'privacy',
    kind: 'info',
    title: 'Privacy Policy | LekhKit',
    h1: 'Privacy Policy',
    label: 'Privacy',
    description: 'LekhKit privacy policy: your text stays in your browser, there are no accounts, and only anonymous site analytics may be collected.',
    intro: 'Short version: what you type into LekhKit stays on your device. Last updated 8 November 2026.',
    sections: [
      {
        h2: 'Your text',
        paras: [
          'Text you write, paste or format is processed in your browser. It is not uploaded to our servers and we cannot read it. Drafts and settings may be saved in your browser storage on your device so you can pick up where you left off, and you can clear them any time from your browser settings.',
        ],
      },
      {
        h2: 'Analytics',
        paras: [
          'We use Google Tag Manager, which may load Google Analytics, to understand how many people visit and which pages are used. This may set cookies and collect anonymous usage data such as pages viewed, device type and approximate location. We do not send the text you write to analytics.',
        ],
      },
      {
        h2: 'Accounts and payments',
        paras: ['There are no accounts and no payments on LekhKit.'],
      },
      {
        h2: 'Your choices',
        paras: ['You can block cookies or analytics scripts in your browser, and the tool will still work.'],
      },
    ],
    related: ['about', 'linkedin-post-preview'],
    updated: UPDATED,
  },
];

import { MORE_PAGES } from './pages-more';
PAGES.push(...MORE_PAGES);

export const PAGE_BY_SLUG: Record<string, SeoPage> = Object.fromEntries(PAGES.map((p) => [p.slug, p]));
export const TOOL_PAGES = PAGES.filter((p) => p.kind === 'tool');
export const GUIDE_PAGES = PAGES.filter((p) => p.kind === 'guide');
export const INFO_PAGES = PAGES.filter((p) => p.kind === 'info');
