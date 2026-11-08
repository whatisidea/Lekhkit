import Link from 'next/link';
import SiteThemeToggle from './SiteThemeToggle';
import MiniConverter from './MiniConverter';
import { PAGES, PAGE_BY_SLUG, TOOL_PAGES, GUIDE_PAGES, INFO_PAGES, type SeoPage } from '@/lib/pages';
import { INTL_PAGES, LANGS, UI, intlPage, intlPagesFor } from '@/lib/i18n';
import { SITE_NAME, SITE_URL } from '@/lib/site';

/** Address of a page: English pages live at /slug, translated pages at /lang/slug. */
export const pagePath = (p: SeoPage) => (p.lang ? `/${p.lang}/${p.slug}` : `/${p.slug}`);

/** The same page in every language it exists in (used for hreflang). Keys are language codes plus x-default. */
export function languageAlternates(page: SeoPage): Record<string, string> | undefined {
  if (!page.group) return undefined;
  const all = [...PAGES, ...INTL_PAGES].filter((p) => p.group === page.group);
  if (all.length < 2) return undefined;
  const out: Record<string, string> = {};
  for (const p of all) out[p.lang || 'en'] = SITE_URL + pagePath(p);
  const en = all.find((p) => !p.lang);
  if (en) out['x-default'] = SITE_URL + pagePath(en);
  return out;
}

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
  const url = SITE_URL + pagePath(page);
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
      inLanguage: page.lang || 'en',
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

export function SiteFooter({ lang }: { lang?: string }) {
  const ui = lang ? UI[lang] : undefined;
  const col = (title: string, items: SeoPage[]) => (
    <div>
      <h2 className="cp-foot-h">{title}</h2>
      <ul>{items.map((p) => <li key={pagePath(p)}><Link href={pagePath(p)}>{p.label}</Link></li>)}</ul>
    </div>
  );
  const langCol = (
    <div>
      <h2 className="cp-foot-h">Languages</h2>
      <ul>
        <li><Link href="/">English</Link></li>
        {LANGS.map((l) => {
          const first = intlPagesFor(l.code)[0];
          return <li key={l.code}><Link href={pagePath(first)} hrefLang={l.code} lang={l.code}>{l.name}</Link></li>;
        })}
      </ul>
    </div>
  );
  return (
    <footer className="site-foot cp-foot">
      <div className="wrap">
        <div className="cp-foot-grid">
          {lang ? (
            <>
              {col(ui!.tools, intlPagesFor(lang))}
              {langCol}
            </>
          ) : (
            <>
              {col('Tools', TOOL_PAGES)}
              {col('Guides', GUIDE_PAGES)}
              {col('LekhKit', INFO_PAGES)}
              {langCol}
            </>
          )}
        </div>
        <p><strong translate="no">LekhKit</strong> · {ui ? ui.footerLine : 'Free LinkedIn post formatter. Your text stays in your browser and is never uploaded. Not affiliated with LinkedIn.'}</p>
      </div>
    </footer>
  );
}

export default function ContentPage({ page }: { page: SeoPage }) {
  const lang = page.lang;
  const ui = lang ? UI[lang] : undefined;
  const related = (page.related || [])
    .map((s) => (lang ? intlPage(lang, s) : PAGE_BY_SLUG[s]))
    .filter((p): p is SeoPage => Boolean(p));
  const englishTwin = lang && page.group ? PAGES.find((p) => p.group === page.group) : undefined;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(page)) }} />
      <a className="skip" href="#main">{ui ? ui.skip : 'Skip to the content'}</a>
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
          {page.mode ? <MiniConverter mode={page.mode} ui={ui} /> : null}
          {page.kind !== 'info' ? (
            <p className="cp-cta">
              {ui ? ui.ctaBefore : 'Writing a full post?'} <Link href="/">{ui ? ui.ctaLink : 'Open the LekhKit editor'}</Link>{' '}
              {ui ? ui.ctaAfter : 'for bold, italic, lists, emoji and a live desktop and mobile preview.'}
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
              <h2>{ui ? ui.faq : 'Frequently asked questions'}</h2>
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

          {related.length || englishTwin ? (
            <section>
              <h2>{ui ? ui.related : 'Related'}</h2>
              <ul className="cp-related">
                {related.map((r) => <li key={pagePath(r)}><Link href={pagePath(r)}>{r.label}</Link></li>)}
                {englishTwin ? <li><Link href={pagePath(englishTwin)} hrefLang="en" lang="en">{ui!.english}</Link></li> : null}
              </ul>
            </section>
          ) : null}
        </article>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
