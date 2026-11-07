import type { Metadata } from 'next';
import Link from 'next/link';
import { TakeHomePack } from '@/components/action/take-home-pack';
import { AdSlot } from '@/components/ads/ad-slot';
import { PartAPremiumCalculator } from './calculator';
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
import { contactByKey } from '@/data/contacts';
import { partA2025 } from '@/data/medicare-part-a-2025';
import { partA2026 } from '@/data/medicare-part-a';
import { sources } from '@/data/sources';
import { dataVerifiedOn, figureYears } from '@/data/verified';
import { partAPremiumCalculator } from '@/lib/formulas/part-a-premium';
import { calculatorSchema, medicalWebPageSchema } from '@/lib/schema';
import { clampMetaDescription } from '@/lib/seo';
import { formatMoney } from '@/lib/utils';

const year = figureYears.current;
const priorYear = figureYears.prior;
const path = '/calculators/part-a-premium/';
const glossaryTips = glossaryTipsFor([
  'Part A',
  'Work credits',
  'Late enrollment penalty',
  'Premium-free Part A',
]);

export const metadata: Metadata = {
  title: { absolute: `Do I have to pay for Medicare Part A? (${year})` },
  description: clampMetaDescription(
    `Do I have to pay for Medicare Part A? Enter your work quarters to see the ${year} premium, whether a spouse's work makes it free, and the late penalty.`,
  ),
  alternates: { canonical: path },
  openGraph: {
    type: 'website',
    title: `Do I have to pay for Medicare Part A? (${year})`,
    description:
      'Check the Medicare Part A premium by work quarters, see whether a spouse qualifies you for free Part A, and estimate any late enrollment penalty.',
    url: path,
    images: [
      {
        url: `/og${path.replace(/\/$/, '')}.png`,
        width: 1200,
        height: 630,
        alt: `Medicare Part A premium calculator (${year})`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/og${path.replace(/\/$/, '')}.png`],
  },
};

const free = partAPremiumCalculator({ ownQuarters: 40 });
const reduced = partAPremiumCalculator({ ownQuarters: 35 });
const withSpouse = partAPremiumCalculator({
  ownQuarters: 20,
  married: true,
  spouseQuarters: 40,
});
const delayed = partAPremiumCalculator({ ownQuarters: 35, yearsDelayed: 2 });
const full = partAPremiumCalculator({ ownQuarters: 20 });

const faqItems = [
  {
    question: 'Is Medicare Part A free at 65?',
    answer:
      'For most people, yes. If you or your spouse worked and paid Medicare taxes for 40 quarters, Part A has no monthly premium. You still pay Part B premiums, and hospital costs like the deductible still apply.',
  },
  {
    question: 'How many quarters to get free Part A?',
    answer:
      `Forty quarters, about 10 years of work where you paid Medicare taxes. Thirty to 39 quarters buy the reduced premium of ${formatMoney(partA2026.reducedPremium.amount)} a month in ${year}, and fewer than 30 quarters cost ${formatMoney(partA2026.fullPremium.amount)} a month.`,
  },
  {
    question: 'Can I delay Part A enrollment?',
    answer:
      'Usually you can, but only without a penalty if you or your spouse are still working with employer group coverage. If you must buy Part A and wait, a 10% penalty applies for twice the number of years you delayed. People with an HSA should also know that premium-free Part A can start up to six months earlier.',
  },
  {
    question: 'Can a spouse make Part A free?',
    answer:
      'In many cases yes. A current spouse’s record can lower or remove your premium, and some divorced and widowed spouses can also count a former spouse’s record. Social Security applies marriage-length rules, so confirm your case with Social Security before you apply.',
  },
  {
    question: 'How do I check my quarters of coverage?',
    answer: `Sign in to your Social Security account and review your earnings history, or call ${contactByKey.ssa.phone}. The quarter count comes from the taxes you paid on earnings, not from how many jobs you held.`,
  },
  {
    question: 'Is the Part A premium deducted from Social Security?',
    answer:
      'If you get Social Security benefits, Social Security can deduct the Part A premium from your monthly check. If you are not getting benefits, you will get a bill from Medicare. Either way the amount is the same tier shown here.',
  },
];

export default function PartAPremiumPage() {
  return (
    <>
      <JsonLd
        data={[
          calculatorSchema({
            name: `Medicare Part A premium calculator ${year}`,
            description:
              'Check the Medicare Part A premium from work quarters, a spouse’s record, and any late enrollment penalty.',
            url: path,
            image: `/og${path.replace(/\/$/, '')}.png`,
          }),
          medicalWebPageSchema({
            name: 'Do I have to pay for Medicare Part A?',
            description:
              `See whether 40 work quarters make Part A free, what 30 to 39 quarters cost in ${year}, and how the Part A late enrollment penalty works.`,
            path,
            image: `/og${path.replace(/\/$/, '')}.png`,
            about: ['Medicare Part A', 'Premium-free Part A', 'Work credits'],
            breadcrumb: [
              { name: 'Home', url: '/' },
              { name: 'Calculators', url: '/calculators/' },
              { name: 'Medicare Part A premium', url: path },
            ],
          }),
        ]}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators/' },
            { name: 'Medicare Part A premium', href: path },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Part A · {year}</p>
          <h1 className="page-title">Do I have to pay for Medicare Part A?</h1>
          <p className="page-lede">
            Enter your work quarters, and your spouse’s if you are married, to see your Part A
            premium, whether your work makes Part A free, and any late enrollment penalty.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <div className="wrap">
        <AnswerCapsule>
          Do I have to pay for Medicare Part A? Most people do not: 40 work quarters make it free.
          In {year}, 30 to 39 quarters cost {formatMoney(partA2026.reducedPremium.amount)} a month
          and fewer than 30 cost {formatMoney(partA2026.fullPremium.amount)}. Enter your quarters to
          see your premium, any spouse help, and a late penalty.
        </AnswerCapsule>
      </div>

      <section className="section section-tight">
        <div className="wrap">
          <KeyFacts
            caption="Part A premium key facts"
            rows={[
              {
                label: '40 or more quarters',
                value: `${formatMoney(partA2026.standardPremium.amount)}/month`,
                note: 'Premium-free Part A for you or your spouse’s work record.',
              },
              {
                label: '30 to 39 quarters',
                value: `${formatMoney(partA2026.reducedPremium.amount)}/month`,
                note: `About ${formatMoney(partA2026.reducedPremium.amount * 12)} a year.`,
              },
              {
                label: 'Fewer than 30 quarters',
                value: `${formatMoney(partA2026.fullPremium.amount)}/month`,
                note: `About ${formatMoney(partA2026.fullPremium.amount * 12)} a year.`,
              },
              {
                label: 'Late enrollment penalty',
                value: '10%, twice the years delayed',
                note: 'Only if you must buy Part A and delay past your first chance.',
              },
              {
                label: 'Where quarters come from',
                value: 'Medicare taxes on earnings',
                note: 'Social Security counts calendar quarters you paid Medicare tax.',
              },
              {
                label: 'Part B is separate',
                value: 'Always has a premium',
                note: 'Work history does not remove the Part B premium.',
              },
            ]}
          />
        </div>
      </section>

      <div className="wrap">
        <PartAPremiumCalculator tips={glossaryTips} />
        <AdSlot placement="below-calculator" />
      </div>

      <section className="section">
        <div className="wrap prose">
          <h2>How much is Medicare Part A</h2>
          <p>
            Most people pay nothing for Part A because 40 or more quarters of Medicare-covered work
            make it premium-free. If you have fewer quarters, Part A becomes a monthly bill: $
            {partA2026.reducedPremium.amount} a month from 30 to 39 quarters, and $
            {partA2026.fullPremium.amount} a month below 30 quarters for {year}. That is the whole
            Medicare Part A cost of having the coverage: the premium decides whether you get a
            bill, and the deductible below decides what a hospital stay costs.
          </p>
          <p>
            A premium does not change what Part A covers. Hospital deductible, coinsurance, and the
            skilled nursing amounts are the same for everyone. The premium only decides whether you
            get a bill for having the coverage.
          </p>

          <h2>Part A premium by quarters</h2>
          <p>
            Social Security counts calendar quarters in which you earned enough and paid Medicare
            tax. Forty quarters is about 10 years of full-time work. A spouse’s quarters can raise
            your count in many marriages, divorces, and widowhoods, and the calculator above
            combines the two records when you say you are married. This Part A premium calculator
            uses only the tier rule: higher record wins, then the quarter count picks the price.
          </p>

          <div className="table-scroll">
            <table className="fact-table">
              <caption>Part A premium by quarters of coverage</caption>
              <thead>
                <tr>
                  <th scope="col">Quarters used</th>
                  <th scope="col">Tier</th>
                  <th scope="col">Monthly premium</th>
                  <th scope="col">Annual premium</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">40 or more</th>
                  <td>Premium-free</td>
                  <td>{formatMoney(free.monthlyPremium)}</td>
                  <td>{formatMoney(free.annualPremium)}</td>
                </tr>
                <tr>
                  <th scope="row">30 to 39</th>
                  <td>Reduced premium</td>
                  <td>{formatMoney(reduced.monthlyPremium)}</td>
                  <td>{formatMoney(reduced.annualPremium)}</td>
                </tr>
                <tr>
                  <th scope="row">Fewer than 30</th>
                  <td>Full premium</td>
                  <td>{formatMoney(full.monthlyPremium)}</td>
                  <td>{formatMoney(full.annualPremium)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="stat-note">
            Source:{' '}
            <a href={sources.cms2026AB} target="_blank" rel="noreferrer">
              CMS, {year} Medicare Parts A &amp; B premiums and deductibles
            </a>
            , checked {dataVerifiedOn}.
          </p>

          <h2>How to get free Part A</h2>
          <p>
            The plain path is 40 quarters of your own work. If you are short, a spouse’s record can
            close the gap in many cases, and some divorced and widowed spouses can use a former
            spouse’s record. People who are already entitled to Social Security retirement or
            disability benefits generally get premium-free Part A automatically.
          </p>
          <p>
            Low-income help is a separate door. A Medicare Savings Program can pay your Part A and
            Part B premiums for you, and Extra Help can lower drug costs. The{' '}
            <Link href="/calculators/medicare-savings-program-extra-help/">
              Medicare Savings Program calculator
            </Link>{' '}
            checks those limits by state.
          </p>

          <aside className="notice" aria-labelledby="method-title">
            <h3 id="method-title">How this was calculated</h3>
            <p>
              Formula: quarters used = the higher of your own quarters and, if married, your
              spouse’s quarters. 40 or more → {formatMoney(partA2026.standardPremium.amount)}; 30
              to 39 → {formatMoney(partA2026.reducedPremium.amount)}; fewer than 30 →{' '}
              {formatMoney(partA2026.fullPremium.amount)}. If you delayed and must buy Part A, the
              penalty is 10% of the monthly premium, payable for twice the number of full years
              delayed. Tier amounts come from the{' '}
              <a href={sources.cms2026AB} target="_blank" rel="noreferrer">
                CMS {year} fact sheet
              </a>
              . Social Security makes the official determination from your earnings record.
            </p>
          </aside>

          <h2>What to do next</h2>
          <ol>
            <li>
              Open your{' '}
              <a href={sources.ssaEarningsRecord} target="_blank" rel="noreferrer">
                Social Security account
              </a>{' '}
              and count your years of Medicare-taxed work. Ask your spouse to do the same.
            </li>
            <li>
              Call Social Security at {contactByKey.ssa.phone} and ask for your quarter count
              before you apply for Part A.
            </li>
            <li>
              If the count puts you on a premium, ask whether a Medicare Savings Program in your
              state would pay it. See the{' '}
              <Link href="/calculators/medicare-savings-program-extra-help/">
                MSP and Extra Help limits
              </Link>
              .
            </li>
            <li>
              If you delayed enrollment, ask Social Security whether a penalty or an exception
              applies to your record before you pay anything.
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
                label: 'Reduced Part A premium (30–39 quarters)',
                prior: formatMoney(partA2025.reducedPremium.amount),
                current: formatMoney(partA2026.reducedPremium.amount),
                note: 'The buy-in rate for people with some, but not enough, work credits.',
              },
              {
                label: 'Full Part A premium (under 30 quarters)',
                prior: formatMoney(partA2025.fullPremium.amount),
                current: formatMoney(partA2026.fullPremium.amount),
                note: 'The rate for the smallest work records.',
              },
              {
                label: 'Inpatient hospital deductible',
                prior: formatMoney(partA2025.inpatientDeductible.amount),
                current: formatMoney(partA2026.inpatientDeductible.amount),
                note: 'Per benefit period, not per year, and the same at every premium tier.',
              },
              {
                label: 'Premium-free threshold',
                prior: '40 quarters',
                current: '40 quarters',
                note: 'The free-part-a bar did not change.',
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Worked examples</h2>
          <p>
            Four situations run through the same rule: take the higher record, pick the tier, then
            add a penalty only if you had to buy Part A and delayed.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Part A premium worked examples</caption>
              <thead>
                <tr>
                  <th scope="col">Input or result</th>
                  <th scope="col">40 own quarters</th>
                  <th scope="col">35 own quarters</th>
                  <th scope="col">20 own, spouse 40</th>
                  <th scope="col">35 quarters, 2 years late</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Quarters used</th>
                  <td>{free.quartersUsed}</td>
                  <td>{reduced.quartersUsed}</td>
                  <td>{withSpouse.quartersUsed}</td>
                  <td>{delayed.quartersUsed}</td>
                </tr>
                <tr>
                  <th scope="row">Tier</th>
                  <td>Premium-free</td>
                  <td>Reduced</td>
                  <td>Premium-free</td>
                  <td>Reduced</td>
                </tr>
                <tr>
                  <th scope="row">Monthly premium</th>
                  <td>{formatMoney(free.monthlyPremium)}</td>
                  <td>{formatMoney(reduced.monthlyPremium)}</td>
                  <td>{formatMoney(withSpouse.monthlyPremium)}</td>
                  <td>{formatMoney(delayed.monthlyPremium)}</td>
                </tr>
                <tr>
                  <th scope="row">Monthly penalty</th>
                  <td>{formatMoney(free.monthlyPenalty)}</td>
                  <td>{formatMoney(reduced.monthlyPenalty)}</td>
                  <td>{formatMoney(withSpouse.monthlyPenalty)}</td>
                  <td>{formatMoney(delayed.monthlyPenalty)}</td>
                </tr>
                <tr>
                  <th scope="row">Monthly total during penalty</th>
                  <td>{formatMoney(free.totalMonthlyDuringPenalty)}</td>
                  <td>{formatMoney(reduced.totalMonthlyDuringPenalty)}</td>
                  <td>{formatMoney(withSpouse.totalMonthlyDuringPenalty)}</td>
                  <td>{formatMoney(delayed.totalMonthlyDuringPenalty)}</td>
                </tr>
                <tr>
                  <th scope="row">Annual premium</th>
                  <td>{formatMoney(free.annualPremium)}</td>
                  <td>{formatMoney(reduced.annualPremium)}</td>
                  <td>{formatMoney(withSpouse.annualPremium)}</td>
                  <td>{formatMoney(delayed.annualPremium)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <IndependenceNote />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Three honest caveats</h2>
          <ol>
            <li>
              Social Security makes the official call from your earnings record. This page uses the
              quarter count you enter, so a mismatch between your memory and the record changes the
              answer.
            </li>
            <li>
              Marriage, divorce, and widowhood rules decide when a spouse’s record counts. The
              calculator combines the records when you say you are married, but Social Security
              still applies those rules case by case.
            </li>
            <li>
              A premium tier never changes what Part A covers, and it does not remove the Part B
              premium or the hospital deductible. Budget for those separately.
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
              <Link href="/guides/medicare-part-a-premium/">
                Medicare Part A premium explained for {year}
              </Link>
            </li>
            <li>
              <Link href="/guides/medicare-part-a-40-quarters-rule/">
                The 40 quarters rule for premium-free Part A
              </Link>
            </li>
            <li>
              <Link href="/calculators/medicare-enrollment-dates/">
                When can I sign up for Medicare
              </Link>
            </li>
            <li>
              <Link href="/calculators/medicare-premium-calculator/">
                Medicare premium calculator for the full monthly bill
              </Link>
            </li>
            <li>
              <Link href="/guides/medicare-part-a-late-enrollment-penalty/">
                Part A late enrollment penalty explained
              </Link>
            </li>
            <li>
              <a href={sources.cms2026AB} target="_blank" rel="noreferrer">
                CMS: {year} Medicare Parts A &amp; B premiums and deductibles
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
                label: 'Part A premium, 30–39 quarters',
                value: formatMoney(partA2026.reducedPremium.amount),
                source: sources.cms2026AB,
                sourceLabel: `CMS ${year} Parts A & B fact sheet`,
              },
              {
                label: 'Part A premium, under 30 quarters',
                value: formatMoney(partA2026.fullPremium.amount),
                source: sources.cms2026AB,
                sourceLabel: `CMS ${year} Parts A & B fact sheet`,
              },
              {
                label: 'Premium-free threshold',
                value: '40 or more quarters of coverage',
                source: sources.cms2026AB,
                sourceLabel: `CMS ${year} Parts A & B fact sheet`,
              },
              {
                label: 'Late enrollment penalty',
                value: '10% of the premium, payable for twice the years delayed',
                source: sources.medicareAvoidPenalties,
                sourceLabel: 'Medicare.gov avoid late enrollment penalties',
              },
              {
                label: 'Where to check your quarters',
                value: 'Social Security earnings record',
                source: sources.ssaEarningsRecord,
                sourceLabel: 'Social Security my account',
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <CiteThisPage
            title="Do I have to pay for Medicare Part A?"
            path="/calculators/part-a-premium/"
          />
          <EmailCapture />
          <TakeHomePack pageTitle="Medicare Part A premium calculator" />
          <p className="disclaimer">
            MedicareClear is independent and is not connected to Medicare.gov, Social Security, or
            any government agency. This page is educational and does not provide legal, tax, or
            insurance advice. Confirm your quarters and premium with Social Security before you act.
          </p>
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
