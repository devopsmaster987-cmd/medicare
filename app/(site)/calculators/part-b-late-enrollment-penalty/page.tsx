import type { Metadata } from 'next';
import Link from 'next/link';
import { TakeHomePack } from '@/components/action/take-home-pack';
import { AdSlot } from '@/components/ads/ad-slot';
import { PartBPenaltyCalculator } from './calculator';
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
import { partB2025 } from '@/data/medicare-part-b-2025';
import { partB2026 } from '@/data/medicare-part-b';
import { partBPenalty } from '@/data/penalties';
import { sources } from '@/data/sources';
import { figureYears } from '@/data/verified';
import { glossaryTipsFor } from '@/data/glossary';
import { partBPenaltyCalculator } from '@/lib/formulas/part-b-penalty';
import { calculatorSchema } from '@/lib/schema';
import { formatMoney } from '@/lib/utils';
import { site } from '@/data/site';
import { clampMetaDescription } from '@/lib/seo';

const year = figureYears.current;
const priorYear = figureYears.prior;
const path = '/calculators/part-b-late-enrollment-penalty/';
const glossaryTips = glossaryTipsFor(['Part B', 'SEP', 'Creditable coverage']);

export const metadata: Metadata = {
  title: { absolute: `Part B late enrollment penalty calculator (${year})` },
  description: clampMetaDescription( `Part B late enrollment penalty calculator: see the monthly penalty, total premium, and 10-year and 20-year cost from the ${year} standard premium.`),
  alternates: { canonical: path },
  openGraph: {
    title: `Part B late enrollment penalty calculator (${year})`,
    description: `Estimate the monthly, annual, 10-year, and 20-year Part B penalty, then check the Special Enrollment Period and creditable coverage rules.`,
    url: path,
    images: [
      {
        url: `/og${path}.png`,
        width: 1200,
        height: 630,
        alt: `Part B late enrollment penalty calculator (${year})`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/og${path}.png`],
  },
};

const example = partBPenaltyCalculator({ monthsDelayed: 24 });
const oneYear = partBPenaltyCalculator({ monthsDelayed: 12 });
const priorOneYear = partBPenaltyCalculator({
  monthsDelayed: 12,
  standardPremium: partB2025.standardPremium.amount,
});

const faqItems = [
  {
    question: 'Medicare Part B penalty per month',
    answer: `At the ${year} standard premium of ${formatMoney(partB2026.standardPremium.amount)}, one full 12-month period adds ${formatMoney(oneYear.monthlyPenalty)} a month. The penalty is 10% of the standard premium for each full 12-month period without creditable coverage.`,
  },
  {
    question: 'Part B special enrollment period 8 months',
    answer:
      'If you had active employer coverage based on current employment, you generally have eight months after that coverage ends to enroll in Part B without a penalty. The eight-month clock can start before COBRA or retiree coverage ends, so confirm your dates with Social Security.',
  },
  {
    question: 'Part B creditable coverage exemption',
    answer:
      'Creditable coverage can let you delay Part B without a penalty while you are still covered by the employer plan. The coverage must be at least as good as Medicare for the benefit you delayed, and you usually need the plan\'s written creditable coverage notice.',
  },
  {
    question: `What is the Part B penalty for ${year}?`,
    answer: `The penalty is 10% of the ${year} standard premium for each full 12-month period. At ${formatMoney(partB2026.standardPremium.amount)} a month, one full year is ${formatMoney(oneYear.monthlyPenalty)} a month, or ${formatMoney(oneYear.annualPenalty)} a year. The dollar amount changes when the standard premium changes.`,
  },
  {
    question: 'Does the Part B penalty ever go away?',
    answer:
      'The penalty generally stays with you for as long as you have Part B. It is not a one-time fee. If you believe the penalty is wrong because of an employer coverage error or a qualifying event, ask Social Security to review the decision.',
  },
  {
    question: 'How do I appeal a Part B penalty?',
    answer:
      'Start with Social Security and ask for the dates and coverage information used in the decision. Provide the employer coverage end date, the creditable coverage notice, and any Special Enrollment Period proof. Ask what review or appeal step applies to your case.',
  },
];

export default function PartBPenaltyPage() {
  return (
    <>
      <JsonLd
        data={calculatorSchema({
          name: `Part B late enrollment penalty calculator ${year}`,
          description:
            'Estimate the Part B late enrollment penalty, the total monthly premium, and the 10-year and 20-year cost.',
          url: `${site.siteUrl}${path}`,
        })}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators/' },
            { name: 'Part B late enrollment penalty', href: path },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Part B · {year}</p>
          <h1 className="page-title">Part B late enrollment penalty calculator</h1>
          <p className="page-lede">
            See how a delay changes the monthly premium, then check whether creditable coverage or a
            Special Enrollment Period can keep the penalty off your record.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <div className="wrap">
        <AnswerCapsule>
          The Part B late enrollment penalty calculator adds 10% to the standard monthly premium for
          each full 12-month period you delayed without creditable coverage. At the {year} standard
          premium of {formatMoney(partB2026.standardPremium.amount)}, one full year adds{' '}
          {formatMoney(oneYear.monthlyPenalty)} a month, or {formatMoney(oneYear.annualPenalty)} a
          year, and the penalty generally lasts as long as you have Part B.
        </AnswerCapsule>
      </div>

      <section className="section section-tight">
        <div className="wrap">
          <KeyFacts
            caption="Part B penalty key facts"
            rows={[
              {
                label: 'Penalty rate',
                value: '10% per full year',
                note: 'Only full 12-month periods count.',
              },
              {
                label: `Standard premium, ${year}`,
                value: formatMoney(partB2026.standardPremium.amount),
                note: 'The penalty is a percentage of this amount.',
              },
              {
                label: 'One-year penalty',
                value: `${formatMoney(oneYear.monthlyPenalty)}/month`,
                note: `Adds ${formatMoney(oneYear.annualPenalty)} a year.`,
              },
              {
                label: 'Special Enrollment Period',
                value: '8 months',
                note: 'Usually after active employer coverage ends.',
              },
              {
                label: 'Is the penalty permanent?',
                value: 'Generally yes',
                note: 'It stays while you have Part B, unless SSA corrects it.',
              },
            ]}
          />
        </div>
      </section>

      <div className="wrap">
        <PartBPenaltyCalculator tips={glossaryTips} />
        <AdSlot placement="below-calculator" />
      </div>

      <section className="section">
        <div className="wrap prose">
          <h2>How much is the Part B penalty</h2>
          <p>
            The Part B penalty is 10% of the standard premium for each full 12-month period you did
            not have Part B and did not have creditable coverage. A delay of 11 months adds nothing
            under this rule because it is not a full 12-month period.
          </p>
          <p>
            At the {year} standard premium of {formatMoney(partB2026.standardPremium.amount)}, one
            full year adds {formatMoney(oneYear.monthlyPenalty)} a month. Two full years add{' '}
            {formatMoney(example.monthlyPenalty)} a month. The penalty is added to the standard
            premium, not charged as a separate bill.
          </p>

          <h2>Part B penalty 10 year cost</h2>
          <p>
            A one-year delay adds {formatMoney(oneYear.tenYearPenalty)} over 10 years at the current
            premium. This is a planning view: it multiplies the annual penalty by 10 and does not
            assume future premium increases or changes in your coverage.
          </p>

          <h2>Part B penalty 20 year cost</h2>
          <p>
            The same one-year delay adds {formatMoney(oneYear.twentyYearPenalty)} over 20 years at
            the current premium. A two-year delay is larger because the penalty rate is 20% instead
            of 10%.
          </p>

          <h2>How is the Part B penalty calculated</h2>
          <p>
            First, count only full 12-month periods. Second, multiply that number by 10%. Third,
            multiply the result by the current standard premium. Finally, add the penalty to the
            standard premium to get the total monthly amount.
          </p>
          <p>
            Social Security may round the final premium, so the official amount can be a few cents
            different from the unrounded math shown here.
          </p>

          <h2>Can I avoid the Part B penalty</h2>
          <p>
            You may avoid the penalty if you qualify for a Special Enrollment Period or another
            recognized exception. Active employer coverage based on current employment is the most
            common path, but the plan must be creditable and the enrollment window still matters.
          </p>
          <p>
            COBRA and retiree coverage usually do not create the same eight-month Special Enrollment
            Period. Do not delay Part B just because you have COBRA. Confirm the rules with Social
            Security and the employer plan before the window closes.
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
                note: 'The penalty is recalculated against the current standard premium.',
              },
              {
                label: 'One full-year penalty',
                prior: formatMoney(priorOneYear.monthlyPenalty),
                current: formatMoney(oneYear.monthlyPenalty),
                note: '10% of the standard premium.',
              },
              {
                label: 'Part B deductible',
                prior: formatMoney(partB2025.deductible.amount),
                current: formatMoney(partB2026.deductible.amount),
                note: 'Not part of the penalty, but part of the Part B cost picture.',
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Worked example</h2>
          <p>
            A person delayed Part B for 24 months without creditable coverage. The delay includes two
            full 12-month periods, so the penalty rate is 20%.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Part B penalty worked example</caption>
              <tbody>
                <tr>
                  <th scope="row">Months delayed</th>
                  <td>{example.monthsDelayed}</td>
                </tr>
                <tr>
                  <th scope="row">Full 12-month periods</th>
                  <td>{example.fullTwelveMonthPeriods}</td>
                </tr>
                <tr>
                  <th scope="row">Penalty rate</th>
                  <td>{example.penaltyRate * 100}%</td>
                </tr>
                <tr>
                  <th scope="row">Monthly penalty</th>
                  <td>{formatMoney(example.monthlyPenalty)}</td>
                </tr>
                <tr>
                  <th scope="row">Total monthly premium</th>
                  <td>{formatMoney(example.totalMonthlyPremium)}</td>
                </tr>
                <tr>
                  <th scope="row">10-year penalty total</th>
                  <td>{formatMoney(example.tenYearPenalty)}</td>
                </tr>
                <tr>
                  <th scope="row">20-year penalty total</th>
                  <td>{formatMoney(example.twentyYearPenalty)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="stat-note">
            The unrounded math here shows {formatMoney(example.totalMonthlyPremium)}. Social Security
            may round the final premium by a few cents.
          </p>
          <IndependenceNote />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Three honest caveats</h2>
          <ol>
            <li>
              The penalty depends on your exact enrollment dates. This calculator asks for months,
              but Social Security uses the month you were first eligible to enroll and the month
              your coverage actually started.
            </li>
            <li>
              Creditable coverage is a plan fact, not a guess. Ask the employer or plan for a
              written notice and keep it with your Medicare records.
            </li>
            <li>
              This is an educational estimate. It does not decide a Special Enrollment Period or an
              exception. Social Security makes the final decision, and the premium can change when
              the standard premium changes.
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
              <Link href="/calculators/irmaa-cliff-checker/">IRMAA brackets and surcharge checker</Link>
            </li>
            <li>
              <Link href="/calculators/medicare-vs-aca/">
                Medicare vs ACA: Medicare or Marketplace at 65
              </Link>
            </li>
            <li>
              <Link href="/calculators/employer-coverage-affordability/">
                Employer coverage affordability
              </Link>
            </li>
            <li>
              <a href={sources.medicareAvoidPenalties} target="_blank" rel="noreferrer">
                Medicare.gov: avoid late enrollment penalties
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
                label: 'Part B penalty rate',
                value: `${partBPenalty.ratePerFullYear.rate * 100}% per full 12-month period`,
                source: sources.medicareAvoidPenalties,
                sourceLabel: 'Medicare.gov late enrollment penalties',
              },
              {
                label: 'Part B standard premium',
                value: formatMoney(partB2026.standardPremium.amount),
                source: sources.cms2026AB,
                sourceLabel: 'CMS Part B premium fact sheet',
              },
              {
                label: 'Special Enrollment Period',
                value: '8 months after active employer coverage ends',
                source: sources.medicareEmployer,
                sourceLabel: 'Medicare.gov sign-up rules',
              },
              {
                label: 'General Enrollment Period',
                value: 'January 1 through March 31 each year',
                source: sources.medicareAvoidPenalties,
                sourceLabel: 'Medicare.gov late enrollment penalties',
              },
              {
                label: 'Creditable coverage',
                value: 'Written plan notice required',
                source: sources.medicareEmployer,
                sourceLabel: 'Medicare.gov sign-up rules',
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <CiteThisPage title={'Part B late enrollment penalty calculator'} path="/calculators/part-b-late-enrollment-penalty/" />
          <EmailCapture />
          <TakeHomePack pageTitle="Part B late enrollment penalty calculator" />
          <p className="disclaimer">
            MedicareClear is independent and is not connected to Medicare.gov, Social Security, or
            any government agency. This page is educational and does not provide legal, tax, or
            insurance advice. Confirm your enrollment dates and coverage with Social Security before
            you act.
          </p>
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}