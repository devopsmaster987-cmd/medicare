import type { Metadata } from 'next';
import Link from 'next/link';
import { AnswerCapsule, KeyFacts, SourceTable } from '@/components/calc/content';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AuthorLine } from '@/components/trust/author-line';
import { LastUpdated } from '@/components/trust/last-updated';
import { ReportError } from '@/components/trust/report-error';
import { aca2025 } from '@/data/aca-2025';
import { aca2026 } from '@/data/aca';
import { partA2025 } from '@/data/medicare-part-a-2025';
import { partA2026 } from '@/data/medicare-part-a';
import { partB2025 } from '@/data/medicare-part-b-2025';
import { partB2026 } from '@/data/medicare-part-b';
import { partD2025 } from '@/data/medicare-part-d-2025';
import { partD2026 } from '@/data/medicare-part-d';
import { sources } from '@/data/sources';
import { dataVerifiedOn, figureYears } from '@/data/verified';
import { formatMoney, formatPercent } from '@/lib/utils';

const year = partB2026.year;
const priorYear = partB2025.year;
const pagePath = `/what-changed-${year}`;
const ogImage = `/og/what-changed-${year}.png`;

export const metadata: Metadata = {
  title: `What changed for ${year}`,
  description: `Medicare and ACA figures for ${year} compared with ${priorYear}: Part B, Part D, IRMAA, Part A, and Marketplace out-of-pocket limits, with official sources.`,
  alternates: { canonical: pagePath },
  openGraph: {
    title: `What changed for ${year} | MedicareClear`,
    description: `Medicare and ACA figures for ${year} compared with ${priorYear}, with official sources and checked dates.`,
    url: pagePath,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `Medicare figures that changed for ${year}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogImage],
  },
};
const partBPremiumChange = partB2026.standardPremium.amount - partB2025.standardPremium.amount;
const partBDeductibleChange = partB2026.deductible.amount - partB2025.deductible.amount;
const partDBaseChange =
  partD2026.baseBeneficiaryPremium.amount - partD2025.baseBeneficiaryPremium.amount;
const partDCapChange = partD2026.outOfPocketCap.amount - partD2025.outOfPocketCap.amount;
const partADeductibleChange =
  partA2026.inpatientDeductible.amount - partA2025.inpatientDeductible.amount;
const acaOopChange =
  aca2026.outOfPocketMaxSelfOnly.amount - aca2025.outOfPocketMaxSelfOnly.amount;

const singleFirst = partB2026.irmaa.single[1];
const jointFirst = partB2026.irmaa.marriedJoint[1];
const separateFirst = partB2026.irmaa.marriedSeparate[1];
const priorSingleFirst = partB2025.irmaa.single[1];
const priorJointFirst = partB2025.irmaa.marriedJoint[1];
const priorSeparateFirst = partB2025.irmaa.marriedSeparate[1];

export default function WhatChangedPage() {
  return (
    <>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: `What changed for ${year}`, href: pagePath },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Yearly update · {year}</p>
          <h1 className="page-title">What changed for {year}</h1>
          <AnswerCapsule>
            The {year} standard Part B premium is {formatMoney(partB2026.standardPremium.amount)} a
            month, up {formatMoney(partBPremiumChange)} from {priorYear}. The Part B deductible is{' '}
            {formatMoney(partB2026.deductible.amount)}. Part D has a{' '}
            {formatMoney(partD2026.outOfPocketCap.amount)} out-of-pocket cap, and the first IRMAA
            tier starts at {formatMoney(singleFirst.min)} for a single filer.
          </AnswerCapsule>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>The short answer</h2>
          <p>
            Most of the movement for {year} is in the Part B premium and deductible, the Part D
            out-of-pocket cap, and the IRMAA thresholds. The late-enrollment penalty rates did not
            change: Part B still adds 10% for each full 12-month period, and Part D still adds 1% of
            the national base beneficiary premium for each uncovered month.
          </p>
          <KeyFacts
            caption={`${year} Medicare and ACA figures compared with ${priorYear}`}
            rows={[
              {
                label: 'Part B standard premium',
                value: `${formatMoney(partB2026.standardPremium.amount)} a month`,
                note: `${formatMoney(partBPremiumChange)} higher than ${priorYear}`,
              },
              {
                label: 'Part B deductible',
                value: formatMoney(partB2026.deductible.amount),
                note: `${formatMoney(partBDeductibleChange)} higher than ${priorYear}`,
              },
              {
                label: 'Part D base beneficiary premium',
                value: `${formatMoney(partD2026.baseBeneficiaryPremium.amount)} a month`,
                note: `${formatMoney(partDBaseChange)} higher than ${priorYear}`,
              },
              {
                label: 'Part D out-of-pocket cap',
                value: formatMoney(partD2026.outOfPocketCap.amount),
                note: `${formatMoney(partDCapChange)} higher than ${priorYear}`,
              },
              {
                label: 'Part A inpatient deductible',
                value: formatMoney(partA2026.inpatientDeductible.amount),
                note: `${formatMoney(partADeductibleChange)} higher than ${priorYear}`,
              },
              {
                label: 'ACA self-only out-of-pocket maximum',
                value: formatMoney(aca2026.outOfPocketMaxSelfOnly.amount),
                note: `${formatMoney(acaOopChange)} higher than ${priorYear}`,
              },
              {
                label: 'Employer affordability percentage',
                value: formatPercent(aca2026.affordabilityPercentage.rate),
                note: `Up from ${formatPercent(aca2025.affordabilityPercentage.rate)} in ${priorYear}`,
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Part B premium and deductible</h2>
          <p>
            The standard Part B premium rose from {formatMoney(partB2025.standardPremium.amount)} to{' '}
            {formatMoney(partB2026.standardPremium.amount)} a month. Over a year, the standard
            premium is {formatMoney(partB2026.standardPremium.amount * 12)} before any IRMAA or
            late-enrollment penalty.
          </p>
          <p>
            The Part B deductible rose from {formatMoney(partB2025.deductible.amount)} to{' '}
            {formatMoney(partB2026.deductible.amount)}. After the deductible, Original Medicare
            generally pays 80% of the approved amount for covered services, and you pay the other
            20% unless another plan covers it.
          </p>
          <p>
            A higher premium does not change the penalty rate. The Part B penalty is still 10% of
            the standard premium for each full 12-month period without qualifying coverage. Because
            the standard premium is higher, the same penalty percentage now costs more in dollars.
            The <Link href="/calculators/part-b-late-enrollment-penalty/">Part B penalty calculator</Link>{' '}
            shows the current amount.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Part D premium, deductible, and cap</h2>
          <p>
            The national base beneficiary premium is {formatMoney(partD2026.baseBeneficiaryPremium.amount)}{' '}
            a month, up from {formatMoney(partD2025.baseBeneficiaryPremium.amount)}. That base figure
            is used to calculate the Part D late-enrollment penalty. It is not the premium of every
            plan.
          </p>
          <p>
            The Part D deductible is {formatMoney(partD2026.deductible.amount)}, and the annual
            out-of-pocket cap for covered drugs is {formatMoney(partD2026.outOfPocketCap.amount)}.
            The cap is up {formatMoney(partDCapChange)} from {priorYear}. Premiums and IRMAA are
            outside the cap.
          </p>
          <p>
            Read the <Link href="/guides/part-d-out-of-pocket-cap/">Part D out-of-pocket cap guide</Link>{' '}
            for what counts toward the cap and what stays outside it.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>IRMAA thresholds and surcharges</h2>
          <p>
            IRMAA uses the income from two years earlier. The {year} premium therefore generally
            uses {partB2026.year - partB2026.lookbackYears} income. The first surcharge tier starts
            at {formatMoney(singleFirst.min)} for a single filer,{' '}
            {formatMoney(jointFirst.min)} for a married couple filing jointly, and{' '}
            {formatMoney(separateFirst.min)} for a married person filing separately.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>
                First IRMAA tier in {priorYear} and {year}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Filing status</th>
                  <th scope="col">{priorYear} first tier starts</th>
                  <th scope="col">{year} first tier starts</th>
                  <th scope="col">{year} monthly Part B + Part D surcharge</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Single</th>
                  <td>{formatMoney(priorSingleFirst.min)}</td>
                  <td>{formatMoney(singleFirst.min)}</td>
                  <td>
                    {formatMoney(singleFirst.partBAdjustment + singleFirst.partDAdjustment)}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Married filing jointly</th>
                  <td>{formatMoney(priorJointFirst.min)}</td>
                  <td>{formatMoney(jointFirst.min)}</td>
                  <td>
                    {formatMoney(jointFirst.partBAdjustment + jointFirst.partDAdjustment)} per
                    spouse
                  </td>
                </tr>
                <tr>
                  <th scope="row">Married filing separately</th>
                  <td>{formatMoney(priorSeparateFirst.min)}</td>
                  <td>{formatMoney(separateFirst.min)}</td>
                  <td>
                    {formatMoney(separateFirst.partBAdjustment + separateFirst.partDAdjustment)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The <Link href="/calculators/irmaa-cliff-checker/">IRMAA cliff checker</Link> shows the
            full table, the next bracket, and the headroom before a Roth conversion. The{' '}
            <Link href="/guides/how-to-lower-irmaa/">guide to lowering IRMAA</Link> explains the
            SSA-44 appeal and the income timing rules.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Part A premiums and hospital deductible</h2>
          <p>
            Most people get premium-free Part A with 40 or more work quarters. For people with 30 to
            39 quarters, the reduced premium is {formatMoney(partA2026.reducedPremium.amount)} a
            month, up from {formatMoney(partA2025.reducedPremium.amount)}. With fewer than 30
            quarters, the full premium is {formatMoney(partA2026.fullPremium.amount)} a month, up
            from {formatMoney(partA2025.fullPremium.amount)}.
          </p>
          <p>
            The inpatient hospital deductible is {formatMoney(partA2026.inpatientDeductible.amount)},
            up {formatMoney(partADeductibleChange)} from {priorYear}. The{' '}
            <Link href="/guides/medicare-part-a-premium/">Part A premium guide</Link> explains the
            work-quarter test.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>ACA affordability and out-of-pocket limits</h2>
          <p>
            The employer affordability percentage rose from{' '}
            {formatPercent(aca2025.affordabilityPercentage.rate)} to{' '}
            {formatPercent(aca2026.affordabilityPercentage.rate)}. A higher percentage makes it
            easier for an employer plan to pass the test, because the employee premium is compared
            with a larger share of household income.
          </p>
          <p>
            The self-only Marketplace out-of-pocket maximum is{' '}
            {formatMoney(aca2026.outOfPocketMaxSelfOnly.amount)}, up from{' '}
            {formatMoney(aca2025.outOfPocketMaxSelfOnly.amount)}. The family maximum is{' '}
            {formatMoney(aca2026.outOfPocketMaxFamily.amount)}.
          </p>
          <p>
            The enhanced premium tax credit provisions expired at the end of{' '}
            {aca2026.enhancedSubsidies.expiredOn.slice(0, 4)}. For {year}, premium tax credits are
            generally limited to households at or below 400% of the federal poverty level. The{' '}
            <Link href="/guides/400-fpl-subsidy-cliff/">400% FPL guide</Link> explains the current
            status and the dollar limits.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <SourceTable
            rows={[
              {
                label: 'Part B premium and deductible',
                value: `${formatMoney(partB2026.standardPremium.amount)} / ${formatMoney(partB2026.deductible.amount)}`,
                source: sources.cms2026AB,
                sourceLabel: `CMS ${year} Part B premium fact sheet`,
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'Part D base premium, deductible, and cap',
                value: `${formatMoney(partD2026.baseBeneficiaryPremium.amount)} / ${formatMoney(partD2026.deductible.amount)} / ${formatMoney(partD2026.outOfPocketCap.amount)}`,
                source: sources.cms2026PartD,
                sourceLabel: `CMS ${year} Part D parameters`,
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'IRMAA thresholds and surcharges',
                value: `${formatMoney(singleFirst.min)} single first tier`,
                source: sources.cms2026AB,
                sourceLabel: `CMS ${year} Part B premium fact sheet`,
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'Part A premiums and hospital deductible',
                value: `${formatMoney(partA2026.reducedPremium.amount)} reduced / ${formatMoney(partA2026.fullPremium.amount)} full`,
                source: sources.cms2026AB,
                sourceLabel: `CMS ${year} Part B premium fact sheet`,
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'ACA out-of-pocket maximum',
                value: formatMoney(aca2026.outOfPocketMaxSelfOnly.amount),
                source: sources.hhs2026CostSharing,
                sourceLabel: `HHS ${year} cost-sharing rule`,
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'Employer affordability percentage',
                value: formatPercent(aca2026.affordabilityPercentage.rate),
                source: sources.irsRp2025_25,
                sourceLabel: `IRS Revenue Procedure ${priorYear}-25`,
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'Enhanced subsidy status',
                value: aca2026.enhancedSubsidies.status,
                source: sources.crsEnhancedPtc,
                sourceLabel: 'Congressional Research Service summary',
                checkedOn: dataVerifiedOn,
              },
            ]}
          />
          <p className="stat-note">
            Prior-year figures are kept in the data layer with their own sources. This page compares
            the current data year, {figureYears.current}, with {figureYears.prior}.
          </p>
          <ReportError pageTitle={`What changed for ${year}`} />
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
