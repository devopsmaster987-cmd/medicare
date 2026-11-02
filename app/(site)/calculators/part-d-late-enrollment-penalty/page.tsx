import type { Metadata } from 'next';
import Link from 'next/link';
import { TakeHomePack } from '@/components/action/take-home-pack';
import { AdSlot } from '@/components/ads/ad-slot';
import { PartDPenaltyCalculator } from './calculator';
import {
  PartDCoverageDecision,
  PartDPenaltyTimeline,
  PartDWorkedExampleGraphic,
} from '@/components/calc/part-d-figures';
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
import { glossaryTipsFor } from '@/data/glossary';
import { partD2025 } from '@/data/medicare-part-d-2025';
import { partD2026 } from '@/data/medicare-part-d';
import { partDPenalty } from '@/data/penalties';
import { sources } from '@/data/sources';
import { dataVerifiedOn, figureYears } from '@/data/verified';
import { partDPenaltyCalculator } from '@/lib/formulas/part-d-penalty';
import { calculatorSchema, medicalWebPageSchema } from '@/lib/schema';
import { clampMetaDescription } from '@/lib/seo';
import { formatMoney, formatPercent } from '@/lib/utils';

const year = figureYears.current;
const priorYear = figureYears.prior;
const path = '/calculators/part-d-late-enrollment-penalty/';
const glossaryTips = glossaryTipsFor(['Part D', 'Creditable coverage', 'Extra Help']);

export const metadata: Metadata = {
  title: { absolute: `Part D late enrollment penalty calculator (${year})` },
  description: clampMetaDescription(
    `Use the Part D late enrollment penalty calculator to see the ${year} monthly penalty, the annual cost, and whether creditable drug coverage can remove it.`,
  ),
  alternates: { canonical: path },
  openGraph: {
    type: 'website',
    title: `Part D late enrollment penalty calculator (${year})`,
    description:
      'Estimate the monthly and annual Part D penalty, compare 10-year and 20-year totals, and check whether creditable coverage or a short gap can remove it.',
    url: path,
    images: [
      {
        url: `/og${path.replace(/\/$/, '')}.png`,
        width: 1200,
        height: 630,
        alt: `Part D late enrollment penalty calculator (${year})`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/og${path.replace(/\/$/, '')}.png`],
  },
};

const oneYear = partDPenaltyCalculator({ monthsWithoutCoverage: 12 });
const twoYearsWithPlan = partDPenaltyCalculator({
  monthsWithoutCoverage: 24,
  planPremium: partD2026.baseBeneficiaryPremium.amount,
});
const shortGap = partDPenaltyCalculator({ monthsWithoutCoverage: 2, gapUnder63Days: true });
const priorOneYear = partDPenaltyCalculator({
  monthsWithoutCoverage: 12,
  basePremium: partD2025.baseBeneficiaryPremium.amount,
});

const timelineRows = [1, 6, 12, 24, 36].map((months) => {
  const result = partDPenaltyCalculator({ monthsWithoutCoverage: months });
  return {
    label: `${months} month${months === 1 ? '' : 's'}`,
    penalty: result.monthlyPenalty,
    rate: result.penaltyRate,
  };
});

const faqItems = [
  {
    question: 'Can Part D penalty be waived?',
    answer:
      'Not automatically. Medicare may correct or remove the penalty if its records or the plan’s written notice show creditable drug coverage for the gap. Ask the plan for the notice, then contact Medicare and the plan for a review. Not knowing the rule is not usually a reason to remove the penalty.',
  },
  {
    question: 'What are creditable drug coverage gap days?',
    answer:
      'The penalty is built from full uncovered months, and the trigger is generally a continuous gap of 63 days or more after your initial enrollment period. A shorter continuous gap does not usually start a Part D penalty. Keep the exact start and end dates because the plan and Medicare use their records, not a rounded memory.',
  },
  {
    question: 'How is the Part D penalty calculated?',
    answer:
      'Medicare multiplies 1% of the national base beneficiary premium by the number of full months without creditable coverage. It then rounds the monthly amount to the nearest 10 cents. At the current base premium, 12 uncovered months add the amount shown in the calculator.',
  },
  {
    question: `What is the Part D penalty for ${year} per month?`,
    answer: `At the ${year} national base beneficiary premium of ${formatMoney(partD2026.baseBeneficiaryPremium.amount)}, one uncovered month adds about ${formatMoney(partDPenaltyCalculator({ monthsWithoutCoverage: 1 }).monthlyPenalty)} a month. Twelve uncovered months add about ${formatMoney(oneYear.monthlyPenalty)} a month.`,
  },
  {
    question: 'Does the Part D penalty go away if I switch plans?',
    answer:
      'No. The penalty generally follows you between Part D plans because it is based on the national base beneficiary premium, not the plan’s own premium. Changing plans can change the plan premium, but it usually does not remove a valid late enrollment penalty.',
  },
  {
    question: 'What counts as creditable drug coverage?',
    answer:
      'Creditable coverage is prescription drug coverage the plan expects to pay, on average, at least as much as standard Part D coverage. Employer retiree coverage, some union plans, and certain other drug plans may qualify. The plan must tell you in writing each year whether its coverage is creditable.',
  },
  {
    question: 'How do I ask for a Part D penalty review?',
    answer:
      'Gather the plan’s written creditable coverage notice, your Part D enrollment dates, and any letters about the penalty. Contact Medicare and the plan and ask which months were counted. If the notice covers the gap, ask for the penalty to be corrected and keep a copy of everything you send.',
  },
  {
    question: 'Does Extra Help pay the Part D late enrollment penalty?',
    answer:
      'Extra Help can lower Part D premiums and cost sharing, but it does not automatically erase a late enrollment penalty. Ask Social Security and the plan how Extra Help applies to your specific premium and whether any penalty review is pending.',
  },
];

export default function PartDPenaltyPage() {
  return (
    <>
      <JsonLd
        data={[
          calculatorSchema({
            name: `Part D late enrollment penalty calculator ${year}`,
            description:
              'Estimate the Part D late enrollment penalty, the annual cost, and the 10-year and 20-year totals.',
            url: path,
            image: `/og${path.replace(/\/$/, '')}.png`,
          }),
          medicalWebPageSchema({
            name: 'Part D late enrollment penalty calculator',
            description:
              'See the monthly Part D penalty, the annual cost, the 10-year and 20-year totals, and whether creditable coverage or a short gap can remove it.',
            path,
            image: `/og${path.replace(/\/$/, '')}.png`,
            about: ['Medicare Part D', 'Late enrollment penalty', 'Creditable drug coverage'],
            breadcrumb: [
              { name: 'Home', url: '/' },
              { name: 'Calculators', url: '/calculators/' },
              { name: 'Part D late enrollment penalty', url: path },
            ],
          }),
        ]}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators/' },
            { name: 'Part D late enrollment penalty', href: path },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Part D · {year}</p>
          <h1 className="page-title">Part D late enrollment penalty calculator</h1>
          <p className="page-lede">
            See how a gap in creditable drug coverage changes the monthly Part D penalty, then check
            the notice and dates that can remove it.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <div className="wrap">
        <AnswerCapsule>
          The Part D late enrollment penalty calculator adds 1% of the national base beneficiary
          premium for each full month without creditable drug coverage. At the {year} base premium of{' '}
          {formatMoney(partD2026.baseBeneficiaryPremium.amount)}, 12 uncovered months add{' '}
          {formatMoney(oneYear.monthlyPenalty)} a month. The penalty is generally permanent and is
          added to your plan premium.
        </AnswerCapsule>
      </div>

      <section className="section section-tight">
        <div className="wrap">
          <KeyFacts
            caption="Part D penalty key facts"
            rows={[
              {
                label: 'Penalty rate',
                value: `${formatPercent(partDPenalty.ratePerUncoveredMonth.rate)} per month`,
                note: 'Applied to the national base beneficiary premium, not your plan premium.',
              },
              {
                label: `Base beneficiary premium, ${year}`,
                value: formatMoney(partD2026.baseBeneficiaryPremium.amount),
                note: 'The national reference amount for the penalty.',
              },
              {
                label: 'One-year penalty',
                value: `${formatMoney(oneYear.monthlyPenalty)}/month`,
                note: `Adds ${formatMoney(oneYear.annualPenalty)} a year.`,
              },
              {
                label: 'Penalty trigger',
                value: '63 days or more',
                note: 'Generally a continuous gap in creditable drug coverage.',
              },
              {
                label: 'How long it lasts',
                value: 'Generally permanent',
                note: 'It continues while you have Part D, unless Medicare corrects it.',
              },
              {
                label: 'Creditable coverage',
                value: 'Written notice required',
                note: 'The plan decides and must tell you in writing.',
              },
            ]}
          />
        </div>
      </section>

      <div className="wrap">
        <PartDPenaltyCalculator tips={glossaryTips} />
        <AdSlot placement="below-calculator" />
      </div>

      <section className="section">
        <div className="wrap prose">
          <h2>What is the Part D late enrollment penalty</h2>
          <p>
            The Part D late enrollment penalty is a permanent surcharge added to your monthly drug
            plan premium when you go without creditable prescription drug coverage for too long.
            The surcharge is based on the national base beneficiary premium, not on the premium of
            the plan you choose.
          </p>
          <p>
            Because the base premium changes each year, the dollar penalty can change too even if
            your gap does not. The penalty is separate from the Part B late enrollment penalty and
            from the Part D IRMAA surcharge.
          </p>

          <PartDPenaltyTimeline
            rows={timelineRows}
            basePremium={partD2026.baseBeneficiaryPremium.amount}
            sourceUrl={sources.medicarePartDCosts}
            sourceName="Medicare.gov Part D costs"
            checkedOn={dataVerifiedOn}
          />

          <h2>How is Part D penalty calculated</h2>
          <p>
            Medicare multiplies 1% of the national base beneficiary premium by each full month
            without creditable coverage, then rounds the monthly penalty to the nearest 10 cents.
          </p>
          <p>
            The count uses full months. A gap of a few days inside a month does not add a month by
            itself, but the continuous gap still has to be checked against the 63-day trigger. Keep
            the exact coverage dates from the plan.
          </p>
          <aside className="notice" aria-labelledby="method-title">
            <h3 id="method-title">How this was calculated</h3>
            <p>
              Formula: monthly penalty = national base beneficiary premium × 1% × full uncovered
              months, rounded to the nearest 10 cents. For {year}, the base premium is{' '}
              {formatMoney(partD2026.baseBeneficiaryPremium.amount)}. The rate and the 63-day rule
              are checked against{' '}
              <a href={sources.medicarePartDCosts} target="_blank" rel="noreferrer">
                Medicare.gov Part D costs
              </a>
              . The calculator never adds a plan premium unless you enter one.
            </p>
          </aside>

          <h2>Part D penalty {year} per month</h2>
          <p>
            At the {year} base premium, one uncovered month adds{' '}
            {formatMoney(partDPenaltyCalculator({ monthsWithoutCoverage: 1 }).monthlyPenalty)} a
            month. Twelve uncovered months add {formatMoney(oneYear.monthlyPenalty)} a month, or{' '}
            {formatMoney(oneYear.annualPenalty)} a year. Twenty-four uncovered months add{' '}
            {formatMoney(twoYearsWithPlan.monthlyPenalty)} a month.
          </p>
          <p>
            These amounts are the penalty only. Your actual Part D bill also includes the plan
            premium, and it can include an IRMAA surcharge if your income is above the IRMAA
            threshold.
          </p>

          <h2>Can Part D penalty be waived</h2>
          <p>
            The penalty is not waived just because you did not know the rule. It can be corrected if
            the records show creditable coverage for the gap, or if the plan or Medicare made an
            enrollment error. Start with the plan’s written creditable coverage notice and the exact
            dates.
          </p>
          <p>
            Contact Medicare and the plan and ask which months were counted. If the notice covers
            the gap, ask for a review. Keep copies of the notice, the letters, and anything you send.
          </p>

          <PartDCoverageDecision
            sourceUrl={sources.medicareAvoidPenalties}
            sourceName="Medicare.gov late enrollment penalties"
            checkedOn={dataVerifiedOn}
          />

          <h2>What counts as creditable drug coverage</h2>
          <p>
            Creditable coverage is drug coverage that the plan expects to pay, on average, at least
            as much as standard Part D coverage. Employer retiree coverage, some union plans, and
            certain other drug plans may qualify. The plan must tell you in writing each year
            whether its coverage is creditable.
          </p>
          <p>
            Medicare Advantage plans with drug coverage and standalone Part D plans count as Part D
            coverage while they are in force. Dropping that coverage and going without creditable
            drug coverage can start penalty months.
          </p>

          <h2>What to do next</h2>
          <ol>
            <li>
              Find the date your Part D coverage started and the date the prior coverage ended.
              Confirm both with the plan and with{' '}
              <a href={sources.medicarePartDCosts} target="_blank" rel="noreferrer">
                Medicare.gov’s Part D cost page
              </a>
              .
            </li>
            <li>
              If you get Extra Help, ask how it applies to the plan premium. Start with{' '}
              <a href={sources.ssaExtraHelp} target="_blank" rel="noreferrer">
                Social Security’s Extra Help page
              </a>
              .
            </li>
            <li>
              Read the current national base beneficiary premium and plan parameters in the{' '}
              <a href={sources.cms2026PartD} target="_blank" rel="noreferrer">
                CMS Part D premium parameters
              </a>
              .
            </li>
            <li>
              Keep the plan notices and premium records with your tax papers. Part D premiums can
              count toward medical expenses; see{' '}
              <a href={sources.irsPub502} target="_blank" rel="noreferrer">
                IRS Publication 502
              </a>
              .
            </li>
          </ol>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <WhatChanged
            year={year}
            priorYear={priorYear}
            rows={[
              {
                label: 'National base beneficiary premium',
                prior: formatMoney(partD2025.baseBeneficiaryPremium.amount),
                current: formatMoney(partD2026.baseBeneficiaryPremium.amount),
                note: 'The penalty is calculated from this amount.',
              },
              {
                label: 'Penalty after 12 uncovered months',
                prior: formatMoney(priorOneYear.monthlyPenalty),
                current: formatMoney(oneYear.monthlyPenalty),
                note: '1% per month, rounded to the nearest 10 cents.',
              },
              {
                label: 'Part D deductible',
                prior: formatMoney(partD2025.deductible.amount),
                current: formatMoney(partD2026.deductible.amount),
                note: 'Not part of the penalty, but part of the drug cost picture.',
              },
              {
                label: 'Part D out-of-pocket cap',
                prior: formatMoney(partD2025.outOfPocketCap.amount),
                current: formatMoney(partD2026.outOfPocketCap.amount),
                note: 'The cap does not remove the late enrollment penalty.',
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Worked examples</h2>
          <p>
            The first example uses 12 full uncovered months. The second adds a plan premium equal to
            the national base premium so you can see how the penalty sits beside a plan bill. The
            third shows a gap shorter than 63 days.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Part D penalty worked examples</caption>
              <thead>
                <tr>
                  <th scope="col">Input or result</th>
                  <th scope="col">12-month gap</th>
                  <th scope="col">24-month gap</th>
                  <th scope="col">Short gap</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Full uncovered months</th>
                  <td>{oneYear.monthsWithoutCoverage}</td>
                  <td>{twoYearsWithPlan.monthsWithoutCoverage}</td>
                  <td>{shortGap.monthsWithoutCoverage}</td>
                </tr>
                <tr>
                  <th scope="row">Months counted</th>
                  <td>{oneYear.monthsCounted}</td>
                  <td>{twoYearsWithPlan.monthsCounted}</td>
                  <td>{shortGap.monthsCounted}</td>
                </tr>
                <tr>
                  <th scope="row">Penalty rate</th>
                  <td>{formatPercent(oneYear.penaltyRate)}</td>
                  <td>{formatPercent(twoYearsWithPlan.penaltyRate)}</td>
                  <td>{formatPercent(shortGap.penaltyRate)}</td>
                </tr>
                <tr>
                  <th scope="row">Monthly penalty</th>
                  <td>{formatMoney(oneYear.monthlyPenalty)}</td>
                  <td>{formatMoney(twoYearsWithPlan.monthlyPenalty)}</td>
                  <td>{formatMoney(shortGap.monthlyPenalty)}</td>
                </tr>
                <tr>
                  <th scope="row">Annual penalty</th>
                  <td>{formatMoney(oneYear.annualPenalty)}</td>
                  <td>{formatMoney(twoYearsWithPlan.annualPenalty)}</td>
                  <td>{formatMoney(shortGap.annualPenalty)}</td>
                </tr>
                <tr>
                  <th scope="row">Plan premium plus penalty</th>
                  <td>Enter your plan premium</td>
                  <td>{formatMoney(twoYearsWithPlan.totalMonthlyWithPlan ?? 0)}</td>
                  <td>Not applicable</td>
                </tr>
                <tr>
                  <th scope="row">10-year penalty total</th>
                  <td>{formatMoney(oneYear.tenYearPenalty)}</td>
                  <td>{formatMoney(twoYearsWithPlan.tenYearPenalty)}</td>
                  <td>{formatMoney(shortGap.tenYearPenalty)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="stat-note">
            The 24-month example assumes a plan premium of{' '}
            {formatMoney(partD2026.baseBeneficiaryPremium.amount)}, the same as the national base
            premium. Your plan premium is different and is not stored or guessed by this page.
          </p>

          <PartDWorkedExampleGraphic
            months={oneYear.monthsWithoutCoverage}
            rate={oneYear.penaltyRate}
            basePremium={oneYear.basePremium}
            unrounded={oneYear.basePremium * oneYear.penaltyRate}
            rounded={oneYear.monthlyPenalty}
            sourceUrl={sources.medicarePartDCosts}
            sourceName="Medicare.gov Part D costs"
            checkedOn={dataVerifiedOn}
          />
          <IndependenceNote />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Three honest caveats</h2>
          <ol>
            <li>
              The official penalty uses Social Security and plan enrollment records. This page uses
              the months you enter, so check the exact dates before you rely on the number.
            </li>
            <li>
              A plan premium is not a fixed national number. The calculator keeps the penalty and
              the optional plan premium separate so a plan change does not look like a penalty
              change.
            </li>
            <li>
              A review can correct a penalty, but it does not stop the plan from billing it while
              the review is pending. Ask the plan what it expects you to pay in the meantime.
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
              <Link href="/guides/medicare-part-d-late-enrollment-penalty/">
                Medicare Part D late enrollment penalty explained
              </Link>
            </li>
            <li>
              <Link href="/calculators/part-b-late-enrollment-penalty/">
                Part B late enrollment penalty calculator
              </Link>
            </li>
            <li>
              <Link href="/calculators/irmaa-cliff-checker/">IRMAA brackets and surcharge checker</Link>
            </li>
            <li>
              <Link href="/calculators/medicare-savings-program-extra-help/">
                Medicare Savings Program and Extra Help limits
              </Link>
            </li>
            <li>
              <Link href="/guides/part-d-out-of-pocket-cap/">
                Part D out-of-pocket cap for the current year
              </Link>
            </li>
            <li>
              <a href={sources.medicarePartDCosts} target="_blank" rel="noreferrer">
                Medicare.gov: Part D costs
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
                label: 'Part D penalty rate',
                value: `${formatPercent(partDPenalty.ratePerUncoveredMonth.rate)} per full uncovered month`,
                source: sources.medicarePartDCosts,
                sourceLabel: 'Medicare.gov Part D costs',
              },
              {
                label: 'National base beneficiary premium',
                value: formatMoney(partD2026.baseBeneficiaryPremium.amount),
                source: sources.cms2026PartD,
                sourceLabel: 'CMS Part D premium parameters',
              },
              {
                label: 'Penalty trigger',
                value: 'Continuous gap of 63 days or more',
                source: sources.medicareAvoidPenalties,
                sourceLabel: 'Medicare.gov late enrollment penalties',
              },
              {
                label: 'Creditable coverage',
                value: 'Written notice from the plan',
                source: sources.medicarePartDCosts,
                sourceLabel: 'Medicare.gov Part D costs',
              },
              {
                label: 'Annual enrollment period',
                value: 'October 15 through December 7 each year',
                source: sources.medicareEmployer,
                sourceLabel: 'Medicare.gov sign-up rules',
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <CiteThisPage
            title="Part D late enrollment penalty calculator"
            path="/calculators/part-d-late-enrollment-penalty/"
          />
          <EmailCapture />
          <TakeHomePack pageTitle="Part D late enrollment penalty calculator" />
          <p className="disclaimer">
            MedicareClear is independent and is not connected to Medicare.gov, Social Security, or
            any government agency. This page is educational and does not provide legal, tax, or
            insurance advice. Confirm your enrollment dates and coverage with Medicare or the plan
            before you act.
          </p>
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
