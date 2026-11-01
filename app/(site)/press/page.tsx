import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { CopyText } from '@/components/trust/copy-text';
import { LastUpdated } from '@/components/trust/last-updated';
import { aca2026 } from '@/data/aca';
import { fpl2026, fplAnnual } from '@/data/fpl';
import { partB2026 } from '@/data/medicare-part-b';
import { partD2026 } from '@/data/medicare-part-d';
import { mspPrograms } from '@/data/msp';
import { site } from '@/data/site';
import { dataVerifiedOn, figureYears } from '@/data/verified';
import { organizationSchema, personSchema, webPageSchema } from '@/lib/schema';
import { formatDate, formatMoney } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Press and media kit',
  description:
    'MedicareClear press kit: independent publisher details, citable Medicare and ACA figures, logo files, and a media contact.',
  alternates: { canonical: '/press/' },
  openGraph: {
    type: 'website',
    title: 'Press and media kit',
    description:
      'Independent publisher details, citable Medicare and ACA figures, logo files, and a media contact.',
    url: '/press/',
    images: [
      {
        url: '/og/press.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear press and media kit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/press.png'],
  },
};

const year = figureYears.current;

const boilerplate = `${site.siteName} publishes free, source-linked calculators and plain-language guides about Medicare and ACA costs. It is operated by ${site.ownerName}, an independent publisher in ${site.location}. Every figure is stored with an official source URL and the date it was checked. The site is not affiliated with Medicare.gov, CMS, SSA, or the IRS.`;

const facts = [
  {
    label: `Part B standard monthly premium (${year})`,
    value: formatMoney(partB2026.standardPremium.amount),
    source: partB2026.standardPremium.source,
  },
  {
    label: `Part B annual deductible (${year})`,
    value: formatMoney(partB2026.deductible.amount),
    source: partB2026.deductible.source,
  },
  {
    label: `Part D base beneficiary premium (${year})`,
    value: formatMoney(partD2026.baseBeneficiaryPremium.amount),
    source: partD2026.baseBeneficiaryPremium.source,
  },
  {
    label: `Part D out-of-pocket cap (${year})`,
    value: formatMoney(partD2026.outOfPocketCap.amount),
    source: partD2026.outOfPocketCap.source,
  },
  {
    label: `IRMAA first surcharge threshold, single (${year})`,
    value: formatMoney(partB2026.irmaa.single[0].max ?? 0),
    source: partB2026.irmaa.single[0].source,
  },
  {
    label: `QMB monthly income limit, single (${year})`,
    value: formatMoney(mspPrograms.qmb.anchorMonthlySingle ?? 0),
    source: mspPrograms.qmb.source,
  },
  {
    label: `ACA affordability percentage (${year})`,
    value: `${(aca2026.affordabilityPercentage.rate * 100).toFixed(2)}%`,
    source: aca2026.affordabilityPercentage.source,
  },
  {
    label: `Federal poverty level, one person (${year})`,
    value: formatMoney(fplAnnual(year, 1)),
    source: fpl2026.source,
  },
];

export default function PressPage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          personSchema(),
          webPageSchema({
            name: 'Press and media kit',
            description:
              'Independent publisher details, citable Medicare and ACA figures, logo files, and a media contact.',
            path: '/press/',
            image: '/og/press.png',
            about: 'MedicareClear press and media resources',
            breadcrumb: [
              { name: 'Home', url: '/' },
              { name: 'Press', url: '/press/' },
            ],
          }),
        ]}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Press', href: '/press/' },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Press and media</p>
          <h1 className="page-title">Press and media kit</h1>
          <p className="page-lede">
            A short description, the publisher facts, citable figures with official sources, and the
            files a writer or editor usually needs.
          </p>
          <LastUpdated />
        </div>
      </section>

      <section className="section">
        <div className="wrap prose">
          <h2>About MedicareClear</h2>
          <p>{boilerplate}</p>
          <CopyText text={boilerplate} label="Copy boilerplate" />

          <h2>Publisher facts</h2>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Who operates MedicareClear</caption>
              <tbody>
                <tr>
                  <th scope="row">Publisher</th>
                  <td>{site.ownerName}</td>
                </tr>
                <tr>
                  <th scope="row">Location</th>
                  <td>{site.location}</td>
                </tr>
                <tr>
                  <th scope="row">Role</th>
                  <td>Independent publisher and researcher</td>
                </tr>
                <tr>
                  <th scope="row">Contact</th>
                  <td>
                    <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Response time</th>
                  <td>{site.responseTime}</td>
                </tr>
                <tr>
                  <th scope="row">Funding</th>
                  <td>Advertising, currently off</td>
                </tr>
                <tr>
                  <th scope="row">US agency or license affiliation</th>
                  <td>None claimed</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Citable figures</h2>
          <p>
            These are the figures most often requested. Each one links to the official source used
            on the site. The checked date for the data layer is{' '}
            <time dateTime={dataVerifiedOn}>{formatDate(dataVerifiedOn)}</time>.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Selected Medicare and ACA figures with official sources</caption>
              <thead>
                <tr>
                  <th scope="col">Figure</th>
                  <th scope="col">Value</th>
                  <th scope="col">Official source</th>
                </tr>
              </thead>
              <tbody>
                {facts.map((fact) => (
                  <tr key={fact.label}>
                    <th scope="row">{fact.label}</th>
                    <td>{fact.value}</td>
                    <td>
                      <a href={fact.source} rel="noreferrer">
                        Source
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            For the full set, including IRMAA tiers and state Medicare Savings Program rules,
            download the <Link href={`/data/medicare-figures-${year}.json`}>source-linked JSON file</Link>.
          </p>

          <h2>Logos and images</h2>
          <ul>
            <li>
              <a href="/apple-icon.png">Square logo, 180 by 180 PNG</a>
            </li>
            <li>
              <a href="/icon.svg">Vector mark, SVG</a>
            </li>
            <li>
              <a href="/og/default.png">Default social card, 1200 by 630 PNG</a>
            </li>
          </ul>

          <h2>Machine-readable files</h2>
          <ul>
            <li>
              <a href="/sitemap.xml">XML sitemap</a>
            </li>
            <li>
              <a href="/feed.xml">RSS feed for guides</a>
            </li>
            <li>
              <a href="/llms.txt">Short index for answer engines</a>
            </li>
            <li>
              <a href="/llms-full.txt">Full text index for answer engines</a>
            </li>
            <li>
              <Link href="/data/">Medicare and ACA data page</Link>
            </li>
          </ul>

          <h2>How to cite and link</h2>
          <p>
            The <Link href="/link-to-us/">link and citation page</Link> has ready-to-use citation
            text, a plain HTML link, and suggested anchor text. A link to the page that answers the
            question is more useful than a link to the home page.
          </p>

          <h2>Interview and comment requests</h2>
          <p>
            Send the topic, the outlet, the deadline, and the specific question to{' '}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. Comments are general
            information, not legal, tax, medical, or insurance advice, and they do not create a
            professional relationship.
          </p>
          <p>
            If a figure in a story looks different from the site, check the checked date and the
            official source on the page. The <Link href="/corrections/">corrections page</Link>{' '}
            explains how to report a discrepancy.
          </p>
        </div>
      </section>
    </>
  );
}
