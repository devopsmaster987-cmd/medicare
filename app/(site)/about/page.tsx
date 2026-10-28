import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { IndependenceNote } from '@/components/trust/independence-note';
import { LastUpdated } from '@/components/trust/last-updated';
import { site } from '@/data/site';
import { personSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About',
  description:
    'MedicareClear is an independent publisher in Punjab, Pakistan, turning official US Medicare and ACA rules into free, source-linked calculators.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About MedicareClear',
    description:
      'An independent publisher in Punjab, Pakistan, turning official US Medicare and ACA rules into free, source-linked calculators.',
    url: '/about',
    images: [
      {
        url: '/og/about.png',
        width: 1200,
        height: 630,
        alt: 'About MedicareClear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/about.png'],
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personSchema()} />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'About', href: '/about' },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Independent publisher</p>
          <h1 className="page-title">About MedicareClear</h1>
          <p className="page-lede">
            I am Abdul Samad, an independent publisher based in Punjab, Pakistan. I research US
            Medicare and ACA rules from official government sources and turn them into free
            calculators.
          </p>
          <LastUpdated />
        </div>
      </section>

      <section className="section">
        <div className="wrap prose">
          <h2>Why this site exists</h2>
          <p>
            Medicare and ACA decisions often arrive with a number, a deadline, and very little plain
            explanation. A premium quote may not say which income year it uses. An enrollment notice
            may not explain what happens if you delay. A state program may have an income limit that
            is hard to compare with the federal one.
          </p>
          <p>
            MedicareClear exists to make those decisions easier to inspect. The goal is to be
            genuinely useful, to check every calculation against an official source, and to explain
            complicated rules in original, plain-language content.
          </p>

          <h2>Publisher facts</h2>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Who publishes MedicareClear</caption>
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
                  <th scope="row">Funding</th>
                  <td>Advertising, currently off</td>
                </tr>
                <tr>
                  <th scope="row">US license or agency affiliation</th>
                  <td>None claimed</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>How the calculators are built</h2>
          <p>
            Each figure in the data layer carries a year, an official source link, and the date it
            was checked. The formulas are tested at boundaries, and the worked examples are recorded
            in the <Link href="/verification-log">public verification log</Link>. When a rule varies
            by state or depends on a fact we do not have, the page says so instead of guessing.
          </p>
          <p>
            Your calculator inputs stay in your browser. The site does not ask for a Social Security
            number, and it does not send the income or asset amounts you type to analytics.
          </p>

          <h2>How the research is done</h2>
          <ol>
            <li>Start with the official publication, not a summary from another calculator.</li>
            <li>Record the figure, the year, the source link, and the date it was checked.</li>
            <li>Work at least two examples by hand from the published table or worked example.</li>
            <li>Test the formula one unit below, at, and above each threshold.</li>
            <li>Publish the result with its limits, and say when a state rule is not covered.</li>
            <li>Correct the page and the change log when a source changes or a reader finds an error.</li>
          </ol>

          <h2>How the site is funded</h2>
          <p>
            The site is designed to be funded by advertising so the calculators can stay free. Ads
            are currently off. They will appear only after approval, and only in reserved spaces that
            do not cover the result, the math, or the next step. Advertising does not change a
            calculator result or a source link.
          </p>

          <h2>What this site is not</h2>
          <p>
            MedicareClear is not affiliated with Medicare.gov, the Centers for Medicare &amp;
            Medicaid Services, the Social Security Administration, the IRS, or any state agency. It
            does not sell insurance, rank carriers, or provide legal, tax, medical, or insurance
            advice.
          </p>
          <IndependenceNote />

          <h2>Corrections and contact</h2>
          <p>
            If a figure, source link, or explanation looks wrong, send the page and the official
            source you used to <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. The{' '}
            <Link href="/corrections">corrections page</Link> explains what to include and records
            changes.
          </p>
          <p>
            You can read more about the owner on the{' '}
            <Link href="/authors/abdul-samad">author page</Link>, or review the{' '}
            <Link href="/methodology">methodology</Link> and{' '}
            <Link href="/editorial-policy">editorial policy</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
