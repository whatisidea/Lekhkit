import { sty, type StyleId } from './unicode';

export const LIMIT = 3000;

export const STYLE_LIST: [StyleId, string][] = [
  ['sansBold', 'Bold'], ['sansItalic', 'Italic'], ['sansBoldItalic', 'Bold italic'],
  ['serifBold', 'Serif bold'], ['serifItalic', 'Serif italic'], ['serifBoldItalic', 'Serif bold italic'],
  ['script', 'Script'], ['fraktur', 'Fraktur'], ['double', 'Double-struck'], ['mono', 'Monospace'],
];

export const BULLETS: [string, string][] = [
  ['•', 'Dot'], ['▪', 'Small square'], ['–', 'Dash'], ['➤', 'Pointer'], ['✓', 'Check'], ['→', 'Arrow'], ['★', 'Star'],
];

export const EMOJI: Record<string, string> = {
  Faces: '😀 grinning|😃 big smile|😄 smile|😁 beaming|😂 laughing tears|🤣 rolling laughing|😊 blush|🙂 slight smile|😉 wink|😍 heart eyes|🥰 love|😘 kiss|😎 cool|🤩 star struck|🤔 thinking|😅 sweat smile|😬 grimace|😴 sleepy|😢 cry|😭 sob|😡 angry|🤯 mind blown|🥳 party face|🙄 eye roll|😇 angel|🤗 hug|😌 relieved|😏 smirk',
  Hands: '👍 thumbs up|👎 thumbs down|👏 clap|🙌 raised hands|🙏 thanks pray|🤝 handshake|💪 strong|✌️ victory|🤞 fingers crossed|👇 point down|👆 point up|👉 point right|👈 point left|👋 wave|🫶 heart hands|✍️ writing|👀 eyes|🧑‍💻 developer',
  Work: '💼 briefcase|📈 chart up|📉 chart down|📊 bar chart|📌 pin|📍 location|🎯 target|💡 idea bulb|🚀 rocket|🧠 brain|📝 memo|📣 megaphone|📢 loudspeaker|🔔 bell|📅 calendar|💻 laptop|🛠️ tools|⚙️ gear|🔍 search|🔗 link|📚 books|🎓 graduation|💰 money|🏆 trophy|🌱 growth plant|⏰ alarm|🤖 robot|📧 email',
  Symbols: '✅ check|❌ cross|✔️ tick|➡️ arrow right|⬇️ arrow down|⬆️ arrow up|➕ plus|⭐ star|🌟 glowing star|✨ sparkles|🔥 fire|⚡ lightning|❤️ heart|💙 blue heart|💯 hundred|🎉 party popper|🎊 confetti|⚠️ warning|❓ question|❗ exclamation|▶️ play|🔴 red circle|🟢 green circle|🔵 blue circle|♻️ recycle|🔒 lock|🆕 new|💬 speech',
};

export interface EmojiItem { e: string; n: string }

export function emojiList(group: string): EmojiItem[] {
  return EMOJI[group].split('|').map((s) => {
    const i = s.indexOf(' ');
    return { e: s.slice(0, i), n: s.slice(i + 1) };
  });
}

export const SAMPLE =
  sty('sansBold', 'Most LinkedIn posts are hard to read.') +
  '\n\nA few small changes make yours easier to scan:\n\n' +
  '• Open with one clear line\n• Keep paragraphs to one or two sentences\n• Leave a blank line between ideas\n• Use ' +
  sty('sansItalic', 'italic') + ' and ' + sty('sansBold', 'bold') + ' only for what matters\n\n' +
  'Which of these do you already do?\n\n#writing #linkedin #contentcreation';

export interface Profile { name: string; headline: string; photo: string }
export type { Attachment } from './attachments';

export const DEFAULT_PROFILE: Profile = {
  name: 'Ananya Rao',
  headline: 'Senior Product Manager | Building products people use every day',
  photo: '',
};

export const store = {
  get(k: string): string | null { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

export function fmtNum(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
