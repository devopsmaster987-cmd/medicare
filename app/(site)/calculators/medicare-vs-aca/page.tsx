import type { Metadata } from 'next';
import Link from 'next/link';
import { TakeHomePack } from '@/components/action/take-home-pack';
import { AdSlot } from '@/components/ads/ad-slot';
import { MedicareVsAcaCalculator } from './calculator';
import {
  AnswerCapsule,
  Faq,
  KeyFacts,
  SourceTable,
  WhatChanged,
} from '@/components/calc/content';
import { EmailCapture } from '@/components/calc/email-capture';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { AuthorLine } from '@/components/trust/author-line';
import { IndependenceNote } from '@/components/trust/independence-note';
import { LastUpdated } from '@/components/trust/last-updated';
import { aca2026 } from '@/data/aca';
import { aca2025 } from '@/data/aca-2025';
import { irs2026 } from '@/data/irs';
import { partA2026 } from '@/data/medicare-part-a';
import { partA2025 } from '@/data/medicare-part-a-2025';
import { partB2025 } from '@/data/medicare-part-b-2025';
import { partB2026 } from '@/data/medicare-part-b';
import { sources } from '@/data/sources';
import { figureYears } from '@/data/verified';
import { glossaryTipsFor } from '@/data/glossary';
import { medicareVsAca } from '@/lib/formulas/medicare-vs-aca';
import { calculatorSchema } from '@/lib/schema';
import { formatMoney, formatNumber, formatPercent } from '@/lib/utils';
import { site } from '@/data/site';

const year = figureYears.current;
const priorYear = figureYears.prior;
const path = '/calculators/medicare-vs-aca';
const glossaryTips = glossaryTipsFor(['Creditable coverage', 'Part A', 'Part B', 'HSA']);

export const metadata: Metadata = {
  title: 'Medicare vs ACA: Medicare or Marketplace at 65?',
  description: `Medicare vs ACA: compare Medicare and Marketplace paths at 65 using the ${year} 20-employee rule, Part A work credits, HSA rules, and subsidy eligibility.`,
  alternates: { canonical: path },
  openGraph: {
    title: 'Medicare vs ACA: Medicare or Marketplace at 65?',
    description:
      'Use the 20-employee rule, creditable coverage, Part A work credits, and HSA timing to choose a Medicare or Marketplace path.',
    url: path,
    images: [
      {
        url: `/og${path}.png`,
        width: 1200,
        height: 630,
        alt: 'Medicare vs ACA: Medicare or Marketplace at 65?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/og${path}.png`],
  },
};

const example = medicareVsAca({
  age: 66,
  coverageType: 'active',
  employerSize: 25,
  creditableCoverage: true,
  workCredits: 40,
});
const noPartAExample = medicareVsAca({
  age: 66,
  coverageType: 'none',
  workCredits: 35,
});

const faqItems = [
  {
    question: 'Medicare vs ACA subsidies',
    answer: `Eligibility for premium-free Part A generally ends Marketplace premium tax credits. At 65, if you have premium-free Part A, the Marketplace subsidy path usually closes even if you delay Part B. Without premium-free Part A, the Marketplace may still be an option.`,
  },
  {
    question: 'Can I delay Medicare if I have employer coverage?',
    answer:
      'You can usually delay Part B without a penalty if you have active employer coverage from an employer with 20 or more employees and the coverage is creditable. You generally have eight months after that coverage ends to enroll.',
  },
  {
    question: 'Does COBRA count as active employer coverage?',
    answer:
      'COBRA generally does not count as active employer coverage for the Part B Special Enrollment Period. Retiree coverage is also different. Do not delay Part B only because you have COBRA; confirm the rule with Social Security.',
  },
  {
    question: 'What happens if I do not have premium-free Part A?',
    answer:
      'You may need to compare the full Part A and Part B premium with a Marketplace plan and any premium tax credit. With 30 to 39 work credits, Part A can use a reduced premium rather than the full premium.',
  },
  {
    question: 'When should I stop HSA contributions?',
    answer:
      'Stop HSA contributions six months before Medicare Part A begins. Part A can be backdated up to six months, so a contribution after that point can create a tax problem.',
  },
  {
    question: 'What if my employer has fewer than 20 employees?',
    answer:
      'With active coverage from an employer with fewer than 20 employees, Medicare generally pays first. Enrolling in Part B usually avoids gaps and penalty risk. Ask HR and Social Security to confirm the employer size rule for your plan.',
  },
];

export default function MedicareVsAcaPage() {
  return (
    <>
      <JsonLd
        data={calculatorSchema({
          name: 'Medicare vs ACA decision calculator',
          description:
            'Compare Medicare and Marketplace paths using age, the 20-employee rule, creditable coverage, Part A work credits, and HSA timing.',
          url: `${site.siteUrl}${path}`,
        })}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators' },
            { name: 'Medicare vs ACA', href: path },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Coverage decision · {year}</p>
          <h1 className="page-title">Medicare vs ACA</h1>
          <p className="page-lede">
            Compare Medicare and Marketplace paths using your age, employer size, coverage type,
            Part A work credits, and HSA status. The result shows a path, the reasoning, costs, and
            the enrollment windows to calendar.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <div className="wrap">
        <AnswerCapsule>
          Medicare vs ACA depends on age, employer size, and whether you have premium-free Part A.
          At 65 with active coverage from an employer with 20 or more employees, you can usually
          delay Part B while the plan is creditable. Without premium-free Part A, compare the full
          Medicare premium with a Marketplace plan and any subsidy.
        </AnswerCapsule>
      </div>

      <section className="section section-tight">
        <div className="wrap">
          <KeyFacts
            caption="Medicare vs ACA key facts"
            rows={[
              {
                label: '20-employee rule',
                value: `${formatNumber(irs2026.employerSizeRule.employees)} employees`,
                note: 'Active employer coverage at or above this size generally pays first.',
              },
              {
                label: 'Part B standard premium',
                value: formatMoney(partB2026.standardPremium.amount),
                note: 'Monthly standard amount before IRMAA.',
              },
              {
                label: 'Part A full premium',
                value: formatMoney(partA2026.fullPremium.amount),
                note: 'Applies with fewer than 30 work credits.',
              },
              {
                label: 'Part A reduced premium',
                value: formatMoney(partA2026.reducedPremium.amount),
                note: 'Applies with 30 to 39 work credits.',
              },
              {
                label: 'Special Enrollment Period',
                value: `${formatNumber(irs2026.specialEnrollmentPeriodMonths)} months`,
                note: 'Usually after active employer coverage ends.',
              },
              {
                label: 'HSA stop date',
                value: `${formatNumber(irs2026.hsaContributionStopMonthsBeforeMedicare)} months`,
                note: 'Before Part A begins, because Part A can be backdated.',
              },
            ]}
          />
        </div>
      </section>

      <div className="wrap">
        <MedicareVsAcaCalculator tips={glossaryTips} />
        <AdSlot placement="below-calculator" />
      </div>

      <section className="section">
        <div className="wrap prose">
          <h2>Medicare 20 employee rule</h2>
          <p>
            With active employer coverage from an employer with 20 or more employees, the group
            health plan generally pays first for a worker age 65 or older. That rule is why many
            people can delay Part B without a penalty.
          </p>
          <p>
            With fewer than 20 employees, Medicare generally pays first. The employer count can
            include full-time equivalents, so ask HR for the official count instead of guessing from
            the number of people in your department.
          </p>

          <h2>Should I take Medicare or Marketplace at 65</h2>
          <p>
            At 65, start with whether you have premium-free Part A. If you do, the Marketplace
            subsidy path generally ends. Compare your active employer plan with Medicare, and
            choose based on the premium, the network, the drug coverage, and the enrollment risk.
          </p>
          <p>
            If you do not have premium-free Part A, compare the full Part A and Part B cost with a
            Marketplace plan and any premium tax credit. The calculator shows the Medicare premium
            side; it does not invent a Marketplace benchmark premium.
          </p>

          <h2>ACA subsidies end when eligible for Part A</h2>
          <p>
            Marketplace premium tax credits generally end once you are eligible for premium-free
            Part A. That can happen even if you delay Part B. Being eligible for premium-free Part A
            is the key fact, not whether you have enrolled yet.
          </p>
          <p>
            If Part A is not premium-free, the Marketplace may still be an option. Check the income
            rules and the current 400% federal poverty level cliff before you rely on a subsidy.
          </p>

          <h2>No premium free Part A what to do</h2>
          <p>
            If you do not have premium-free Part A, get your work credits from Social Security and
            ask whether you qualify for a reduced premium with 30 to 39 credits. Then compare the
            full annual Medicare premium with a Marketplace plan and any subsidy.
          </p>
          <p>
            In the worked example below, a person with 35 credits uses the reduced Part A premium,
            not the full premium. The exact amount depends on the current Part A table.
          </p>

          <h2>Working past 65</h2>
          <p>
            If you keep working past 65, the 20-employee rule, creditable coverage, and the type of
            coverage decide whether you can delay Part B. Active coverage is different from COBRA and
            retiree coverage.
          </p>
          <p>
            If you contribute to an HSA, stop contributions six months before Part A begins. Part A
            can be backdated, and an HSA contribution after Medicare starts can create a tax issue.
            The calculator shows the enrollment windows once you enter the month you turn 65 and the
            month coverage ends.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <WhatChanged
            year={year}
            priorYear={priorYear}
            rows={[
              {
                label: 'Part B standard premium',
                prior: formatMoney(partB2025.standardPremium.amount),
                current: formatMoney(partB2026.standardPremium.amount),
                note: 'Monthly standard amount before IRMAA.',
              },
              {
                label: 'Annual Part B standard cost',
                prior: formatMoney(partB2025.standardPremium.amount * 12),
                current: formatMoney(partB2026.standardPremium.amount * 12),
                note: 'Used in the Medicare cost estimate.',
              },
              {
                label: 'Part A full premium',
                prior: formatMoney(partA2025.fullPremium.amount),
                current: formatMoney(partA2026.fullPremium.amount),
                note: 'Applies with fewer than 30 work credits.',
              },
              {
                label: 'Part A reduced premium',
                prior: formatMoney(partA2025.reducedPremium.amount),
                current: formatMoney(partA2026.reducedPremium.amount),
                note: 'Applies with 30 to 39 work credits.',
              },
              {
                label: 'Affordability percentage',
                prior: formatPercent(aca2025.affordabilityPercentage.rate),
                current: formatPercent(aca2026.affordabilityPercentage.rate),
                note: 'Used for the employer affordability test, not this decision directly.',
              },
              {
                label: 'Enhanced Marketplace subsidies',
                prior: 'Enhanced subsidies available',
                current: `Expired after ${priorYear}; ${formatNumber(aca2026.subsidyCliffFplPercent)}% FPL cliff generally applies`,
                note: 'Check the current Marketplace rules before applying.',
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Worked example</h2>
          <p>
            A 66-year-old has active coverage from an employer with 25 employees, creditable
            coverage, and 40 work credits. The employer plan pays first, so Part B can generally be
            delayed. Part A is premium-free, which generally ends the Marketplace subsidy path.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Medicare vs ACA worked example</caption>
              <tbody>
                <tr>
                  <th scope="row">Recommended path</th>
                  <td>{example.pathLabel}</td>
                </tr>
                <tr>
                  <th scope="row">Part A status</th>
                  <td>Premium-free</td>
                </tr>
                <tr>
                  <th scope="row">Annual Part B</th>
                  <td>{formatMoney(example.annualPartBPremium)}</td>
                </tr>
                <tr>
                  <th scope="row">Annual Part A</th>
                  <td>{formatMoney(example.annualPartAPremium)}</td>
                </tr>
                <tr>
                  <th scope="row">Annual Medicare premium estimate</th>
                  <td>{formatMoney(example.annualMedicarePremiumEstimate)}</td>
                </tr>
                <tr>
                  <th scope="row">ACA subsidy signal</th>
                  <td>Marketplace subsidies generally end</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="stat-note">
            With 35 work credits and no premium-free Part A, the same person would use the reduced
            Part A premium and compare {formatMoney(noPartAExample.annualMedicarePremiumEstimate)} a
            year in Medicare premiums with a Marketplace plan.
          </p>
          <IndependenceNote />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Three honest caveats</h2>
          <ol>
            <li>
              The 20-employee rule can count full-time equivalents, and the plan&apos;s
              creditable-coverage notice controls. Ask HR for both facts in writing.
            </li>
            <li>
              This calculator does not include a Marketplace benchmark premium, a Medigap policy, a
              Medicare Advantage plan, or Part D. Compare the full cost of each path, not just the
              premium shown here.
            </li>
            <li>
              COBRA and retiree coverage are not active employer coverage for the Part B Special
              Enrollment Period. Do not delay Part B based only on the name of the coverage.
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Faq items={faqItems} />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <h2>Related help</h2>
          <ul className="related-list">
            <li>
              <Link href="/calculators/part-b-late-enrollment-penalty">
                Part B late enrollment penalty calculator
              </Link>
            </li>
            <li>
              <Link href="/calculators/irmaa-cliff-checker">IRMAA brackets and surcharge checker</Link>
            </li>
            <li>
              <Link href="/calculators/employer-coverage-affordability">
                Employer coverage affordability
              </Link>
            </li>
            <li>
              <a href={sources.medicarePaysFirst} target="_blank" rel="noreferrer">
                Medicare.gov: who pays first
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SourceTable
            rows={[
              {
                label: '20-employee rule',
                value: `${formatNumber(irs2026.employerSizeRule.employees)} or more employees`,
                source: sources.medicarePaysFirst,
                sourceLabel: 'Medicare.gov coordination of benefits',
              },
              {
                label: 'Part B standard premium',
                value: formatMoney(partB2026.standardPremium.amount),
                source: sources.cms2026AB,
                sourceLabel: 'CMS Part B premium fact sheet',
              },
              {
                label: 'Part A premiums',
                value: `${formatMoney(partA2026.reducedPremium.amount)} reduced / ${formatMoney(partA2026.fullPremium.amount)} full`,
                source: sources.cms2026AB,
                sourceLabel: 'CMS Part B premium fact sheet',
              },
              {
                label: 'Special Enrollment Period',
                value: `${formatNumber(irs2026.specialEnrollmentPeriodMonths)} months`,
                source: sources.medicareEmployer,
                sourceLabel: 'Medicare.gov sign-up rules',
              },
              {
                label: 'HSA six-month rule',
                value: `${formatNumber(irs2026.hsaContributionStopMonthsBeforeMedicare)} months before Part A`,
                source: sources.medicareEmployer,
                sourceLabel: 'Medicare.gov sign-up rules',
              },
              {
                label: 'Marketplace subsidy status',
                value: `Enhanced subsidies ${aca2026.enhancedSubsidies.status}; ${formatNumber(aca2026.subsidyCliffFplPercent)}% FPL cliff generally applies`,
                source: sources.crsEnhancedPtc,
                sourceLabel: 'Congressional Research Service',
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <EmailCapture />
          <TakeHomePack pageTitle="Medicare vs ACA" />
          <p className="disclaimer">
            MedicareClear is independent and is not connected to Medicare.gov, Social Security,
            HealthCare.gov, or any government agency. This page is educational and does not provide
            legal, tax, or insurance advice. Confirm your work credits, employer size, and coverage
            dates with the official sources before you act.
          </p>
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
