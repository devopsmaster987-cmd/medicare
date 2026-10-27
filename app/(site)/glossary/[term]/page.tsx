import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { LastUpdated } from '@/components/trust/last-updated';
import { ReportError } from '@/components/trust/report-error';
import { glossary, glossaryBySlug, glossarySlug } from '@/data/glossary';
import { site } from '@/data/site';

export const dynamicParams = false;

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
    title: `${entry.term} Definition`,
    description: `${entry.definition} Read the plain-language definition and see the MedicareClear calculators that use this term.`,
    alternates: { canonical: `/glossary/${term}` },
    openGraph: {
      title: `${entry.term} Definition`,
      description: entry.definition,
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

export default async function GlossaryTermPage({ params }: TermPageProps) {
  const { term } = await params;
  const entry = glossaryBySlug(term);
  if (!entry) notFound();

  const index = glossary.findIndex((item) => item.term === entry.term);
  const previous = glossary[(index - 1 + glossary.length) % glossary.length];
  const next = glossary[(index + 1) % glossary.length];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: entry.term,
          description: entry.definition,
          url: `${site.siteUrl}/glossary/${term}`,
          inDefinedTermSet: {
            '@type': 'DefinedTermSet',
            name: `${site.siteName} Medicare glossary`,
            url: `${site.siteUrl}/glossary`,
          },
        }}
      />

      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Glossary', href: '/glossary' },
            { name: entry.term, href: `/glossary/${term}` },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Glossary</p>
          <h1 className="page-title">{entry.term}</h1>
          <p className="page-lede">{entry.definition}</p>
          <LastUpdated />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Where this term appears</h2>
          <p>
            MedicareClear uses this definition in its calculators and plain-language guides. Start
            with the calculator that matches your question, or browse the full glossary for the other
            terms beside it.
          </p>
          <ul>
            <li>
              <Link href="/calculators">Use the Medicare calculator hub</Link>
            </li>
            <li>
              <Link href="/glossary">Browse all glossary terms</Link>
            </li>
            <li>
              <Link href="/methodology">Read how the figures and formulas are checked</Link>
            </li>
          </ul>

          <h2>Related terms</h2>
          <ul>
            <li>
              <Link href={`/glossary/${glossarySlug(previous.term)}`}>{previous.term}</Link>
            </li>
            <li>
              <Link href={`/glossary/${glossarySlug(next.term)}`}>{next.term}</Link>
            </li>
          </ul>

          <p>
            This definition is general information. It does not replace official program rules, your
            plan documents, or advice about your own situation.
          </p>
          <ReportError pageTitle={`${entry.term} definition`} />
        </div>
      </section>
    </>
  );
}
