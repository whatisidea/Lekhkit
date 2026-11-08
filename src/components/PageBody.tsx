import Link from 'next/link';
import type { Faq, Section } from '@/lib/pages';

/* Building blocks for the text under the editor. Server components, plain HTML: everything here is crawlable text. */

export function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.h2} className="cp-sec">
          <h2>{s.h2}</h2>
          {s.paras?.map((p, i) => <p key={i} className="cp-prose">{p}</p>)}
          {s.list && s.ordered ? (
            <ol className="cp-steps">
              {s.list.map((l, i) => (
                <li key={l}><span className="cp-num" aria-hidden="true">{i + 1}</span><span>{l}</span></li>
              ))}
            </ol>
          ) : null}
          {s.list && !s.ordered ? (
            <ul className="cp-checks">
              {s.list.map((l) => <li key={l}>{l}</li>)}
            </ul>
          ) : null}
        </section>
      ))}
    </>
  );
}

export function FaqList({ title, items }: { title: string; items: Faq[] }) {
  return (
    <section className="cp-sec">
      <h2>{title}</h2>
      <div className="cp-faqs">
        {items.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export interface LinkItem { href: string; label: string; lang?: string }

export function LinkGrid({ title, items }: { title: string; items: LinkItem[] }) {
  return (
    <section className="cp-sec">
      <h2>{title}</h2>
      <ul className="cp-links">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} hrefLang={i.lang} lang={i.lang}>
              <span>{i.label}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" /></svg>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
