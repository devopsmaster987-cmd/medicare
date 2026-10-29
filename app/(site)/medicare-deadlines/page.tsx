import type { Metadata } from 'next';
import Link from 'next/link';
import { AnswerCapsule, KeyFacts, SourceTable } from '@/components/calc/content';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AuthorLine } from '@/components/trust/author-line';
import { LastUpdated } from '@/components/trust/last-updated';
import { ReportError } from '@/components/trust/report-error';
import { aca2026 } from '@/data/aca';
import { irs2026 } from '@/data/irs';
import { partB2026 } from '@/data/medicare-part-b';
import { sources } from '@/data/sources';
import { dataVerifiedOn } from '@/data/verified';
import { formatMoney } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Medicare deadlines',
  description:
    'The Medicare Initial Enrollment Period, General Enrollment Period, Special Enrollment Period, and annual window, with the dates and official sources.',
  alternates: { canonical: '/medicare-deadlines/' },
  openGraph: {
    title: 'Medicare deadlines | MedicareClear',
    description:
      'The Medicare enrollment windows and the dates that matter, with official sources and checked dates.',
    url: '/medicare-deadlines/',
    images: [
      {
        url: '/og/medicare-deadlines.png',
        width: 1200,
        height: 630,
        alt: 'Medicare enrollment deadlines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/medicare-deadlines.png'],
  },
};

const year = irs2026.year;

function monthDay(month: number, day: number, dateYear: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(dateYear, month - 1, day)));
}

function windowLabel(
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number,
  dateYear: number,
): string {
  const endYear = endMonth < startMonth ? dateYear + 1 : dateYear;
  return `${monthDay(startMonth, startDay, dateYear)} through ${monthDay(endMonth, endDay, endYear)}`;
}

const initialWindow = `${irs2026.initialEnrollmentPeriod.monthsBeforeBirthdayMonth} months before your birthday month through ${irs2026.initialEnrollmentPeriod.monthsAfterBirthdayMonth} months after it`;
const generalWindow = windowLabel(
  irs2026.generalEnrollmentPeriod.startMonth,
  irs2026.generalEnrollmentPeriod.startDay,
  irs2026.generalEnrollmentPeriod.endMonth,
  irs2026.generalEnrollmentPeriod.endDay,
  year,
);
const annualWindow = windowLabel(
  irs2026.annualEnrollmentPeriod.startMonth,
  irs2026.annualEnrollmentPeriod.startDay,
  irs2026.annualEnrollmentPeriod.endMonth,
  irs2026.annualEnrollmentPeriod.endDay,
  year,
);
const acaWindow = windowLabel(
  aca2026.openEnrollment.startMonth,
  aca2026.openEnrollment.startDay,
  aca2026.openEnrollment.endMonth,
  aca2026.openEnrollment.endDay,
  year,
);

export default function MedicareDeadlinesPage() {
  return (
    <>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Medicare deadlines', href: '/medicare-deadlines/' },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Reference · {year}</p>
          <h1 className="page-title">Medicare deadlines</h1>
          <AnswerCapsule>
            The main Medicare deadlines are your seven-month Initial Enrollment Period, the General
            Enrollment Period from January 1 through March 31, the eight-month Special Enrollment
            Period after active employer coverage ends, and the annual window from October 15
            through December 7. Confirm your own dates with Social Security before you act.
          </AnswerCapsule>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>The short answer</h2>
          <p>
            Your first chance to enroll is the Initial Enrollment Period around your 65th birthday.
            If you miss it and do not qualify for a Special Enrollment Period, the General
            Enrollment Period is the next yearly window. If you have active employer coverage, the
            eight-month Special Enrollment Period can let you delay Part B. The annual window is for
            changing Part D or Medicare Advantage coverage, not for your first Part B enrollment.
          </p>
          <KeyFacts
            caption={`Medicare and Marketplace enrollment windows for ${year}`}
            rows={[
              {
                label: 'Initial Enrollment Period',
                value: `${irs2026.initialEnrollmentPeriod.months} months`,
                note: initialWindow,
              },
              {
                label: 'General Enrollment Period',
                value: generalWindow,
                note: 'For people who missed their first chance and do not qualify for a Special Enrollment Period.',
              },
              {
                label: 'Special Enrollment Period',
                value: `${irs2026.specialEnrollmentPeriodMonths} months`,
                note: 'Usually after active employer coverage or employment ends, if the employer has 20 or more employees.',
              },
              {
                label: 'Annual enrollment window',
                value: annualWindow,
                note: 'For changing Part D or Medicare Advantage coverage for the next plan year.',
              },
              {
                label: 'HSA contribution stop date',
                value: `${irs2026.hsaContributionStopMonthsBeforeMedicare} months before Part A`,
                note: 'Part A can be backdated, so the stop date can be earlier than your enrollment date.',
              },
              {
                label: 'ACA Marketplace open enrollment',
                value: acaWindow,
                note: 'Federal dates. State marketplaces can use different dates.',
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Initial Enrollment Period</h2>
          <p>
            The Initial Enrollment Period is a seven-month window. It starts three months before the
            month you turn 65 and ends three months after that month. If your birthday is on the
            first day of the month, the first-of-month rule can shift the window; use the official
            Medicare page to confirm your own dates.
          </p>
          <p>
            The window is not a single deadline. The month you enroll can change when coverage
            starts. Enrolling before your birthday month can give you a coverage start earlier than
            your birthday month, while enrolling after it can leave a gap.
          </p>
          <p>
            Read the <Link href="/guides/medicare-initial-enrollment-period/">Initial Enrollment Period guide</Link>{' '}
            for the month-by-month rules, or use the{' '}
            <Link href="/calculators/medicare-vs-aca/">Medicare vs ACA tool</Link> if you are still
            working.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>General Enrollment Period</h2>
          <p>
            The General Enrollment Period runs from January 1 through March 31 each year. It is for
            people who missed their first chance to enroll and do not qualify for a Special
            Enrollment Period. Coverage generally starts the month after you enroll, so a March
            application can still leave a gap for March.
          </p>
          <p>
            A Part B late-enrollment penalty can apply for the months you went without Part B. The
            penalty is generally permanent. The{' '}
            <Link href="/calculators/part-b-late-enrollment-penalty/">Part B penalty calculator</Link>{' '}
            shows the monthly and long-term cost.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Special Enrollment Period while working</h2>
          <p>
            If you or your spouse have active employer coverage from an employer with 20 or more
            employees, you can usually delay Part B without a penalty. The Special Enrollment Period
            is generally eight months after the active coverage or employment ends. Retiree coverage
            and COBRA generally do not create the same window.
          </p>
          <p>
            Keep the employer&apos;s written confirmation that the coverage is creditable and the exact
            start and end dates. The{' '}
            <Link href="/guides/medicare-special-enrollment-period-while-working/">
              working past 65 guide
            </Link>{' '}
            explains the 20-employee rule and the proof to keep.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Annual enrollment window</h2>
          <p>
            The annual Medicare window runs from October 15 through December 7. It is the time to
            change Part D or Medicare Advantage coverage for the next plan year. It is not the window
            for your first Part B enrollment, and it does not replace the Initial Enrollment Period
            or a Special Enrollment Period.
          </p>
          <p>
            Before the window, compare the plan&apos;s premium, deductible, formulary, and pharmacy
            network. The <Link href="/guides/part-d-out-of-pocket-cap/">Part D out-of-pocket cap guide</Link>{' '}
            explains what the annual cap does and does not cover.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>HSA stop date before Medicare</h2>
          <p>
            If you contribute to a Health Savings Account, stop contributions six months before
            Medicare Part A begins. Part A can be backdated up to six months, so the effective date
            can be earlier than the date you apply. A contribution made after the effective date can
            become an excess contribution.
          </p>
          <p>
            The <Link href="/guides/hsa-and-medicare-6-month-rule/">HSA and Medicare six-month rule guide</Link>{' '}
            explains the backdate and the correction steps.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>ACA Marketplace open enrollment</h2>
          <p>
            The federal Marketplace open enrollment window is {acaWindow}. State marketplaces can
            use different dates. A special enrollment period may apply after a qualifying life
            event, such as losing other coverage, moving, or a change in household size.
          </p>
          <p>
            The <Link href="/guides/aca-open-enrollment-dates/">ACA open enrollment guide</Link>{' '}
            explains the federal dates and the state exceptions. The{' '}
            <Link href="/calculators/employer-coverage-affordability/">employer affordability tool</Link>{' '}
            checks whether a job-based offer affects Marketplace help.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>How to build your own timeline</h2>
          <ol>
            <li>Write down the month you turn 65 and the start and end of your seven-month window.</li>
            <li>Mark whether you have active employer coverage and whether the employer has 20 or more employees.</li>
            <li>If you are still working, write down the date the coverage or employment will end and add eight months.</li>
            <li>If you contribute to an HSA, write down the date six months before Part A will start.</li>
            <li>Put the annual October 15 to December 7 window on the calendar for plan changes.</li>
            <li>Confirm every date with Social Security or the official Medicare page before you rely on it.</li>
          </ol>
          <p>
            The <Link href="/calculators/part-b-late-enrollment-penalty/">Part B penalty tool</Link>{' '}
            can show what a missed window costs. The{' '}
            <Link href="/calculators/irmaa-cliff-checker/">IRMAA tool</Link> covers a different
            deadline: the two-year income lookback.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <SourceTable
            rows={[
              {
                label: 'Initial Enrollment Period',
                value: `${irs2026.initialEnrollmentPeriod.months} months around age 65`,
                source: sources.medicareEmployer,
                sourceLabel: 'Medicare.gov when can I sign up',
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'General Enrollment Period',
                value: generalWindow,
                source: sources.medicareAvoidPenalties,
                sourceLabel: 'Medicare.gov avoid late enrollment penalties',
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'Special Enrollment Period',
                value: `${irs2026.specialEnrollmentPeriodMonths} months after coverage ends`,
                source: sources.medicareWorkingPast65,
                sourceLabel: 'Medicare.gov working past 65',
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'Annual enrollment window',
                value: annualWindow,
                source: sources.medicareEmployer,
                sourceLabel: 'Medicare.gov when can I sign up',
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'HSA stop date',
                value: `${irs2026.hsaContributionStopMonthsBeforeMedicare} months before Part A`,
                source: sources.irsPub969,
                sourceLabel: 'IRS Publication 969',
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'ACA open enrollment',
                value: acaWindow,
                source: sources.healthcareOpenEnrollment,
                sourceLabel: 'HealthCare.gov open enrollment',
                checkedOn: dataVerifiedOn,
              },
            ]}
          />
          <p className="stat-note">
            The Part B standard premium for {year} is {formatMoney(partB2026.standardPremium.amount)} a month. Use the{' '}
            <Link href="/calculators/part-b-late-enrollment-penalty/">penalty calculator</Link> for
            a result based on your own months, not the standard amount alone.
          </p>
          <ReportError pageTitle="Medicare deadlines" />
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
