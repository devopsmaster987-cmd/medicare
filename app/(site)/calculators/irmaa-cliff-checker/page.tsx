import type { Metadata } from 'next';
import Link from 'next/link';
import { TakeHomePack } from '@/components/action/take-home-pack';
import { AdSlot } from '@/components/ads/ad-slot';
import { IrmaaCalculator } from './calculator';
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
import { sources } from '@/data/sources';
import { figureYears } from '@/data/verified';
import { glossaryTipsFor } from '@/data/glossary';
import { irmaaCalculator } from '@/lib/formulas/irmaa';
import { calculatorSchema } from '@/lib/schema';
import { formatMoney } from '@/lib/utils';
import { site } from '@/data/site';

const year = figureYears.current;
const priorYear = figureYears.prior;
const path = '/calculators/irmaa-cliff-checker';
const glossaryTips = glossaryTipsFor(['MAGI', 'IRMAA']);
const lookbackYear = year - partB2026.lookbackYears;

export const metadata: Metadata = {
  title: `IRMAA brackets ${year}: Part B and Part D surcharge checker`,
  description: `IRMAA brackets ${year}: see the single, married, and married-filing-separately thresholds, your Part B and Part D surcharge, and the next cliff.`,
  alternates: { canonical: path },
  openGraph: {
    title: `IRMAA brackets ${year}: Part B and Part D surcharge checker`,
    description: `Check your IRMAA tier, Part B and Part D surcharge, two-year lookback, and Roth-conversion headroom.`,
    url: path,
    images: [
      {
        url: `/og${path}.png`,
        width: 1200,
        height: 630,
        alt: `IRMAA brackets ${year}: Part B and Part D surcharge checker`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/og${path}.png`],
  },
};

const example = irmaaCalculator({
  filingStatus: 'single',
  magiTwoYearsBack: 109001,
  projectedMagi: 137001,
});
const singleBase = partB2026.irmaa.single[0];
const singleFirst = partB2026.irmaa.single[1];
const jointBase = partB2026.irmaa.marriedJoint[0];
const jointFirst = partB2026.irmaa.marriedJoint[1];
const separateBase = partB2026.irmaa.marriedSeparate[0];
const separateFirst = partB2026.irmaa.marriedSeparate[1];
const priorSingleFirst = partB2025.irmaa.single[1];
const priorJointFirst = partB2025.irmaa.marriedJoint[1];
const priorSeparateFirst = partB2025.irmaa.marriedSeparate[1];

const faqItems = [
  {
    question: 'Medicare Part B premium calculator',
    answer: `Use this calculator with the MAGI from the tax return two years earlier. For ${year}, the standard Part B premium is ${formatMoney(partB2026.standardPremium.amount)}. Above the first threshold, the Part B premium rises by IRMAA tier.`,
  },
  {
    question: `What is the CMS Part B premium ${year}?`,
    answer: `The CMS standard Part B premium for ${year} is ${formatMoney(partB2026.standardPremium.amount)} a month. The Part B deductible is ${formatMoney(partB2026.deductible.amount)}. IRMAA can raise the premium above the standard amount.`,
  },
  {
    question: 'Where is the SSA IRMAA chart?',
    answer:
      'The Social Security Administration publishes the official IRMAA chart and the SSA-44 form. This page uses the CMS premium and IRMAA table from the source table below. Check the official SSA chart before filing an appeal.',
  },
  {
    question: 'Can a Roth conversion push me into IRMAA?',
    answer:
      'Yes. A Roth conversion can raise MAGI in the year of the conversion, and that income can set your Part B and Part D premium two years later. The projected-income field shows the next bracket before you convert.',
  },
  {
    question: 'What is the IRMAA lookback year?',
    answer: `For ${year} premiums, IRMAA generally uses ${lookbackYear} modified adjusted gross income. A life-changing event can let you ask Social Security to use a newer income figure through Form SSA-44.`,
  },
  {
    question: 'Can I appeal an IRMAA decision?',
    answer:
      'You can ask Social Security to review the decision if a life-changing event changed your income. File Form SSA-44 and provide the proof the office requests. This page is guidance, not tax or legal advice.',
  },
];

export default function IrmaaPage() {
  return (
    <>
      <JsonLd
        data={calculatorSchema({
          name: `IRMAA brackets and surcharge calculator ${year}`,
          description:
            'Check the IRMAA tier, Part B and Part D surcharge, next bracket, two-year lookback, and married-filing-separately rules.',
          url: `${site.siteUrl}${path}`,
        })}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators' },
            { name: 'IRMAA cliff checker', href: path },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">IRMAA · {year}</p>
          <h1 className="page-title">IRMAA brackets {year}</h1>
          <p className="page-lede">
            Find your current tier, the next income cliff, and the Part B and Part D surcharge. The
            calculator also shows the two-year lookback and the married-filing-separately rules.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <div className="wrap">
        <AnswerCapsule>
          IRMAA brackets {year} start at {formatMoney(singleFirst.min)}{' '}
          of MAGI for a single filer and {formatMoney(jointFirst.min)} for a married couple filing
          jointly. Above those lines, Part B and Part D surcharges rise by tier. This calculator
          shows your current tier, the next cliff, the two-year lookback, and the
          married-filing-separately rules.
        </AnswerCapsule>
      </div>

      <section className="section section-tight">
        <div className="wrap">
          <KeyFacts
            caption="IRMAA key facts"
            rows={[
              {
                label: 'Single first threshold',
                value: formatMoney(singleFirst.min),
                note: 'First tier above the standard premium.',
              },
              {
                label: 'Joint first threshold',
                value: formatMoney(jointFirst.min),
                note: 'Married filing jointly.',
              },
              {
                label: 'Married filing separately',
                value: formatMoney(separateFirst.min),
                note: 'The first surcharge tier starts here.',
              },
              {
                label: 'First-tier Part B premium',
                value: formatMoney(singleFirst.partBTotal),
                note: 'Part D adds a separate IRMAA amount.',
              },
              {
                label: 'Lookback',
                value: `${partB2026.lookbackYears} years`,
                note: `For ${year}, generally ${lookbackYear} income.`,
              },
            ]}
          />
        </div>
      </section>

      <div className="wrap">
        <IrmaaCalculator tips={glossaryTips} />
        <AdSlot placement="below-calculator" />
      </div>

      <section className="section">
        <div className="wrap prose">
          <h2>IRMAA brackets {year} married</h2>
          <p>
            A married couple filing jointly moves into the first IRMAA tier at{' '}
            {formatMoney(jointFirst.min)} of MAGI. Each spouse who is enrolled in Medicare may pay
            the surcharge, so a joint return can produce two IRMAA amounts.
          </p>
          <p>
            The joint thresholds are double the single thresholds until the top tier. Use the
            married-couple view in the calculator to see the household monthly surcharge when both
            spouses have the same MAGI.
          </p>

          <h2>IRMAA brackets {year} married filing separately</h2>
          <p>
            Married filing separately has its own table. The first surcharge tier starts at{' '}
            {formatMoney(separateFirst.min)}, much lower than the joint first threshold. Each spouse
            has a separate MAGI and a separate premium notice.
          </p>
          <p>
            Do not double one spouse&apos;s result for a married-filing-separately estimate. Check
            each return and each Medicare notice, and ask a tax preparer if the filing status is
            uncertain.
          </p>

          <h2>What is the IRMAA threshold for {year}</h2>
          <p>
            The first single threshold is {formatMoney(singleFirst.min)} of MAGI. The first joint
            threshold is {formatMoney(jointFirst.min)}. The standard premium applies at or below
            those lines, and the surcharge begins one dollar above them.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>First IRMAA threshold by filing status</caption>
              <thead>
                <tr>
                  <th scope="col">Filing status</th>
                  <th scope="col">Standard tier up to</th>
                  <th scope="col">First surcharge starts at</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Single</th>
                  <td>{formatMoney(singleBase.max ?? 0)}</td>
                  <td>{formatMoney(singleFirst.min)}</td>
                </tr>
                <tr>
                  <th scope="row">Married filing jointly</th>
                  <td>{formatMoney(jointBase.max ?? 0)}</td>
                  <td>{formatMoney(jointFirst.min)}</td>
                </tr>
                <tr>
                  <th scope="row">Married filing separately</th>
                  <td>{formatMoney(separateBase.max ?? 0)}</td>
                  <td>{formatMoney(separateFirst.min)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>How close am I to the next IRMAA bracket</h2>
          <p>
            The calculator subtracts your MAGI from the next bracket&apos;s start. In the worked
            example, {formatMoney(example.magi)} leaves {formatMoney(example.headroomToNextBracket ?? 0)}{' '}
            before the next tier at {formatMoney(example.nextTier?.min ?? 0)}.
          </p>
          <p>
            That headroom is not a tax-free allowance. It is the amount of additional MAGI that
            would move you into the next IRMAA tier for the premium year.
          </p>

          <h2>IRMAA Part B surcharge {year}</h2>
          <p>
            Part B IRMAA is the difference between your tier&apos;s Part B total and the standard
            premium. In the first tier, the Part B total is {formatMoney(singleFirst.partBTotal)},
            so the Part B surcharge is {formatMoney(singleFirst.partBAdjustment)} a month.
          </p>
          <p>
            The surcharge is added to the standard premium. It is not a separate optional plan. If
            you are enrolled in Part B, the income-based amount applies.
          </p>

          <h2>IRMAA Part D surcharge {year}</h2>
          <p>
            Part D IRMAA is an add-on to your Part D plan premium. In the first tier, the amount is{' '}
            {formatMoney(singleFirst.partDAdjustment)} a month. It is billed separately from the plan
            premium and can be deducted from Social Security or paid to Medicare.
          </p>
          <p>
            A person with no Part D plan generally does not pay the Part D IRMAA amount, but the
            Part B surcharge can still apply.
          </p>

          <h2>IRMAA two year lookback</h2>
          <p>
            IRMAA uses a two-year lookback. Income you earn in one year generally sets your premium
            two years later. A large sale, Roth conversion, or retirement distribution can raise the
            premium before you notice the change.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Two-year lookback example</caption>
              <thead>
                <tr>
                  <th scope="col">Income year</th>
                  <th scope="col">Premium year</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{lookbackYear}</th>
                  <td>{year}</td>
                </tr>
                <tr>
                  <th scope="row">{lookbackYear + 1}</th>
                  <td>{year + 1}</td>
                </tr>
                <tr>
                  <th scope="row">{lookbackYear + 2}</th>
                  <td>{year + 2}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Medicare Part B premium {year} married</h2>
          <p>
            For a married couple filing jointly, the standard Part B premium is{' '}
            {formatMoney(partB2026.standardPremium.amount)} per spouse. Above the joint threshold,
            each enrolled spouse can pay the tier&apos;s Part B total, not just one household
            surcharge.
          </p>
          <p>
            If both spouses have different MAGI because they file separately, use each
            spouse&apos;s own return and tier. The calculator&apos;s married-filing-separately view
            explains that split.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>SSA-44 appeal helper</h2>
          <p>
            Form SSA-44 asks Social Security to use a newer income figure after a life-changing
            event. Common events include retirement, marriage, divorce, the death of a spouse, and a
            loss of income-producing property. The calculator lists the events in its result and
            links to Social Security.
          </p>
          <p>
            <a href={sources.ssaForm44} target="_blank" rel="noreferrer">
              Open the official SSA-44 form
            </a>
            . This page is guidance, not legal or tax advice.
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
                note: 'The base for every IRMAA tier.',
              },
              {
                label: 'Single first threshold',
                prior: formatMoney(priorSingleFirst.min),
                current: formatMoney(singleFirst.min),
                note: 'Surcharge starts one dollar above this line.',
              },
              {
                label: 'Joint first threshold',
                prior: formatMoney(priorJointFirst.min),
                current: formatMoney(jointFirst.min),
                note: 'Married filing jointly.',
              },
              {
                label: 'Separate first threshold',
                prior: formatMoney(priorSeparateFirst.min),
                current: formatMoney(separateFirst.min),
                note: 'Married filing separately.',
              },
              {
                label: 'First-tier Part B total',
                prior: formatMoney(priorSingleFirst.partBTotal),
                current: formatMoney(singleFirst.partBTotal),
                note: 'Standard premium plus the first-tier surcharge.',
              },
              {
                label: 'First-tier Part D IRMAA',
                prior: formatMoney(priorSingleFirst.partDAdjustment),
                current: formatMoney(singleFirst.partDAdjustment),
                note: 'Added to the Part D plan premium.',
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Worked example</h2>
          <p>
            A single filer reports {formatMoney(example.magi)} of MAGI from {example.taxYearBasis}.
            That is one dollar above the first threshold, so the first IRMAA tier applies.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>IRMAA worked example</caption>
              <tbody>
                <tr>
                  <th scope="row">MAGI from {example.taxYearBasis}</th>
                  <td>{formatMoney(example.magi)}</td>
                </tr>
                <tr>
                  <th scope="row">Current tier</th>
                  <td>{example.tier.index === 0 ? 'Standard premium' : `Tier ${example.tier.index}`}</td>
                </tr>
                <tr>
                  <th scope="row">Monthly Part B</th>
                  <td>{formatMoney(example.monthlyPartB)}</td>
                </tr>
                <tr>
                  <th scope="row">Monthly Part D IRMAA</th>
                  <td>{formatMoney(example.monthlyPartD)}</td>
                </tr>
                <tr>
                  <th scope="row">Monthly surcharge</th>
                  <td>{formatMoney(example.monthlySurcharge)}</td>
                </tr>
                <tr>
                  <th scope="row">Annual surcharge</th>
                  <td>{formatMoney(example.annualSurcharge)}</td>
                </tr>
                <tr>
                  <th scope="row">Headroom to next tier</th>
                  <td>{formatMoney(example.headroomToNextBracket ?? 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="stat-note">
            At a projected MAGI of {formatMoney(example.projected?.magi ?? 0)}, the next tier starts
            at {formatMoney(example.projected?.tier.min ?? 0)} and the Roth-conversion headroom is{' '}
            {formatMoney(example.projected?.rothConversionHeadroom ?? 0)}.
          </p>
          <IndependenceNote />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Three honest caveats</h2>
          <ol>
            <li>
              IRMAA uses MAGI, not taxable income or your salary. Add back the income items the tax
              rules require, and use the tax return from the lookback year.
            </li>
            <li>
              A life-changing event can change the income SSA uses, but only if you file the right
              form with the right proof. The agency decides whether the event qualifies.
            </li>
            <li>
              Part D IRMAA is separate from the plan premium, and Part D plan premiums vary. This
              calculator estimates the IRMAA add-on, not the total Part D plan cost.
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
              <Link href="/calculators/medicare-vs-aca">
                Medicare vs ACA: Medicare or Marketplace at 65
              </Link>
            </li>
            <li>
              <Link href="/calculators/medicare-savings-program-extra-help">
                Medicare Savings Program and Extra Help
              </Link>
            </li>
            <li>
              <a href={sources.ssaForm44} target="_blank" rel="noreferrer">
                Official SSA-44 form
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
                sourceLabel: 'CMS Part B premium fact sheet',
              },
              {
                label: 'IRMAA brackets and surcharges',
                value: `${formatMoney(singleFirst.min)} single / ${formatMoney(jointFirst.min)} joint`,
                source: sources.cms2026AB,
                sourceLabel: 'CMS Part B premium fact sheet',
              },
              {
                label: 'Two-year lookback',
                value: `${partB2026.lookbackYears} years`,
                source: sources.ssaPomsLce,
                sourceLabel: 'SSA Program Operations Manual',
              },
              {
                label: 'SSA-44 life-changing events',
                value: 'Official form and review process',
                source: sources.ssaForm44,
                sourceLabel: 'SSA-44 form',
              },
              {
                label: 'Part D IRMAA billing',
                value: 'Separate from the plan premium',
                source: sources.medicarePartDCosts,
                sourceLabel: 'Medicare.gov Part D costs',
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <CiteThisPage title={`IRMAA brackets ${year}`} path="/calculators/irmaa-cliff-checker" />
          <EmailCapture />
          <TakeHomePack pageTitle={`IRMAA brackets ${year}`} />
          <p className="disclaimer">
            MedicareClear is independent and is not connected to Medicare.gov, Social Security, or
            the IRS. This page is educational and does not provide tax, legal, or financial advice.
            Confirm the income year and filing status with the official sources before you act.
          </p>
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
