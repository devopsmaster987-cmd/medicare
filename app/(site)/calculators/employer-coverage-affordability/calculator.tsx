'use client';

import { useMemo } from 'react';
import { ActionPlan } from '@/components/action/action-plan';
import { CalculatorEvents } from '@/components/calc/calculator-events';
import { CountUp } from '@/components/calc/count-up';
import { CurrencyField, RadioField, SelectField } from '@/components/calc/fields';
import { GlossaryTip } from '@/components/calc/glossary-tip';
import { ShareResult, ReminderIcs, CalculatorReportError } from '@/components/calc/interactive';
import {
  ScenarioCompare,
  ShowMath,
  StickySummary,
} from '@/components/calc/calculator-blocks';
import { contactByKey } from '@/data/contacts';
import type { GlossaryTipEntry } from '@/data/glossary';
import { figureYears } from '@/data/verified';
import {
  employerAffordability,
  payPeriodsPerYear,
} from '@/lib/formulas/employer-affordability';
import { employerAffordabilitySchema, parseMoneyInput } from '@/lib/validation';
import { useHashState } from '@/lib/use-hash-state';
import { formatMoney, formatPercent } from '@/lib/utils';

const path = '/calculators/employer-coverage-affordability';

const defaults = {
  income: '',
  premium: '',
  familyPremium: '',
  frequency: 'monthly',
  minValue: 'unknown',
  alternateIncome: '',
};

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'semimonthly', label: 'Twice a month' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Once a year' },
];

const minimumValueOptions = [
  { value: 'yes', label: 'Yes, it meets minimum value' },
  { value: 'no', label: 'No, it does not meet minimum value' },
  { value: 'unknown', label: 'Not sure' },
];

export function EmployerCalculator({ tips }: { tips: Record<string, GlossaryTipEntry> }) {
  const { values, update } = useHashState(defaults);

  const parsed = useMemo(() => {
    if (values.income.trim() === '' || values.premium.trim() === '') {
      return { data: null, incomeError: '', premiumError: '', familyError: '' };
    }
    const householdIncome = parseMoneyInput(values.income);
    const employeeOnlyPremium = parseMoneyInput(values.premium);
    const familyValue =
      values.familyPremium.trim() === '' ? undefined : parseMoneyInput(values.familyPremium);
    const familyError =
      values.familyPremium.trim() !== '' && familyValue === null
        ? 'Enter a valid family premium or leave it blank.'
        : '';
    const result = employerAffordabilitySchema.safeParse({
      householdIncome: householdIncome ?? Number.NaN,
      employeeOnlyPremium: employeeOnlyPremium ?? Number.NaN,
      familyPremium: familyValue ?? undefined,
      payFrequency: values.frequency,
      planMeetsMinimumValue:
        values.minValue === 'yes' ? true : values.minValue === 'no' ? false : undefined,
    });
    return {
      data: result.success && familyError === '' ? result.data : null,
      incomeError:
        householdIncome === null ? 'Enter a valid household income.' : '',
      premiumError:
        employeeOnlyPremium === null ? 'Enter a valid employee-only premium.' : '',
      familyError,
    };
  }, [values]);

  const result = useMemo(
    () => (parsed.data ? employerAffordability(parsed.data) : null),
    [parsed.data],
  );

  const alternateIncome =
    values.alternateIncome.trim() === ''
      ? Number.NaN
      : Number(values.alternateIncome.replace(/[^0-9.]/g, ''));
  const alternateResult = useMemo(() => {
    if (!parsed.data || !Number.isFinite(alternateIncome) || alternateIncome < 0) return null;
    return employerAffordability({ ...parsed.data, householdIncome: alternateIncome });
  }, [parsed.data, alternateIncome]);

  const verdict = result
    ? result.employeeCoverageAffordable
      ? 'Affordable under this test'
      : 'Not affordable under this test'
    : 'Enter your details';

  const subsidyLabel = result
    ? result.employeeSubsidyEligibility === 'likely-qualify'
      ? 'You may qualify for Marketplace help'
      : result.familySubsidyEligibility === 'likely-qualify'
        ? 'Family members may qualify for Marketplace help'
        : result.employeeSubsidyEligibility === 'unknown' ||
            result.familySubsidyEligibility === 'unknown'
          ? 'Answer the minimum value question'
          : 'No subsidy expected from this test'
    : 'Waiting for inputs';

  const reportSummary = result
    ? `Employer coverage affordability (${result.year}). Annual employee-only premium ${formatMoney(result.annualEmployeeOnlyPremium)}. Annual threshold ${formatMoney(result.annualThreshold)}. Employee-only premium ${result.employeeCoverageAffordable ? 'affordable' : 'not affordable'}. Marketplace signal: ${subsidyLabel}.`
    : 'No result yet.';

  return (
    <section className="calculator-shell" aria-labelledby="calculator-title">
      <CalculatorEvents path={path} complete={Boolean(result)} />
      <div className="calculator-grid">
        <form className="calculator-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <p className="calculator-kicker">Your inputs</p>
            <h2 id="calculator-title">Check the affordability test</h2>
            <p>
              Use the lowest-cost self-only plan offered to you. Results update as you type. Your
              inputs stay in the page address after the hash and are not sent to a server.
            </p>
          </div>

          <CurrencyField
            id="household-income"
            label="Household income"
            value={values.income}
            onChange={(value) => update('income', value)}
            hint="Use the income on your tax return, not just your own W-2 wages."
            error={parsed.incomeError}
          />
          <div className="field-glossary">
            <GlossaryTip term="Household income" tips={tips} />
            <GlossaryTip term="W-2 wages" tips={tips} />
          </div>

          <CurrencyField
            id="employee-premium"
            label="Employee-only premium"
            value={values.premium}
            onChange={(value) => update('premium', value)}
            hint="The amount you pay for the lowest-cost self-only plan."
            error={parsed.premiumError}
          />

          <CurrencyField
            id="family-premium"
            label="Family premium"
            value={values.familyPremium}
            onChange={(value) => update('familyPremium', value)}
            hint="Leave blank if you do not cover a spouse or children."
            error={parsed.familyError}
            optional
          />

          <SelectField
            id="pay-frequency"
            label="How often do you pay that premium?"
            value={values.frequency}
            onChange={(value) => update('frequency', value)}
            options={frequencyOptions}
          />

          <RadioField
            legend="Does the plan meet minimum value?"
            value={values.minValue}
            onChange={(value) => update('minValue', value)}
            options={minimumValueOptions}
            hint="Ask HR or check the plan's summary of benefits. Minimum value means the plan pays at least 60% of covered costs on average."
          />
          <div className="field-glossary">
            <GlossaryTip term="Minimum value" tips={tips} />
            <GlossaryTip term="Affordability percentage" tips={tips} />
          </div>

          <p className="calculator-privacy">
            This calculator runs in your browser. Nothing is submitted. The page address hash can
            contain your inputs, so avoid sharing the full link if you do not want them visible.
          </p>
        </form>

        <div className="calculator-result">
          <div className="result-header">
            <p className="calculator-kicker">Your result</p>
            <h2>Employee-only coverage</h2>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {result ? `${verdict}. ${subsidyLabel}.` : 'Enter income and premium to see the result.'}
          </p>

          {result ? (
            <>
              <div className={`result-verdict ${result.employeeCoverageAffordable ? 'is-good' : 'is-warn'}`}>
                {verdict}
              </div>
              <p className="result-copy">
                The annual employee-only premium is{' '}
                <strong>{formatMoney(result.annualEmployeeOnlyPremium)}</strong>. The affordability
                threshold is <strong>{formatMoney(result.annualThreshold)}</strong>, or{' '}
                <strong>{formatPercent(result.affordabilityRate)}</strong> of household income.
              </p>

              <div className="result-card-grid">
                <div className="result-card">
                  <span>Annual premium</span>
                  <strong>
                    <CountUp value={result.annualEmployeeOnlyPremium} format={formatMoney} />
                  </strong>
                </div>
                <div className="result-card">
                  <span>Annual threshold</span>
                  <strong>
                    <CountUp value={result.annualThreshold} format={formatMoney} />
                  </strong>
                </div>
                <div className="result-card">
                  <span>{result.employeeHeadroom >= 0 ? 'Room below the line' : 'Amount over the line'}</span>
                  <strong>
                    <CountUp value={Math.abs(result.employeeHeadroom)} format={formatMoney} />
                  </strong>
                </div>
              </div>

              <div className="result-section">
                <h3>Marketplace signal</h3>
                <p>
                  <strong>{subsidyLabel}.</strong>{' '}
                  {result.minimumValueStatus === 'unknown'
                    ? 'The affordability test is separate from the minimum value test. Answer the minimum value question to refine the signal.'
                    : result.employeeSubsidyEligibility === 'likely-qualify'
                      ? 'The employee-only premium is above the line or the plan does not meet minimum value. Check the Marketplace application.'
                      : result.familySubsidyEligibility === 'likely-qualify'
                        ? 'Employee-only coverage passes, but the family premium is above the line, so family members may qualify. Check the Marketplace application for each person.'
                        : 'The employee-only premium passes and the plan meets minimum value under the answer you selected.'}
                </p>
              </div>

              <div className="result-section">
                <h3>Family test</h3>
                {result.annualFamilyPremium === null ? (
                  <p>No family premium entered. This test applies only to the employee.</p>
                ) : (
                  <p>
                    The annual family premium is{' '}
                    <strong>{formatMoney(result.annualFamilyPremium)}</strong>. That is{' '}
                    {result.familyCoverageAffordable ? 'at or below' : 'above'} the same
                    affordability threshold. Under the family glitch fix, family members are
                    tested with the family premium: {result.familySubsidyEligibility === 'likely-qualify'
                      ? 'they may qualify for Marketplace help.'
                      : result.familySubsidyEligibility === 'likely-none'
                        ? 'they are not expected to qualify from this test.'
                        : 'answer the minimum value question to finish the test.'}
                  </p>
                )}
              </div>

              <ShowMath>
                <ul>
                  <li>
                    Annual employee-only premium: {formatMoney(parsed.data?.employeeOnlyPremium ?? 0)} ×{' '}
                    {payPeriodsPerYear[values.frequency as keyof typeof payPeriodsPerYear]} pay periods
                    = {formatMoney(result.annualEmployeeOnlyPremium)}.
                  </li>
                  <li>
                    Affordability threshold: {formatMoney(parsed.data?.householdIncome ?? 0)} ×{' '}
                    {formatPercent(result.affordabilityRate)} = {formatMoney(result.annualThreshold)}.
                  </li>
                  <li>
                    Comparison: {formatMoney(result.annualEmployeeOnlyPremium)} vs{' '}
                    {formatMoney(result.annualThreshold)}.
                  </li>
                  {result.annualFamilyPremium !== null ? (
                    <li>
                      Family comparison: {formatMoney(result.annualFamilyPremium)} vs{' '}
                      {formatMoney(result.annualThreshold)}.
                    </li>
                  ) : null}
                </ul>
              </ShowMath>

              <ActionPlan
                steps={[
                  {
                    title: 'Confirm the plan facts',
                    detail:
                      "Ask HR for the lowest-cost self-only premium and whether the plan meets minimum value. The affordability test uses those two facts, not the plan's total value or your deductible.",
                  },
                  {
                    title: 'If the employee premium is unaffordable',
                    detail:
                      "Apply through HealthCare.gov or your state Marketplace and answer the employer coverage questions honestly. Keep the offer letter and premium sheet.",
                  },
                  {
                    title: 'If family coverage is expensive',
                    detail:
                      'Family members are tested against the annual family premium and the same income threshold. If that premium is above the line, or the plan does not meet minimum value, family members may qualify even when employee-only coverage is affordable. Check the application for each person.',
                  },
                ]}
              />

              <ScenarioCompare
                currentLabel="Current income"
                currentValue={verdict}
                alternateLabel="Alternate income"
                alternateValue={
                  alternateResult
                    ? alternateResult.employeeCoverageAffordable
                      ? 'Affordable under this test'
                      : 'Not affordable under this test'
                    : 'Enter an alternate income'
                }
                rows={[
                  {
                    label: 'Annual threshold',
                    current: formatMoney(result.annualThreshold),
                    alternate: alternateResult ? formatMoney(alternateResult.annualThreshold) : '—',
                  },
                  {
                    label: 'Annual employee-only premium',
                    current: formatMoney(result.annualEmployeeOnlyPremium),
                    alternate: alternateResult
                      ? formatMoney(alternateResult.annualEmployeeOnlyPremium)
                      : '—',
                  },
                  {
                    label: 'Room or overage',
                    current: formatMoney(Math.abs(result.employeeHeadroom)),
                    alternate: alternateResult
                      ? formatMoney(Math.abs(alternateResult.employeeHeadroom))
                      : '—',
                  },
                  {
                    label: 'Marketplace signal',
                    current: subsidyLabel,
                    alternate: alternateResult
                      ? alternateResult.subsidyEligibility === 'likely-qualify'
                        ? 'May qualify'
                        : alternateResult.subsidyEligibility === 'likely-none'
                            ? 'No subsidy expected'
                            : 'Answer minimum value'
                      : '—',
                  },
                ]}
              >
                <CurrencyField
                  id="alternate-income"
                  label="Alternate household income"
                  value={values.alternateIncome}
                  onChange={(value) => update('alternateIncome', value)}
                  hint="Change this line to compare two income levels with the same premium."
                />
              </ScenarioCompare>

              <div className="result-actions no-print">
                <ShareResult summary={reportSummary} />
              </div>

              <section className="deadline-box" aria-labelledby="deadline-title">
                <h2 id="deadline-title">Deadline and timing</h2>
                <p>
                  There is no single federal deadline for checking affordability. If you are
                  comparing a job offer, the employer&apos;s response date is the one that matters.
                  Marketplace Open Enrollment dates are set each year, and special enrollment can
                  apply after a qualifying event.
                </p>
                <p>
                  <a href={contactByKey.healthcare.url} target="_blank" rel="noreferrer">
                    Check the current Marketplace dates at HealthCare.gov
                  </a>
                  .
                </p>
                <ReminderIcs
                  title="Review employer coverage affordability"
                  description="Open MedicareClear and recheck the employer affordability test with the latest premium and income facts."
                  days={7}
                  path={path}
                />
              </section>

              <CalculatorReportError pageTitle="Employer coverage affordability" path={path} summary={reportSummary} />
              <StickySummary label="Employee-only coverage" value={verdict} />
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter income and premium to see the result</h3>
              <p>
                The calculator needs a household income and an employee-only premium. Family
                coverage and minimum value are optional refinements.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
