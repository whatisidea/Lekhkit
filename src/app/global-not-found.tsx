import './globals.css';

/* Shown for any address that does not exist. It has its own <html> because the site uses separate root layouts per language. */
export const metadata = { title: 'Page not found | LekhKit', robots: { index: false, follow: false } };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="wrap cp">
          <article className="cp-article">
            <h1>Page not found</h1>
            <p className="cp-lead">That address does not exist. Go back to the <a href="/">LekhKit post formatter</a>.</p>
          </article>
        </main>
      </body>
    </html>
  );
}
