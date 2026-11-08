'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Icon from './Icon';
import Lightbox from './Lightbox';
import { useSwipe } from '@/lib/useSwipe';
import { richInto, richNodes } from '@/lib/rich';
import { fmtDuration, type Attachment } from '@/lib/attachments';
import type { Profile } from '@/lib/data';

function initials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return (((p[0] || '?')[0]) + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
}

export function Avatar({ profile }: { profile: Profile }) {
  return profile.photo
    // eslint-disable-next-line @next/next/no-img-element
    ? <img className="pv-avatar" src={profile.photo} alt="" width={48} height={48} />
    : <span className="pv-avatar pv-initials" aria-hidden="true">{initials(profile.name)}</span>;
}

/* How LinkedIn lays out several images: 1 full width, 2 side by side, 3 one large + two, 4+ a 2x2 grid with "+N". */
function ImageGrid({ imgs, onOpen }: { imgs: Attachment[]; onOpen: (i: number) => void }) {
  if (imgs.length === 1) {
    return (
      <button type="button" className="pv-single" aria-label={'Open ' + imgs[0].name} onClick={() => onOpen(0)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pv-media" src={imgs[0].url} alt={imgs[0].name} />
      </button>
    );
  }
  const shown = imgs.slice(0, 4);
  const extra = imgs.length - 4;
  return (
    <div className={'pv-grid n' + shown.length}>
      {shown.map((a, i) => (
        <button type="button" className="pv-tile" key={a.id} aria-label={'Open image ' + (i + 1) + ' of ' + imgs.length} onClick={() => onOpen(i)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.url} alt={a.name} />
          {extra > 0 && i === 3 && <span className="pv-plus" aria-label={extra + ' more images'}>+{extra}</span>}
        </button>
      ))}
    </div>
  );
}

function VideoBox({ a }: { a: Attachment }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="pv-video">
      {ok && <video src={a.url} preload="metadata" muted playsInline onError={() => setOk(false)} />}
      <span className="play"><Icon name="play" /></span>
      {a.duration !== undefined && <span className="dur">{fmtDuration(a.duration)}</span>}
    </div>
  );
}

/* A document post is a carousel: one page at a time on a grey stage, arrows, swipe, arrow keys,
   and a bar with the title and "N of M". Pages beyond the first render in the background. */
function DocBox({ a }: { a: Attachment }) {
  const [page, setPage] = useState(0);
  const title = a.name.replace(/\.[^.]+$/, '');
  const total = Math.max(a.pages ?? 1, 1);
  const cur = Math.min(page, total - 1);
  const imgs = a.pageImgs ?? (a.thumb ? [a.thumb] : []);
  const img = imgs[cur];
  const go = (d: number) => setPage((p) => Math.min(Math.max(p + d, 0), total - 1));
  const swipe = useSwipe(() => go(1), () => go(-1));
  return (
    <div
      className="pv-docview"
      role="group"
      aria-roledescription="carousel"
      aria-label={'Document ' + title + ', page ' + (cur + 1) + ' of ' + total}
      tabIndex={total > 1 ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      }}
      {...swipe}
    >
      <div className="pv-page">
        {img
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={img} alt={'Page ' + (cur + 1) + ' of ' + a.name} draggable={false} />
          : a.thumb
            ? <div className="pv-page-ph" role="status"><span className="spin" aria-hidden="true" /><span>Loading page {cur + 1}…</span></div>
            : <div className="pv-page-ph"><Icon name="doc" /><b>{a.ext || 'DOC'}</b><span>A page preview is not available for this file type</span></div>}
        {cur > 0 && <button type="button" className="pv-nav prev" aria-label="Previous page" onClick={() => go(-1)}><Icon name="chev" /></button>}
        {cur < total - 1 && <button type="button" className="pv-nav next" aria-label="Next page" onClick={() => go(1)}><Icon name="chev" /></button>}
      </div>
      <div className="pv-docbar">
        <span className="t">{title}</span>
        <span className="n" aria-live="polite">{a.pages ? (cur + 1) + ' of ' + total : a.ext}</span>
      </div>
    </div>
  );
}

function Media({ atts, onOpenImage }: { atts: Attachment[]; onOpenImage: (i: number) => void }) {
  if (!atts.length) return null;
  if (atts[0].kind === 'image') return <ImageGrid imgs={atts.filter((a) => a.kind === 'image')} onOpen={onOpenImage} />;
  if (atts[0].kind === 'video') return <VideoBox a={atts[0]} />;
  return <DocBox key={atts[0].id} a={atts[0]} />;
}

interface Props {
  device: 'mobile' | 'desktop';
  text: string;
  atts: Attachment[];
  profile: Profile;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onSample: () => void;
  /** Bumped on window resize so the fold is measured again. */
  tick: number;
}

const THREE_LINES = 20 * 3 + 1;

/** Don't cut a surrogate pair in half. */
function safeCut(text: string, n: number) {
  if (n > 0 && n < text.length) {
    const c = text.charCodeAt(n - 1);
    if (c >= 0xD800 && c <= 0xDBFF) return n - 1;
  }
  return n;
}

/* The first web address in the post, the way LinkedIn picks the one it makes a preview card for. */
function firstLink(text: string): { host: string; known: boolean } | null {
  const m = text.match(/(?:https?:\/\/|www\.)[^\s]+/i);
  if (!m) return null;
  const raw = m[0].replace(/[.,;:!?)\]}'"]+$/, '');
  try {
    const host = new URL(/^https?:/i.test(raw) ? raw : 'https://' + raw).hostname.replace(/^www\./, '');
    return host.includes('.') ? { host, known: host === 'lekhkit.com' } : null;
  } catch {
    return null;
  }
}

/* LinkedIn shows a card (picture, title, domain) under a post that holds a link and no other media.
   LekhKit cannot fetch the real page, so it shows the domain; our own address shows its real title and picture. */
function LinkCard({ host, known }: { host: string; known: boolean }) {
  return (
    <div className="pv-link" role="img" aria-label={'Link preview for ' + host}>
      <div className="pv-link-img">
        {known
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src="/opengraph-image" alt="" />
          : <span className="pv-link-ph" aria-hidden="true"><Icon name="globe" /></span>}
      </div>
      <div className="pv-link-txt">
        <b>{known ? 'LekhKit — LinkedIn Post Formatter' : host}</b>
        <span>{host}</span>
      </div>
    </div>
  );
}

export default function PostCard({ device, text, atts, profile, expanded, onExpand, onCollapse, onSample, tick }: Props) {
  const empty = !text.trim() && !atts.length;
  const link = !atts.length ? firstLink(text) : null;
  const measure = useRef<HTMLParagraphElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  /** Where "…more" would cut the text, or null when the whole post fits in three lines. */
  const [cut, setCut] = useState<number | null>(null);

  /* Measured whether or not the post is expanded, so we always know if a fold exists. Approximate on purpose. */
  useLayoutEffect(() => {
    const el = measure.current;
    if (empty || !el) { setCut(null); return; }
    el.replaceChildren();
    richInto(el, text);
    if (el.scrollHeight <= THREE_LINES) { setCut(null); return; }
    const draw = (n: number) => {
      el.replaceChildren();
      richInto(el, text.slice(0, safeCut(text, n)).replace(/\s+$/, ''));
      const more = document.createElement('span');
      more.className = 'pv-more';
      more.textContent = '…more';
      el.append(more);
    };
    let lo = 0, hi = text.length;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      draw(mid);
      if (el.scrollHeight <= THREE_LINES) lo = mid; else hi = mid - 1;
    }
    setCut(safeCut(text, lo));
  }, [text, empty, device, tick]);

  const folded = cut !== null && !expanded;
  const shown = folded && cut !== null ? text.slice(0, cut).replace(/\s+$/, '') : text;

  return (
    <article className={'pv-card pv-' + device}>
      <div className="pv-top">
        <Avatar profile={profile} />
        <div className="pv-who">
          <p className="pv-name">{profile.name || 'Your name'}</p>
          <p className="pv-sub">{profile.headline || 'Your headline'}</p>
          <p className="pv-time">2h · <Icon name="globe" /></p>
        </div>
        <div className="pv-icons"><span className="pv-iconbtn" aria-hidden="true"><Icon name="more" /></span></div>
      </div>

      <div className="pv-body">
        <p className={'pv-text' + (empty ? ' empty' : '')}>
          {empty ? 'Your post will appear here as you write.' : (
            <>
              {richNodes(shown)}
              {folded && <button type="button" className="pv-more" onClick={onExpand}>…more</button>}
              {cut !== null && expanded && <>{' '}<button type="button" className="pv-more" onClick={onCollapse}>Show less</button></>}
            </>
          )}
        </p>
        {empty && <button type="button" className="pv-sample" onClick={onSample}>Use a sample post</button>}
        <p ref={measure} className="pv-text pv-measure" aria-hidden="true" />
      </div>

      <Media atts={atts} onOpenImage={setLightbox} />
      {link && <LinkCard host={link.host} known={link.known} />}
      <Lightbox images={atts.filter((x) => x.kind === 'image')} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />

      <div className="pv-counts" aria-hidden="true">
        <span className="pv-react">
          <span className="pv-dots">
            <span className="pv-dot" style={{ background: '#378fe9' }}><Icon name="like" /></span>
            <span className="pv-dot" style={{ background: '#df704d' }}><Icon name="heart" /></span>
          </span>
          24
        </span>
        <span>6 comments · 2 reposts</span>
      </div>
      <div className="pv-actions" aria-hidden="true">
        {([['like', 'Like'], ['comment', 'Comment'], ['repost', 'Repost'], ['send', 'Send']] as const).map(([i, l]) => (
          <span className="pv-act" key={l}><Icon name={i} />{l}</span>
        ))}
      </div>
    </article>
  );
}
