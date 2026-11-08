import { ImageResponse } from 'next/og';

/* The card people see when a LekhKit link is shared (LinkedIn, X, WhatsApp, Slack...). */
export const alt = 'LekhKit: free LinkedIn post formatter';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const MARK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="8" y1="0" x2="56" y2="64" gradientUnits="userSpaceOnUse"><stop stop-color="#2B86E8"/><stop offset="1" stop-color="#0A57B8"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><path d="M16.5 13.5H28.5V38.5H48V50.5H16.5Z" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M37 18h9M41.5 18v12.5M37 30.5h9" stroke="#FFB21E" stroke-width="3.4" stroke-linecap="round" fill="none"/></svg>',
  );

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 90px',
          background: 'linear-gradient(135deg, #0b63ce 0%, #0a57b8 60%, #0d6f7f 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK} width={120} height={120} alt="" />
          <div style={{ display: 'flex', marginLeft: 30, fontSize: 96, fontWeight: 800, letterSpacing: -3 }}>
            <span>Lekh</span>
            <span style={{ color: '#bfe0ff' }}>Kit</span>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 44, fontSize: 52, fontWeight: 700, lineHeight: 1.15 }}>
          Format LinkedIn posts that stand out
        </div>
        <div style={{ display: 'flex', marginTop: 26, fontSize: 34, color: '#d7ebff' }}>
          Bold, italic, lists and emoji. Live preview. Free and private.
        </div>
        <div style={{ display: 'flex', marginTop: 46, width: 150, height: 10, borderRadius: 5, background: '#ffb21e' }} />
      </div>
    ),
    { ...size },
  );
}
