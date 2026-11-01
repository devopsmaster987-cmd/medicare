import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { CopyText } from '@/components/trust/copy-text';
import { LastUpdated } from '@/components/trust/last-updated';
import { aca2026 } from '@/data/aca';
import { fplAnnual } from '@/data/fpl';
import { partB2026 } from '@/data/medicare-part-b';
import { partD2026 } from '@/data/medicare-part-d';
import { mspPrograms } from '@/data/msp';
import { site } from '@/data/site';
import { dataVerifiedOn, figureYears } from '@/data/verified';
import { datasetSchema, webPageSchema } from '@/lib/schema';
import { formatDate, formatMoney } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Medicare and ACA data',
  description: `Download source-linked ${figureYears.current} Medicare and ACA figures as JSON, with official source URLs and checked dates for each value.`,
  alternates: { canonical: '/data/' },
  openGraph: {
    type: 'website',
    title: 'Medicare and ACA data',
    description: `Source-linked ${figureYears.current} Medicare and ACA figures as JSON, with official source URLs and checked dates.`,
    url: '/data/',
    images: [
      {
        url: '/og/data.png',
        width: 1200,
        height: 630,
        alt: 'Medicare and ACA data files',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/data.png'],
  },
};

const year = figureYears.current;
const downloadPath = `/data/medicare-figures-${year}.json`;

const sampleRecord = {
  id: 'part-b-standard-premium',
  label: 'Part B standard monthly premium',
  value: partB2026.standardPremium.amount,
  unit: 'USD/month',
  year: partB2026.standardPremium.year,
  source: partB2026.standardPremium.source,
  verifiedOn: partB2026.standardPremium.verifiedOn,
};

const selectedFigures = [
  {
    label: `Part B standard monthly premium (${year})`,
    value: formatMoney(partB2026.standardPremium.amount),
  },
  {
    label: `Part D base beneficiary premium (${year})`,
    value: formatMoney(partD2026.baseBeneficiaryPremium.amount),
  },
  {
    label: `IRMAA first surcharge threshold, single (${year})`,
    value: formatMoney(partB2026.irmaa.single[0].max ?? 0),
  },
  {
    label: `QMB monthly income limit, single (${year})`,
    value: formatMoney(mspPrograms.qmb.anchorMonthlySingle ?? 0),
  },
  {
    label: `ACA affordability percentage (${year})`,
    value: `${(aca2026.affordabilityPercentage.rate * 100).toFixed(2)}%`,
  },
  {
    label: `Federal poverty level, one person (${year})`,
    value: formatMoney(fplAnnual(year, 1)),
  },
];

const attribution = `Figures from ${site.siteName} (${site.siteUrl}). Data checked ${formatDate(dataVerifiedOn)}. The official source on each record controls if the two differ.`;

const badgeCode = `<a href="${site.siteUrl}/data/"><img src="${site.siteUrl}/badge-data.svg" alt="${site.siteName} source-linked data" width="240" height="64"></a>`;

export default function DataPage() {
  return (
    <>
      <JsonLd
        data={[
          datasetSchema({
            name: `${site.siteName} Medicare and ACA figures ${year}`,
            description:
              'Source-linked Medicare and ACA figures with official source URLs, years, and checked dates, plus IRMAA, federal poverty level, Medicare Savings Program, and ACA tables.',
            path: '/data/',
            downloadPath,
            year,
            keywords: [
              'Medicare',
              'IRMAA',
              'Part B premium',
              'Part D out-of-pocket cap',
              'Medicare Savings Program',
              'ACA affordability',
              'federal poverty level',
            ],
          }),
          webPageSchema({
            name: 'Medicare and ACA data',
            description:
              'Source-linked Medicare and ACA figures as JSON, with official source URLs and checked dates.',
            path: '/data/',
            image: '/og/data.png',
            about: 'Medicare and ACA figures and tables',
            breadcrumb: [
              { name: 'Home', url: '/' },
              { name: 'Data', url: '/data/' },
            ],
          }),
        ]}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Data', href: '/data/' },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Open data</p>
          <h1 className="page-title">Medicare and ACA data</h1>
          <p className="page-lede">
            A JSON file with the figures used on this site, each one tied to an official source and
            the date it was checked. Use it for research, a citation, or a comparison.
          </p>
          <LastUpdated />
        </div>
      </section>

      <section className="section">
        <div className="wrap prose">
          <h2>Download the data</h2>
          <p>
            The file is generated from the same data layer as the calculators. It is not a separate
            copy that can drift.
          </p>
          <p>
            <a className="button button-primary" href={downloadPath}>
              Download the {year} JSON file
            </a>
          </p>

          <h2>What is in the file</h2>
          <ul>
            <li>Selected Part A, Part B, and Part D figures.</li>
            <li>IRMAA brackets for single, married filing jointly, and married filing separately.</li>
            <li>Federal poverty guidelines for household sizes one through eight, for both years.</li>
            <li>Federal Medicare Savings Program tests and the state rules currently modeled.</li>
            <li>The ACA affordability percentage, out-of-pocket maximums, and applicable percentage table.</li>
            <li>The official source URL, year, and checked date on each record.</li>
          </ul>

          <h2>File structure</h2>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Top-level fields in the JSON file</caption>
              <thead>
                <tr>
                  <th scope="col">Field</th>
                  <th scope="col">What it contains</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">site</th>
                  <td>Name, URL, operator, location, and contact for attribution.</td>
                </tr>
                <tr>
                  <th scope="row">dataYear</th>
                  <td>The year the figures describe.</td>
                </tr>
                <tr>
                  <th scope="row">verifiedOn</th>
                  <td>The date the data layer was last checked against official sources.</td>
                </tr>
                <tr>
                  <th scope="row">figures</th>
                  <td>A flat list of values with an id, label, unit, source, and checked date.</td>
                </tr>
                <tr>
                  <th scope="row">tables</th>
                  <td>IRMAA, federal poverty level, Medicare Savings Program, and ACA tables.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Example record</h2>
          <p>Each figure in the flat list follows the same shape.</p>
          <pre>
            <code>{JSON.stringify(sampleRecord, null, 2)}</code>
          </pre>

          <h2>Selected figures</h2>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Examples of the figures in the download</caption>
              <thead>
                <tr>
                  <th scope="col">Figure</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {selectedFigures.map((figure) => (
                  <tr key={figure.label}>
                    <th scope="row">{figure.label}</th>
                    <td>{figure.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Attribution</h2>
          <p>
            You may reuse the figures with attribution and a link to {site.siteName}. The official
            source on each record controls if the two differ.
          </p>
          <blockquote className="cite-text">
            <p>{attribution}</p>
          </blockquote>
          <CopyText text={attribution} label="Copy attribution" />

          <h2>Embed the data badge</h2>
          <p>
            If you cite the data, you can use this badge. It links back to this page so readers can
            see the source and the checked date.
          </p>
          <p>
            <img
              src="/badge-data.svg"
              alt={`${site.siteName} source-linked data badge`}
              width="240"
              height="64"
            />
          </p>
          <pre>
            <code>{badgeCode}</code>
          </pre>
          <CopyText text={badgeCode} label="Copy badge HTML" />

          <h2>How the data is updated</h2>
          <p>
            The file is rebuilt when the data layer changes. The annual schedule covers the fall
            Medicare premium and IRMAA release, the IRS affordability percentage, the federal
            poverty guidelines, and state savings-program limits. The{' '}
            <Link href="/methodology/">methodology page</Link> explains the boundary tests and known
            limits.
          </p>

          <h2>Related resources</h2>
          <ul className="related-list">
            <li>
              <Link href="/link-to-us/">Citation text and suggested anchor text</Link>
            </li>
            <li>
              <Link href="/press/">Press and media kit</Link>
            </li>
            <li>
              <Link href="/verification-log/">Public verification log</Link>
            </li>
            <li>
              <Link href="/corrections/">Corrections and change log</Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
