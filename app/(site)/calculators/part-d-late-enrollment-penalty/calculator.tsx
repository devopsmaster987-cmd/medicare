'use client';

import { useMemo } from 'react';
import { ActionPlan } from '@/components/action/action-plan';
import { CalculatorEvents } from '@/components/calc/calculator-events';
import { CountUp } from '@/components/calc/count-up';
import { CurrencyField, NumberField, RadioField } from '@/components/calc/fields';
import { GlossaryTip } from '@/components/calc/glossary-tip';
import { ShareResult, ReminderIcs, CalculatorReportError } from '@/components/calc/interactive';
import { ScenarioCompare, ShowMath, StickySummary } from '@/components/calc/calculator-blocks';
import { contactByKey } from '@/data/contacts';
import type { GlossaryTipEntry } from '@/data/glossary';
import { irs2026 } from '@/data/irs';
import { partDPenalty as penaltyRule } from '@/data/penalties';
import { partDPenaltyCalculator } from '@/lib/formulas/part-d-penalty';
import { parseOptionalMoneyInput, partDPenaltySchema } from '@/lib/validation';
import { useHashState } from '@/lib/use-hash-state';
import { formatMoney, formatPercent } from '@/lib/utils';

const path = '/calculators/part-d-late-enrollment-penalty/';

const defaults = {
  months: '',
  creditable: 'not-sure',
  shortGap: 'not-sure',
  planPremium: '',
  alternateMonths: '',
};

const yesNoOptions = [
  { value: 'yes', label: 'Yes, confirmed in writing' },
  { value: 'no', label: 'No' },
  { value: 'not-sure', label: 'Not sure' },
];

function booleanFromChoice(value: string): boolean | undefined {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return undefined;
}

function monthDay(year: number, month: number, day: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function PartDPenaltyCalculator({ tips }: { tips: Record<string, GlossaryTipEntry> }) {
  const { values, update } = useHashState(defaults);

  const parsed = useMemo(() => {
    if (values.months.trim() === '') {
      return { data: null, monthsError: '' };
    }
    const months = Number(values.months);
    const planPremium = parseOptionalMoneyInput(values.planPremium);
    const result = partDPenaltySchema.safeParse({
      monthsWithoutCoverage: months,
      creditableCoverageConfirmed: booleanFromChoice(values.creditable),
      gapUnder63Days: booleanFromChoice(values.shortGap),
      planPremium,
    });
    const monthsError =
      !Number.isInteger(months) || months < 0
        ? 'Enter a whole number of months, zero or greater.'
        : '';
    return {
      data: result.success && monthsError === '' ? result.data : null,
      monthsError,
    };
  }, [values]);

  const result = useMemo(
    () => (parsed.data ? partDPenaltyCalculator(parsed.data) : null),
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
    return partDPenaltyCalculator({ ...parsed.data, monthsWithoutCoverage: alternateMonths });
  }, [parsed.data, alternateMonths, values.alternateMonths]);

  const verdict = result
    ? result.monthsCounted === 0
      ? 'No penalty counted'
      : result.monthlyPenalty === 0
        ? 'No penalty yet'
        : result.creditableCoverageStatus === 'confirmed'
          ? 'Penalty may be removed'
          : 'Penalty applies'
    : 'Enter your months';

  const reportSummary = result
    ? `Part D late enrollment penalty (${result.year}). Months without creditable coverage: ${result.monthsWithoutCoverage}. Months counted: ${result.monthsCounted}. Monthly penalty: ${formatMoney(result.monthlyPenalty)}. Annual penalty: ${formatMoney(result.annualPenalty)}. 10-year penalty total: ${formatMoney(result.tenYearPenalty)}. 20-year penalty total: ${formatMoney(result.twentyYearPenalty)}.`
    : 'No result yet.';

  const enrollmentStart = monthDay(
    irs2026.annualEnrollmentPeriod.year,
    irs2026.annualEnrollmentPeriod.startMonth,
    irs2026.annualEnrollmentPeriod.startDay,
  );
  const enrollmentEnd = monthDay(
    irs2026.annualEnrollmentPeriod.year,
    irs2026.annualEnrollmentPeriod.endMonth,
    irs2026.annualEnrollmentPeriod.endDay,
  );

  return (
    <section className="calculator-shell" aria-labelledby="calculator-title">
      <CalculatorEvents path={path} complete={Boolean(result)} />
      <div className="calculator-grid">
        <form className="calculator-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <p className="calculator-kicker">Your inputs</p>
            <h2 id="calculator-title">Check the Part D penalty</h2>
            <p>
              Enter the number of full months you went without Part D or other creditable drug
              coverage after your first chance to enroll. Results update as you type. Your inputs
              stay in the page address after the hash.
            </p>
          </div>

          <NumberField
            id="months-without-coverage"
            label="Full months without creditable drug coverage"
            value={values.months}
            onChange={(value) => update('months', value)}
            min={0}
            max={600}
            hint="Count full months only. A few uncovered days inside a month do not add another month by themselves."
            error={parsed.monthsError}
          />
          <div className="field-glossary">
            <GlossaryTip term="Part D" tips={tips} />
            <GlossaryTip term="Creditable coverage" tips={tips} />
          </div>

          <RadioField
            legend="Does a written notice confirm creditable drug coverage for the whole gap?"
            value={values.creditable}
            onChange={(value) => update('creditable', value)}
            options={yesNoOptions}
            hint="The plan or employer must tell you in writing whether its drug coverage is creditable. A verbal answer is not enough."
          />

          <RadioField
            legend="Was the continuous gap shorter than 63 days?"
            value={values.shortGap}
            onChange={(value) => update('shortGap', value)}
            options={yesNoOptions}
            hint="The penalty generally starts with a continuous gap of 63 days or more. Count the dates from the plan records, not from memory."
          />

          <CurrencyField
            id="plan-premium"
            label="Your Part D plan premium"
            value={values.planPremium}
            onChange={(value) => update('planPremium', value)}
            hint="Optional. Add the plan premium to see the penalty and the plan premium together on one bill."
            optional
          />

          <p className="calculator-privacy">
            This calculator runs in your browser. Nothing is submitted. The page address hash can
            contain your inputs, so avoid sharing the full link if you do not want them visible.
          </p>
        </form>

        <div className="calculator-result">
          <div className="result-header">
            <p className="calculator-kicker">Your result</p>
            <h2>Part D penalty estimate</h2>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {result
              ? `${verdict}. Monthly penalty ${formatMoney(result.monthlyPenalty)}. Annual penalty ${formatMoney(result.annualPenalty)}.`
              : 'Enter the months without creditable drug coverage to see the result.'}
          </p>

          {result ? (
            <>
              <div
                className={`result-verdict ${
                  result.monthlyPenalty === 0 ? 'is-good' : 'is-warn'
                }`}
              >
                {verdict}
              </div>
              <p className="result-copy">
                {result.monthsCounted === 0
                  ? result.shortGapExcluded
                    ? 'You reported a continuous gap shorter than 63 days. The penalty generally starts with a gap of 63 days or more, so this estimate adds no penalty. Keep the exact coverage dates.'
                    : 'You reported confirmed creditable drug coverage for the gap, so this estimate adds no penalty. Keep the written notice. If the notice does not cover every month, the uncovered months can still count.'
                  : `The penalty is 1% of the ${formatMoney(result.basePremium)} national base beneficiary premium for each full uncovered month. That adds ${formatMoney(result.monthlyPenalty)} a month to your Part D bill.`}
              </p>

              <div className="result-card-grid">
                <div className="result-card">
                  <span>Monthly penalty</span>
                  <strong>
                    <CountUp value={result.monthlyPenalty} format={formatMoney} />
                  </strong>
                </div>
                <div className="result-card">
                  <span>Annual penalty</span>
                  <strong>
                    <CountUp value={result.annualPenalty} format={formatMoney} />
                  </strong>
                </div>
                <div className="result-card">
                  <span>{result.totalMonthlyWithPlan === null ? 'Base premium' : 'Plan plus penalty'}</span>
                  <strong>
                    <CountUp
                      value={result.totalMonthlyWithPlan ?? result.basePremium}
                      format={formatMoney}
                    />
                  </strong>
                </div>
              </div>

              <div className="result-section">
                <h3>Longer view</h3>
                <div className="table-scroll">
                  <table className="fact-table">
                    <caption>Part D penalty over 10 and 20 years</caption>
                    <tbody>
                      <tr>
                        <th scope="row">Months counted</th>
                        <td>{result.monthsCounted}</td>
                      </tr>
                      <tr>
                        <th scope="row">Penalty rate</th>
                        <td>{formatPercent(result.penaltyRate)}</td>
                      </tr>
                      <tr>
                        <th scope="row">10-year penalty total</th>
                        <td>{formatMoney(result.tenYearPenalty)}</td>
                      </tr>
                      <tr>
                        <th scope="row">20-year penalty total</th>
                        <td>{formatMoney(result.twentyYearPenalty)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  The penalty is generally permanent while you have Part D. These totals are
                  planning views at the current base premium; the penalty is recalculated each year
                  as the national base beneficiary premium changes.
                </p>
              </div>

              <div className="result-section">
                <h3>Can it be reviewed?</h3>
                <p>{result.note}</p>
                <p>
                  <a href={contactByKey.medicare.url} target="_blank" rel="noreferrer">
                    Ask Medicare about the penalty
                  </a>
                  . Keep the plan notice and the exact start and end dates for the coverage.
                </p>
              </div>

              <ShowMath>
                <ul>
                  <li>Full months without coverage: {result.monthsWithoutCoverage}.</li>
                  {result.monthsExcluded > 0 ? (
                    <li>
                      Months excluded because of confirmed creditable coverage or a continuous gap
                      shorter than 63 days: {result.monthsExcluded}.
                    </li>
                  ) : null}
                  <li>
                    Penalty rate: {result.monthsCounted} × {formatPercent(penaltyRule.ratePerUncoveredMonth.rate)} ={' '}
                    {formatPercent(result.penaltyRate)}.
                  </li>
                  <li>
                    Unrounded penalty: {formatMoney(result.basePremium)} ×{' '}
                    {formatPercent(result.penaltyRate)} ={' '}
                    {formatMoney(result.basePremium * result.penaltyRate)}.
                  </li>
                  <li>
                    Rounded monthly penalty: {formatMoney(result.basePremium * result.penaltyRate)} →{' '}
                    {formatMoney(result.monthlyPenalty)} (nearest 10 cents).
                  </li>
                  <li>
                    Annual penalty: {formatMoney(result.monthlyPenalty)} × 12 ={' '}
                    {formatMoney(result.annualPenalty)}.
                  </li>
                  <li>
                    10-year penalty total: {formatMoney(result.annualPenalty)} × 10 ={' '}
                    {formatMoney(result.tenYearPenalty)}.
                  </li>
                  <li>
                    20-year penalty total: {formatMoney(result.annualPenalty)} × 20 ={' '}
                    {formatMoney(result.twentyYearPenalty)}.
                  </li>
                  {result.totalMonthlyWithPlan !== null ? (
                    <li>
                      Plan premium plus penalty: {formatMoney(result.planPremium ?? 0)} +{' '}
                      {formatMoney(result.monthlyPenalty)} ={' '}
                      {formatMoney(result.totalMonthlyWithPlan)}.
                    </li>
                  ) : null}
                </ul>
              </ShowMath>

              <ActionPlan
                steps={[
                  {
                    title: 'Find the plan’s creditable coverage notice',
                    detail:
                      'Ask the employer, union, or drug plan for the written notice that covers the exact gap. The notice should show whether the drug coverage was creditable and the dates it covered.',
                  },
                  {
                    title: 'Check your Part D enrollment dates',
                    detail:
                      'Ask Medicare or your plan when your Part D coverage started and which months were counted. A date error can change the penalty.',
                  },
                  {
                    title: 'Ask for a review if the notice covers the gap',
                    detail:
                      'Contact Medicare and the plan with the notice. If the records show creditable coverage, the penalty can be corrected. Do not stop paying the premium while a review is pending without confirming what the plan expects.',
                  },
                ]}
              />

              <ScenarioCompare
                currentLabel="Current gap"
                currentValue={`${result.monthsWithoutCoverage} months`}
                alternateLabel="Alternate gap"
                alternateValue={
                  alternateResult ? `${alternateResult.monthsWithoutCoverage} months` : 'Enter months'
                }
                rows={[
                  {
                    label: 'Months counted',
                    current: String(result.monthsCounted),
                    alternate: alternateResult ? String(alternateResult.monthsCounted) : '—',
                  },
                  {
                    label: 'Monthly penalty',
                    current: formatMoney(result.monthlyPenalty),
                    alternate: alternateResult ? formatMoney(alternateResult.monthlyPenalty) : '—',
                  },
                  {
                    label: 'Annual penalty',
                    current: formatMoney(result.annualPenalty),
                    alternate: alternateResult ? formatMoney(alternateResult.annualPenalty) : '—',
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
                  label="Alternate months without creditable coverage"
                  value={values.alternateMonths}
                  onChange={(value) => update('alternateMonths', value)}
                  min={0}
                  max={600}
                  hint="Change only the gap to isolate the penalty difference."
                />
              </ScenarioCompare>

              <div className="result-actions no-print">
                <ShareResult summary={reportSummary} />
              </div>

              <section className="deadline-box" aria-labelledby="deadline-title">
                <h2 id="deadline-title">Deadline and timing</h2>
                <p>
                  If you are joining or changing a Part D plan, the yearly Medicare window runs{' '}
                  {enrollmentStart} through {enrollmentEnd}. A qualifying special enrollment period
                  can open a different window. Ask the plan or Medicare to confirm your dates before
                  the window closes.
                </p>
                <p>
                  <a href={contactByKey.medicare.url} target="_blank" rel="noreferrer">
                    Confirm your Part D dates with Medicare
                  </a>
                  .
                </p>
                <ReminderIcs
                  title="Review Part D coverage and penalty"
                  description="Open MedicareClear, check the Part D gap and the creditable coverage notice, and contact Medicare or the plan if the penalty looks wrong."
                  days={30}
                  path={path}
                />
              </section>

              <CalculatorReportError
                pageTitle="Part D late enrollment penalty"
                path={path}
                summary={reportSummary}
              />
              <StickySummary label="Part D penalty" value={verdict} />
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter the months without creditable drug coverage</h3>
              <p>
                The calculator needs a whole number of months. A written creditable coverage notice
                can change whether those months count.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
