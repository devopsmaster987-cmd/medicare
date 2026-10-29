import type { Metadata } from 'next';
import Link from 'next/link';
import { TakeHomePack } from '@/components/action/take-home-pack';
import { AdSlot } from '@/components/ads/ad-slot';
import { EmployerCalculator } from './calculator';
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
import { CiteThisPage } from '@/components/trust/cite-this-page';
import { IndependenceNote } from '@/components/trust/independence-note';
import { LastUpdated } from '@/components/trust/last-updated';
import { aca2026 } from '@/data/aca';
import { irs2026 } from '@/data/irs';
import { irs2025 } from '@/data/irs-2025';
import { sources } from '@/data/sources';
import { figureYears } from '@/data/verified';
import { glossaryTipsFor } from '@/data/glossary';
import { employerAffordability } from '@/lib/formulas/employer-affordability';
import { calculatorSchema } from '@/lib/schema';
import { formatDate, formatMoney, formatNumber, formatPercent } from '@/lib/utils';
import { site } from '@/data/site';
import { clampMetaDescription } from '@/lib/seo';

const year = figureYears.current;
const priorYear = figureYears.prior;
const path = '/calculators/employer-coverage-affordability/';
const glossaryTips = glossaryTipsFor(['Household income', 'W-2 wages', 'Minimum value', 'Affordability percentage']);

export const metadata: Metadata = {
  title: { absolute: `Is employer health insurance affordable ${year}?` },
  description: clampMetaDescription( `Is employer health insurance affordable ${year}? Check the employee-only premium against the ${formatPercent(irs2026.employerAffordabilityPercentage.rate)} income test and the family glitch rule with dated IRS sources.`),
  alternates: { canonical: path },
  openGraph: {
    title: `Is employer health insurance affordable ${year}?`,
    description: `Check the employee-only premium against the ${formatPercent(irs2026.employerAffordabilityPercentage.rate)} affordability test and see the Marketplace next step.`,
    url: path,
    images: [
      {
        url: `/og${path}.png`,
        width: 1200,
        height: 630,
        alt: `Is employer health insurance affordable ${year}?`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/og${path}.png`],
  },
};

const example = employerAffordability({
  householdIncome: 30000,
  employeeOnlyPremium: 200,
  familyPremium: 600,
  payFrequency: 'monthly',
  planMeetsMinimumValue: true,
});

const faqItems = [
  {
    question: 'Is my employer plan affordable single?',
    answer:
      'For a single employee, the test is the annual premium for the lowest-cost self-only plan compared with household income multiplied by the affordability percentage. The number of people on the plan does not change that employee-only comparison.',
  },
  {
    question: 'Minimum value coverage explained',
    answer:
      'Minimum value is a separate test from affordability. It asks whether the plan pays at least the minimum share of covered costs. A plan can have a low premium and still fail minimum value, which can open a Marketplace path.',
  },
  {
    question: 'Employer health insurance affordability test',
    answer:
      'For the employee, the test uses the lowest-cost self-only premium, not the deductible. For a spouse and children, the family glitch fix uses the premium you must pay for family coverage. If you are offered more than one plan, use the lowest-cost option that meets the minimum value standard.',
  },
  {
    question: 'What income do I use for the Marketplace?',
    answer:
      'Use the household income figure for the people on your tax return, including a spouse and dependents who file with you. W-2 wages alone can be too narrow because Marketplace income includes other income and adjustments.',
  },
  {
    question: 'Does the family premium decide family subsidies?',
    answer:
      'Yes, for family members. Under the family glitch fix, a spouse and children are tested against the annual premium for family coverage compared with the same share of household income. A high family premium can qualify them even when the employee-only premium is affordable.',
  },
  {
    question: 'What if my employer plan changes during the year?',
    answer:
      'A premium change or a plan change can change the result. Keep the plan year summary and rerun the calculator with the new employee-only premium. A qualifying event may also open a special enrollment period.',
  },
];

export default function EmployerCoverageAffordabilityPage() {
  return (
    <>
      <JsonLd
        data={calculatorSchema({
          name: `Employer health insurance affordability calculator ${year}`,
          description:
            'Check the employee-only premium against the current IRS affordability percentage and the family glitch rule.',
          url: `${site.siteUrl}${path}`,
        })}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators/' },
            { name: 'Employer coverage affordability', href: path },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Employer coverage · {year}</p>
          <h1 className="page-title">Is employer health insurance affordable {year}?</h1>
          <p className="page-lede">
            Start with the premium for the lowest-cost self-only plan. The IRS compares it with a
            share of household income. Family members are tested separately with the family
            premium, so a high family cost can open Marketplace help.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <div className="wrap">
        <AnswerCapsule>
          Is employer health insurance affordable {year}? The IRS compares your annual
          employee-only premium with {formatPercent(irs2026.employerAffordabilityPercentage.rate)}{' '}
          of household income. Above that line, or if the plan fails minimum value, you may get
          Marketplace help. Family members use the family premium, so a high family cost can
          qualify them.
        </AnswerCapsule>
      </div>

      <section className="section section-tight">
        <div className="wrap">
          <KeyFacts
            caption="Employer affordability key facts"
            rows={[
              {
                label: 'Affordability percentage',
                value: formatPercent(irs2026.employerAffordabilityPercentage.rate),
                note: 'Applied to household income for the plan year.',
              },
              {
                label: 'Premium tested',
                value: 'Two separate tests',
                note: 'Employee-only premium for you; family premium for your spouse and children.',
              },
              {
                label: 'Minimum value',
                value: 'Separate test',
                note: 'A low premium does not excuse a plan that fails minimum value.',
              },
              {
                label: 'Family glitch rule',
                value: 'Family premium controls family test',
                note: 'A high family premium can qualify family members even when your own coverage is affordable.',
              },
              {
                label: 'Subsidy cliff',
                value: `${formatNumber(aca2026.subsidyCliffFplPercent)}% of FPL`,
                note: 'Enhanced subsidies expired after the prior year in this dataset.',
              },
            ]}
          />
        </div>
      </section>

      <div className="wrap">
        <EmployerCalculator tips={glossaryTips} />
        <AdSlot placement="below-calculator" />
      </div>

      <section className="section">
        <div className="wrap prose">
          <h2>Lowest cost self only plan affordability</h2>
          <p>
            The affordability test uses the lowest-cost self-only plan offered to you, not the
            family plan and not the plan with the richest benefits. If your employer offers several
            self-only options, use the lowest-cost option that meets the minimum value standard.
          </p>
          <p>
            Multiply the monthly premium by the number of pay periods to get the annual amount. Then
            compare that annual amount with household income multiplied by{' '}
            {formatPercent(irs2026.employerAffordabilityPercentage.rate)}. The result is a
            coverage test, not a tax bill.
          </p>

          <h2>What counts as minimum value coverage</h2>
          <p>
            Minimum value is about the share of covered costs the plan pays, not the size of the
            premium. A plan that fails minimum value can leave you eligible for Marketplace help
            even when the employee-only premium looks affordable.
          </p>
          <p>
            Ask HR for the plan&apos;s summary of benefits and the minimum value statement. Keep the
            answer with the premium sheet you used in the calculator.
          </p>

          <h2>Household income vs W2 wages Marketplace</h2>
          <p>
            Marketplace eligibility uses household income for the people on your tax return. That
            can include a spouse&apos;s income, self-employment income, and other income that does
            not appear on your W-2. Using only your own W-2 wages can make the affordability test
            look wrong.
          </p>
          <p>
            Use the same household income figure you will put on the application. If the figure is
            uncertain, run the calculator with a range and write down the source for each number.
          </p>

          <h2>Family glitch fix calculator</h2>
          <p>
            The family glitch fix changed who is tested against which premium. An employee is
            tested with the lowest-cost self-only premium. A spouse and children are tested with
            the annual premium the employee must pay for family coverage, compared with the same
            share of household income.
          </p>
          <p>
            That means a family can face two different answers. Employee-only coverage may be
            affordable while the family premium is above the line, which can open premium tax
            credits for the spouse and children. The calculator shows both signals and never adds
            the family premium to the employee-only premium.
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
                label: 'Affordability percentage',
                prior: formatPercent(irs2025.employerAffordabilityPercentage.rate),
                current: formatPercent(irs2026.employerAffordabilityPercentage.rate),
                note: 'The higher percentage raises the income-based threshold.',
              },
              {
                label: 'Enhanced premium tax credits',
                prior: 'Enhanced subsidies available',
                current: `Expired after ${priorYear}; ${formatNumber(aca2026.subsidyCliffFplPercent)}% FPL cliff generally applies`,
                note: `Expiration date in the dataset: ${formatDate(aca2026.enhancedSubsidies.expiredOn)}.`,
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Worked example</h2>
          <p>
            A single worker earns {formatMoney(30000)} in household income and pays{' '}
            {formatMoney(200)} a month for the lowest-cost self-only plan. The plan meets minimum
            value.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Employer affordability worked example</caption>
              <tbody>
                <tr>
                  <th scope="row">Annual employee-only premium</th>
                  <td>{formatMoney(example.annualEmployeeOnlyPremium)}</td>
                </tr>
                <tr>
                  <th scope="row">Affordability threshold</th>
                  <td>
                    {formatMoney(example.annualThreshold)} (
                    {formatPercent(example.affordabilityRate)} of household income)
                  </td>
                </tr>
                <tr>
                  <th scope="row">Employee-only result</th>
                  <td>{example.employeeCoverageAffordable ? 'Affordable' : 'Not affordable'}</td>
                </tr>
                <tr>
                  <th scope="row">Annual family premium</th>
                  <td>
                    {example.annualFamilyPremium === null
                      ? 'Not entered'
                      : formatMoney(example.annualFamilyPremium)}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Family coverage result</th>
                  <td>
                    {example.familyCoverageAffordable === null
                      ? 'Not tested'
                      : example.familyCoverageAffordable
                        ? 'Affordable'
                        : 'Not affordable'}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Marketplace signal</th>
                  <td>
                    {example.employeeSubsidyEligibility === 'likely-qualify'
                      ? 'Employee may qualify'
                      : example.familySubsidyEligibility === 'likely-qualify'
                        ? 'Family members may qualify'
                        : example.subsidyEligibility === 'likely-none'
                          ? 'No subsidy expected'
                          : 'Needs minimum value answer'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="stat-note">
            In this example the employee-only premium is affordable, but the family premium is
            above the same threshold. The family glitch fix therefore lets the spouse and children
            seek Marketplace help while the employee stays on the employer plan.
          </p>
          <IndependenceNote />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Three honest caveats</h2>
          <ol>
            <li>
              The plan year matters. A premium quoted for a different plan year can change the
              answer, even when the percentage stays the same.
            </li>
            <li>
              Household income for the Marketplace is not the same as your salary. Use the tax
              household figure and include the income sources the application asks for.
            </li>
            <li>
              This is an educational estimate. It does not check the{' '}
              {formatNumber(aca2026.subsidyCliffFplPercent)}% federal poverty level cliff,
              immigration status, or every other coverage rule. The Marketplace makes the
              eligibility decision, and a tax preparer can check the income rules for your return.
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
              <Link href="/calculators/medicare-savings-program-extra-help/">
                Medicare Savings Program and Extra Help limits
              </Link>
            </li>
            <li>
              <Link href="/calculators/">All Medicare calculators</Link>
            </li>
            <li>
              <a href={sources.irsPtcQa} target="_blank" rel="noreferrer">
                IRS premium tax credit questions and answers
              </a>
            </li>
            <li>
              <a href={sources.healthcareGov} target="_blank" rel="noreferrer">
                HealthCare.gov Marketplace application
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
                label: 'Affordability percentage',
                value: formatPercent(irs2026.employerAffordabilityPercentage.rate),
                source: sources.irsRp2025_25,
                sourceLabel: 'IRS revenue procedure',
              },
              {
                label: 'Family member affordability rule',
                value: 'Family premium compared with the same income share',
                source: sources.treasuryFamilyGlitch,
                sourceLabel: 'Treasury final rule (Federal Register)',
              },
              {
                label: 'Prior-year affordability percentage',
                value: formatPercent(irs2025.employerAffordabilityPercentage.rate),
                source: sources.irsRp2024_35,
                sourceLabel: 'IRS revenue procedure',
              },
              {
                label: 'Enhanced premium tax credit status',
                value: aca2026.enhancedSubsidies.status,
                source: sources.crsEnhancedPtc,
                sourceLabel: 'Congressional Research Service',
              },
              {
                label: 'Subsidy cliff',
                value: `${formatNumber(aca2026.subsidyCliffFplPercent)}% of FPL`,
                source: sources.crsEnhancedPtc,
                sourceLabel: 'Congressional Research Service',
              },
              {
                label: 'Marketplace application',
                value: 'Official application and plan data',
                source: sources.healthcareGov,
                sourceLabel: 'HealthCare.gov',
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <CiteThisPage title={`Is employer health insurance affordable ${year}?`} path="/calculators/employer-coverage-affordability/" />
          <EmailCapture />
          <TakeHomePack pageTitle={`Is employer health insurance affordable ${year}?`} />
          <p className="disclaimer">
            MedicareClear is independent and is not connected to Medicare.gov, the IRS, or any
            government agency. This page is educational and does not provide tax, legal, or
            insurance advice. Verify the plan year and your household income with the official
            sources before you act.
          </p>
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}