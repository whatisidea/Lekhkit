import Link from 'next/link';
import SiteThemeToggle from './SiteThemeToggle';
import MiniConverter from './MiniConverter';
import { PAGE_BY_SLUG, TOOL_PAGES, GUIDE_PAGES, INFO_PAGES, type SeoPage } from '@/lib/pages';
import { SITE_NAME, SITE_URL } from '@/lib/site';

function Brand() {
  return (
    <a className="brand" href="/" aria-label="LekhKit, home">
      <svg className="mark" viewBox="0 0 64 64" aria-hidden="true">
        <defs><linearGradient id="lkg" x1="8" y1="0" x2="56" y2="64" gradientUnits="userSpaceOnUse"><stop stopColor="#2B86E8" /><stop offset="1" stopColor="#0A57B8" /></linearGradient></defs>
        <rect width="64" height="64" rx="16" fill="url(#lkg)" />
        <path d="M16.5 13.5H28.5V38.5H48V50.5H16.5Z" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
        <path className="caret" d="M37 18h9M41.5 18v12.5M37 30.5h9" stroke="#FFB21E" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      </svg>
      <span className="wm" translate="no">Lekh<b>Kit</b></span>
    </a>
  );
}

function jsonLd(page: SeoPage) {
  const url = `${SITE_URL}/${page.slug}`;
  const graph: object[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: page.label, item: url },
      ],
    },
    {
      '@type': page.kind === 'guide' ? 'Article' : 'WebPage',
      '@id': url + '#page',
      url,
      name: page.h1,
      description: page.description,
      inLanguage: 'en',
      dateModified: page.updated,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      ...(page.kind === 'guide'
        ? {
            headline: page.h1,
            author: { '@type': 'Organization', name: SITE_NAME },
            publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: SITE_URL + '/icon-512.png' } },
          }
        : {}),
    },
  ];
  if (page.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function SiteFooter() {
  const col = (title: string, items: SeoPage[]) => (
    <div>
      <h2 className="cp-foot-h">{title}</h2>
      <ul>{items.map((p) => <li key={p.slug}><Link href={'/' + p.slug}>{p.label}</Link></li>)}</ul>
    </div>
  );
  return (
    <footer className="site-foot cp-foot">
      <div className="wrap">
        <div className="cp-foot-grid">
          {col('Tools', TOOL_PAGES)}
          {col('Guides', GUIDE_PAGES)}
          {col('LekhKit', INFO_PAGES)}
        </div>
        <p><strong translate="no">LekhKit</strong> · Free LinkedIn post formatter. Your text stays in your browser and is never uploaded. Not affiliated with LinkedIn.</p>
      </div>
    </footer>
  );
}

export default function ContentPage({ page }: { page: SeoPage }) {
  const related = (page.related || []).map((s) => PAGE_BY_SLUG[s]).filter(Boolean);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(page)) }} />
      <a className="skip" href="#main">Skip to the content</a>
      <header className="top">
        <div className="wrap">
          <Brand />
          <SiteThemeToggle />
        </div>
      </header>

      <main id="main" className="wrap cp">
        <nav className="cp-crumbs" aria-label="Breadcrumb">
          <Link href="/">LekhKit</Link> <span aria-hidden="true">/</span> <span aria-current="page">{page.label}</span>
        </nav>
        <article className="cp-article">
          <h1>{page.h1}</h1>
          <p className="cp-lead">{page.intro}</p>
          {page.mode ? <MiniConverter mode={page.mode} /> : null}
          {page.kind !== 'info' ? (
            <p className="cp-cta">
              Writing a full post? <Link href="/">Open the LekhKit editor</Link> for bold, italic, lists, emoji and a live desktop and mobile preview.
            </p>
          ) : null}

          {page.sections.map((s) => (
            <section key={s.h2}>
              <h2>{s.h2}</h2>
              {s.paras?.map((p, i) => <p key={i}>{p}</p>)}
              {s.list ? (s.ordered ? <ol>{s.list.map((l) => <li key={l}>{l}</li>)}</ol> : <ul>{s.list.map((l) => <li key={l}>{l}</li>)}</ul>) : null}
            </section>
          ))}

          {page.faq?.length ? (
            <section>
              <h2>Frequently asked questions</h2>
              <dl className="cp-faq">
                {page.faq.map((f) => (
                  <div key={f.q}>
                    <dt>{f.q}</dt>
                    <dd>{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {related.length ? (
            <section>
              <h2>Related</h2>
              <ul className="cp-related">
                {related.map((r) => <li key={r.slug}><Link href={'/' + r.slug}>{r.label}</Link></li>)}
              </ul>
            </section>
          ) : null}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
