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
import { irmaaBracketsFor } from '@/data/medicare-part-b';
import { lifeEvents } from '@/data/lifeEvents';
import type { FilingStatus } from '@/data/types';
import { irmaaCalculator } from '@/lib/formulas/irmaa';
import { irmaaSchema, parseMoneyInput, parseOptionalMoneyInput } from '@/lib/validation';
import { useHashState } from '@/lib/use-hash-state';
import { formatMoney } from '@/lib/utils';

const path = '/calculators/irmaa-cliff-checker';

const defaults = {
  filing: 'single',
  magi: '110000',
  projected: '130000',
  alternateProjected: '150000',
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

function tierLabel(index: number): string {
  return index === 0 ? 'Standard premium' : `Tier ${index}`;
}

function bracketRange(min: number, max: number | null): string {
  return max === null
    ? `${formatMoney(min)} or more`
    : `${formatMoney(min)} to ${formatMoney(max)}`;
}

export function IrmaaCalculator({ tips }: { tips: Record<string, GlossaryTipEntry> }) {
  const { values, update } = useHashState(defaults);

  const parsed = useMemo(() => {
    if (values.magi.trim() === '') {
      return { data: null, magiError: '' };
    }
    const magi = parseMoneyInput(values.magi);
    const projected = parseOptionalMoneyInput(values.projected);
    const result = irmaaSchema.safeParse({
      filingStatus: values.filing,
      magiTwoYearsBack: magi ?? Number.NaN,
      projectedMagi: projected,
    });
    return {
      data: result.success ? result.data : null,
      magiError: magi === null ? 'Enter a valid MAGI from two years back.' : '',
    };
  }, [values]);

  const result = useMemo(
    () => (parsed.data ? irmaaCalculator(parsed.data) : null),
    [parsed.data],
  );

  const alternateProjected = parseOptionalMoneyInput(values.alternateProjected);
  const alternateResult = useMemo(() => {
    if (!parsed.data || alternateProjected === undefined) return null;
    return irmaaCalculator({ ...parsed.data, projectedMagi: alternateProjected });
  }, [parsed.data, alternateProjected]);

  const brackets = irmaaBracketsFor((values.filing as FilingStatus) ?? 'single');
  const verdict = result
    ? result.tier.index === 0
      ? 'Standard premium — no IRMAA'
      : `IRMAA tier ${result.tier.index}`
    : 'Enter your MAGI';

  const reportSummary = result
    ? `IRMAA check (${result.year}). Filing status: ${filingLabels[result.filingStatus]}. MAGI from ${result.taxYearBasis}: ${formatMoney(result.magi)}. Tier: ${tierLabel(result.tier.index)}. Monthly Part B: ${formatMoney(result.monthlyPartB)}. Monthly Part D IRMAA: ${formatMoney(result.monthlyPartD)}. Monthly surcharge: ${formatMoney(result.monthlySurcharge)}. Annual surcharge: ${formatMoney(result.annualSurcharge)}.`
    : 'No result yet.';

  return (
    <section className="calculator-shell" aria-labelledby="calculator-title">
      <CalculatorEvents path={path} complete={Boolean(result)} />
      <div className="calculator-grid">
        <form className="calculator-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <p className="calculator-kicker">Your inputs</p>
            <h2 id="calculator-title">Check your IRMAA tier</h2>
            <p>
              IRMAA uses modified adjusted gross income from two years earlier. For {result?.year ?? 'the current year'}, use {result?.taxYearBasis ?? 'the lookback year'} income. Results update as you type.
            </p>
          </div>

          <SelectField
            id="filing-status"
            label="Filing status"
            value={values.filing}
            onChange={(value) => update('filing', value)}
            options={filingOptions}
            hint="Married filing separately has its own IRMAA tiers and thresholds."
          />

          <CurrencyField
            id="magi"
            label={`MAGI from ${result?.taxYearBasis ?? 'two years back'}`}
            value={values.magi}
            onChange={(value) => update('magi', value)}
            hint="Use the modified adjusted gross income from the tax return that sets this year's premium."
            error={parsed.magiError}
          />
          <div className="field-glossary">
            <GlossaryTip term="MAGI" tips={tips} />
            <GlossaryTip term="IRMAA" tips={tips} />
          </div>

          <CurrencyField
            id="projected-magi"
            label="Projected MAGI"
            value={values.projected}
            onChange={(value) => update('projected', value)}
            hint="Optional. Use an estimate for a sale, Roth conversion, or distribution to see the next tier."
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
            <h2>Your IRMAA tier</h2>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {result
              ? `${verdict}. Monthly surcharge ${formatMoney(result.monthlySurcharge)}. Annual surcharge ${formatMoney(result.annualSurcharge)}.`
              : 'Enter your MAGI to see the IRMAA result.'}
          </p>

          {result ? (
            <>
              <div className={`result-verdict ${result.tier.index === 0 ? 'is-good' : 'is-warn'}`}>
                {verdict}
              </div>
              <p className="result-copy">
                For {filingLabels[result.filingStatus].toLowerCase()} with MAGI of{' '}
                <strong>{formatMoney(result.magi)}</strong> from {result.taxYearBasis}, the monthly
                Part B premium is <strong>{formatMoney(result.monthlyPartB)}</strong>. The Part D
                IRMAA amount is <strong>{formatMoney(result.monthlyPartD)}</strong>, and the total
                monthly surcharge is <strong>{formatMoney(result.monthlySurcharge)}</strong>.
              </p>

              <div className="result-card-grid">
                <div className="result-card">
                  <span>Monthly Part B</span>
                  <strong>{formatMoney(result.monthlyPartB)}</strong>
                </div>
                <div className="result-card">
                  <span>Monthly Part D IRMAA</span>
                  <strong>{formatMoney(result.monthlyPartD)}</strong>
                </div>
                <div className="result-card">
                  <span>Monthly surcharge</span>
                  <strong>{formatMoney(result.monthlySurcharge)}</strong>
                </div>
                <div className="result-card">
                  <span>Annual surcharge</span>
                  <strong>{formatMoney(result.annualSurcharge)}</strong>
                </div>
              </div>

              <div className="result-section">
                <h3>Room to the next bracket</h3>
                {result.headroomToNextBracket === null ? (
                  <p>You are in the top IRMAA tier. There is no higher bracket in this table.</p>
                ) : (
                  <p>
                    You have <strong>{formatMoney(result.headroomToNextBracket)}</strong> of MAGI
                    headroom before the next tier at{' '}
                    {formatMoney(result.nextTier?.min ?? 0)}. Crossing that line can raise the
                    surcharge for both Part B and Part D.
                  </p>
                )}
              </div>

              {result.cliffCost.additionalAnnualSurcharge !== null ? (
                <div className="result-section">
                  <h3>What crossing the next cliff costs</h3>
                  <p>
                    One dollar of MAGI over the next threshold adds{' '}
                    <strong>{formatMoney(result.cliffCost.additionalAnnualSurcharge)}</strong> a year
                    in surcharges for one person
                    {result.marriedCouple.bothSpousesMayPay
                      ? `, or ${formatMoney(result.cliffCost.householdAdditionalAnnualSurcharge ?? 0)} for a married couple when both spouses are enrolled`
                      : ''}
                    . The increase is a premium change, not a tax.
                  </p>
                </div>
              ) : null}

              {result.projected ? (
                <div className="result-section">
                  <h3>Projected income</h3>
                  <p>
                    At a projected MAGI of <strong>{formatMoney(result.projected.magi)}</strong>,
                    the projected tier is <strong>{tierLabel(result.projected.tier.index)}</strong>.
                    The projected monthly surcharge is{' '}
                    <strong>{formatMoney(result.projected.monthlySurcharge)}</strong>, or{' '}
                    <strong>{formatMoney(result.projected.annualSurcharge)}</strong> a year.
                  </p>
                  <p>
                    Roth-conversion headroom before the next bracket is{' '}
                    <strong>{formatMoney(result.projected.rothConversionHeadroom)}</strong> at this
                    income level. This is a planning estimate, not tax advice.
                  </p>
                </div>
              ) : null}

              <div className="result-section">
                <h3>Cliff chart</h3>
                <p>
                  The chart shows the MAGI range, the Part B total, and the Part D IRMAA amount for
                  each tier.
                </p>
                <div className="table-scroll">
                  <table className="fact-table">
                    <caption>IRMAA tiers for {filingLabels[result.filingStatus]}</caption>
                    <thead>
                      <tr>
                        <th scope="col">Tier</th>
                        <th scope="col">MAGI range</th>
                        <th scope="col">Part B</th>
                        <th scope="col">Part D IRMAA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brackets.map((bracket, index) => (
                        <tr
                          key={bracket.min}
                          className={index === result.tier.index ? 'tier-current' : undefined}
                        >
                          <th scope="row">{tierLabel(index)}</th>
                          <td>{bracketRange(bracket.min, bracket.max)}</td>
                          <td>{formatMoney(bracket.partBTotal)}</td>
                          <td>{formatMoney(bracket.partDAdjustment)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="result-section">
                <h3>Two-year lookahead</h3>
                <div className="table-scroll">
                  <table className="fact-table">
                    <caption>Income year to premium year</caption>
                    <thead>
                      <tr>
                        <th scope="col">Income year</th>
                        <th scope="col">Premium year</th>
                        <th scope="col">What it means</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.twoYearLookahead.map((row) => (
                        <tr key={row.incomeYear}>
                          <th scope="row">{row.incomeYear}</th>
                          <td>{row.premiumYear}</td>
                          <td>
                            Income you earn in {row.incomeYear} generally sets your premium in{' '}
                            {row.premiumYear}.
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="result-section">
                <h3>{result.marriedCouple.bothSpousesMayPay ? 'Married couple view' : 'Married filing separately'}</h3>
                {result.marriedCouple.bothSpousesMayPay ? (
                  <p>
                    If both spouses are enrolled in Medicare and have the same MAGI, each may pay
                    the surcharge. The household monthly Part B total is{' '}
                    <strong>{formatMoney(result.marriedCouple.householdMonthlyPartB)}</strong>, and
                    the household monthly surcharge is{' '}
                    <strong>{formatMoney(result.marriedCouple.householdMonthlySurcharge)}</strong>.
                  </p>
                ) : (
                  <p>
                    Each spouse filing separately has a separate MAGI and IRMAA tier. Do not simply
                    double one spouse&apos;s result. Check each return and each Medicare premium
                    notice.
                  </p>
                )}
                <p>
                  Part D IRMAA is added to the Part D plan premium. It is billed separately from the
                  plan premium and is usually deducted from Social Security or paid to Medicare.
                </p>
              </div>

              <div className="result-section">
                <h3>SSA-44 appeal helper</h3>
                <p>
                  If a life-changing event lowered your income, you can ask Social Security to use
                  the new income by filing Form SSA-44. Ask what proof the office needs for your
                  event.
                </p>
                <div className="table-scroll">
                  <table className="fact-table">
                    <caption>Life-changing events SSA may review</caption>
                    <thead>
                      <tr>
                        <th scope="col">Event</th>
                        <th scope="col">Proof usually asked for</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lifeEvents.map((event) => (
                        <tr key={event.key}>
                          <th scope="row">{event.name}</th>
                          <td>{event.proofUsuallyAskedFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>
                  <a href={contactByKey.ssa.url} target="_blank" rel="noreferrer">
                    Contact Social Security about an IRMAA review
                  </a>
                  .
                </p>
              </div>

              <ShowMath>
                <ul>
                  <li>
                    MAGI from the lookback year: {formatMoney(result.magi)}. Filing status:{' '}
                    {filingLabels[result.filingStatus]}.
                  </li>
                  <li>
                    Tier: {tierLabel(result.tier.index)}. Part B total:{' '}
                    {formatMoney(result.monthlyPartB)}.
                  </li>
                  <li>
                    Part B surcharge: {formatMoney(result.tier.partBAdjustment)}. Part D IRMAA
                    add-on: {formatMoney(result.monthlyPartD)}. Combined monthly surcharge:{' '}
                    {formatMoney(result.tier.partBAdjustment)} +{' '}
                    {formatMoney(result.monthlyPartD)} = {formatMoney(result.monthlySurcharge)}.
                  </li>
                  <li>
                    Annual surcharge: {formatMoney(result.monthlySurcharge)} × 12 ={' '}
                    {formatMoney(result.annualSurcharge)}.
                  </li>
                  <li>
                    Headroom to the next tier:{' '}
                    {result.headroomToNextBracket === null
                      ? 'none (top tier)'
                      : `${formatMoney(result.headroomToNextBracket)} below ${formatMoney(result.nextTier?.min ?? 0)}.`}
                  </li>
                </ul>
              </ShowMath>

              <ActionPlan
                steps={[
                  {
                    title: 'Check the income year on your notice',
                    detail:
                      'IRMAA uses a two-year lookback. Compare the notice with the tax return from the income year it names, not with this year’s income.',
                  },
                  {
                    title: 'If a life-changing event applies, file SSA-44',
                    detail:
                      'Use the event that lowered your income and attach the proof Social Security asks for. Keep a copy of the form and the notice.',
                  },
                  {
                    title: 'Ask how Part D IRMAA is billed',
                    detail:
                      'Part D IRMAA is separate from the plan premium. Confirm whether it is deducted from Social Security or billed by Medicare, and check both amounts.',
                  },
                ]}
              />

              <ScenarioCompare
                currentLabel="Current MAGI"
                currentValue={formatMoney(result.magi)}
                alternateLabel="Alternate projected MAGI"
                alternateValue={
                  alternateResult ? formatMoney(alternateResult.projected?.magi ?? 0) : 'Enter MAGI'
                }
                rows={[
                  {
                    label: 'Tier',
                    current: tierLabel(result.tier.index),
                    alternate: alternateResult?.projected
                      ? tierLabel(alternateResult.projected.tier.index)
                      : '—',
                  },
                  {
                    label: 'Monthly surcharge',
                    current: formatMoney(result.monthlySurcharge),
                    alternate: alternateResult?.projected
                      ? formatMoney(alternateResult.projected.monthlySurcharge)
                      : '—',
                  },
                  {
                    label: 'Annual surcharge',
                    current: formatMoney(result.annualSurcharge),
                    alternate: alternateResult?.projected
                      ? formatMoney(alternateResult.projected.annualSurcharge)
                      : '—',
                  },
                  {
                    label: 'Roth conversion headroom',
                    current: result.projected
                      ? formatMoney(result.projected.rothConversionHeadroom)
                      : '—',
                    alternate: alternateResult?.projected
                      ? formatMoney(alternateResult.projected.rothConversionHeadroom)
                      : '—',
                  },
                ]}
              >
                <CurrencyField
                  id="alternate-projected"
                  label="Alternate projected MAGI"
                  value={values.alternateProjected}
                  onChange={(value) => update('alternateProjected', value)}
                  hint="Use a Roth conversion, sale, or distribution to compare two income paths."
                  optional
                />
              </ScenarioCompare>

              <div className="result-actions no-print">
                <ShareResult summary={reportSummary} />
              </div>

              <section className="deadline-box" aria-labelledby="deadline-title">
                <h2 id="deadline-title">Deadline and timing</h2>
                <p>
                  IRMAA is based on the tax return from two years earlier. If Social Security sends
                  an IRMAA notice, review it when it arrives and ask about Form SSA-44 if a
                  life-changing event applies.
                </p>
                <p>
                  Part D IRMAA is billed separately from the plan premium. Check both the Medicare
                  notice and the plan bill so a missing amount does not become a surprise.
                </p>
                <ReminderIcs
                  title="Review Medicare IRMAA and income"
                  description="Open MedicareClear, compare the IRMAA notice with the two-year lookback income, and ask Social Security about Form SSA-44 if a life-changing event applies."
                  days={30}
                  path={path}
                />
              </section>

              <CalculatorReportError
                pageTitle="IRMAA cliff checker"
                path={path}
                summary={reportSummary}
              />
              <StickySummary label="IRMAA tier" value={verdict} />
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter your MAGI to see the IRMAA result</h3>
              <p>
                The calculator needs the MAGI from the tax return used for this year&apos;s premium
                and a filing status. Projected income is optional.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
