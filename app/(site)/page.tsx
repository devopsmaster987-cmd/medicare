import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionPlan } from '@/components/action/action-plan';
import { JsonLd } from '@/components/seo/json-ld';
import { AuthorLine } from '@/components/trust/author-line';
import { IndependenceNote } from '@/components/trust/independence-note';
import { LastUpdated } from '@/components/trust/last-updated';
import { ReportError } from '@/components/trust/report-error';
import { SourceLine } from '@/components/trust/source-line';
import { guides, resolveGuide } from '@/content/guides/meta';
import { partB2026 } from '@/data/medicare-part-b';
import { partD2026 } from '@/data/medicare-part-d';
import { sources } from '@/data/sources';
import { figureYears } from '@/data/verified';
import { formatMoney } from '@/lib/utils';
import { organizationSchema, websiteSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Free Medicare Calculator',
  description:
    'Free Medicare calculator for costs, late penalties, IRMAA, Medicare Savings Programs, and ACA choices. Every figure links to a dated official source.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Free Medicare Calculator',
    description:
      "Use MedicareClear's free Medicare calculator to check Medicare costs, late penalties, IRMAA, Medicare Savings Programs, and ACA choices.",
    url: '/',
    images: [
      {
        url: '/og/home.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear free Medicare calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/home.png'],
  },
};

const calculators = [
  {
    number: '01',
    title: 'Employer coverage affordability',
    href: '/calculators/employer-coverage-affordability',
    question: 'Does your employer plan pass the affordability test?',
    detail: 'Check the employee-only premium against the current IRS percentage and the family glitch rule.',
  },
  {
    number: '02',
    title: 'Medicare Savings Program and Extra Help',
    href: '/calculators/medicare-savings-program-extra-help',
    question: 'Do you meet the QMB, SLMB, QI, or Extra Help limits?',
    detail: 'Compare income and countable assets with the federal tests, then see the next state step.',
  },
  {
    number: '03',
    title: 'Part B late enrollment penalty',
    href: '/calculators/part-b-late-enrollment-penalty',
    question: 'What does a delay cost now and over time?',
    detail: 'See the monthly penalty, the annual cost, and the 10-year and 20-year totals.',
  },
  {
    number: '04',
    title: 'IRMAA cliff checker',
    href: '/calculators/irmaa-cliff-checker',
    question: 'Which income bracket applies, and how close is the next one?',
    detail: 'Check the two-year lookback, the Part B and Part D surcharges, and Roth conversion headroom.',
  },
  {
    number: '05',
    title: 'Medicare vs ACA',
    href: '/calculators/medicare-vs-aca',
    question: 'Should you take Medicare or keep Marketplace coverage?',
    detail: 'Follow the 20-employee rule, the premium-free Part A test, and the subsidy consequences.',
  },
];

const steps = [
  {
    title: 'Pick the decision',
    copy: 'Start with the question you actually need to answer, not a generic quote form.',
  },
  {
    title: 'Answer a few facts',
    copy: 'Income, household size, coverage type, and dates are enough for most checks.',
  },
  {
    title: 'Leave with a source',
    copy: 'Every result shows the rule, the official link, and the date the figure was checked.',
  },
];

const afterSteps = [
  {
    title: 'Check the date',
    detail: 'A Medicare figure is only useful with the year and the source attached. Check both before you act.',
  },
  {
    title: 'Open the official page',
    detail: 'Use the linked agency page for the application, the appeal form, or the current table.',
  },
  {
    title: 'Ask before a deadline',
    detail: 'Call Social Security, your state Medicaid agency, or a SHIP counselor before an enrollment window closes.',
  },
];

const sourceCards = [
  {
    title: 'CMS Part B premiums and deductibles',
    href: sources.cms2026AB,
    note: 'Standard premium, deductible, and IRMAA brackets.',
  },
  {
    title: 'Medicare.gov cost basics',
    href: sources.medicareCosts,
    note: 'Part A and Part B costs, coinsurance, and enrollment basics.',
  },
  {
    title: 'Medicare Savings Programs',
    href: sources.medicareMsp,
    note: 'QMB, SLMB, QI, and state application routes.',
  },
  {
    title: 'IRS affordability percentage',
    href: sources.irsRp2025_25,
    note: 'The employer coverage affordability test for the current plan year.',
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={[websiteSchema(), organizationSchema()]} />
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">Independent tools. Dated sources.</p>
            <h1 className="hero-title">Free Medicare calculator</h1>
            <p className="hero-lede">
              Use this free Medicare calculator to turn a confusing cost question into a clear next
              step. Check premiums, penalties, IRMAA, savings programs, and ACA choices without a
              sales call or a lead form.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/calculators">
                Browse the calculators
              </Link>
              <Link className="button button-secondary" href="#how-it-works">
                See how the checks work
              </Link>
            </div>
            <IndependenceNote />
          </div>

          <aside className="hero-card" aria-label="Current Medicare figures">
            <p className="hero-card-label">Figures checked for {figureYears.current}</p>
            <div className="stat-list">
              <div className="stat">
                <span className="stat-label">Part B standard premium</span>
                <span className="stat-value">{formatMoney(partB2026.standardPremium.amount)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Part B deductible</span>
                <span className="stat-value">{formatMoney(partB2026.deductible.amount)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Part D base premium</span>
                <span className="stat-value">
                  {formatMoney(partD2026.baseBeneficiaryPremium.amount)}
                </span>
              </div>
            </div>
            <LastUpdated />
            <p className="stat-note">
              Each calculator links to the exact source used for its result.
            </p>
          </aside>
        </div>
      </section>

      <section className="section" id="calculators">
        <div className="wrap">
          <h2 className="section-heading">Five questions, answered with the same facts</h2>
          <p className="section-intro">
            The calculators share one audited data layer. A limit changes in one place, and every
            result, table, and guide changes with it.
          </p>
          <ol className="calculator-index">
            {calculators.map((calculator) => (
              <li key={calculator.number}>
                <Link className="calculator-entry" href={calculator.href}>
                  <span className="calculator-entry-number" aria-hidden="true">
                    {calculator.number}
                  </span>
                  <div className="calculator-entry-body">
                    <h3 className="calculator-entry-title">{calculator.title}</h3>
                    <span className="calculator-entry-question">{calculator.question}</span>
                    <span className="calculator-entry-detail">{calculator.detail}</span>
                  </div>
                  <span className="calculator-entry-action" aria-hidden="true">
                    Open
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="notice">
            All five calculator screens are live. The data layer and formulas are tested, and every
            result shows its source before you act.
          </p>
        </div>
      </section>

      <section className="section section-tight" id="guides">
        <div className="wrap">
          <h2 className="section-heading">Guides that explain the rule</h2>
          <p className="section-intro">
            A number is only useful if you know what moves it. These guides walk through the timing
            rules, the appeals, and the cliffs behind the calculators.
          </p>
          <ul className="related-list">
            {guides.slice(0, 6).map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`}>
                  {resolveGuide(guide.h1, figureYears.current)}
                </Link>
              </li>
            ))}
          </ul>
          <p className="stat-note">
            <Link href="/guides">Read all {guides.length} guides</Link>
          </p>
        </div>
      </section>

      <section className="section section-tight" id="reference">
        <div className="wrap">
          <h2 className="section-heading">Reference shelf</h2>
          <p className="section-intro">
            The yearly changes, the enrollment windows, and worked decisions in one place. Each
            page uses the same dated data as the calculators.
          </p>
          <ul className="related-list">
            <li>
              <Link href={`/what-changed-${figureYears.current}`}>What changed for {figureYears.current}</Link>
            </li>
            <li>
              <Link href="/medicare-deadlines">Medicare deadlines</Link>
            </li>
            <li>
              <Link href="/scenarios">Medicare scenarios</Link>
            </li>
            <li>
              <Link href="/verification-log">Verification log</Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="wrap">
          <h2 className="section-heading">How the checks work</h2>
          <p className="section-intro">
            A useful answer shows its work. MedicareClear keeps the rule, the input, and the source
            together so you can check the result before you act.
          </p>
          <div className="steps">
            {steps.map((step) => (
              <article className="step" key={step.title}>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-copy">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-label="What to do after a result">
        <div className="wrap">
          <ActionPlan title="What to do with the answer" steps={afterSteps} />
        </div>
      </section>

      <section className="section" id="sources">
        <div className="wrap">
          <h2 className="section-heading">Sources you can open</h2>
          <p className="section-intro">
            We use agency publications, not summaries from other calculators. Dates and links stay
            visible on the page so a figure can be checked again.
          </p>
          <div className="source-grid">
            {sourceCards.map((source) => (
              <article className="source-card" key={source.title}>
                <strong>{source.title}</strong>
                <p className="card-copy">{source.note}</p>
                <SourceLine href={source.href} label="Official source" />
              </article>
            ))}
          </div>
          <LastUpdated label="Current data checked" />
          <p className="stat-note">
            If a source changes, the page is updated and the date changes with it.
          </p>
          <AuthorLine />
          <ReportError pageTitle="Free Medicare calculator" />
        </div>
      </section>
    </>
  );
}
