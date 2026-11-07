'use client';

import { useMemo } from 'react';
import { ActionPlan } from '@/components/action/action-plan';
import { CalculatorEvents } from '@/components/calc/calculator-events';
import { CountUp } from '@/components/calc/count-up';
import { NumberField, RadioField } from '@/components/calc/fields';
import { GlossaryTip } from '@/components/calc/glossary-tip';
import { ShareResult, ReminderIcs, CalculatorReportError } from '@/components/calc/interactive';
import { ScenarioCompare, ShowMath, StickySummary } from '@/components/calc/calculator-blocks';
import { contactByKey } from '@/data/contacts';
import type { GlossaryTipEntry } from '@/data/glossary';
import { partAPremiumCalculator } from '@/lib/formulas/part-a-premium';
import { partAPremiumSchema } from '@/lib/validation';
import { useHashState } from '@/lib/use-hash-state';
import { formatMoney } from '@/lib/utils';

const path = '/calculators/part-a-premium/';

const defaults = {
  quarters: '',
  married: 'no',
  spouseQuarters: '',
  delayed: '',
  alternateQuarters: '',
};

const yesNoOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export function PartAPremiumCalculator({ tips }: { tips: Record<string, GlossaryTipEntry> }) {
  const { values, update } = useHashState(defaults);

  const parsed = useMemo(() => {
    if (values.quarters.trim() === '') {
      return { data: null, quartersError: '' };
    }
    const ownQuarters = Number(values.quarters);
    const spouseQuarters =
      values.spouseQuarters.trim() === '' ? undefined : Number(values.spouseQuarters);
    const yearsDelayed = values.delayed.trim() === '' ? undefined : Number(values.delayed);
    const quartersError =
      !Number.isFinite(ownQuarters) || ownQuarters < 0 || ownQuarters > 40
        ? 'Enter your quarters of coverage, from 0 to 40.'
        : '';
    const spouseError =
      spouseQuarters !== undefined && (!Number.isFinite(spouseQuarters) || spouseQuarters < 0 || spouseQuarters > 40)
        ? 'Enter spouse quarters from 0 to 40, or leave the field empty.'
        : '';
    const result = partAPremiumSchema.safeParse({
      ownQuarters,
      married: values.married === 'yes',
      spouseQuarters,
      yearsDelayed,
    });
    return {
      data:
        result.success && quartersError === '' && spouseError === ''
          ? result.data
          : null,
      quartersError,
      spouseError,
    };
  }, [values]);

  const result = useMemo(
    () => (parsed.data ? partAPremiumCalculator(parsed.data) : null),
    [parsed.data],
  );

  const alternateQuarters = Number(values.alternateQuarters);
  const alternateResult = useMemo(() => {
    if (
      !parsed.data ||
      values.alternateQuarters.trim() === '' ||
      !Number.isFinite(alternateQuarters) ||
      alternateQuarters < 0 ||
      alternateQuarters > 40
    ) {
      return null;
    }
    return partAPremiumCalculator({ ...parsed.data, ownQuarters: alternateQuarters });
  }, [parsed.data, alternateQuarters, values.alternateQuarters]);

  const verdict = !result
    ? 'Enter your quarters'
    : result.tier === 'free'
      ? 'No Part A premium'
      : result.monthlyPenalty > 0
        ? 'Premium plus late penalty'
        : result.tier === 'reduced'
          ? 'Reduced premium applies'
          : 'Full premium applies';

  const reportSummary = result
    ? `Medicare Part A premium (${result.year}). Quarters used: ${result.quartersUsed}. Tier: ${result.tierLabel}. Monthly premium: ${formatMoney(result.monthlyPremium)}. Annual premium: ${formatMoney(result.annualPremium)}. Monthly penalty: ${formatMoney(result.monthlyPenalty)} for ${result.penaltyDurationYears} years.`
    : 'No result yet.';

  return (
    <section className="calculator-shell" aria-labelledby="calculator-title">
      <CalculatorEvents path={path} complete={Boolean(result)} />
      <div className="calculator-grid">
        <form className="calculator-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <p className="calculator-kicker">Your inputs</p>
            <h2 id="calculator-title">Check your Part A premium</h2>
            <p>
              Enter your quarters of Medicare-covered work, as shown in your Social Security
              account. Results update as you type. Your inputs stay in the page address after the
              hash.
            </p>
          </div>

          <NumberField
            id="own-quarters"
            label="Your quarters of coverage"
            value={values.quarters}
            onChange={(value) => update('quarters', value)}
            min={0}
            max={40}
            hint="One quarter is about three months of work where you paid Medicare taxes. 40 quarters is about 10 years."
            error={parsed.quartersError}
          />

          <RadioField
            legend="Are you married?"
            value={values.married}
            onChange={(value) => update('married', value)}
            options={yesNoOptions}
            hint="In many cases a spouse’s work record can lower or remove your Part A premium."
          />

          {values.married === 'yes' ? (
            <NumberField
              id="spouse-quarters"
              label="Your spouse’s quarters of coverage"
              value={values.spouseQuarters}
              onChange={(value) => update('spouseQuarters', value)}
              min={0}
              max={40}
              hint="Optional. Social Security applies marriage rules to a spouse’s record, so confirm your case with Social Security."
              error={parsed.spouseError}
            />
          ) : null}

          <NumberField
            id="years-delayed"
            label="Full years you delayed signing up for Part A"
            value={values.delayed}
            onChange={(value) => update('delayed', value)}
            min={0}
            max={60}
            hint="Optional. Count full years after your first chance to enroll when you could have bought Part A but did not."
          />

          <div className="field-glossary">
            <GlossaryTip term="Part A" tips={tips} />
            <GlossaryTip term="Work credits" tips={tips} />
            <GlossaryTip term="Late enrollment penalty" tips={tips} />
          </div>

          <p className="calculator-privacy">
            This calculator runs in your browser. Nothing is submitted. The page address hash can
            contain your inputs, so avoid sharing the full link if you do not want them visible.
          </p>
        </form>

        <div className="calculator-result">
          <div className="result-header">
            <p className="calculator-kicker">Your result</p>
            <h2>Part A premium estimate</h2>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {result
              ? `${verdict}. Monthly premium ${formatMoney(result.monthlyPremium)}. Annual premium ${formatMoney(result.annualPremium)}.`
              : 'Enter your quarters of coverage to see the result.'}
          </p>

          {result ? (
            <>
              <div
                className={`result-verdict ${result.tier === 'free' ? 'is-good' : 'is-warn'}`}
              >
                {verdict}
              </div>
              <p className="result-copy">
                {result.tier === 'free'
                  ? `With ${result.quartersUsed} quarters of coverage, Part A has no monthly premium for you. Part B still has its own premium.`
                  : `With ${result.quartersUsed} quarters of coverage, Part A costs ${formatMoney(result.monthlyPremium)} a month, or ${formatMoney(result.annualPremium)} a year.`}
              </p>

              <div className="result-card-grid">
                <div className="result-card">
                  <span>Monthly premium</span>
                  <strong>
                    <CountUp value={result.monthlyPremium} format={formatMoney} />
                  </strong>
                </div>
                <div className="result-card">
                  <span>Annual premium</span>
                  <strong>
                    <CountUp value={result.annualPremium} format={formatMoney} />
                  </strong>
                </div>
                <div className="result-card">
                  <span>Quarters used</span>
                  <strong>
                    <CountUp value={result.quartersUsed} format={(value) => String(Math.round(value))} />
                  </strong>
                </div>
              </div>

              <div className="result-section">
                <h3>Your tier</h3>
                <p>{result.tierLabel}.</p>
                <p>{result.note}</p>
              </div>

              {result.monthlyPenalty > 0 ? (
                <div className="result-section">
                  <h3>Late enrollment penalty</h3>
                  <div className="table-scroll">
                    <table className="fact-table">
                      <caption>Part A late enrollment penalty</caption>
                      <tbody>
                        <tr>
                          <th scope="row">Penalty rate</th>
                          <td>10% of the monthly premium</td>
                        </tr>
                        <tr>
                          <th scope="row">Monthly penalty</th>
                          <td>{formatMoney(result.monthlyPenalty)}</td>
                        </tr>
                        <tr>
                          <th scope="row">Payable for</th>
                          <td>
                            {result.penaltyDurationYears} year
                            {result.penaltyDurationYears === 1 ? '' : 's'} (twice the years delayed)
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Monthly total during penalty</th>
                          <td>{formatMoney(result.totalMonthlyDuringPenalty)}</td>
                        </tr>
                        <tr>
                          <th scope="row">Cost across the penalty period</th>
                          <td>{formatMoney(result.penaltyCostDuringDuration)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>
                    The penalty is added for twice the number of full years you delayed. Ask Social
                    Security whether an exception or Special Enrollment Period removes it before you
                    pay.
                  </p>
                </div>
              ) : null}

              <ShowMath>
                <ul>
                  <li>
                    Quarters counted: {result.ownQuarters} yours
                    {result.spouseQuarters > 0 ? `, ${result.spouseQuarters} your spouse’s` : ''} →{' '}
                    {result.quartersUsed} used.
                  </li>
                  <li>
                    Tier: {result.quartersUsed} is {result.tier === 'free' ? '40 or more' : result.tier === 'reduced' ? 'between 30 and 39' : 'fewer than 30'} quarters →{' '}
                    {formatMoney(result.monthlyPremium)} a month.
                  </li>
                  <li>
                    Annual premium: {formatMoney(result.monthlyPremium)} × 12 ={' '}
                    {formatMoney(result.annualPremium)}.
                  </li>
                  {result.monthlyPenalty > 0 ? (
                    <>
                      <li>
                        Penalty: {formatMoney(result.monthlyPremium)} ×{' '}
                        {Math.round(result.penaltyRate * 100)}% ={' '}
                        {formatMoney(result.monthlyPenalty)} a month.
                      </li>
                      <li>
                        Penalty duration: {result.yearsDelayed} year
                        {result.yearsDelayed === 1 ? '' : 's'} delayed × 2 ={' '}
                        {result.penaltyDurationYears} years.
                      </li>
                    </>
                  ) : null}
                </ul>
              </ShowMath>

              <ActionPlan
                steps={[
                  {
                    title: 'Check your own and your spouse’s work record',
                    detail:
                      'Sign in to your Social Security account and look at the earnings history. The quarter count comes from those records, not from memory.',
                  },
                  {
                    title: 'Confirm the count with Social Security before you apply',
                    detail: `Call Social Security at ${contactByKey.ssa.phone} and ask how many quarters of coverage you and your spouse have. If you are married, divorced, or widowed, ask how the marriage rules apply to your record.`,
                  },
                  {
                    title: 'Bring the right documents if you buy Part A',
                    detail:
                      'Have your marriage certificate ready if you are using a spouse’s record, plus your Social Security number. Social Security handles the Part A application.',
                  },
                ]}
              />

              <ScenarioCompare
                currentLabel="Your quarters"
                currentValue={`${result.quartersUsed} quarters`}
                alternateLabel="Alternate quarters"
                alternateValue={
                  alternateResult ? `${alternateResult.quartersUsed} quarters` : 'Enter quarters'
                }
                rows={[
                  {
                    label: 'Tier',
                    current: result.tier === 'free' ? 'Premium-free' : result.tier === 'reduced' ? 'Reduced' : 'Full',
                    alternate: alternateResult
                      ? alternateResult.tier === 'free'
                        ? 'Premium-free'
                        : alternateResult.tier === 'reduced'
                          ? 'Reduced'
                          : 'Full'
                      : '—',
                  },
                  {
                    label: 'Monthly premium',
                    current: formatMoney(result.monthlyPremium),
                    alternate: alternateResult ? formatMoney(alternateResult.monthlyPremium) : '—',
                  },
                  {
                    label: 'Annual premium',
                    current: formatMoney(result.annualPremium),
                    alternate: alternateResult ? formatMoney(alternateResult.annualPremium) : '—',
                  },
                ]}
              >
                <NumberField
                  id="alternate-quarters"
                  label="Alternate quarters of coverage"
                  value={values.alternateQuarters}
                  onChange={(value) => update('alternateQuarters', value)}
                  min={0}
                  max={40}
                  hint="Change only the quarters to see how close you are to the next tier."
                />
              </ScenarioCompare>

              <div className="result-actions no-print">
                <ShareResult summary={reportSummary} />
              </div>

              <section className="deadline-box" aria-labelledby="deadline-title">
                <h2 id="deadline-title">Deadline and timing</h2>
                <p>
                  Part A is bought during your seven-month enrollment window around your 65th
                  birthday, unless you qualify for a Special Enrollment Period. Check your quarters
                  before that window opens so a surprise premium does not delay your sign-up.
                </p>
                <p>
                  <a href={contactByKey.ssa.url} target="_blank" rel="noreferrer">
                    Check your record with Social Security
                  </a>{' '}
                  or call {contactByKey.ssa.phone}.
                </p>
                <ReminderIcs
                  title="Check Medicare Part A work quarters"
                  description="Open MedicareClear, check your Part A premium estimate, and confirm your quarters of coverage with Social Security."
                  days={30}
                  path={path}
                />
              </section>

              <CalculatorReportError
                pageTitle="Medicare Part A premium"
                path={path}
                summary={reportSummary}
              />
              <StickySummary label="Part A premium" value={verdict} />
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter your quarters of coverage</h3>
              <p>
                The calculator needs your quarter count from 0 to 40. If you are married, add your
                spouse’s quarters to see whether their work lowers your premium.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
