'use client';

import { useMemo } from 'react';
import { ActionPlan } from '@/components/action/action-plan';
import { CalculatorEvents } from '@/components/calc/calculator-events';
import { CountUp } from '@/components/calc/count-up';
import { NumberField, RadioField } from '@/components/calc/fields';
import { GlossaryTip } from '@/components/calc/glossary-tip';
import { ShareResult, ReminderIcs, CalculatorReportError } from '@/components/calc/interactive';
import {
  ScenarioCompare,
  ShowMath,
  StickySummary,
} from '@/components/calc/content';
import { contactByKey } from '@/data/contacts';
import type { GlossaryTipEntry } from '@/data/glossary';
import { partB2026 } from '@/data/medicare-part-b';
import { partBPenalty as penaltyRule } from '@/data/penalties';
import { partBPenaltyCalculator } from '@/lib/formulas/part-b-penalty';
import { partBPenaltySchema } from '@/lib/validation';
import { useHashState } from '@/lib/use-hash-state';
import { formatMoney } from '@/lib/utils';

const path = '/calculators/part-b-late-enrollment-penalty';

const defaults = {
  months: '24',
  creditable: 'yes',
  sep: 'not-sure',
  exception: 'no',
  alternateMonths: '12',
};

const yesNoOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not-sure', label: 'Not sure' },
];

function booleanFromChoice(value: string): boolean | undefined {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return undefined;
}

function penaltyLabel(months: number): string {
  if (months < penaltyRule.fullPeriodMonths) {
    return 'No full 12-month penalty period';
  }
  const years = Math.floor(months / penaltyRule.fullPeriodMonths);
  return `${years} full 12-month ${years === 1 ? 'period' : 'periods'} counted`;
}

export function PartBPenaltyCalculator({ tips }: { tips: Record<string, GlossaryTipEntry> }) {
  const { values, update } = useHashState(defaults);

  const parsed = useMemo(() => {
    const months = Number(values.months);
    const result = partBPenaltySchema.safeParse({
      monthsDelayed: months,
      hadCreditableCoverage: booleanFromChoice(values.creditable),
      sepEligible: booleanFromChoice(values.sep),
      exceptionApplies: booleanFromChoice(values.exception),
    });
    const monthsError =
      values.months.trim() === ''
        ? 'Enter the number of months you delayed Part B.'
        : !Number.isInteger(months) || months < 0
          ? 'Enter a whole number of months, zero or greater.'
          : '';
    return {
      data: result.success && monthsError === '' ? result.data : null,
      monthsError,
    };
  }, [values]);

  const result = useMemo(
    () => (parsed.data ? partBPenaltyCalculator(parsed.data) : null),
    [parsed.data],
  );

  const alternateMonths = Number(values.alternateMonths);
  const alternateResult = useMemo(() => {
    if (
      !parsed.data ||
      values.alternateMonths.trim() === '' ||
      !Number.isInteger(alternateMonths) ||
      alternateMonths < 0
    ) {
      return null;
    }
    return partBPenaltyCalculator({ ...parsed.data, monthsDelayed: alternateMonths });
  }, [parsed.data, alternateMonths, values.alternateMonths]);

  const verdict = result
    ? result.fullTwelveMonthPeriods === 0
      ? 'No full-year penalty yet'
      : result.canAvoid
        ? 'Possible path to avoid the penalty'
        : 'Penalty applies'
    : 'Enter your details';

  const reportSummary = result
    ? `Part B late enrollment penalty (${result.year}). Months delayed: ${result.monthsDelayed}. Full 12-month periods: ${result.fullTwelveMonthPeriods}. Monthly penalty: ${formatMoney(result.monthlyPenalty)}. Total monthly premium: ${formatMoney(result.totalMonthlyPremium)}. 10-year penalty total: ${formatMoney(result.tenYearPenalty)}. 20-year penalty total: ${formatMoney(result.twentyYearPenalty)}.`
    : 'No result yet.';

  return (
    <section className="calculator-shell" aria-labelledby="calculator-title">
      <CalculatorEvents path={path} complete={Boolean(result)} />
      <div className="calculator-grid">
        <form className="calculator-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <p className="calculator-kicker">Your inputs</p>
            <h2 id="calculator-title">Check the Part B penalty</h2>
            <p>
              Count only months you delayed Part B after your first chance to enroll and did not
              have qualifying coverage. Results update as you type. Your inputs stay in the page
              address after the hash.
            </p>
          </div>

          <NumberField
            id="months-delayed"
            label="Months without Part B"
            value={values.months}
            onChange={(value) => update('months', value)}
            min={0}
            max={600}
            hint="Only full 12-month periods count. A delay of 11 months adds no full-year penalty."
            error={parsed.monthsError}
          />
          <div className="field-glossary">
            <GlossaryTip term="Part B" tips={tips} />
            <GlossaryTip term="SEP" tips={tips} />
          </div>

          <RadioField
            legend="Did you have creditable coverage during the delay?"
            value={values.creditable}
            onChange={(value) => update('creditable', value)}
            options={yesNoOptions}
            hint="Creditable coverage is coverage at least as good as Medicare for the benefit you delayed. Ask the plan for written confirmation."
          />
          <div className="field-glossary">
            <GlossaryTip term="Creditable coverage" tips={tips} />
          </div>

          <RadioField
            legend="Do you qualify for a Special Enrollment Period?"
            value={values.sep}
            onChange={(value) => update('sep', value)}
            options={yesNoOptions}
            hint="The usual Special Enrollment Period is eight months after active employer coverage ends. Other qualifying events may also apply."
          />

          <RadioField
            legend="Does another exception apply?"
            value={values.exception}
            onChange={(value) => update('exception', value)}
            options={yesNoOptions}
            hint="Examples can include certain disability, international volunteer, or other limited situations. Ask Social Security before assuming an exception."
          />

          <p className="calculator-privacy">
            This calculator runs in your browser. Nothing is submitted. The page address hash can
            contain your inputs, so avoid sharing the full link if you do not want them visible.
          </p>
        </form>

        <div className="calculator-result">
          <div className="result-header">
            <p className="calculator-kicker">Your result</p>
            <h2>Part B penalty estimate</h2>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {result
              ? `${verdict}. Monthly penalty ${formatMoney(result.monthlyPenalty)}. Total monthly premium ${formatMoney(result.totalMonthlyPremium)}.`
              : 'Enter the months without Part B to see the result.'}
          </p>

          {result ? (
            <>
              <div
                className={`result-verdict ${
                  result.monthlyPenalty === 0 || result.canAvoid
                    ? 'is-good'
                    : 'is-warn'
                }`}
              >
                {verdict}
              </div>
              <p className="result-copy">
                {result.fullTwelveMonthPeriods === 0
                  ? 'Your delay does not include a full 12-month period, so this estimate adds no Part B penalty.'
                  : `Each full 12-month period adds 10% of the standard premium. Your estimate adds ${formatMoney(result.monthlyPenalty)} a month to the ${formatMoney(result.standardPremium)} standard premium.`}
              </p>

              <div className="result-card-grid">
                <div className="result-card">
                  <span>Monthly penalty</span>
                  <strong>
                    <CountUp value={result.monthlyPenalty} format={formatMoney} />
                  </strong>
                </div>
                <div className="result-card">
                  <span>Total monthly premium</span>
                  <strong>
                    <CountUp value={result.totalMonthlyPremium} format={formatMoney} />
                  </strong>
                </div>
                <div className="result-card">
                  <span>Annual penalty</span>
                  <strong>
                    <CountUp value={result.annualPenalty} format={formatMoney} />
                  </strong>
                </div>
              </div>

              <div className="result-section">
                <h3>Longer view</h3>
                <div className="table-scroll">
                  <table className="fact-table">
                    <caption>Part B penalty over 10 and 20 years</caption>
                    <tbody>
                      <tr>
                        <th scope="row">10-year penalty total</th>
                        <td>{formatMoney(result.tenYearPenalty)}</td>
                      </tr>
                      <tr>
                        <th scope="row">20-year penalty total</th>
                        <td>{formatMoney(result.twentyYearPenalty)}</td>
                      </tr>
                      <tr>
                        <th scope="row">Full 12-month periods</th>
                        <td>{result.fullTwelveMonthPeriods}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  The penalty is generally permanent while you have Part B. The 10-year and 20-year
                  totals are planning views, not a statement that you must keep Part B for that long.
                </p>
              </div>

              <div className="result-section">
                <h3>Can you avoid it?</h3>
                <p>{result.avoidanceNote}</p>
                <p>
                  {values.creditable === 'yes'
                    ? 'You indicated creditable coverage. Keep the plan notice that confirms it and the exact start and end dates.'
                    : values.creditable === 'no'
                      ? 'You indicated no creditable coverage. That usually means the delay counts toward the penalty, but an exception may still change the result.'
                      : 'Creditable coverage is not confirmed. Ask the plan for a written creditable coverage notice before you rely on this result.'}
                </p>
              </div>

              <ShowMath>
                <ul>
                  <li>
                    Full 12-month periods: {result.monthsDelayed} months ÷{' '}
                    {penaltyRule.fullPeriodMonths} = {result.fullTwelveMonthPeriods} full periods.
                  </li>
                  <li>
                    Penalty rate: {result.fullTwelveMonthPeriods} × 10% ={' '}
                    {result.penaltyRate * 100}%.
                  </li>
                  <li>
                    Monthly penalty: {formatMoney(result.standardPremium)} ×{' '}
                    {result.penaltyRate * 100}% = {formatMoney(result.monthlyPenalty)}.
                  </li>
                  <li>
                    Total monthly premium: {formatMoney(result.standardPremium)} +{' '}
                    {formatMoney(result.monthlyPenalty)} = {formatMoney(result.totalMonthlyPremium)}.
                  </li>
                  <li>
                    10-year penalty total: {formatMoney(result.annualPenalty)} × 10 ={' '}
                    {formatMoney(result.tenYearPenalty)}.
                  </li>
                  <li>
                    20-year penalty total: {formatMoney(result.annualPenalty)} × 20 ={' '}
                    {formatMoney(result.twentyYearPenalty)}.
                  </li>
                </ul>
              </ShowMath>

              <ActionPlan
                steps={[
                  {
                    title: 'Confirm your exact dates with Social Security',
                    detail:
                      'Ask for the month your Initial Enrollment Period ended, the month you enrolled, and the months Social Security counted. A one-month date error can change the penalty.',
                  },
                  {
                    title: 'Keep proof of creditable coverage',
                    detail:
                      'Ask the employer or plan for a written creditable coverage notice showing the start and end dates. Do not rely on a verbal answer.',
                  },
                  {
                    title: 'If a Special Enrollment Period applies, enroll now',
                    detail:
                      'The usual window is eight months after active employer coverage ends. Gather the employer coverage end date and submit the Part B application before the window closes.',
                  },
                ]}
              />

              <ScenarioCompare
                currentLabel="Current delay"
                currentValue={`${result.monthsDelayed} months`}
                alternateLabel="Alternate delay"
                alternateValue={
                  alternateResult ? `${alternateResult.monthsDelayed} months` : 'Enter months'
                }
                rows={[
                  {
                    label: 'Full 12-month periods',
                    current: String(result.fullTwelveMonthPeriods),
                    alternate: alternateResult
                      ? String(alternateResult.fullTwelveMonthPeriods)
                      : '—',
                  },
                  {
                    label: 'Monthly penalty',
                    current: formatMoney(result.monthlyPenalty),
                    alternate: alternateResult ? formatMoney(alternateResult.monthlyPenalty) : '—',
                  },
                  {
                    label: 'Total monthly premium',
                    current: formatMoney(result.totalMonthlyPremium),
                    alternate: alternateResult
                      ? formatMoney(alternateResult.totalMonthlyPremium)
                      : '—',
                  },
                  {
                    label: '20-year penalty total',
                    current: formatMoney(result.twentyYearPenalty),
                    alternate: alternateResult
                      ? formatMoney(alternateResult.twentyYearPenalty)
                      : '—',
                  },
                ]}
              >
                <NumberField
                  id="alternate-months"
                  label="Alternate months without Part B"
                  value={values.alternateMonths}
                  onChange={(value) => update('alternateMonths', value)}
                  min={0}
                  max={600}
                  hint="Change only the delay to isolate the penalty difference."
                />
              </ScenarioCompare>

              <div className="result-actions no-print">
                <ShareResult summary={reportSummary} />
              </div>

              <section className="deadline-box" aria-labelledby="deadline-title">
                <h2 id="deadline-title">Deadline and timing</h2>
                <p>
                  If you are leaving active employer coverage, the usual Special Enrollment Period
                  lasts eight months after that coverage ends. The General Enrollment Period runs
                  January 1 through March 31 each year for people who missed their first chance.
                </p>
                <p>
                  <a href={contactByKey.ssa.url} target="_blank" rel="noreferrer">
                    Confirm your enrollment dates with Social Security
                  </a>
                  .
                </p>
                <ReminderIcs
                  title="Review Part B enrollment and penalty"
                  description="Open MedicareClear, confirm the Part B dates and creditable coverage, and contact Social Security if the penalty looks wrong."
                  days={30}
                  path={path}
                />
              </section>

              <CalculatorReportError
                pageTitle="Part B late enrollment penalty"
                path={path}
                summary={reportSummary}
              />
              <StickySummary label="Part B penalty" value={verdict} />
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter the months without Part B</h3>
              <p>
                The calculator needs a whole number of months. Creditable coverage and a Special
                Enrollment Period can change whether the penalty is avoidable.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
