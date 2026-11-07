'use client';

import { useEffect, useRef } from 'react';
import Icon from './Icon';
import PostCard, { Avatar } from './PostCard';
import { DEFAULT_PROFILE, store, type Attachment, type Profile } from '@/lib/data';
import { photoToDataUrl } from '@/lib/attachments';

type Device = 'mobile' | 'desktop';
type Theme = 'light' | 'dark';

/** Keep a <dialog> in step with an `open` flag; report native closes (Esc) back up. */
function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
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
    const backdrop = (e: MouseEvent) => { if (e.target === d) d.close(); };
    d.addEventListener('close', close);
    d.addEventListener('click', backdrop);
    return () => { d.removeEventListener('close', close); d.removeEventListener('click', backdrop); };
  }, [onClose]);
  return ref;
}

function Skeleton() {
  return (
    <div className="f-card f-skel" aria-hidden="true">
      <div className="row"><span className="dot" /><div><div className="bar" style={{ width: '38%' }} /><div className="bar" style={{ width: '58%' }} /></div></div>
      <div className="bar" style={{ width: '94%' }} /><div className="bar" style={{ width: '80%' }} /><div className="bar" style={{ width: '62%' }} />
      <div className="media" />
    </div>
  );
}

function Composer({ profile }: { profile: Profile }) {
  return (
    <div className="f-card" aria-hidden="true">
      <div className="f-comp"><Avatar profile={profile} /><span className="pill">Start a post</span></div>
      <div className="f-comp-act"><span className="bar" /><span className="bar" /><span className="bar" /></div>
    </div>
  );
}

interface FeedProps {
  open: boolean;
  onClose: () => void;
  device: Device;
  setDevice: (d: Device) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  text: string;
  atts: Attachment[];
  profile: Profile;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onSample: () => void;
  tick: number;
}

export function FeedDialog(p: FeedProps) {
  const ref = useDialog(p.open, p.onClose);
  const card = (device: Device) => (
    <PostCard device={device} text={p.text} atts={p.atts} profile={p.profile} expanded={p.expanded} onExpand={p.onExpand} onCollapse={p.onCollapse} onSample={p.onSample} tick={p.tick} />
  );
  return (
    <dialog id="feedDlg" ref={ref} aria-labelledby="feedTtl">
      <div className="dlg-head">
        <h2 id="feedTtl">Feed preview</h2>
        <div className="seg" role="group" aria-label="Feed size">
          <button type="button" aria-pressed={p.device === 'mobile'} onClick={() => p.setDevice('mobile')}><Icon name="phone" />Mobile</button>
          <button type="button" aria-pressed={p.device === 'desktop'} onClick={() => p.setDevice('desktop')}><Icon name="monitor" />Desktop</button>
        </div>
        <div className="seg" role="group" aria-label="Feed theme">
          <button type="button" aria-pressed={p.theme === 'light'} onClick={() => p.setTheme('light')}><Icon name="sun" />Light</button>
          <button type="button" aria-pressed={p.theme === 'dark'} onClick={() => p.setTheme('dark')}><Icon name="moon" />Dark</button>
        </div>
        <button type="button" className="sq" data-tip="Close" aria-label="Close feed preview" onClick={() => ref.current?.close()}><Icon name="x" /></button>
      </div>
      <div className="pv feedbody" data-pv={p.theme}>
        {p.open && p.device === 'desktop' && (
          <>
            <div className="f-nav" aria-hidden="true">
              <span className="mk" /><span className="search" /><span className="sp" />
              <span className="ni"><i /><i /><i /><i /><i /></span>
            </div>
            <div className="feed">
              <div className="f-grid">
                <aside className="f-left" aria-hidden="true">
                  <div className="f-card">
                    <div className="f-cover" />
                    <div className="f-me"><Avatar profile={p.profile} /><b>{p.profile.name || 'Your name'}</b><span>{p.profile.headline || ''}</span></div>
                  </div>
                  <div className="f-card f-pad"><div className="bar" style={{ width: '60%' }} /><div className="bar" style={{ width: '80%' }} /><div className="bar" style={{ width: '45%' }} /></div>
                </aside>
                <div className="f-main">
                  <Composer profile={p.profile} />
                  <div className="f-sort" aria-hidden="true"><span className="bar" /></div>
                  {card('desktop')}
                  <Skeleton />
                </div>
                <aside className="f-right" aria-hidden="true">
                  <div className="f-card f-pad">
                    <div className="bar" style={{ width: '50%', marginBottom: 14 }} />
                    {[70, 90, 60, 85, 55].map((w) => (
                      <div key={w} style={{ marginBottom: 14 }}><div className="bar" style={{ width: w + '%' }} /><div className="bar" style={{ width: (w - 30) + '%', opacity: 0.7 }} /></div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </>
        )}
        {p.open && p.device === 'mobile' && (
          <div className="phone">
            <div className="f-mbar" aria-hidden="true"><span className="dot" /><span className="search" /><span className="dot" /></div>
            <div className="f-mid">
              <Composer profile={p.profile} />
              {card('mobile')}
              <Skeleton />
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}

interface ProfProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
}

export function ProfileDialog({ open, onClose, profile, setProfile }: ProfProps) {
  const ref = useDialog(open, onClose);
  const file = useRef<HTMLInputElement>(null);

  /* Remembered in this browser's localStorage only (no cookies, no server), including a small copy of the photo. */
  const update = (next: Profile) => {
    setProfile(next);
    store.set('ltf.profile', JSON.stringify(next));
  };

  return (
    <dialog id="profDlg" ref={ref} aria-labelledby="profTtl">
      <div className="dlg-head">
        <h2 id="profTtl">Preview profile</h2>
        <button type="button" className="sq" data-tip="Close" aria-label="Close" onClick={() => ref.current?.close()}><Icon name="x" /></button>
      </div>
      <div className="dlg-body">
        <p className="mnote" style={{ padding: 0 }}>Only used for the preview. Saved in this browser on your device, so it is still here next time. Nothing is sent anywhere.</p>
        <div className="who">
          <div><Avatar profile={profile} /></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-line" onClick={() => file.current?.click()}>Choose photo</button>
            {profile.photo && <button type="button" className="btn btn-ghost" onClick={() => update({ ...profile, photo: '' })}>Remove</button>}
            <button type="button" className="btn btn-ghost" onClick={() => update(DEFAULT_PROFILE)}>Reset</button>
          </div>
        </div>
        <div><label htmlFor="pfName">Name</label><input className="field" id="pfName" type="text" maxLength={60} autoComplete="off" value={profile.name} onChange={(e) => update({ ...profile, name: e.target.value })} /></div>
        <div><label htmlFor="pfHead">Headline</label><input className="field" id="pfHead" type="text" maxLength={120} autoComplete="off" value={profile.headline} onChange={(e) => update({ ...profile, headline: e.target.value })} /></div>
      </div>
      <div className="dlg-foot"><button type="button" className="btn btn-primary" onClick={() => ref.current?.close()}>Done</button></div>
      <input ref={file} type="file" accept="image/*" hidden onChange={async (e) => {
        const f = e.target.files?.[0];
        e.target.value = '';
        if (!f) return;
        try { update({ ...profile, photo: await photoToDataUrl(f) }); } catch { /* not an image the browser can read */ }
      }} />
    </dialog>
  );
}
