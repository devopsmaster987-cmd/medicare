'use client';

import { useMemo } from 'react';
import { ActionPlan } from '@/components/action/action-plan';
import { CalculatorEvents } from '@/components/calc/calculator-events';
import { CountUp } from '@/components/calc/count-up';
import { CurrencyField, NumberField, RadioField, SelectField } from '@/components/calc/fields';
import { GlossaryTip } from '@/components/calc/glossary-tip';
import { ShareResult, ReminderIcs, CalculatorReportError } from '@/components/calc/interactive';
import { ScenarioCompare, ShowMath, StickySummary } from '@/components/calc/calculator-blocks';
import type { GlossaryTipEntry } from '@/data/glossary';
import type { FilingStatus } from '@/data/types';
import { medicarePremiumCalculator } from '@/lib/formulas/medicare-premium';
import {
  medicarePremiumSchema,
  parseMoneyInput,
} from '@/lib/validation';
import { useHashState } from '@/lib/use-hash-state';
import { formatMoney } from '@/lib/utils';

const path = '/calculators/medicare-premium-calculator/';

const defaults = {
  filing: 'single',
  magi: '',
  quarters: '',
  married: 'no',
  spouseQuarters: '',
  partD: 'yes',
  planPremium: '',
  bothEnrolled: 'no',
  partBPenaltyMonths: '',
  partDPenaltyMonths: '',
  alternateMagi: '',
};

const filingOptions = [
  { value: 'single', label: 'Single' },
  { value: 'marriedJoint', label: 'Married filing jointly' },
  { value: 'marriedSeparate', label: 'Married filing separately' },
];

const filingLabels: Record<FilingStatus, string> = {
  single: 'Single',
  marriedJoint: 'Married filing jointly',
  marriedSeparate: 'Married filing separately',
};

const yesNoOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export function MedicarePremiumCalculator({
  tips,
}: {
  tips: Record<string, GlossaryTipEntry>;
}) {
  const { values, update } = useHashState(defaults);

  const parsed = useMemo(() => {
    if (values.magi.trim() === '') {
      return { data: null, magiError: '', quartersError: '' };
    }
    const magi = parseMoneyInput(values.magi);
    const magiError =
      magi === null || magi < 0
        ? 'Enter your household income from two years ago.'
        : '';

    const quarters =
      values.quarters.trim() === '' ? 40 : Number(values.quarters.replace(/[^0-9.]/g, ''));
    const quartersError =
      !Number.isFinite(quarters) || quarters < 0 || quarters > 40
        ? 'Enter quarters from 0 to 40, or leave the field empty for 40 or more.'
        : '';

    const spouseQuarters =
      values.married === 'yes' && values.spouseQuarters.trim() !== ''
        ? Number(values.spouseQuarters.replace(/[^0-9.]/g, ''))
        : undefined;
    const spouseError =
      spouseQuarters !== undefined &&
      (!Number.isFinite(spouseQuarters) || spouseQuarters < 0 || spouseQuarters > 40)
        ? 'Enter spouse quarters from 0 to 40, or leave the field empty.'
        : '';

    const planPremium = values.partD === 'yes' ? (parseMoneyInput(values.planPremium) ?? 0) : 0;
    const partBPenaltyMonths =
      values.partBPenaltyMonths.trim() === ''
        ? 0
        : Number(values.partBPenaltyMonths.replace(/[^0-9.]/g, ''));
    const partDPenaltyMonths =
      values.partDPenaltyMonths.trim() === ''
        ? 0
        : Number(values.partDPenaltyMonths.replace(/[^0-9.]/g, ''));

    const result = medicarePremiumSchema.safeParse({
      filingStatus: values.filing,
      magiTwoYearsBack: magi,
      ownQuarters: quarters,
      married: values.married === 'yes',
      spouseQuarters,
      partDEnrolled: values.partD === 'yes',
      partDPlanPremium: planPremium,
      bothEnrolled: values.bothEnrolled === 'yes',
      partBPenaltyMonths,
      partDPenaltyMonths,
    });

    return {
      data:
        result.success && magiError === '' && quartersError === '' && spouseError === ''
          ? result.data
          : null,
      magiError,
      quartersError,
      spouseError,
    };
  }, [values]);

  const result = useMemo(
    () => (parsed.data ? medicarePremiumCalculator(parsed.data) : null),
    [parsed.data],
  );

  const alternateMagi = parseMoneyInput(values.alternateMagi);
  const alternateResult = useMemo(() => {
    if (!parsed.data || alternateMagi === null || alternateMagi < 0) return null;
    return medicarePremiumCalculator({
      ...parsed.data,
      magiTwoYearsBack: alternateMagi,
    });
  }, [parsed.data, alternateMagi]);

  const filingStatus: FilingStatus = parsed.data?.filingStatus ?? 'single';
  const magiUsed = parsed.data?.magiTwoYearsBack ?? 0;

  const verdict = !result
    ? 'Enter your income'
    : result.headroomToNextBracket !== null && result.headroomToNextBracket <= 5000
      ? `Watch the next bracket: ${formatMoney(result.headroomToNextBracket)} of headroom`
      : `About ${formatMoney(result.totalMonthly)} a month`;

  const reportSummary = result
    ? `Medicare premium estimate (${result.year}). Filing status: ${filingLabels[filingStatus]}. MAGI from ${result.taxYearBasis}: ${formatMoney(magiUsed)}. Part A: ${formatMoney(result.partA.monthlyPremium)} a month. Part B: ${formatMoney(result.partB.monthlyTotal)} a month for ${result.persons} person${result.persons === 1 ? '' : 's'}. Part D: ${formatMoney(result.partD.monthlyTotal)} a month. Total: ${formatMoney(result.totalMonthly)} a month, ${formatMoney(result.totalAnnual)} a year.`
    : 'No result yet.';

  return (
    <section className="calculator-shell" aria-labelledby="calculator-title">
      <CalculatorEvents path={path} complete={Boolean(result)} />
      <div className="calculator-grid">
        <form className="calculator-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <p className="calculator-kicker">Your inputs</p>
            <h2 id="calculator-title">Add up your Medicare bill</h2>
            <p>
              Enter your income from two years ago and your plan choices. Results update as you
              type. Your inputs stay in the page address after the hash.
            </p>
          </div>

          <SelectField
            id="filing"
            label="Tax filing status"
            value={values.filing}
            onChange={(value) => update('filing', value)}
            options={filingOptions}
            hint="Use the status from the tax return filed for the income year you enter below. It decides which income brackets apply."
          />

          <CurrencyField
            id="magi"
            label="Household income from two years ago"
            value={values.magi}
            onChange={(value) => update('magi', value)}
            error={parsed.magiError}
            hint="Modified adjusted gross income from the tax return two years before this year, with any foreign earned income and tax-exempt interest added back."
          />

          <NumberField
            id="quarters"
            label="Your quarters of Medicare-covered work"
            value={values.quarters}
            onChange={(value) => update('quarters', value)}
            min={0}
            max={40}
            error={parsed.quartersError}
            hint="Optional. Leave empty if you have 40 or more quarters, which makes Part A premium-free. Fewer quarters add a Part A premium to the bill."
          />

          <RadioField
            legend="Is Part D drug coverage part of your household?"
            value={values.partD}
            onChange={(value) => update('partD', value)}
            options={yesNoOptions}
            hint="If you have a stand-alone Part D plan or a Medicare Advantage plan with drug coverage, say yes."
          />

          {values.partD === 'yes' ? (
            <CurrencyField
              id="plan-premium"
              label="Your Part D plan premium"
              value={values.planPremium}
              onChange={(value) => update('planPremium', value)}
              optional
              hint="The premium shown on your plan’s annual notice, before any low-income subsidy. Leave empty to count zero."
            />
          ) : null}

          {values.filing === 'marriedJoint' ? (
            <>
              <RadioField
                legend="Are both spouses enrolled in Medicare?"
                value={values.bothEnrolled}
                onChange={(value) => update('bothEnrolled', value)}
                options={yesNoOptions}
                hint="Each enrolled spouse pays Part B and Part D separately, so the household bill roughly doubles."
              />
              <RadioField
                legend="Do you and your spouse combine work quarters?"
                value={values.married}
                onChange={(value) => update('married', value)}
                options={yesNoOptions}
                hint="In many cases a spouse’s record lowers or removes the Part A premium."
              />
              {values.married === 'yes' ? (
                <NumberField
                  id="spouse-quarters"
                  label="Higher of your two quarter counts"
                  value={values.spouseQuarters}
                  onChange={(value) => update('spouseQuarters', value)}
                  min={0}
                  max={40}
                  hint="Optional. Social Security applies marriage rules to a spouse’s record, so confirm your case with Social Security."
                  error={parsed.spouseError}
                />
              ) : null}
            </>
          ) : null}

          <NumberField
            id="part-b-penalty-months"
            label="Months of Part B late penalty"
            value={values.partBPenaltyMonths}
            onChange={(value) => update('partBPenaltyMonths', value)}
            min={0}
            max={600}
            hint="Optional. If Social Security already adds a Part B penalty to your bill, enter the months of delay it counts."
          />

          {values.partD === 'yes' ? (
            <NumberField
              id="part-d-penalty-months"
              label="Months of Part D late penalty"
              value={values.partDPenaltyMonths}
              onChange={(value) => update('partDPenaltyMonths', value)}
              min={0}
              max={600}
              hint="Optional. Months without creditable drug coverage after your first chance to enroll."
            />
          ) : null}

          <div className="field-glossary">
            <GlossaryTip term="IRMAA" tips={tips} />
            <GlossaryTip term="MAGI" tips={tips} />
            <GlossaryTip term="Part B" tips={tips} />
            <GlossaryTip term="Part D" tips={tips} />
          </div>

          <p className="calculator-privacy">
            This calculator runs in your browser. Nothing is submitted. The page address hash can
            contain your inputs, so avoid sharing the full link if you do not want them visible.
          </p>
        </form>

        <div className="calculator-result">
          <div className="result-header">
            <p className="calculator-kicker">Your result</p>
            <h2>Estimated Medicare premium</h2>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {result
              ? `${verdict}. Total ${formatMoney(result.totalMonthly)} a month and ${formatMoney(result.totalAnnual)} a year, including Part A, Part B, and Part D.`
              : 'Enter your income from two years ago to see your estimated Medicare bill.'}
          </p>

          {result ? (
            <>
              <div
                className={`result-verdict ${
                  result.headroomToNextBracket !== null && result.headroomToNextBracket <= 5000
                    ? 'is-warn'
                    : 'is-good'
                }`}
              >
                {verdict}
              </div>
              <p className="result-copy">
                For a {filingLabels[filingStatus].toLowerCase()} filer with income from{' '}
                {result.taxYearBasis} of {formatMoney(magiUsed)}, Medicare costs about{' '}
                {formatMoney(result.totalMonthly)} a month this year, or{' '}
                {formatMoney(result.totalAnnual)} a year. {result.note}
              </p>

              <div className="result-card-grid">
                <div className="result-card">
                  <span>Part B each person</span>
                  <strong>
                    <CountUp value={result.partB.monthlyPerPerson} format={formatMoney} />
                  </strong>
                </div>
                <div className="result-card">
                  <span>Part D each person</span>
                  <strong>
                    <CountUp
                      value={result.partD.monthlyPerPerson}
                      format={formatMoney}
                    />
                  </strong>
                </div>
                <div className="result-card">
                  <span>Total each month</span>
                  <strong>
                    <CountUp value={result.totalMonthly} format={formatMoney} />
                  </strong>
                </div>
              </div>

              <div className="result-section">
                <h3>Your itemized bill</h3>
                <div className="table-scroll">
                  <table className="fact-table">
                    <caption>Medicare premium breakdown for {result.year}</caption>
                    <thead>
                      <tr>
                        <th scope="col">Part</th>
                        <th scope="col">Monthly</th>
                        <th scope="col">Annual</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Part A ({result.partA.tier})</th>
                        <td>{formatMoney(result.partA.monthlyPremium)}</td>
                        <td>{formatMoney(result.partA.annualPremium)}</td>
                      </tr>
                      <tr>
                        <th scope="row">Part B (all household members)</th>
                        <td>{formatMoney(result.partB.monthlyTotal)}</td>
                        <td>{formatMoney(result.partB.annualTotal)}</td>
                      </tr>
                      <tr>
                        <th scope="row">Part D (all household members)</th>
                        <td>{formatMoney(result.partD.monthlyTotal)}</td>
                        <td>{formatMoney(result.partD.annualTotal)}</td>
                      </tr>
                      <tr>
                        <th scope="row">Total</th>
                        <td>{formatMoney(result.totalMonthly)}</td>
                        <td>{formatMoney(result.totalAnnual)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Part B shows as{' '}
                  {result.partB.irmaaAdjustment > 0
                    ? `${formatMoney(result.partB.standardPremium)} standard plus ${formatMoney(result.partB.irmaaAdjustment)} of IRMAA surcharge`
                    : 'the standard premium with no surcharge'}
                  {result.partB.monthlyPenalty > 0
                    ? `, plus ${formatMoney(result.partB.monthlyPenalty)} of late enrollment penalty`
                    : ''}
                  . Part D shows as{' '}
                  {result.partD.irmaaAdjustment > 0
                    ? `${formatMoney(result.partD.planPremium)} plan premium plus ${formatMoney(result.partD.irmaaAdjustment)} of IRMAA surcharge`
                    : 'your plan premium with no surcharge'}
                  {result.partD.monthlyPenalty > 0
                    ? `, plus ${formatMoney(result.partD.monthlyPenalty)} of late penalty`
                    : ''}
                  .
                </p>
              </div>

              <div className="result-section">
                <h3>How close to the next income bracket</h3>
                <p>
                  {result.headroomToNextBracket === null
                    ? 'You are in the top bracket, so there is no higher tier above you.'
                    : `Your income is ${formatMoney(result.headroomToNextBracket)} below the next income bracket. Crossing it raises the Part B and Part D surcharges for the year, because income from ${result.taxYearBasis} sets your ${result.year + 2} premium.`}
                </p>
              </div>

              <ShowMath>
                <ul>
                  <li>
                    Income basis: your household income from {result.taxYearBasis} is{' '}
                    {formatMoney(magiUsed)}, so the {result.year} brackets for{' '}
                    {filingLabels[filingStatus].toLowerCase()} apply.
                  </li>
                  <li>
                    Part B: {formatMoney(result.partB.monthlyWithIrmaa)} a month each
                    {result.persons === 2 ? ', two people' : ''} × {result.persons} ={' '}
                    {formatMoney(result.partB.monthlyTotal)}.
                  </li>
                  <li>
                    Part D:{' '}
                    {result.partD.enrolled
                      ? `${formatMoney(result.partD.planPremium)} plan premium + ${formatMoney(result.partD.irmaaAdjustment)} IRMAA${result.partD.monthlyPenalty > 0 ? ` + ${formatMoney(result.partD.monthlyPenalty)} penalty` : ''} each = ${formatMoney(result.partD.monthlyTotal)}`
                      : 'not included in this bill'}{' '}
                    a month.
                  </li>
                  <li>
                    Part A: {result.partA.tier.toLowerCase()} at{' '}
                    {formatMoney(result.partA.monthlyPremium)} a month for the household.
                  </li>
                  <li>
                    Total: {formatMoney(result.partA.monthlyPremium)} +{' '}
                    {formatMoney(result.partB.monthlyTotal)} +{' '}
                    {formatMoney(result.partD.monthlyTotal)} = {formatMoney(result.totalMonthly)} a
                    month, × 12 = {formatMoney(result.totalAnnual)} a year.
                  </li>
                </ul>
              </ShowMath>

              <ActionPlan
                steps={[
                  {
                    title: 'Check the income year the bill is based on',
                    detail: `Your ${result.year} premium comes from your ${result.taxYearBasis} tax return. If that year was unusual, expect a change the next time you file.`,
                  },
                  {
                    title: 'Review your Part D plan each fall',
                    detail:
                      'Plan premiums and drug costs change every year. Compare plans during the October 15 to December 7 window so a cheaper alternative does not pass you by.',
                  },
                  {
                    title: 'Ask about a life-changing event form if income dropped',
                    detail:
                      'If your income fell because of marriage, divorce, work stoppage, or another listed event, Social Security can decide to use a more recent year. See the SSA-44 guide on this site.',
                  },
                ]}
              />

              <ScenarioCompare
                currentLabel="Your income"
                currentValue={formatMoney(parsed.data?.magiTwoYearsBack ?? 0)}
                alternateLabel="Compare another income"
                alternateValue={alternateMagi !== null ? formatMoney(alternateMagi) : 'Enter an amount'}
                rows={[
                  {
                    label: 'Total each month',
                    current: formatMoney(result.totalMonthly),
                    alternate: alternateResult ? formatMoney(alternateResult.totalMonthly) : '—',
                  },
                  {
                    label: 'Part B each person',
                    current: formatMoney(result.partB.monthlyPerPerson),
                    alternate: alternateResult
                      ? formatMoney(alternateResult.partB.monthlyPerPerson)
                      : '—',
                  },
                  {
                    label: 'Part D each person',
                    current: formatMoney(result.partD.monthlyPerPerson),
                    alternate: alternateResult
                      ? formatMoney(alternateResult.partD.monthlyPerPerson)
                      : '—',
                  },
                ]}
              >
                <CurrencyField
                  id="alternate-magi"
                  label="Compare another income from the same year"
                  value={values.alternateMagi}
                  onChange={(value) => update('alternateMagi', value)}
                  optional
                  hint="See how a Roth conversion, a large sale, or a smaller year changes the whole bill."
                />
              </ScenarioCompare>

              <div className="result-actions no-print">
                <ShareResult summary={reportSummary} />
              </div>

              <section className="deadline-box" aria-labelledby="deadline-title">
                <h2 id="deadline-title">Deadline and timing</h2>
                <p>
                  Your {result.year} premium is based on income from {result.taxYearBasis}. The
                  plan you pick during fall open enrollment sets the Part D side for next year, and
                  a life-changing event form can be filed at any time while the higher premium
                  applies.
                </p>
                <ReminderIcs
                  title="Review my Medicare premiums"
                  description="Check plan premiums, any IRMAA change, and whether a life-changing event form applies. MedicareClear keeps your estimate in this browser."
                  days={30}
                  path={path}
                />
              </section>

              <CalculatorReportError
                pageTitle="Medicare premium calculator"
                path={path}
                summary={reportSummary}
              />
              <StickySummary label="Medicare total" value={verdict} />
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter your income from two years ago</h3>
              <p>
                The estimate needs one income number to pick your bracket, then your plan choices
                to add Part A, Part B, and Part D together.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
