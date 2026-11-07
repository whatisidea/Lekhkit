import { ImageResponse } from 'next/og';

/* The card people see when a LekhKit link is shared (LinkedIn, X, WhatsApp, Slack...). */
export const alt = 'LekhKit: free LinkedIn post formatter';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 28,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0b63ce',
              fontSize: 78,
              fontWeight: 800,
            }}
          >
            L
          </div>
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
