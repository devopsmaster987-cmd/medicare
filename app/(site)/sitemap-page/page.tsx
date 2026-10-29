import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { LastUpdated } from '@/components/trust/last-updated';
import { ReportError } from '@/components/trust/report-error';
import { guides, resolveGuide } from '@/content/guides/meta';
import { glossary, glossarySlug } from '@/data/glossary';
import { figureYears } from '@/data/verified';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'A human-readable index of MedicareClear calculators, glossary entries, and site pages.',
  alternates: { canonical: '/sitemap-page/' },
  openGraph: {
    title: 'MedicareClear Sitemap',
    description:
      'A human-readable index of MedicareClear calculators, glossary entries, and site pages.',
    url: '/sitemap-page/',
    images: [
      {
        url: '/og/sitemap-page.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear sitemap',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/sitemap-page.png'],
  },
};

const calculatorLinks = [
  { href: '/calculators/', label: 'Medicare calculator hub' },
  {
    href: '/calculators/employer-coverage-affordability/',
    label: 'Employer coverage affordability',
  },
  {
    href: '/calculators/medicare-savings-program-extra-help/',
    label: 'Medicare Savings Program and Extra Help',
  },
  {
    href: '/calculators/part-b-late-enrollment-penalty/',
    label: 'Part B late enrollment penalty',
  },
  { href: '/calculators/irmaa-cliff-checker/', label: 'IRMAA cliff checker' },
  { href: '/calculators/medicare-vs-aca/', label: 'Medicare vs ACA' },
];

const siteLinks = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
  { href: '/authors/abdul-samad/', label: 'Author: Abdul Samad' },
  { href: '/glossary/', label: 'Medicare glossary' },
  { href: `/what-changed-${figureYears.current}`, label: `What changed for ${figureYears.current}` },
  { href: '/medicare-deadlines/', label: 'Medicare deadlines' },
  { href: '/scenarios/', label: 'Medicare scenarios' },
  { href: '/methodology/', label: 'Methodology' },
  { href: '/verification-log/', label: 'Verification log' },
  { href: '/editorial-policy/', label: 'Editorial policy' },
  { href: '/corrections/', label: 'Corrections and change log' },
];

const legalLinks = [
  { href: '/privacy-policy/', label: 'Privacy policy' },
  { href: '/terms-of-service/', label: 'Terms of service' },
  { href: '/disclaimer/', label: 'Disclaimer' },
  { href: '/cookie-policy/', label: 'Cookie policy' },
  { href: '/cookie-policy/#cookie-settings', label: 'Cookie settings' },
];

const sortedGlossary = [...glossary].sort((a, b) => a.term.localeCompare(b.term));

export default function SitemapPage() {
  return (
    <>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Sitemap', href: '/sitemap-page/' },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Index</p>
          <h1 className="page-title">Sitemap</h1>
          <p className="page-lede">
            Every live section of MedicareClear in one place. The XML sitemap is available for search
            engines, and this page is the human-readable index.
          </p>
          <LastUpdated />
        </div>
      </section>

      <section className="section">
        <div className="wrap sitemap-grid">
          <section aria-labelledby="sitemap-calculators">
            <h2 id="sitemap-calculators">Calculators</h2>
            <ul className="link-list">
              {calculatorLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sitemap-guides">
            <h2 id="sitemap-guides">Guides</h2>
            <ul className="link-list">
              <li>
                <Link href="/guides/">All guides</Link>
              </li>
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link href={`/guides/${guide.slug}`}>
                    {resolveGuide(guide.h1, figureYears.current)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sitemap-site">
            <h2 id="sitemap-site">Site pages</h2>
            <ul className="link-list">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sitemap-legal">
            <h2 id="sitemap-legal">Policies</h2>
            <ul className="link-list">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sitemap-glossary" className="sitemap-glossary">
            <h2 id="sitemap-glossary">Glossary</h2>
            <p>
              {glossary.length} definitions, from Medicare basics to IRMAA and enrollment terms.
            </p>
            <ul className="link-list link-list-compact">
              {sortedGlossary.map((entry) => (
                <li key={entry.term}>
                  <Link href={`/glossary/${glossarySlug(entry.term)}`}>{entry.term}</Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="wrap">
          <ReportError pageTitle="Sitemap" />
        </div>
      </section>
    </>
  );
}
