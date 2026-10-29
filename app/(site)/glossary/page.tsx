import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AuthorLine } from '@/components/trust/author-line';
import { LastUpdated } from '@/components/trust/last-updated';
import { ReportError } from '@/components/trust/report-error';
import { glossary, glossarySlug } from '@/data/glossary';

export const metadata: Metadata = {
  title: 'Medicare Glossary',
  description:
    'Plain-language definitions for Medicare, ACA, IRMAA, Medicare Savings Program, and enrollment terms used across MedicareClear calculators.',
  alternates: { canonical: '/glossary/' },
  openGraph: {
    title: 'Medicare Glossary',
    description:
      'Plain-language definitions for Medicare, ACA, IRMAA, Medicare Savings Program, and enrollment terms.',
    url: '/glossary/',
    images: [
      {
        url: '/og/glossary.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear glossary',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/glossary.png'],
  },
};

const sortedGlossary = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
const groups = sortedGlossary.reduce<Record<string, typeof sortedGlossary>>((result, entry) => {
  const letter = entry.term[0].toUpperCase();
  result[letter] = [...(result[letter] ?? []), entry];
  return result;
}, {});
const letters = Object.keys(groups).sort();

export default function GlossaryPage() {
  return (
    <>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Glossary', href: '/glossary/' },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Reference</p>
          <h1 className="page-title">Medicare glossary</h1>
          <p className="page-lede">
            Plain-language definitions for the Medicare and ACA terms used across the calculators.
            Each entry explains the idea without assuming you already know the jargon.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <p className="glossary-count">
            {glossary.length} terms. Choose a letter or scan the list.
          </p>
          <nav className="glossary-nav" aria-label="Glossary letters">
            {letters.map((letter) => (
              <a key={letter} href={`#letter-${letter}`}>
                {letter}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="wrap glossary-groups">
          {letters.map((letter) => (
            <section
              className="glossary-group"
              id={`letter-${letter}`}
              key={letter}
              aria-labelledby={`letter-${letter}-title`}
            >
              <h2 id={`letter-${letter}-title`}>{letter}</h2>
              <dl className="glossary-list">
                {groups[letter].map((entry) => (
                  <div className="glossary-entry" key={entry.term}>
                    <dt>
                      <Link href={`/glossary/${glossarySlug(entry.term)}`}>{entry.term}</Link>
                    </dt>
                    <dd>{entry.definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>How to use this glossary</h2>
          <p>
            Every entry goes beyond a one-line definition: it explains the rule the term controls,
            gives the current figure with its official source and the date it was checked, walks a
            worked number with real figures, and links the calculators where the term does its work.
          </p>
          <p>
            A definition explains a rule in general terms. It does not replace the official source,
            your plan documents, or a decision about your own situation.
          </p>
          <p>
            <Link href="/calculators/">Open the calculator hub</Link> to see the tools that use these
            terms.
          </p>
          <ReportError pageTitle="Medicare glossary" />
        </div>
      </section>
    </>
  );
}
