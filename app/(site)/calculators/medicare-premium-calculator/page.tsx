import type { Metadata } from 'next';
import Link from 'next/link';
import { TakeHomePack } from '@/components/action/take-home-pack';
import { AdSlot } from '@/components/ads/ad-slot';
import { MedicarePremiumCalculator } from './calculator';
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
import { partA2025 } from '@/data/medicare-part-a-2025';
import { partA2026 } from '@/data/medicare-part-a';
import { partB2025 } from '@/data/medicare-part-b-2025';
import { partB2026 } from '@/data/medicare-part-b';
import { partD2026 } from '@/data/medicare-part-d';
import { sources } from '@/data/sources';
import { dataVerifiedOn, figureYears } from '@/data/verified';
import { medicarePremiumCalculator } from '@/lib/formulas/medicare-premium';
import { calculatorSchema, medicalWebPageSchema } from '@/lib/schema';
import { clampMetaDescription } from '@/lib/seo';
import { formatMoney } from '@/lib/utils';

const year = figureYears.current;
const priorYear = figureYears.prior;
const path = '/calculators/medicare-premium-calculator/';
const glossaryTips = glossaryTipsFor(['IRMAA', 'MAGI', 'Part B', 'Part D']);

export const metadata: Metadata = {
  title: { absolute: `Medicare premium calculator (${year})` },
  description: clampMetaDescription(
    `Medicare premium calculator: add Part A, Part B, and Part D for ${year}, including any income surcharge, and see the monthly and yearly bill.`,
  ),
  alternates: { canonical: path },
  openGraph: {
    type: 'website',
    title: `Medicare premium calculator (${year})`,
    description:
      'Add up Part A, Part B, and Part D for this year, including the income-based surcharge from two years ago, and see your monthly and yearly Medicare bill.',
    url: path,
    images: [
      {
        url: `/og${path.replace(/\/$/, '')}.png`,
        width: 1200,
        height: 630,
        alt: `Medicare premium calculator (${year})`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/og${path.replace(/\/$/, '')}.png`],
  },
};

const examplePlanPremium = partD2026.baseBeneficiaryPremium.amount;
const standard = medicarePremiumCalculator({
  filingStatus: 'single',
  magiTwoYearsBack: 80000,
  ownQuarters: 40,
  partDEnrolled: true,
  partDPlanPremium: examplePlanPremium,
});
const withIrmaa = medicarePremiumCalculator({
  filingStatus: 'single',
  magiTwoYearsBack: 150000,
  ownQuarters: 40,
  partDEnrolled: true,
  partDPlanPremium: examplePlanPremium,
});
const couple = medicarePremiumCalculator({
  filingStatus: 'marriedJoint',
  magiTwoYearsBack: 250000,
  ownQuarters: 40,
  bothEnrolled: true,
  partDEnrolled: true,
  partDPlanPremium: examplePlanPremium,
});
const buyingPartA = medicarePremiumCalculator({
  filingStatus: 'single',
  magiTwoYearsBack: 40000,
  ownQuarters: 35,
  partDEnrolled: false,
});

const faqItems = [
  {
    question: 'How much does Medicare cost per month?',
    answer: `For most people in ${year}, Medicare costs the Part B premium of ${formatMoney(partB2026.standardPremium.amount)} a month, plus whatever their Part D plan charges, plus ${formatMoney(partA2026.standardPremium.amount)} for Part A when 40 work quarters are met. The calculator above turns those three pieces into one bill.`,
  },
  {
    question: 'Does everyone pay the Part B premium?',
    answer:
      'Almost everyone who takes Part B pays a premium, because it is not tied to work history. It is deducted from your Social Security check if you get one, or billed if you do not. Only a Medicare Savings Program or other public program can pay it for you.',
  },
  {
    question: 'Does Medicare include prescription drug coverage?',
    answer:
      'Original Medicare does not include routine drug coverage. You join a stand-alone Part D plan or a Medicare Advantage plan that includes drugs, and that plan has its own premium, which the calculator adds to your bill.',
  },
  {
    question: 'What income is used for Medicare premiums?',
    answer:
      `Your modified adjusted gross income from two years ago picks your bracket. For the ${year} premium that is the tax return you filed for ${year - 2}, with foreign earned income and tax-exempt interest added back.`,
  },
  {
    question: 'Can I pay Medicare premiums monthly?',
    answer:
      'Yes. Social Security can deduct the Part A and Part B premiums from your monthly check. If you are not getting benefits, Medicare sends a bill, usually every three months for Part B and monthly for a Part A premium.',
  },
  {
    question: 'What is the Medicare premium for a married couple?',
    answer:
      `Part B and Part D are per person. Two enrolled spouses each pay their own, so at the standard ${year} rate that is ${formatMoney(partB2026.standardPremium.amount)} each for Part B before any plan premium, and the income brackets use your joint return.`,
  },
];

export default function MedicarePremiumCalculatorPage() {
  return (
    <>
      <JsonLd
        data={[
          calculatorSchema({
            name: `Medicare premium calculator ${year}`,
            description:
              'Add Part A, Part B, and Part D premiums, including the income surcharge, for a monthly and yearly Medicare bill.',
            url: path,
            image: `/og${path.replace(/\/$/, '')}.png`,
          }),
          medicalWebPageSchema({
            name: 'Medicare premium calculator',
            description:
              'What Medicare really costs each month: Part A from work quarters, Part B standard and income-based surcharge, and Part D plan premium in one bill.',
            path,
            image: `/og${path.replace(/\/$/, '')}.png`,
            about: ['Medicare Part B premium', 'Medicare Part A premium', 'Medicare Part D premium'],
            breadcrumb: [
              { name: 'Home', url: '/' },
              { name: 'Calculators', url: '/calculators/' },
              { name: 'Medicare premium calculator', url: path },
            ],
          }),
        ]}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators/' },
            { name: 'Medicare premium calculator', href: path },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Costs · {year}</p>
          <h1 className="page-title">Medicare premium calculator</h1>
          <p className="page-lede">
            Enter your income from two years ago and your plan choices. You get one itemized bill:
            Part A from work history, Part B with any surcharge, and Part D with your plan premium.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <div className="wrap">
        <AnswerCapsule>
          Medicare premium calculator: add Part A, Part B, and Part D to see the real monthly bill.
          In {year}, most people pay {formatMoney(partA2026.standardPremium.amount)} for Part A,{' '}
          {formatMoney(partB2026.standardPremium.amount)} a month for Part B, and whatever their
          Part D plan charges, plus any income surcharge from two years ago.
        </AnswerCapsule>
      </div>

      <section className="section section-tight">
        <div className="wrap">
          <KeyFacts
            caption="Medicare premium key facts"
            rows={[
              {
                label: 'Part A, 40 or more quarters',
                value: `${formatMoney(partA2026.standardPremium.amount)}/month`,
                note: 'Premium-free for most people and their spouses.',
              },
              {
                label: 'Part A, fewer than 30 quarters',
                value: `${formatMoney(partA2026.fullPremium.amount)}/month`,
                note: `About ${formatMoney(partA2026.fullPremium.amount * 12)} a year if you must buy Part A.`,
              },
              {
                label: 'Part B standard premium',
                value: `${formatMoney(partB2026.standardPremium.amount)}/month`,
                note: 'The same for everyone before the income surcharge.',
              },
              {
                label: 'Part B highest income tier',
                value: `${formatMoney(partB2026.irmaa.single[partB2026.irmaa.single.length - 1].partBTotal)}/month`,
                note: 'Single filers above the top income line, from the surcharge two years ago.',
              },
              {
                label: 'Part B deductible',
                value: `${formatMoney(partB2026.deductible.amount)} per year`,
                note: 'Paid before Part B cost sharing starts.',
              },
              {
                label: 'Part D',
                value: 'Your plan premium + surcharge',
                note: 'Stand-alone drug plans set their own premiums, and the surcharge is billed by Medicare.',
              },
            ]}
          />
        </div>
      </section>

      <div className="wrap">
        <MedicarePremiumCalculator tips={glossaryTips} />
        <AdSlot placement="below-calculator" />
      </div>

      <section className="section">
        <div className="wrap prose">
          <h2>How much is Medicare Part B premium</h2>
          <p>
            The standard Part B premium for {year} is{' '}
            {formatMoney(partB2026.standardPremium.amount)} a month. If your income from two years
            ago sits above the first bracket, an income surcharge is added on top, and the highest
            single-filer tier reaches{' '}
            {formatMoney(
              partB2026.irmaa.single[partB2026.irmaa.single.length - 1].partBTotal,
            )}{' '}
            a month. Part B also has a yearly deductible of{' '}
            {formatMoney(partB2026.deductible.amount)} before cost sharing begins.
          </p>
          <p>
            Work history does not change Part B. Almost everyone pays it, and the amount comes out
            of your Social Security check if you take benefits. The full surcharge chart and the
            two-year lookback are on the{' '}
            <Link href="/calculators/irmaa-cliff-checker/">IRMAA cliff checker</Link>.
          </p>

          <h2>What does Medicare cost per month</h2>
          <p>
            Three pieces make up the bill, and this medicare cost calculator adds them. Part A
            depends on quarters of work and is {formatMoney(partA2026.standardPremium.amount)} for
            most people. Part B is the standard premium plus any surcharge. Part D is your plan’s
            own premium plus the same surcharge, billed separately by Medicare. The calculator adds
            them for one person or a married couple, so the total Medicare premium you see includes
            every household member who is enrolled.
          </p>
          <p>
            Deductibles, copays, and coinsurance sit outside this premium number: the Part B
            deductible is {formatMoney(partB2026.deductible.amount)} for {year}, and the Part A
            inpatient deductible is {formatMoney(partA2026.inpatientDeductible.amount)} per benefit
            period.
          </p>

          <h2>Medicare Part D plan premium</h2>
          <p>
            Stand-alone Part D plans set their own premiums, so this number is yours, not a
            government rate. Enter it in the calculator and the surcharge from your income two years
            ago is added on top. That surcharge is billed by Medicare as a separate line, not
            through your plan, which is why the plan’s bill and Medicare’s bill can differ.
          </p>
          <p>
            People with modest income may qualify for Extra Help, which lowers drug costs directly.
            The{' '}
            <Link href="/calculators/medicare-savings-program-extra-help/">
              Medicare Savings Program and Extra Help calculator
            </Link>{' '}
            checks those income and asset limits.
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
                label: 'Standard Part B premium',
                prior: formatMoney(partB2025.standardPremium.amount),
                current: formatMoney(partB2026.standardPremium.amount),
                note: 'The base monthly figure before any income surcharge.',
              },
              {
                label: 'Part B deductible',
                prior: formatMoney(partB2025.deductible.amount),
                current: formatMoney(partB2026.deductible.amount),
                note: 'What you pay each year before Part B cost sharing starts.',
              },
              {
                label: 'Part A premium, 30–39 quarters',
                prior: formatMoney(partA2025.reducedPremium.amount),
                current: formatMoney(partA2026.reducedPremium.amount),
                note: 'The buy-in rate for people short of 40 work quarters.',
              },
              {
                label: 'Part A premium, under 30 quarters',
                prior: formatMoney(partA2025.fullPremium.amount),
                current: formatMoney(partA2026.fullPremium.amount),
                note: 'The rate for the smallest work records.',
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Worked examples</h2>
          <p>
            Four households run through the same three steps: pick the bracket from income two
            years ago, add Part A from work quarters, then add each person’s Part D plan premium.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Medicare premium worked examples</caption>
              <thead>
                <tr>
                  <th scope="col">Input or result</th>
                  <th scope="col">Single, {formatMoney(80000)}</th>
                  <th scope="col">Single, {formatMoney(150000)}</th>
                  <th scope="col">Joint, {formatMoney(250000)}, both enrolled</th>
                  <th scope="col">Single, {formatMoney(40000)}, 35 quarters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Part A monthly</th>
                  <td>{formatMoney(standard.partA.monthlyPremium)}</td>
                  <td>{formatMoney(withIrmaa.partA.monthlyPremium)}</td>
                  <td>{formatMoney(couple.partA.monthlyPremium)}</td>
                  <td>{formatMoney(buyingPartA.partA.monthlyPremium)}</td>
                </tr>
                <tr>
                  <th scope="row">Part B each person</th>
                  <td>{formatMoney(standard.partB.monthlyPerPerson)}</td>
                  <td>{formatMoney(withIrmaa.partB.monthlyPerPerson)}</td>
                  <td>{formatMoney(couple.partB.monthlyPerPerson)}</td>
                  <td>{formatMoney(buyingPartA.partB.monthlyPerPerson)}</td>
                </tr>
                <tr>
                  <th scope="row">Part D each person</th>
                  <td>{formatMoney(standard.partD.monthlyPerPerson)}</td>
                  <td>{formatMoney(withIrmaa.partD.monthlyPerPerson)}</td>
                  <td>{formatMoney(couple.partD.monthlyPerPerson)}</td>
                  <td>{formatMoney(buyingPartA.partD.monthlyPerPerson)}</td>
                </tr>
                <tr>
                  <th scope="row">Household total each month</th>
                  <td>{formatMoney(standard.totalMonthly)}</td>
                  <td>{formatMoney(withIrmaa.totalMonthly)}</td>
                  <td>{formatMoney(couple.totalMonthly)}</td>
                  <td>{formatMoney(buyingPartA.totalMonthly)}</td>
                </tr>
                <tr>
                  <th scope="row">Household total each year</th>
                  <td>{formatMoney(standard.totalAnnual)}</td>
                  <td>{formatMoney(withIrmaa.totalAnnual)}</td>
                  <td>{formatMoney(couple.totalAnnual)}</td>
                  <td>{formatMoney(buyingPartA.totalAnnual)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="stat-note">
            Source:{' '}
            <a href={sources.cms2026AB} target="_blank" rel="noreferrer">
              CMS, {year} Parts A &amp; B premiums
            </a>{' '}
            and{' '}
            <a href={sources.cms2026PartD} target="_blank" rel="noreferrer">
              CMS, {year} Part D figures
            </a>
            , checked {dataVerifiedOn}. The example plan premium is the national base
            beneficiary premium CMS publishes for {year},{' '}
            {formatMoney(partD2026.baseBeneficiaryPremium.amount)}; your own drug plan charges its
            own rate.
          </p>
          <IndependenceNote />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>What to do next</h2>
          <ol>
            <li>
              Pull last year’s tax return and find your modified adjusted gross income. That one
              number picks your bracket.
            </li>
            <li>
              Find your Part D plan premium on the annual notice from your plan, and enter it above
              so the bill is complete.
            </li>
            <li>
              If your income dropped this year because of a life-changing event, file Form SSA-44
              with Social Security so a lower year is used instead. See the{' '}
              <Link href="/guides/ssa-44-form-irmaa-appeal/">SSA-44 guide</Link>.
            </li>
            <li>
              During October 15 to December 7, compare Part D plans. A cheaper plan for your drugs
              is the fastest legal way to cut this bill.
            </li>
          </ol>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Three honest caveats</h2>
          <ol>
            <li>
              The surcharge comes from the tax return two years ago, so a big sale, conversion, or
              bad year shows up in a future premium, not this one. The calculator shows that
              distance as headroom.
            </li>
            <li>
              Plan premiums and drug costs change every year. This estimate uses the {year}{' '}
              government figures plus the plan premium you enter, not next year’s numbers.
            </li>
            <li>
              Premiums are only half the cost. Deductibles, copays, and out-of-pocket maximums are
              separate, and this page does not estimate them.
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
              <Link href="/calculators/irmaa-cliff-checker/">
                IRMAA brackets and the income surcharge
              </Link>
            </li>
            <li>
              <Link href="/calculators/part-a-premium/">
                Do I have to pay for Medicare Part A
              </Link>
            </li>
            <li>
              <Link href="/calculators/medicare-savings-program-extra-help/">
                Medicare Savings Program and Extra Help limits
              </Link>
            </li>
            <li>
              <Link href="/guides/medicare-part-b-premium-increase/">
                Medicare Part B premium increase explained
              </Link>
            </li>
            <li>
              <Link href="/guides/medicare-part-d-deductible/">
                Part D deductible and premium guide
              </Link>
            </li>
            <li>
              <a href={sources.medicareCostsPub} target="_blank" rel="noreferrer">
                Medicare.gov: Medicare costs at a glance
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
                label: 'Part B standard premium',
                value: formatMoney(partB2026.standardPremium.amount),
                source: sources.cms2026AB,
                sourceLabel: `CMS ${year} Parts A & B fact sheet`,
              },
              {
                label: 'Part B deductible',
                value: formatMoney(partB2026.deductible.amount),
                source: sources.cms2026AB,
                sourceLabel: `CMS ${year} Parts A & B fact sheet`,
              },
              {
                label: 'Part A premiums by quarters',
                value: `${formatMoney(partA2026.reducedPremium.amount)} or ${formatMoney(partA2026.fullPremium.amount)}`,
                source: sources.cms2026AB,
                sourceLabel: `CMS ${year} Parts A & B fact sheet`,
              },
              {
                label: 'Income surcharge tiers',
                value: 'Income from two years ago sets Part B and Part D surcharges',
                source: sources.cms2026PartD,
                sourceLabel: `CMS ${year} Part D premium figures`,
              },
              {
                label: 'How the bill is paid',
                value: 'Social Security deduction or a Medicare bill',
                source: sources.medicareCostsPub,
                sourceLabel: 'Medicare.gov costs at a glance',
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <CiteThisPage
            title="Medicare premium calculator"
            path="/calculators/medicare-premium-calculator/"
          />
          <EmailCapture />
          <TakeHomePack pageTitle="Medicare premium calculator" />
          <p className="disclaimer">
            MedicareClear is independent and is not connected to Medicare.gov, Social Security, or
            any government agency. This page is educational and does not provide legal, tax, or
            insurance advice. Confirm your premium with Medicare or Social Security before you act.
          </p>
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
