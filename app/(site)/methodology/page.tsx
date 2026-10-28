import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/legal-page';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Methodology',
  description:
    'The sources, formula tests, boundary checks, update process, and known limits behind MedicareClear calculators.',
  alternates: { canonical: '/methodology' },
  openGraph: {
    title: 'Methodology',
    description:
      'The sources, formula tests, boundary checks, update process, and known limits behind MedicareClear calculators.',
    url: '/methodology',
    images: [
      {
        url: '/og/methodology.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear methodology',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/methodology.png'],
  },
};

export default function MethodologyPage() {
  return (
    <LegalPage
      title="Methodology"
      path="/methodology"
      eyebrow="Methodology"
      lede="A calculator is only as good as the rule behind it. This page explains where the figures come from, how the formulas are checked, and what the tools do not cover."
    >
      <h2>Where the figures come from</h2>
      <p>
        The data layer uses official publications from the Centers for Medicare &amp; Medicaid
        Services, Medicare.gov, the Social Security Administration, the Department of Health and
        Human Services, the Internal Revenue Service, and state Medicaid agencies. Each figure keeps
        its year, source link, and checked date with the value.
      </p>
      <p>
        A figure that has not been checked against an official source is flagged for review rather
        than presented as settled. The visible source table on each calculator shows the figure, the
        year, the agency, the link, and the checked date.
      </p>

      <h2>How the formulas are tested</h2>
      <p>
        Every formula has automated tests for the normal case, boundary values, zero values, and the
        cliff or threshold that matters to that formula. A threshold is checked one unit below, at,
        and one unit above the line. A penalty is checked for a partial year and a full period. A
        state program is checked at its income and resource limits.
      </p>
      <p>
        Each formula also has hand-worked examples recorded in the{' '}
        <Link href="/verification-log">public verification log</Link>. The examples use published
        tables or official worked examples where one exists. Where no official worked example
        exists, the entry says so and shows the hand calculation from the published rule.
      </p>

      <h2>Boundary checks by formula</h2>
      <div className="table-scroll">
        <table className="fact-table">
          <caption>Examples of the boundary cases in the test suite</caption>
          <thead>
            <tr>
              <th scope="col">Formula</th>
              <th scope="col">Boundary checked</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Employer affordability</th>
              <td>The annual premium one cent below, at, and above the income threshold.</td>
            </tr>
            <tr>
              <th scope="row">Medicare Savings Program</th>
              <td>Income at each program limit and countable assets at the resource limit.</td>
            </tr>
            <tr>
              <th scope="row">Part B late enrollment penalty</th>
              <td>11 months, 12 months, 23 months, and 24 months, plus creditable coverage.</td>
            </tr>
            <tr>
              <th scope="row">IRMAA</th>
              <td>Income one dollar below, at, and above each filing-status threshold.</td>
            </tr>
            <tr>
              <th scope="row">Medicare vs ACA</th>
              <td>19 and 20 employees, 30 and 40 work credits, and active versus retiree coverage.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>How to reproduce a result</h2>
      <p>
        Open the <Link href="/verification-log">verification log</Link>, find the formula, and use
        the inputs in one of the worked examples. The expected result and the actual result are shown
        side by side. If the code and the log disagree, the log entry is the first place to check.
      </p>

      <h2>What the calculators do not cover</h2>
      <ul>
        <li>Plan-specific premiums, networks, formularies, and out-of-pocket costs are not included unless the page says so.</li>
        <li>A Marketplace benchmark premium is not invented. The ACA comparison separates known Medicare premiums from the unknown plan price.</li>
        <li>State-specific Medicare Savings Program disregards and case rules are not fully modeled. The tool applies the federal tests for covered states and tells the reader to apply through the state agency.</li>
        <li>Tax filing changes, future income, and events after the checked date can change a result.</li>
        <li>Medigap, Medicare Advantage, and Part D plan choices are outside the current calculator scope.</li>
      </ul>

      <h2>How often figures change</h2>
      <p>
        The annual update checklist covers the fall Medicare premium and IRMAA release, the IRS
        affordability percentage, the federal poverty guidelines, and state savings-program limits.
        A figure is updated when the official source publishes the new value, not before.
      </p>
      <p>
        The current data year is shown on every calculator. A future year is not added until the
        official table is available.
      </p>

      <h2>Why a result can differ from an agency decision</h2>
      <p>
        An agency applies your full record, current state rules, and its own verification. A
        calculator applies the inputs you provide and the simplified rule described on the page. Treat
        the result as a way to understand the rule and prepare for the official process, not as a
        final determination.
      </p>

      <h2>Corrections</h2>
      <p>
        If a formula, source, or boundary test is wrong, send the page and the official source to{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. The{' '}
        <Link href="/corrections">corrections page</Link> explains what to include and how changes are
        recorded.
      </p>
    </LegalPage>
  );
}
