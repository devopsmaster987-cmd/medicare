import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { SourceTable } from '@/components/calc/content';
import { articleSchema } from '@/lib/schema';
import { LastUpdated } from '@/components/trust/last-updated';
import { AuthorLine } from '@/components/trust/author-line';
import { ReportError } from '@/components/trust/report-error';
import { glossary, glossaryBySlug, glossaryRelated, glossarySlug } from '@/data/glossary';
import type { GlossaryTerm } from '@/data/glossary';
import { formatDate } from '@/lib/utils';
import { site } from '@/data/site';

export const dynamicParams = false;

function metaDescription(term: string, definition: string): string {
  const base = `What ${term} means in Medicare and ACA rules. ${definition}`;
  if (base.length <= 155) return base;
  const sentences = definition.split(/(?<=[.!?]) /);
  for (const candidate of sentences) {
    const text = `What ${term} means in Medicare and ACA rules. ${candidate}`;
    if (text.length <= 155) return text;
  }
  let words = definition.split(' ');
  while (
    words.length > 1 &&
    `What ${term} means in Medicare and ACA rules. ${words.join(' ')}`.length > 152
  ) {
    words = words.slice(0, -1);
  }
  return `What ${term} means in Medicare and ACA rules. ${words.join(' ')}...`;
}

type TermPageProps = {
  params: Promise<{ term: string }>;
};

export function generateStaticParams() {
  return glossary.map((entry) => ({ term: glossarySlug(entry.term) }));
}

export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const { term } = await params;
  const entry = glossaryBySlug(term);
  if (!entry) return {};

  return {
    title: `${entry.term} definition`,
    description: metaDescription(entry.term, entry.definition),
    alternates: { canonical: `/glossary/${term}` },
    openGraph: {
      title: `${entry.term} Definition`,
      description: metaDescription(entry.term, entry.definition),
      url: `/glossary/${term}`,
      images: [
        {
          url: `/og/glossary/${term}.png`,
          width: 1200,
          height: 630,
          alt: `${entry.term} definition`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/og/glossary/${term}.png`],
    },
  };
}

function inlineLinks(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <a key={index} href={match[2]} target="_blank" rel="noreferrer">
          {match[1]}
        </a>
      );
    }
    return part;
  });
}

function Paragraphs({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{inlineLinks(paragraph)}</p>
      ))}
    </>
  );
}

export default async function GlossaryTermPage({ params }: TermPageProps) {
  const { term } = await params;
  const entry = glossaryBySlug(term);
  if (!entry) notFound();

  const relatedTerms = glossaryRelated(entry);
  const href = `/glossary/${term}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: entry.term,
          description: entry.definition,
          url: `${site.siteUrl}${href}`,
          inDefinedTermSet: {
            '@type': 'DefinedTermSet',
            name: `${site.siteName} Medicare glossary`,
            url: `${site.siteUrl}/glossary`,
          },
        }}
      />
      <JsonLd
        data={articleSchema({
          headline: `${entry.term} definition`,
          description: entry.definition,
          url: `${site.siteUrl}${href}`,
          datePublished: entry.updatedOn,
          dateModified: entry.updatedOn,
          citation: entry.sources.map((sourceRow) => sourceRow.source),
        })}
      />

      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Glossary', href: '/glossary/' },
            { name: entry.term, href: href },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Glossary</p>
          <h1 className="page-title">{entry.term}</h1>
          <p className="page-lede">{entry.definition}</p>
          <LastUpdated date={entry.updatedOn} />
          <AuthorLine />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2 id="why-it-matters">Why it matters</h2>
          <Paragraphs paragraphs={entry.whyItMatters} />

          <h2>{entry.exactHeading}</h2>
          <Paragraphs paragraphs={entry.exact} />

          <h2>Worked number</h2>
          <p>{entry.worked}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <SourceTable rows={entry.sources} />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Where this term appears in the calculators</h2>
          <ul>
            {entry.calculators.map((link) => (
              <li key={link.href + link.label}>
                <Link href={link.href}>{link.label}</Link> &mdash; {link.note}
              </li>
            ))}
          </ul>

          <h2>Related terms</h2>
          <ul>
            {relatedTerms.map((related) => (
              <li key={related.term}>
                <Link href={`/glossary/${glossarySlug(related.term)}`}>{related.term}</Link>
              </li>
            ))}
          </ul>

          <p>
            This definition is general information. It does not replace official program rules, your
            plan documents, or advice about your own situation.
          </p>
          <p>
            Figures last checked {formatDate(entry.updatedOn)}.{' '}
            <Link href="/methodology/">How figures are verified</Link>
          </p>
          <ReportError pageTitle={`${entry.term} definition`} />
        </div>
      </section>
    </>
  );
}
