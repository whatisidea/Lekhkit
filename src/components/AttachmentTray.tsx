'use client';

import Icon from './Icon';
import { fmtDuration, fmtSize, type Attachment } from '@/lib/attachments';

interface Props {
  atts: Attachment[];
  busy: boolean;
  canAddImages: boolean;
  onRemove: (id: string) => void;
  onAddImages: () => void;
  onClearAll: () => void;
}

function RemoveBtn({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button type="button" className="att-x" aria-label={'Remove ' + name} data-tip={'Remove ' + name} onClick={onClick}>
      <Icon name="x" />
    </button>
  );
}

function Card({ a, onRemove }: { a: Attachment; onRemove: () => void }) {
  if (a.kind === 'image') {
    return (
      <div className="att att-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.url} alt={a.name} width={64} height={64} />
        <RemoveBtn name={a.name} onClick={onRemove} />
      </div>
    );
  }
  if (a.kind === 'video') {
    return (
      <div className="att att-img att-vid">
        <video src={a.url} muted preload="metadata" playsInline aria-label={a.name} />
        <span className="att-play" aria-hidden="true"><Icon name="play" /></span>
        {a.duration !== undefined && <span className="att-dur">{fmtDuration(a.duration)}</span>}
        <RemoveBtn name={a.name} onClick={onRemove} />
      </div>
    );
  }
  const meta = [a.ext || 'File', fmtSize(a.size), a.pages ? a.pages + (a.pages === 1 ? ' page' : ' pages') : ''].filter(Boolean).join(' · ');
  return (
    <div className="att att-doc">
      <span className={'att-ext' + (a.ext === 'PDF' ? ' pdf' : '')} aria-hidden="true">{a.ext || 'DOC'}</span>
      <span className="att-meta"><b title={a.name}>{a.name}</b><span>{meta}</span></span>
      <RemoveBtn name={a.name} onClick={onRemove} />
    </div>
  );
}

export default function AttachmentTray({ atts, busy, canAddImages, onRemove, onAddImages, onClearAll }: Props) {
  if (!atts.length && !busy) return null;
  const kind = atts[0]?.kind;
  const label = kind === 'image' ? atts.length + (atts.length === 1 ? ' image' : ' images') : kind === 'video' ? '1 video' : kind === 'doc' ? '1 document' : 'Reading file…';
  const where = kind === 'image' ? 'images' : kind === 'video' ? 'video' : 'document';
  return (
    <div className="tray" role="group" aria-label="Attachments">
      <div className="tray-row">
        {atts.map((a) => <Card key={a.id} a={a} onRemove={() => onRemove(a.id)} />)}
        {busy && <div className="att att-busy" role="status"><span className="spin" aria-hidden="true" />Reading file…</div>}
        {canAddImages && !busy && (
          <button type="button" className="att att-add" aria-label="Add more images" data-tip="Add more images" onClick={onAddImages}><Icon name="plus" /></button>
        )}
      </div>
      <p className="tray-note">
        <b>{label}</b>{kind ? ' · Preview only. Add the ' + where + ' again in LinkedIn when you post.' : ''}
        {atts.length > 1 && <button type="button" className="linkbtn" onClick={onClearAll}>Remove all</button>}
      </p>
    </div>
  );
}
