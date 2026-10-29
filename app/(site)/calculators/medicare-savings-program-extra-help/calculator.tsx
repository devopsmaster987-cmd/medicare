'use client';

import { useMemo } from 'react';
import { ActionPlan } from '@/components/action/action-plan';
import { CalculatorEvents } from '@/components/calc/calculator-events';
import { CurrencyField, SelectField } from '@/components/calc/fields';
import { GlossaryTip } from '@/components/calc/glossary-tip';
import { ShareResult, ReminderIcs, CalculatorReportError } from '@/components/calc/interactive';
import {
  ScenarioCompare,
  ShowMath,
  StickySummary,
} from '@/components/calc/calculator-blocks';
import { contactByKey } from '@/data/contacts';
import type { GlossaryTipEntry } from '@/data/glossary';
import { mspPrograms } from '@/data/msp';
import { mspEligibility, type MspStateInput } from '@/lib/formulas/msp-eligibility';
import { mspEligibilitySchema, parseMoneyInput } from '@/lib/validation';
import { useHashState } from '@/lib/use-hash-state';
import { formatMoney, formatPercent } from '@/lib/utils';

const path = '/calculators/medicare-savings-program-extra-help/';

const defaults = {
  state: 'TX',
  householdSize: '1',
  income: '',
  assets: '',
  alternateIncome: '',
};

const householdOptions = Array.from({ length: 12 }, (_, index) => {
  const size = index + 1;
  return {
    value: String(size),
    label:
      size === 1
        ? '1 person'
        : size === 2
          ? '2 people'
          : `${size} people`,
  };
});

function programLabel(key: keyof typeof mspPrograms): string {
  return mspPrograms[key].shortName;
}

export function MspCalculator({
  tips,
  states,
}: {
  tips: Record<string, GlossaryTipEntry>;
  states: MspStateInput[];
}) {
  const { values, update } = useHashState(defaults);
  const stateOptions = useMemo(
    () =>
      [...states]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((state) => ({ value: state.abbr, label: state.name })),
    [states],
  );
  const selectedState = useMemo(
    () => states.find((state) => state.abbr === values.state),
    [states, values.state],
  );

  const parsed = useMemo(() => {
    if (values.income.trim() === '' || values.assets.trim() === '') {
      return { data: null, incomeError: '', assetError: '' };
    }
    const monthlyIncome = parseMoneyInput(values.income);
    const countableAssets = parseMoneyInput(values.assets);
    const result = mspEligibilitySchema.safeParse({
      stateAbbr: values.state,
      householdSize: values.householdSize,
      monthlyIncome: monthlyIncome ?? Number.NaN,
      countableAssets: countableAssets ?? Number.NaN,
    });
    return {
      data: result.success ? result.data : null,
      incomeError:
        monthlyIncome === null ? 'Enter a valid monthly income.' : '',
      assetError:
        countableAssets === null ? 'Enter valid countable assets.' : '',
    };
  }, [values]);

  const result = useMemo(
    () =>
      parsed.data && selectedState
        ? mspEligibility({ ...parsed.data, state: selectedState })
        : null,
    [parsed.data, selectedState],
  );

  const alternateIncome =
    values.alternateIncome.trim() === ''
      ? Number.NaN
      : Number(values.alternateIncome.replace(/[^0-9.]/g, ''));
  const alternateResult = useMemo(() => {
    if (!parsed.data || !selectedState || !Number.isFinite(alternateIncome) || alternateIncome < 0)
      return null;
    return mspEligibility({
      ...parsed.data,
      state: selectedState,
      monthlyIncome: alternateIncome,
    });
  }, [parsed.data, selectedState, alternateIncome]);

  const likelyLabels = result
    ? result.likelyPrograms.map((key) => programLabel(key)).join(' + ')
    : '';

  const verdict = result
    ? !result.stateCovered
      ? 'State rules not covered yet'
      : result.likelyPrograms.length > 0
        ? likelyLabels
        : result.applyAnyway
          ? 'Close to a limit — apply'
          : 'No program expected from federal limits'
    : 'Enter your details';

  const reportSummary = result
    ? `Medicare Savings Program check (${result.year}). State: ${result.stateName}. Household size: ${parsed.data?.householdSize}. Monthly income: ${formatMoney(parsed.data?.monthlyIncome ?? 0)}. Countable assets: ${formatMoney(parsed.data?.countableAssets ?? 0)}. Likely programs: ${likelyLabels || 'none'}. Estimated monthly value: ${formatMoney(result.estimatedMonthlyValue)}.`
    : 'No result yet.';

  return (
    <section className="calculator-shell" aria-labelledby="calculator-title">
      <CalculatorEvents path={path} complete={Boolean(result)} />
      <div className="calculator-grid">
        <form className="calculator-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <p className="calculator-kicker">Your inputs</p>
            <h2 id="calculator-title">Check the federal MSP and Extra Help tests</h2>
            <p>
              This version uses federal income and resource limits and adds state agency links.
              Results update as you type. Your inputs stay in the page address after the hash.
            </p>
          </div>

          <SelectField
            id="state"
            label="State"
            value={values.state}
            onChange={(value) => update('state', value)}
            options={stateOptions}
            hint="The calculator uses the federal baseline for every state. Pick yours to see the state agency link."
          />

          <SelectField
            id="household-size"
            label="Household size"
            value={values.householdSize}
            onChange={(value) => update('householdSize', value)}
            options={householdOptions}
            hint="Count yourself and your spouse if you are married. The federal limits use household size, not tax filing status."
          />

          <CurrencyField
            id="monthly-income"
            label="Monthly income"
            value={values.income}
            onChange={(value) => update('income', value)}
            hint="Use gross monthly income before payroll deductions. Ask the agency which income disregards apply."
            error={parsed.incomeError}
          />
          <div className="field-glossary">
            <GlossaryTip term="MAGI" tips={tips} />
            <GlossaryTip term="FPL" tips={tips} />
          </div>

          <CurrencyField
            id="countable-assets"
            label="Countable assets"
            value={values.assets}
            onChange={(value) => update('assets', value)}
            hint="Use the resource figure the program asks for. Some states count fewer assets than others."
            error={parsed.assetError}
          />
          <div className="field-glossary">
            <GlossaryTip term="Countable assets" tips={tips} />
            <GlossaryTip term="MSP" tips={tips} />
          </div>

          <p className="calculator-privacy">
            This calculator runs in your browser. Nothing is submitted. The page address hash can
            contain your inputs, so avoid sharing the full link if you do not want them visible.
          </p>
        </form>

        <div className="calculator-result">
          <div className="result-header">
            <p className="calculator-kicker">Your result</p>
            <h2>Federal limits for {result ? result.stateName : 'your state'}</h2>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {result
              ? result.stateCovered
                ? `${verdict}. Estimated monthly value ${formatMoney(result.estimatedMonthlyValue)}.`
                : `${verdict}. Use the state agency link for the current limits.`
              : 'Enter income and assets to see the result.'}
          </p>

          {result ? (
            <>
              <div
                className={`result-verdict ${
                  !result.stateCovered
                    ? 'is-neutral'
                    : result.likelyPrograms.length > 0
                      ? 'is-good'
                      : result.applyAnyway
                        ? 'is-warn'
                        : 'is-neutral'
                }`}
              >
                {verdict}
              </div>

              {!result.stateCovered ? (
                <div className="result-section">
                  <p>{result.message}</p>
                  <p>
                    <a href={result.stateAgencyUrl} target="_blank" rel="noreferrer">
                      Open the {result.stateName} Medicaid agency directory
                    </a>
                    .
                  </p>
                  <p>
                    The agency can confirm the current income limits, asset rules, and program names
                    for your state.
                  </p>
                </div>
              ) : (
                <>
                  <p className="result-copy">
                    Based on the federal limits, the best fit is{' '}
                    <strong>{likelyLabels || 'no program'}</strong>. The estimated monthly value is{' '}
                    <strong>{formatMoney(result.estimatedMonthlyValue)}</strong>.
                  </p>

                  <div className="result-card-grid">
                    <div className="result-card">
                      <span>Estimated monthly value</span>
                      <strong>{formatMoney(result.estimatedMonthlyValue)}</strong>
                    </div>
                    <div className="result-card">
                      <span>Estimated annual value</span>
                      <strong>{formatMoney(result.estimatedAnnualValue)}</strong>
                    </div>
                    <div className="result-card">
                      <span>Income as % of FPL</span>
                      <strong>{formatPercent(result.incomePercentOfFpl)}</strong>
                    </div>
                  </div>

                  <div className="result-section">
                    <h3>Why this result</h3>
                    <p>{result.message}</p>
                    {result.stateNote ? (
                      <p>
                        <strong>{result.stateName} rule:</strong> {result.stateNote}
                      </p>
                    ) : null}
                    <p>
                      The income test uses {formatMoney(result.fplAnnual)} as the federal poverty
                      level for a household of {parsed.data?.householdSize}. The agency makes the
                      final decision and may disregard some income or resources.
                    </p>
                  </div>

                  <div className="result-section">
                    <h3>Programs checked</h3>
                    <div className="table-scroll">
                      <table className="fact-table">
                        <caption>
                          MSP and Extra Help results for {result.stateName}
                        </caption>
                        <thead>
                          <tr>
                            <th scope="col">Program</th>
                            <th scope="col">Income limit</th>
                            <th scope="col">Resource limit</th>
                            <th scope="col">Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.programs.map((program) => (
                            <tr key={program.key}>
                              <th scope="row">{program.name}</th>
                              <td>
                                {program.incomeLimitMonthly !== null
                                  ? `${formatMoney(program.incomeLimitMonthly)}/month`
                                  : program.incomeLimitAnnual !== null
                                    ? `${formatMoney(program.incomeLimitAnnual)}/year`
                                    : 'See agency'}
                              </td>
                              <td>
                                {program.resourceLimit === null
                                  ? 'No asset test'
                                  : formatMoney(program.resourceLimit)}
                              </td>
                              <td>
                                {program.eligible
                                  ? 'Meets federal test'
                                  : program.closeToLimit
                                    ? 'Close — apply anyway'
                                    : 'Over the federal test'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <ShowMath>
                    <ul>
                      <li>
                        Annual income: {formatMoney(parsed.data?.monthlyIncome ?? 0)} × 12 ={' '}
                        {formatMoney((parsed.data?.monthlyIncome ?? 0) * 12)}.
                      </li>
                      <li>
                        Federal poverty level for {parsed.data?.householdSize}:{' '}
                        {formatMoney(result.fplAnnual)}.
                      </li>
                      <li>
                        QMB monthly limit:{' '}
                        {result.programs.find((program) => program.key === 'qmb')?.incomeLimitMonthly
                          ? formatMoney(
                              result.programs.find((program) => program.key === 'qmb')
                                ?.incomeLimitMonthly ?? 0,
                            )
                          : 'See agency'}
                        . The limit uses the state rule when one is published, otherwise the FPL
                        percentage and monthly disregard in the data layer.
                      </li>
                      <li>
                        Extra Help annual limit:{' '}
                        {formatMoney(
                          result.programs.find((program) => program.key === 'extraHelp')
                            ?.incomeLimitAnnual ?? 0,
                        )}
                        .
                      </li>
                      <li>
                        Estimated value: Part B standard premium plus the Part D base premium when
                        both programs are a likely fit.
                      </li>
                    </ul>
                  </ShowMath>

                  <ActionPlan
                    steps={[
                      {
                        title: 'Apply through your state agency',
                        detail: `Start with ${result.stateAgencyName}. Ask which Medicare Savings Program application to use and whether a separate Extra Help application is needed.`,
                      },
                      {
                        title: 'Gather the proof the agency asks for',
                        detail:
                          'Have your Medicare card, Social Security award letter, recent income proof, and statements for the countable assets you reported. Ask before sending originals.',
                      },
                      {
                        title: 'Ask about Extra Help and timing',
                        detail:
                          'Extra Help can lower Part D costs. Ask the agency and Social Security what happens to your premiums while the application is reviewed.',
                      },
                    ]}
                  />

                  <ScenarioCompare
                    currentLabel="Current monthly income"
                    currentValue={verdict}
                    alternateLabel="Alternate monthly income"
                    alternateValue={
                      alternateResult
                        ? !alternateResult.stateCovered
                          ? 'State rules not covered yet'
                          : alternateResult.likelyPrograms.length > 0
                            ? alternateResult.likelyPrograms
                                .map((key) => programLabel(key))
                                .join(' + ')
                            : alternateResult.applyAnyway
                              ? 'Close to a limit — apply'
                              : 'No program expected'
                        : 'Enter an alternate income'
                    }
                    rows={[
                      {
                        label: 'Likely programs',
                        current: likelyLabels || 'None',
                        alternate: alternateResult
                          ? alternateResult.likelyPrograms
                              .map((key) => programLabel(key))
                              .join(' + ') || 'None'
                          : '—',
                      },
                      {
                        label: 'Estimated monthly value',
                        current: formatMoney(result.estimatedMonthlyValue),
                        alternate: alternateResult
                          ? formatMoney(alternateResult.estimatedMonthlyValue)
                          : '—',
                      },
                      {
                        label: 'Annual income',
                        current: formatMoney((parsed.data?.monthlyIncome ?? 0) * 12),
                        alternate:
                          Number.isFinite(alternateIncome) && alternateIncome >= 0
                            ? formatMoney(alternateIncome * 12)
                            : '—',
                      },
                      {
                        label: 'Apply anyway signal',
                        current: result.applyAnyway ? 'Yes, close to a limit' : 'No',
                        alternate: alternateResult
                          ? alternateResult.applyAnyway
                            ? 'Yes, close to a limit'
                            : 'No'
                          : '—',
                      },
                    ]}
                  >
                    <CurrencyField
                      id="alternate-income"
                      label="Alternate monthly income"
                      value={values.alternateIncome}
                      onChange={(value) => update('alternateIncome', value)}
                      hint="Keep the same state, household size, and assets to isolate the income change."
                    />
                  </ScenarioCompare>

                  <div className="result-actions no-print">
                    <ShareResult summary={reportSummary} />
                  </div>

                  <section className="deadline-box" aria-labelledby="deadline-title">
                    <h2 id="deadline-title">Deadline and timing</h2>
                    <p>
                      Medicare Savings Programs do not have a single annual open enrollment window.
                      You can apply when you think you qualify, and benefits can start after the
                      agency approves the application.
                    </p>
                    <p>
                      Extra Help is handled by Social Security. Ask both offices how the timing works
                      for your case and whether one application can cover both.
                    </p>
                    <p>
                      <a href={contactByKey.ssa.url} target="_blank" rel="noreferrer">
                        Open the Social Security Extra Help page
                      </a>
                      .
                    </p>
                    <ReminderIcs
                      title="Follow up on Medicare Savings Program application"
                      description="Open MedicareClear, review the federal limits, and follow up with the state agency or Social Security."
                      days={30}
                      path={path}
                    />
                  </section>

                  <CalculatorReportError
                    pageTitle="Medicare Savings Program and Extra Help"
                    path={path}
                    summary={reportSummary}
                  />
                  <StickySummary label="Best federal fit" value={verdict} />
                </>
              )}
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter income and assets to see the result</h3>
              <p>
                The calculator needs a state, household size, monthly income, and countable assets.
                It checks QMB, SLMB, QI, and Extra Help.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
