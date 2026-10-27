import type { Metadata } from 'next';
import Link from 'next/link';
import { TakeHomePack } from '@/components/action/take-home-pack';
import { AdSlot } from '@/components/ads/ad-slot';
import { MspCalculator } from './calculator';
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
import { fplAnnual } from '@/data/fpl';
import {
  extraHelpAnnualIncomeLimit,
  mspMonthlyIncomeLimit,
  mspPrograms,
  mspResourceLimit,
} from '@/data/msp';
import { partB2025 } from '@/data/medicare-part-b-2025';
import { partB2026 } from '@/data/medicare-part-b';
import { partD2026 } from '@/data/medicare-part-d';
import { partD2025 } from '@/data/medicare-part-d-2025';
import { sources } from '@/data/sources';
import { getState, states } from '@/data/states';
import { figureYears } from '@/data/verified';
import { glossaryTipsFor } from '@/data/glossary';
import { mspEligibility } from '@/lib/formulas/msp-eligibility';
import { calculatorSchema } from '@/lib/schema';
import { formatMoney, formatNumber, formatPercent } from '@/lib/utils';
import { site } from '@/data/site';

const year = figureYears.current;
const priorYear = figureYears.prior;
const path = '/calculators/medicare-savings-program-extra-help';
const glossaryTips = glossaryTipsFor(['MAGI', 'FPL', 'Countable assets', 'MSP']);

export const metadata: Metadata = {
  title: `Medicare Savings Program income limits ${year}`,
  description: `Medicare Savings Program income limits ${year}: check QMB, SLMB, QI, and Extra Help income and asset limits for a single person or a married couple.`,
  alternates: { canonical: path },
  openGraph: {
    title: `Medicare Savings Program income limits ${year}`,
    description: `Check QMB, SLMB, QI, and Extra Help income and resource limits with official sources and a state agency next step.`,
    url: path,
    images: [
      {
        url: `/og${path}.png`,
        width: 1200,
        height: 630,
        alt: `Medicare Savings Program income limits ${year}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/og${path}.png`],
  },
};

const exampleState = getState('TX');
if (!exampleState) {
  throw new Error('Texas state data is missing.');
}

const example = mspEligibility({
  stateAbbr: 'TX',
  state: exampleState,
  householdSize: 1,
  monthlyIncome: 1350,
  countableAssets: 9000,
});

const qmbSingle = mspMonthlyIncomeLimit(mspPrograms.qmb, 1);
const qmbCouple = mspMonthlyIncomeLimit(mspPrograms.qmb, 2);
const slmbSingle = mspMonthlyIncomeLimit(mspPrograms.slmb, 1);
const slmbCouple = mspMonthlyIncomeLimit(mspPrograms.slmb, 2);
const qiSingle = mspMonthlyIncomeLimit(mspPrograms.qi, 1);
const qiCouple = mspMonthlyIncomeLimit(mspPrograms.qi, 2);
const extraHelpSingle = extraHelpAnnualIncomeLimit(1);
const extraHelpCouple = extraHelpAnnualIncomeLimit(2);
const priorExtraHelpSingle = extraHelpAnnualIncomeLimit(1, priorYear);
const priorExtraHelpCouple = extraHelpAnnualIncomeLimit(2, priorYear);
const noAssetTestStates = states.filter((state) => state.mspCovered && !state.assetTest);
const launchStateCount = states.filter((state) => state.mspCovered).length;

const faqItems = [
  {
    question: `Medicare Savings Program income limits ${year} single`,
    answer: `For a single person, the federal QMB monthly income limit is ${formatMoney(qmbSingle ?? 0)}, the SLMB limit is ${formatMoney(slmbSingle ?? 0)}, and the QI limit is ${formatMoney(qiSingle ?? 0)}. Extra Help uses an annual limit of ${formatMoney(extraHelpSingle)}. State disregards can raise the effective limit.`,
  },
  {
    question: `QMB income limit ${year} single`,
    answer: `The federal QMB monthly income limit for one person is ${formatMoney(qmbSingle ?? 0)}. The resource limit is ${formatMoney(mspResourceLimit(mspPrograms.qmb, 1))} in states that use an asset test. QMB can pay Part A and Part B premiums and cost sharing.`,
  },
  {
    question: `QMB income limit ${year} married`,
    answer: `The federal QMB monthly income limit for a married couple is ${formatMoney(qmbCouple ?? 0)}. The couple resource limit is ${formatMoney(mspResourceLimit(mspPrograms.qmb, 2))}. State rules and income disregards can change the result.`,
  },
  {
    question: `Extra Help income limits ${year} married`,
    answer: `The federal Extra Help annual income limit for a married couple is ${formatMoney(extraHelpCouple)}. The couple resource limit is ${formatMoney(mspResourceLimit(mspPrograms.extraHelp, 2))}. Extra Help is a Part D subsidy, not an MSP that pays the Part B premium.`,
  },
  {
    question: 'Do I qualify for Extra Help?',
    answer:
      'Extra Help uses its own income and resource tests. This calculator compares your annual income and countable assets with the federal limits, then shows whether Extra Help is a likely fit. Apply through Social Security for the final decision.',
  },
  {
    question: 'What documents should I bring?',
    answer:
      'Bring your Medicare card, Social Security award letter, recent proof of income, and statements for the countable assets you reported. Ask the state agency and Social Security before sending originals or using a portal you have not verified.',
  },
];

export default function MedicareSavingsProgramPage() {
  return (
    <>
      <JsonLd
        data={calculatorSchema({
          name: `Medicare Savings Program income limits ${year}`,
          description:
            'Check QMB, SLMB, QI, and Extra Help income and resource limits for a single person or a married couple.',
          url: `${site.siteUrl}${path}`,
        })}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators' },
            { name: 'Medicare Savings Program and Extra Help', href: path },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">MSP · {year}</p>
          <h1 className="page-title">Medicare Savings Program income limits {year}</h1>
          <p className="page-lede">
            Check the federal QMB, SLMB, QI, and Extra Help limits for your household, then open the
            state agency that makes the final decision. State disregards can be more generous than
            the federal table.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <div className="wrap">
        <AnswerCapsule>
          Medicare Savings Program income limits {year} start with the federal tests, but your
          state can treat income and assets differently. This calculator checks QMB, SLMB, QI, and
          Extra Help, shows the exact figures used, and gives you the state agency link for the
          application.
        </AnswerCapsule>
      </div>

      <section className="section section-tight">
        <div className="wrap">
          <KeyFacts
            caption="MSP key facts"
            rows={[
              {
                label: 'QMB monthly income',
                value: `${formatMoney(qmbSingle ?? 0)} single / ${formatMoney(qmbCouple ?? 0)} couple`,
                note: 'Federal limit before state disregards.',
              },
              {
                label: 'SLMB monthly income',
                value: `${formatMoney(slmbSingle ?? 0)} single / ${formatMoney(slmbCouple ?? 0)} couple`,
                note: 'Pays the Part B premium only.',
              },
              {
                label: 'QI monthly income',
                value: `${formatMoney(qiSingle ?? 0)} single / ${formatMoney(qiCouple ?? 0)} couple`,
                note: 'Funding is limited and applications can close.',
              },
              {
                label: 'Extra Help annual income',
                value: `${formatMoney(extraHelpSingle)} single / ${formatMoney(extraHelpCouple)} couple`,
                note: 'Part D subsidy with separate resource limits.',
              },
              {
                label: 'QMB resource limit',
                value: `${formatMoney(mspResourceLimit(mspPrograms.qmb, 1))} single / ${formatMoney(mspResourceLimit(mspPrograms.qmb, 2))} couple`,
                note: 'Not used in states that have no asset test.',
              },
            ]}
          />
        </div>
      </section>

      <div className="wrap">
        <MspCalculator tips={glossaryTips} states={states} />
        <AdSlot placement="below-calculator" />
      </div>

      <section className="section">
        <div className="wrap prose">
          <h2>QMB income limit {year}</h2>
          <p>
            QMB is the MSP with the lowest income limit and the broadest
            payment. For a single person, the federal monthly income limit is{' '}
            {formatMoney(qmbSingle ?? 0)}. For a married couple, it is{' '}
            {formatMoney(qmbCouple ?? 0)}. The calculator applies the{' '}
            {formatMoney(mspPrograms.qmb.monthlyDisregard)} monthly disregard from the data layer.
          </p>
          <p>
            QMB can pay Part A and Part B premiums and Medicare cost sharing. The resource limit
            matters in states that use an asset test. Ask the agency which resources it counts.
          </p>

          <h2>SLMB income limit {year}</h2>
          <p>
            SLMB has a higher income limit than QMB and pays the Part B premium. The federal monthly
            limit is {formatMoney(slmbSingle ?? 0)} for one person and{' '}
            {formatMoney(slmbCouple ?? 0)} for a couple. You must have Part A.
          </p>
          <p>
            Because SLMB pays only the Part B premium, a person who needs help with deductibles or
            coinsurance may need a different program or Medicaid. The agency can explain the
            difference.
          </p>

          <h2>QI income limit {year}</h2>
          <p>
            QI also pays the Part B premium, with a higher income limit than SLMB. The federal
            monthly limit is {formatMoney(qiSingle ?? 0)} for one person and{' '}
            {formatMoney(qiCouple ?? 0)} for a couple.
          </p>
          <p>
            QI funding is limited. Some states run out of slots or use a waiting list, so apply early
            and confirm the current status with the state agency.
          </p>

          <h2>Extra Help income limits {year}</h2>
          <p>
            Extra Help is the Part D Low-Income Subsidy. The federal annual income limit is{' '}
            {formatMoney(extraHelpSingle)} for one person and {formatMoney(extraHelpCouple)} for a
            married couple. The resource limits are {formatMoney(mspResourceLimit(mspPrograms.extraHelp, 1))}{' '}
            and {formatMoney(mspResourceLimit(mspPrograms.extraHelp, 2))}.
          </p>
          <p>
            Extra Help can lower the Part D premium, deductible, and copays. It does not replace QMB
            or pay the Part B premium, so a person can be eligible for both an MSP and
            Extra Help.
          </p>

          <h2>Medicare Savings Program asset limits {year}</h2>
          <p>
            The federal resource limits are {formatMoney(mspResourceLimit(mspPrograms.qmb, 1))} for
            a single person and {formatMoney(mspResourceLimit(mspPrograms.qmb, 2))} for a couple for
            QMB, SLMB, and QI. Extra Help uses separate limits of{' '}
            {formatMoney(mspResourceLimit(mspPrograms.extraHelp, 1))} and{' '}
            {formatMoney(mspResourceLimit(mspPrograms.extraHelp, 2))}.
          </p>
          <p>
            {noAssetTestStates.length > 0
              ? `${noAssetTestStates.map((state) => state.name).join(' and ')} are marked as having no asset test in this dataset. `
              : ''}
            Other states may count assets differently or disregard some of them. The agency makes
            the final decision.
          </p>

          <h2>QMB vs SLMB vs QI</h2>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>QMB, SLMB, QI, and Extra Help compared</caption>
              <thead>
                <tr>
                  <th scope="col">Program</th>
                  <th scope="col">Income test</th>
                  <th scope="col">What it pays</th>
                </tr>
              </thead>
              <tbody>
                {(['qmb', 'slmb', 'qi', 'extraHelp'] as const).map((key) => {
                  const program = mspPrograms[key];
                  return (
                    <tr key={key}>
                      <th scope="row">{program.name}</th>
                      <td>
                        {program.key === 'extraHelp'
                          ? `${formatPercent(program.fplPercent)} of FPL, annual test`
                          : `${formatPercent(program.fplPercent)} of FPL, monthly test`}
                      </td>
                      <td>{program.whatItPays}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p>
            Start with the program that pays the most and has an income test you meet. The
            calculator shows the best federal fit, not a guarantee. The state agency decides which
            program to approve.
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
                note: 'The premium value shown for an MSP estimate.',
              },
              {
                label: 'Federal poverty level, one person',
                prior: formatMoney(fplAnnual(priorYear, 1)),
                current: formatMoney(fplAnnual(year, 1)),
                note: 'The MSP income tests use the current FPL table.',
              },
              {
                label: 'Extra Help annual income, one person',
                prior: formatMoney(priorExtraHelpSingle),
                current: formatMoney(extraHelpSingle),
                note: 'The Extra Help test uses its own percentage of FPL.',
              },
              {
                label: 'Extra Help annual income, couple',
                prior: formatMoney(priorExtraHelpCouple),
                current: formatMoney(extraHelpCouple),
                note: 'Household size drives the couple limit.',
              },
              {
                label: 'Part D base premium',
                prior: formatMoney(partD2025.baseBeneficiaryPremium.amount),
                current: formatMoney(partD2026.baseBeneficiaryPremium.amount),
                note: 'Used only for the Extra Help estimate.',
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Worked example</h2>
          <p>
            A single person in Texas reports {formatMoney(1350)} a month in income and{' '}
            {formatMoney(9000)} in countable assets. The calculator uses the federal QMB limit of{' '}
            {formatMoney(qmbSingle ?? 0)} and the Extra Help annual limit of{' '}
            {formatMoney(extraHelpSingle)}.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>MSP worked example</caption>
              <tbody>
                <tr>
                  <th scope="row">Annual income</th>
                  <td>{formatMoney(1350 * 12)}</td>
                </tr>
                <tr>
                  <th scope="row">Share of federal poverty level</th>
                  <td>{formatPercent(example.incomePercentOfFpl)}</td>
                </tr>
                <tr>
                  <th scope="row">Likely programs</th>
                  <td>
                    {example.likelyPrograms
                      .map((key) => mspPrograms[key].shortName)
                      .join(' + ') || 'None'}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Estimated monthly value</th>
                  <td>{formatMoney(example.estimatedMonthlyValue)}</td>
                </tr>
                <tr>
                  <th scope="row">Estimated annual value</th>
                  <td>{formatMoney(example.estimatedAnnualValue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="stat-note">
            The estimate combines the Part B standard premium with the Part D base premium. Actual
            Extra Help value depends on the drug plan and the income tier.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Three honest caveats</h2>
          <ol>
            <li>
              These are federal limits. States can disregard income, count assets differently, or
              use different program names. The agency&apos;s decision controls.
            </li>
            <li>
              This version checks QMB, SLMB, QI, and Extra Help. It does not check QDWI or every
              state-only program. Ask the agency about other paths.
            </li>
            <li>
              Extra Help is a Part D subsidy. It does not pay the Part B premium, and an MSP
              does not automatically pay drug costs. Ask about both.
            </li>
          </ol>
          <p>
            MedicareClear links the state Medicaid agency for {formatNumber(launchStateCount)}{' '}
            launch states and the federal directory for the rest. The income and resource tests on
            this page are the federal baseline for every state, not a state-specific limit. Your
            state may be more generous, so apply through the agency even if a test here fails.
          </p>
          <IndependenceNote />
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
              <Link href="/calculators/employer-coverage-affordability">
                Employer coverage affordability
              </Link>
            </li>
            <li>
              <Link href="/calculators">All Medicare calculators</Link>
            </li>
            <li>
              <a href={sources.medicareMsp} target="_blank" rel="noreferrer">
                Medicare.gov MSP page
              </a>
            </li>
            <li>
              <a href={sources.ssaExtraHelp} target="_blank" rel="noreferrer">
                Social Security Extra Help
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
                label: 'QMB, SLMB, and QI income limits',
                value: `${formatMoney(qmbSingle ?? 0)} to ${formatMoney(qiCouple ?? 0)}`,
                source: sources.medicareMsp,
                sourceLabel: 'Medicare.gov MSP page',
              },
              {
                label: 'MSP resource limits',
                value: `${formatMoney(mspResourceLimit(mspPrograms.qmb, 1))} single / ${formatMoney(mspResourceLimit(mspPrograms.qmb, 2))} couple`,
                source: sources.medicareMsp,
                sourceLabel: 'Medicare.gov MSP page',
              },
              {
                label: 'Extra Help income and resource limits',
                value: `${formatMoney(extraHelpSingle)} single / ${formatMoney(extraHelpCouple)} couple`,
                source: sources.medicareDrugCosts,
                sourceLabel: 'Medicare.gov drug cost help',
              },
              {
                label: 'Part B standard premium',
                value: formatMoney(partB2026.standardPremium.amount),
                source: sources.cms2026AB,
                sourceLabel: 'CMS Part B premium fact sheet',
              },
              {
                label: 'Part D base beneficiary premium',
                value: formatMoney(partD2026.baseBeneficiaryPremium.amount),
                source: sources.cms2026AB,
                sourceLabel: 'CMS Part B premium fact sheet',
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <EmailCapture />
          <TakeHomePack pageTitle={`Medicare Savings Program income limits ${year}`} />
          <p className="disclaimer">
            MedicareClear is independent and is not connected to Medicare.gov, Social Security, or
            any state Medicaid agency. This page is educational and does not provide legal or
            financial advice. The state agency makes the final eligibility decision.
          </p>
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
