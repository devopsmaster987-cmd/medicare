import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AuthorLine } from '@/components/trust/author-line';
import { LastUpdated } from '@/components/trust/last-updated';
import { ReportError } from '@/components/trust/report-error';
import { guides, resolveGuide } from '@/content/guides/meta';
import { figureYears } from '@/data/verified';

export const metadata: Metadata = {
  title: 'Medicare and ACA guides',
  description:
    'Plain-language guides to the rules behind the calculators: IRMAA appeals, Roth conversions, HSA timing, Part A backdating, the 400% poverty line, and the family glitch fix.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'Medicare and ACA guides',
    description:
      'Plain-language guides to IRMAA, HSA timing, Part A backdating, Marketplace income, and the family glitch fix.',
    url: '/guides',
    images: [
      {
        url: '/og/guides.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/guides.png'],
  },
};

export default function GuidesPage() {
  const year = figureYears.current;

  return (
    <>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Guides', href: '/guides' },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Guides · {year}</p>
          <h1 className="page-title">Medicare and ACA guides</h1>
          <p className="page-lede">
            The calculators give you the number. These guides explain the rule behind it, the
            deadline that matters, and the edge cases that change the answer.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <ol className="calculator-index">
            {guides.map((guide, index) => (
              <li key={guide.slug}>
                <Link className="calculator-entry" href={`/guides/${guide.slug}`}>
                  <span className="calculator-entry-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="calculator-entry-body">
                    <span className="calculator-entry-title">
                      {resolveGuide(guide.h1, year)}
                    </span>
                    <span className="calculator-entry-detail">{guide.summary}</span>
                  </span>
                  <span className="calculator-entry-action" aria-hidden="true">
                    Read
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <h2>How these guides stay current</h2>
          <p className="section-intro">
            Every guide uses the same dated data layer as the calculators. When a premium,
            threshold, or poverty guideline changes, the guide changes with it. Each page lists its
            official sources and the date the figures were last checked.
          </p>
          <ReportError pageTitle="Medicare and ACA guides" />
        </div>
      </section>
    </>
  );
}
