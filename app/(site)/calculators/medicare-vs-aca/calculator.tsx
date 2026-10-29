'use client';

import { useMemo } from 'react';
import { ActionPlan } from '@/components/action/action-plan';
import { CalculatorEvents } from '@/components/calc/calculator-events';
import { MonthField, NumberField, RadioField, SelectField } from '@/components/calc/fields';
import { GlossaryTip } from '@/components/calc/glossary-tip';
import { ShareResult, ReminderIcs, CalculatorReportError } from '@/components/calc/interactive';
import {
  ScenarioCompare,
  ShowMath,
  StickySummary,
} from '@/components/calc/calculator-blocks';
import { contactByKey } from '@/data/contacts';
import type { GlossaryTipEntry } from '@/data/glossary';
import { partA2026 } from '@/data/medicare-part-a';
import { partB2026 } from '@/data/medicare-part-b';
import type { CoverageType } from '@/lib/formulas/medicare-vs-aca';
import { medicareVsAca } from '@/lib/formulas/medicare-vs-aca';
import { medicareVsAcaSchema } from '@/lib/validation';
import { useHashState } from '@/lib/use-hash-state';
import { formatDate, formatMoney } from '@/lib/utils';

const path = '/calculators/medicare-vs-aca/';
const defaults = {
  age: '',
  coverage: 'active',
  employerSize: '',
  creditable: 'yes',
  hsa: 'no',
  credits: '40',
  turning65: '',
  coverageEnd: '',
  alternateAge: '',
};

const coverageOptions = [
  { value: 'active', label: 'Active employer coverage' },
  { value: 'retiree', label: 'Retiree employer coverage' },
  { value: 'cobra', label: 'COBRA' },
  { value: 'none', label: 'No employer coverage' },
];

const yesNoOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not-sure', label: 'Not sure' },
];

const creditOptions = [
  { value: '40', label: '40 or more credits' },
  { value: '35', label: '30 to 39 credits' },
  { value: '0', label: 'Fewer than 30 credits' },
  { value: 'unknown', label: 'Not sure' },
];

const creditLabels: Record<string, string> = {
  '40': '40 or more credits',
  '35': '30 to 39 credits',
  '0': 'Fewer than 30 credits',
  unknown: 'Not confirmed',
};

const coverageLabels: Record<CoverageType, string> = {
  active: 'active employer coverage',
  retiree: 'retiree coverage',
  cobra: 'COBRA',
  none: 'no employer coverage',
};

function booleanFromChoice(value: string): boolean | undefined {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return undefined;
}

function parseMonth(value: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  const parsedYear = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (month < 0 || month > 11) return null;
  return { year: parsedYear, month };
}

function shiftMonth(yearValue: number, monthValue: number, offset: number) {
  const date = new Date(Date.UTC(yearValue, monthValue + offset, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}

function firstDayIso(yearValue: number, monthValue: number): string {
  return new Date(Date.UTC(yearValue, monthValue, 1)).toISOString().slice(0, 10);
}

function lastDayIso(yearValue: number, monthValue: number): string {
  return new Date(Date.UTC(yearValue, monthValue + 1, 0)).toISOString().slice(0, 10);
}

function dateRange(start: { year: number; month: number }, end: { year: number; month: number }) {
  return `${formatDate(firstDayIso(start.year, start.month))} to ${formatDate(lastDayIso(end.year, end.month))}`;
}

export function MedicareVsAcaCalculator({ tips }: { tips: Record<string, GlossaryTipEntry> }) {
  const { values, update } = useHashState(defaults);

  const parsed = useMemo(() => {
    if (values.age.trim() === '') {
      return { data: null, ageError: '', employerError: '' };
    }
    const age = Number(values.age);
    const employerSize =
      values.employerSize.trim() === '' ? undefined : Number(values.employerSize);
    const workCredits = values.credits === 'unknown' ? undefined : Number(values.credits);
    const result = medicareVsAcaSchema.safeParse({
      age,
      employerSize,
      coverageType: values.coverage,
      creditableCoverage: booleanFromChoice(values.creditable),
      hasHsa: booleanFromChoice(values.hsa),
      workCredits,
      premiumFreePartA:
        values.credits === '40' ? true : values.credits === '0' ? false : undefined,
    });
    const ageError =
      values.age.trim() === ''
        ? 'Enter your age.'
        : !Number.isInteger(age) || age < 0
          ? 'Enter a whole-number age.'
          : '';
    const employerError =
      values.coverage === 'active' &&
      (employerSize === undefined || !Number.isFinite(employerSize) || employerSize < 0)
        ? 'Enter the number of employees, or zero if unsure.'
        : '';
    return {
      data: result.success && ageError === '' && employerError === '' ? result.data : null,
      ageError,
      employerError,
    };
  }, [values]);

  const result = useMemo(
    () => (parsed.data ? medicareVsAca(parsed.data) : null),
    [parsed.data],
  );

  const alternateAge = Number(values.alternateAge);
  const alternateResult = useMemo(() => {
    if (
      !parsed.data ||
      values.alternateAge.trim() === '' ||
      !Number.isInteger(alternateAge) ||
      alternateAge < 0
    ) {
      return null;
    }
    return medicareVsAca({ ...parsed.data, age: alternateAge });
  }, [parsed.data, alternateAge, values.alternateAge]);

  const turning65 = parseMonth(values.turning65);
  const coverageEnd = parseMonth(values.coverageEnd);
  const iep = turning65
    ? {
        start: shiftMonth(turning65.year, turning65.month, -3),
        end: shiftMonth(turning65.year, turning65.month, 3),
      }
    : null;
  const sep = coverageEnd
    ? {
        start: shiftMonth(coverageEnd.year, coverageEnd.month, 1),
        end: shiftMonth(coverageEnd.year, coverageEnd.month, 8),
      }
    : null;

  const verdict = result ? result.pathLabel : 'Enter your details';

  const subsidyLabel = result
    ? result.acaSubsidyStatus === 'ends'
      ? 'Marketplace subsidies generally end'
      : result.acaSubsidyStatus === 'not-eligible-with-employer'
        ? 'Employer coverage may block subsidies'
        : 'Check Marketplace subsidy eligibility'
    : 'Waiting for inputs';

  const partALabel = result
    ? result.partAStatus === 'premium-free'
      ? 'Premium-free'
      : result.partAStatus === 'reduced'
        ? 'Reduced premium'
        : result.partAStatus === 'full'
          ? 'Full premium'
          : 'Not confirmed'
    : 'Waiting for inputs';

  const reportSummary = result
    ? `Medicare vs ACA decision (${result.year}). Age: ${parsed.data?.age}. Coverage: ${coverageLabels[parsed.data?.coverageType ?? 'none']}. Path: ${result.pathLabel}. Part A status: ${partALabel}. Annual Part B: ${formatMoney(result.annualPartBPremium)}. Annual Part A: ${formatMoney(result.annualPartAPremium)}. Total annual Medicare estimate: ${formatMoney(result.annualMedicarePremiumEstimate)}. ACA subsidy status: ${subsidyLabel}.`
    : 'No result yet.';

  return (
    <section className="calculator-shell" aria-labelledby="calculator-title">
      <CalculatorEvents path={path} complete={Boolean(result)} />
      <div className="calculator-grid">
        <form className="calculator-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <p className="calculator-kicker">Your inputs</p>
            <h2 id="calculator-title">Compare Medicare and Marketplace paths</h2>
            <p>
              The answer depends on your age, the employer&apos;s size, the type of coverage, and
              whether you have premium-free Part A. Results update as you type.
            </p>
          </div>

          <NumberField
            id="age"
            label="Your age"
            value={values.age}
            onChange={(value) => update('age', value)}
            min={0}
            max={120}
            hint="Medicare generally starts at 65, with disability and other exceptions."
            error={parsed.ageError}
          />

          <SelectField
            id="coverage-type"
            label="Current coverage"
            value={values.coverage}
            onChange={(value) => update('coverage', value)}
            options={coverageOptions}
            hint="Active employer coverage is different from retiree coverage and COBRA."
          />

          <NumberField
            id="employer-size"
            label="Employer size"
            value={values.employerSize}
            onChange={(value) => update('employerSize', value)}
            min={0}
            max={1000000}
            hint="The 20-employee rule matters for active employer coverage. Ask HR if the count includes full-time equivalents."
            error={parsed.employerError}
          />

          <RadioField
            legend="Is the employer coverage creditable?"
            value={values.creditable}
            onChange={(value) => update('creditable', value)}
            options={yesNoOptions}
            hint="Ask the plan for its written creditable coverage notice. A verbal answer is not enough."
          />
          <div className="field-glossary">
            <GlossaryTip term="Creditable coverage" tips={tips} />
            <GlossaryTip term="Part A" tips={tips} />
            <GlossaryTip term="Part B" tips={tips} />
          </div>

          <SelectField
            id="work-credits"
            label="Social Security work credits"
            value={values.credits}
            onChange={(value) => update('credits', value)}
            options={creditOptions}
            hint="40 credits usually means premium-free Part A. 30 to 39 credits can mean a reduced premium."
          />

          <RadioField
            legend="Do you contribute to an HSA?"
            value={values.hsa}
            onChange={(value) => update('hsa', value)}
            options={yesNoOptions}
            hint="Stop HSA contributions six months before Part A begins because Part A can be backdated."
          />
          <div className="field-glossary">
            <GlossaryTip term="HSA" tips={tips} />
          </div>

          <MonthField
            id="turning-65"
            label="Month you turn 65"
            value={values.turning65}
            onChange={(value) => update('turning65', value)}
            hint="Used to show your seven-month Initial Enrollment Period."
          />

          <MonthField
            id="coverage-end"
            label="Month active employer coverage ends"
            value={values.coverageEnd}
            onChange={(value) => update('coverageEnd', value)}
            hint="Optional. Used to show the eight-month Special Enrollment Period."
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
            <h2>Recommended path</h2>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {result
              ? `${verdict}. Part A status ${partALabel}. Annual Medicare premium estimate ${formatMoney(result.annualMedicarePremiumEstimate)}.`
              : 'Enter your age and coverage to see the path.'}
          </p>

          {result ? (
            <>
              <div className={`result-verdict ${result.path === 'delay-part-b' ? 'is-good' : 'is-warn'}`}>
                {verdict}
              </div>
              <p className="result-copy">
                At age {parsed.data?.age} with {coverageLabels[parsed.data?.coverageType ?? 'none']},
                the calculator recommends: <strong>{result.pathLabel}</strong>. Part A is{' '}
                <strong>{partALabel.toLowerCase()}</strong>, and the annual Medicare premium
                estimate is <strong>{formatMoney(result.annualMedicarePremiumEstimate)}</strong>.
              </p>

              <div className="result-card-grid result-card-grid--four">
                <div className="result-card">
                  <span>Part A status</span>
                  <strong>{partALabel}</strong>
                </div>
                <div className="result-card">
                  <span>Annual Part B</span>
                  <strong>{formatMoney(result.annualPartBPremium)}</strong>
                </div>
                <div className="result-card">
                  <span>Annual Part A</span>
                  <strong>{formatMoney(result.annualPartAPremium)}</strong>
                </div>
                <div className="result-card">
                  <span>ACA subsidy signal</span>
                  <strong>{subsidyLabel}</strong>
                </div>
              </div>

              <div className="result-section">
                <h3>Why this path</h3>
                <ul>
                  {result.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                {result.warnings.length > 0 ? (
                  <>
                    <h3>Check these warnings</h3>
                    <ul>
                      {result.warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>

              <div className="result-section">
                <h3>Deadline timeline</h3>
                {iep || sep ? (
                  <div className="table-scroll">
                    <table className="fact-table">
                      <caption>Your Medicare enrollment windows</caption>
                      <thead>
                        <tr>
                          <th scope="col">Window</th>
                          <th scope="col">Dates</th>
                          <th scope="col">What to do</th>
                        </tr>
                      </thead>
                      <tbody>
                        {iep ? (
                          <tr>
                            <th scope="row">Initial Enrollment Period</th>
                            <td>{dateRange(iep.start, iep.end)}</td>
                            <td>Sign up for Part A and Part B if you are not delaying.</td>
                          </tr>
                        ) : null}
                        {sep ? (
                          <tr>
                            <th scope="row">Special Enrollment Period</th>
                            <td>{dateRange(sep.start, sep.end)}</td>
                            <td>Enroll in Part B without a penalty if you qualify.</td>
                          </tr>
                        ) : null}
                        <tr>
                          <th scope="row">General Enrollment Period</th>
                          <td>January 1 through March 31 each year</td>
                          <td>Use this if you missed your first chance and do not qualify for a SEP.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>
                    Enter the month you turn 65 to see your seven-month Initial Enrollment Period.
                    Enter the month active coverage ends to see the eight-month Special Enrollment
                    Period.
                  </p>
                )}
              </div>

              <div className="result-section">
                <h3>Cost view</h3>
                <p>{result.costDeltaNote}</p>
                <p>
                  This estimate does not include a Marketplace benchmark premium, a Medicare
                  Advantage plan, a Medigap policy, or Part D. Compare those costs separately before
                  choosing a path.
                </p>
              </div>

              <ShowMath>
                <ul>
                  <li>
                    Part B: {formatMoney(partB2026.standardPremium.amount)} × 12 ={' '}
                    {formatMoney(result.annualPartBPremium)}.
                  </li>
                  <li>
                    Part A: {result.partAStatus === 'premium-free'
                      ? `premium-free, so the annual amount is ${formatMoney(0)}.`
                      : result.partAStatus === 'reduced'
                        ? `${formatMoney(partA2026.reducedPremium.amount)} × 12 = ${formatMoney(result.annualPartAPremium)}.`
                        : result.partAStatus === 'unknown'
                          ? `assumed at the full ${formatMoney(partA2026.fullPremium.amount)} × 12 = ${formatMoney(result.annualPartAPremium)} until confirmed.`
                          : `${formatMoney(partA2026.fullPremium.amount)} × 12 = ${formatMoney(result.annualPartAPremium)}.`}
                  </li>
                  <li>
                    Annual Medicare premium estimate: {formatMoney(result.annualPartBPremium)} +{' '}
                    {formatMoney(result.annualPartAPremium)} ={' '}
                    {formatMoney(result.annualMedicarePremiumEstimate)}.
                  </li>
                  <li>
                    Employer size rule: {parsed.data?.employerSize ?? 0} employees. The comparison
                    uses the 20-employee rule where active coverage applies.
                  </li>
                </ul>
              </ShowMath>

              <ActionPlan
                steps={[
                  {
                    title: 'Confirm the employer facts',
                    detail:
                      'Ask HR for the employer size, whether the coverage is creditable, and the exact date active coverage ends. Keep the written answer.',
                  },
                  {
                    title: 'Protect the Part B window',
                    detail:
                      'If you can delay Part B, calendar the eight-month Special Enrollment Period after active coverage ends. If you cannot delay, enroll during your Initial Enrollment Period.',
                  },
                  {
                    title: 'Handle Part A and the HSA',
                    detail:
                      'If Part A is not premium-free, compare the full Part A and Part B cost with a Marketplace plan. If you contribute to an HSA, stop contributions six months before Part A begins.',
                  },
                ]}
              />

              <ScenarioCompare
                currentLabel="Current age"
                currentValue={`${parsed.data?.age ?? 0}`}
                alternateLabel="Alternate age"
                alternateValue={alternateResult ? `${alternateAge}` : 'Enter age'}
                rows={[
                  {
                    label: 'Recommended path',
                    current: result.pathLabel,
                    alternate: alternateResult ? alternateResult.pathLabel : '—',
                  },
                  {
                    label: 'Part A status',
                    current: partALabel,
                    alternate: alternateResult
                      ? alternateResult.partAStatus === 'premium-free'
                        ? 'Premium-free'
                        : alternateResult.partAStatus === 'reduced'
                          ? 'Reduced premium'
                          : alternateResult.partAStatus === 'full'
                            ? 'Full premium'
                            : 'Not confirmed'
                      : '—',
                  },
                  {
                    label: 'Annual Medicare estimate',
                    current: formatMoney(result.annualMedicarePremiumEstimate),
                    alternate: alternateResult
                      ? formatMoney(alternateResult.annualMedicarePremiumEstimate)
                      : '—',
                  },
                  {
                    label: 'ACA subsidy signal',
                    current: subsidyLabel,
                    alternate: alternateResult
                      ? alternateResult.acaSubsidyStatus === 'ends'
                        ? 'Marketplace subsidies generally end'
                        : alternateResult.acaSubsidyStatus === 'not-eligible-with-employer'
                          ? 'Employer coverage may block subsidies'
                          : 'Check Marketplace subsidy eligibility'
                      : '—',
                  },
                ]}
              >
                <NumberField
                  id="alternate-age"
                  label="Alternate age"
                  value={values.alternateAge}
                  onChange={(value) => update('alternateAge', value)}
                  min={0}
                  max={120}
                  hint="Change only the age to isolate the age-based decision."
                />
              </ScenarioCompare>

              <div className="result-actions no-print">
                <ShareResult summary={reportSummary} />
              </div>

              <section className="deadline-box" aria-labelledby="deadline-title">
                <h2 id="deadline-title">Deadline and timing</h2>
                <p>
                  The Initial Enrollment Period is seven months around the month you turn 65. The
                  usual employment Special Enrollment Period is eight months after active coverage
                  ends. The General Enrollment Period is January 1 through March 31 each year.
                </p>
                <p>
                  COBRA and retiree coverage generally do not extend the Part B Special Enrollment
                  Period. Confirm the coverage type with HR before you delay.
                </p>
                <ReminderIcs
                  title="Review Medicare vs Marketplace decision"
                  description="Open MedicareClear, confirm the employer size and creditable coverage, and review the Part B enrollment window."
                  days={30}
                  path={path}
                />
              </section>

              <CalculatorReportError
                pageTitle="Medicare vs ACA"
                path={path}
                summary={reportSummary}
              />
              <StickySummary label="Recommended path" value={verdict} />
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter your age and coverage to see the path</h3>
              <p>
                The calculator needs an age and a coverage type. Employer size, creditable coverage,
                work credits, and HSA status refine the answer.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
