'use client';

import { useMemo } from 'react';
import { ActionPlan } from '@/components/action/action-plan';
import { CalculatorEvents } from '@/components/calc/calculator-events';
import { MonthField, NumberField, RadioField, SelectField } from '@/components/calc/fields';
import { GlossaryTip } from '@/components/calc/glossary-tip';
import { ShareResult, CalculatorReportError } from '@/components/calc/interactive';
import { ScenarioCompare, ShowMath, StickySummary } from '@/components/calc/calculator-blocks';
import { contactByKey } from '@/data/contacts';
import { site } from '@/data/site';
import type { GlossaryTipEntry } from '@/data/glossary';
import { trackEvent } from '@/lib/analytics';
import { enrollmentDatesCalculator } from '@/lib/formulas/enrollment-dates';
import { buildIcs } from '@/lib/ics';
import { enrollmentDatesSchema } from '@/lib/validation';
import { useHashState } from '@/lib/use-hash-state';

const path = '/calculators/medicare-enrollment-dates/';

const defaults = {
  birthMonth: '',
  birthYear: '',
  birthdayOnFirst: 'no',
  situation: 'within-iep',
  coverageEndMonth: '',
  alternateBirthYear: '',
};

const monthOptions = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const yesNoOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const situationOptions = [
  { value: 'within-iep', label: 'Retired or no employer coverage' },
  { value: 'working-employer-coverage', label: 'Still working, employer coverage' },
  { value: 'missed-iep', label: 'Already passed my first chance to enroll' },
];

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${monthNames[month - 1]} ${day}, ${year}`;
}

function downloadIcs(title: string, description: string, isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const eventDate = new Date(Date.UTC(year, month - 1, day));
  const ics = buildIcs({
    title,
    description,
    date: eventDate,
    url: `${site.siteUrl}${path}`,
    durationMinutes: 30,
  });
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'medicareclear-deadline.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  trackEvent('calendar_download', { page: path });
}

export function MedicareEnrollmentDatesCalculator({
  tips,
}: {
  tips: Record<string, GlossaryTipEntry>;
}) {
  const { values, update } = useHashState(defaults);

  const parsed = useMemo(() => {
    const birthMonth = Number(values.birthMonth);
    const birthYear = Number(values.birthYear);
    if (values.birthMonth.trim() === '' || values.birthYear.trim() === '') {
      return { data: null, monthError: '', yearError: '' };
    }
    const monthError =
      !Number.isInteger(birthMonth) || birthMonth < 1 || birthMonth > 12
        ? 'Choose the month you were born.'
        : '';
    const currentYear = new Date().getFullYear();
    const yearError =
      !Number.isInteger(birthYear) || birthYear < 1900 || birthYear > currentYear
        ? `Enter a birth year from 1900 to ${currentYear}.`
        : '';
    const result = enrollmentDatesSchema.safeParse({
      birthYear,
      birthMonth,
      birthdayOnFirst: values.birthdayOnFirst === 'yes',
      situation: values.situation,
      coverageEndMonth:
        values.situation === 'working-employer-coverage' &&
        values.coverageEndMonth.trim() !== ''
          ? values.coverageEndMonth
          : undefined,
    });
    return {
      data: result.success && monthError === '' && yearError === '' ? result.data : null,
      monthError,
      yearError,
    };
  }, [values]);

  const result = useMemo(
    () => (parsed.data ? enrollmentDatesCalculator(parsed.data) : null),
    [parsed.data],
  );

  const alternateBirthYear = Number(values.alternateBirthYear);
  const alternateResult = useMemo(() => {
    if (
      !parsed.data ||
      values.alternateBirthYear.trim() === '' ||
      !Number.isInteger(alternateBirthYear) ||
      alternateBirthYear < 1900 ||
      alternateBirthYear > 2100
    ) {
      return null;
    }
    return enrollmentDatesCalculator({ ...parsed.data, birthYear: alternateBirthYear });
  }, [parsed.data, alternateBirthYear, values.alternateBirthYear]);

  const verdict = !result
    ? 'Enter your birthday'
    : result.windowStatus === 'not-open'
      ? `Opens ${formatDate(result.iepStart)}`
      : result.windowStatus === 'closed'
        ? 'Your sign-up window has closed'
        : result.windowStatus === 'closing-soon'
          ? `Closing in ${result.daysUntilIEPEnd} days`
          : 'Your sign-up window is open';

  const reportSummary = result
    ? `Medicare sign-up window for a ${result.eligibleMonthLabel} birthday. Initial Enrollment Period: ${formatDate(result.iepStart)} to ${formatDate(result.iepEnd)}. Status: ${result.windowStatus}. Earliest coverage: ${formatDate(result.earliestCoverageStart)}.${result.sep ? ` Special Enrollment Period: ${formatDate(result.sep.start)} to ${formatDate(result.sep.end)}.` : ''}`
    : 'No result yet.';

  const deadlineDate = result
    ? result.windowStatus === 'closed'
      ? (result.sep?.end ?? result.gep?.end ?? null)
      : result.iepEnd
    : null;

  return (
    <section className="calculator-shell" aria-labelledby="calculator-title">
      <CalculatorEvents path={path} complete={Boolean(result)} />
      <div className="calculator-grid">
        <form className="calculator-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="calculator-heading">
            <p className="calculator-kicker">Your inputs</p>
            <h2 id="calculator-title">Find your Medicare sign-up window</h2>
            <p>
              Enter your birthday. Results update as you type. Your inputs stay in the page address
              after the hash.
            </p>
          </div>

          <SelectField
            id="birth-month"
            label="Month you were born"
            value={values.birthMonth}
            onChange={(value) => update('birthMonth', value)}
            options={[{ value: '', label: 'Choose a month' }, ...monthOptions]}
            error={parsed.monthError}
            hint="Medicare eligibility starts the month you turn 65, with one exception: if your birthday is on the first, it starts the month before."
          />

          <NumberField
            id="birth-year"
            label="Year you were born"
            value={values.birthYear}
            onChange={(value) => update('birthYear', value)}
            min={1900}
            max={new Date().getFullYear()}
            error={parsed.yearError}
          />

          <RadioField
            legend="Is your birthday on the first day of the month?"
            value={values.birthdayOnFirst}
            onChange={(value) => update('birthdayOnFirst', value)}
            options={yesNoOptions}
            hint="If yes, your Medicare month is the month before your birthday month, which shifts the whole window back one month."
          />

          <RadioField
            legend="What is your situation?"
            value={values.situation}
            onChange={(value) => update('situation', value)}
            options={situationOptions}
            hint="This decides whether a Special Enrollment Period or the General Enrollment Period applies after your first window."
          />

          {values.situation === 'working-employer-coverage' ? (
            <MonthField
              id="coverage-end-month"
              label="Month your employer coverage ends"
              value={values.coverageEndMonth}
              onChange={(value) => update('coverageEndMonth', value)}
              optional
              hint="Leave empty to see only your main window. If you add it, the calculator shows the eight-month Special Enrollment Period."
            />
          ) : null}

          <div className="field-glossary">
            <GlossaryTip term="IEP" tips={tips} />
            <GlossaryTip term="SEP" tips={tips} />
            <GlossaryTip term="General enrollment period" tips={tips} />
            <GlossaryTip term="Part B" tips={tips} />
          </div>

          <p className="calculator-privacy">
            This calculator runs in your browser. Nothing is submitted. The page address hash can
            contain your inputs, so avoid sharing the full link if you do not want them visible.
          </p>
        </form>

        <div className="calculator-result">
          <div className="result-header">
            <p className="calculator-kicker">Your result</p>
            <h2>When you can sign up</h2>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {result
              ? `${verdict}. Sign up from ${formatDate(result.iepStart)} through ${formatDate(result.iepEnd)}. Earliest coverage ${formatDate(result.earliestCoverageStart)}.`
              : 'Enter your birth month and year to see your sign-up window.'}
          </p>

          {result ? (
            <>
              <div
                className={`result-verdict ${
                  result.windowStatus === 'closed'
                    ? 'is-warn'
                    : result.windowStatus === 'closing-soon'
                      ? 'is-warn'
                      : result.windowStatus === 'open'
                        ? 'is-good'
                        : ''
                }`}
              >
                {verdict}
              </div>
              <p className="result-copy">
                {result.windowStatus === 'not-open'
                  ? `Your seven-month window runs ${formatDate(result.iepStart)} through ${formatDate(result.iepEnd)} for someone born in ${result.eligibleMonthLabel}.`
                  : result.windowStatus === 'closed'
                    ? `Your Initial Enrollment Period ended ${formatDate(result.iepEnd)}. See the General Enrollment Period and Special Enrollment Period dates below before you act.`
                    : `Your seven-month window runs ${formatDate(result.iepStart)} through ${formatDate(result.iepEnd)}. Sign up in the three months before your birthday month for coverage to start on time.`}
              </p>

              <div className="result-card-grid">
                <div className="result-card">
                  <span>Window opens</span>
                  <strong>{formatDate(result.iepStart)}</strong>
                </div>
                <div className="result-card">
                  <span>Window closes</span>
                  <strong>{formatDate(result.iepEnd)}</strong>
                </div>
                <div className="result-card">
                  <span>Earliest coverage</span>
                  <strong>{formatDate(result.earliestCoverageStart)}</strong>
                </div>
              </div>

              <div className="result-section">
                <h3>What happens if you sign up when</h3>
                <div className="table-scroll">
                  <table className="fact-table">
                    <caption>Coverage start by sign-up month</caption>
                    <thead>
                      <tr>
                        <th scope="col">You sign up in</th>
                        <th scope="col">Coverage starts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.coverageStartTable.map((row) => (
                        <tr key={row.signupMonth}>
                          <th scope="row">{row.signupMonth}</th>
                          <td>{formatDate(row.coverageStart)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>{result.note}</p>
              </div>

              {result.windowStatus === 'closed' ? (
                <div className="result-section">
                  <h3>General Enrollment Period</h3>
                  <p>
                    {result.gep?.openNow ? 'The General Enrollment Period is open now:' : 'The next'}{' '}
                    General Enrollment Period runs {result.gep ? formatDate(result.gep.start) : ''}{' '}
                    through {result.gep ? formatDate(result.gep.end) : ''}. Coverage usually starts
                    the month after you sign up in this window, and a Part B late enrollment penalty
                    may apply.
                  </p>
                </div>
              ) : null}

              {result.sep ? (
                <div className="result-section">
                  <h3>Special Enrollment Period</h3>
                  <p>
                    Your Special Enrollment Period runs {formatDate(result.sep.start)} through{' '}
                    {formatDate(result.sep.end)}: it starts the month after your first window ends
                    and runs through the eighth month after your employer coverage ends.
                  </p>
                </div>
              ) : null}

              <ShowMath>
                <ul>
                  <li>
                    Your month at 65: born {result.eligibleMonthLabel}
                    {result.firstOfMonthRuleApplied ? ' (birthday on the first, shifted back one month)' : ''}.
                  </li>
                  <li>
                    Initial Enrollment Period: three months before that month, that month, and three
                    months after → {formatDate(result.iepStart)} through {formatDate(result.iepEnd)}.
                  </li>
                  <li>
                    Coverage start: sign up before your birthday month → coverage starts the first
                    day of your birthday month; sign up during or after it → the first of the month
                    after sign-up.
                  </li>
                  {result.windowStatus === 'closed' && result.gep ? (
                    <li>
                      General Enrollment Period: January through March of{' '}
                      {result.gep.start.slice(0, 4)} (runs when your first window has closed).
                    </li>
                  ) : null}
                  {result.sep ? (
                    <li>
                      Special Enrollment Period: starts the month after your first window ends and
                      ends on the eighth month after employer coverage ends.
                    </li>
                  ) : null}
                </ul>
              </ShowMath>

              <ActionPlan
                steps={[
                  {
                    title: 'Write down your two dates',
                    detail: `Your window opens ${formatDate(result.iepStart)} and closes ${formatDate(result.iepEnd)}. Put both in your calendar now with the reminder button below.`,
                  },
                  {
                    title: 'Decide on Part B while the window is open',
                    detail:
                      'Part B has a late enrollment penalty of 10% for each full year you delay without creditable coverage, so enrollment timing matters even if you feel healthy.',
                  },
                  {
                    title: 'Enroll with Social Security',
                    detail: `Apply online through your Social Security account, by phone at ${contactByKey.ssa.phone}, or at a local office. Have your Social Security number, Medicare card if you have one, and employer coverage details ready.`,
                  },
                ]}
              />

              <ScenarioCompare
                currentLabel="Your birth year"
                currentValue={String(result.sixtyFifthBirthdayYear)}
                alternateLabel="Alternate birth year"
                alternateValue={
                  alternateResult
                    ? String(alternateResult.sixtyFifthBirthdayYear)
                    : 'Enter a year'
                }
                rows={[
                  {
                    label: 'Window opens',
                    current: formatDate(result.iepStart),
                    alternate: alternateResult ? formatDate(alternateResult.iepStart) : '—',
                  },
                  {
                    label: 'Window closes',
                    current: formatDate(result.iepEnd),
                    alternate: alternateResult ? formatDate(alternateResult.iepEnd) : '—',
                  },
                  {
                    label: 'Earliest coverage',
                    current: formatDate(result.earliestCoverageStart),
                    alternate: alternateResult
                      ? formatDate(alternateResult.earliestCoverageStart)
                      : '—',
                  },
                ]}
              >
                <NumberField
                  id="alternate-birth-year"
                  label="Alternate birth year"
                  value={values.alternateBirthYear}
                  onChange={(value) => update('alternateBirthYear', value)}
                  min={1900}
                  max={2100}
                  hint="Compare with a spouse’s or parent’s birth year. The month stays the same."
                />
              </ScenarioCompare>

              <div className="result-actions no-print">
                <ShareResult summary={reportSummary} />
              </div>

              <section className="deadline-box" aria-labelledby="deadline-title">
                <h2 id="deadline-title">Deadline and timing</h2>
                <p>
                  {result.windowStatus === 'closed'
                    ? `Your first window ended ${formatDate(result.iepEnd)}. ${
                        result.sep
                          ? `Your Special Enrollment Period ends ${formatDate(result.sep.end)}.`
                          : 'Mark the next General Enrollment Period so you do not miss it.'
                      }`
                    : `Your Initial Enrollment Period ends ${formatDate(result.iepEnd)}${
                        result.daysUntilIEPEnd !== null
                          ? `, which is ${result.daysUntilIEPEnd} day${result.daysUntilIEPEnd === 1 ? '' : 's'} from today`
                          : ''
                      }.`}
                </p>
                {deadlineDate ? (
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() =>
                      downloadIcs(
                        'Medicare sign-up deadline',
                        `Your Medicare sign-up window ends ${formatDate(deadlineDate)}. Sign up through Social Security before this date to avoid a late enrollment penalty.`,
                        deadlineDate,
                      )
                    }
                  >
                    Download deadline to my calendar
                  </button>
                ) : null}
                <p>
                  <a
                    href="https://www.ssa.gov/medicare/sign-up"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Sign up for Medicare with Social Security
                  </a>
                  .
                </p>
              </section>

              <CalculatorReportError
                pageTitle="Medicare enrollment dates"
                path={path}
                summary={reportSummary}
              />
              <StickySummary label="Medicare sign-up" value={verdict} />
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter your birth month and year</h3>
              <p>
                The calculator needs your birthday to place your seven-month enrollment window and
                your earliest possible coverage date.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
