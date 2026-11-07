import Script from 'next/script';

/*
  Google Tag Manager. The container ID lives in the environment, never in the code:
    NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX   (.env.local for development, Project Settings > Environment Variables on Vercel)
  If it is missing or not shaped like a GTM ID, nothing is loaded at all.
  LekhKit never pushes the text a visitor writes into the dataLayer.
*/
const raw = process.env.NEXT_PUBLIC_GTM_ID?.trim();
const GTM_ID = raw && /^GTM-[A-Z0-9]{4,}$/.test(raw) ? raw : null;

/** Goes at the end of <body>. Uses Google's standard install snippet (it sends the gtm.start event that tags wait for). */
export function GoogleTagManager() {
  if (!GTM_ID) return null;
  const snippet =
    "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});" +
    "var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;" +
    "j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})" +
    "(window,document,'script','dataLayer'," + JSON.stringify(GTM_ID) + ");";
  return <Script id="gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: snippet }} />;
}

/** Goes right after the opening <body> tag, for visitors with JavaScript off. */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={'https://www.googletagmanager.com/ns.html?id=' + GTM_ID}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
