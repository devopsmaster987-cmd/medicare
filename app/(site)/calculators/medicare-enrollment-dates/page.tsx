import type { Metadata } from 'next';
import Link from 'next/link';
import { TakeHomePack } from '@/components/action/take-home-pack';
import { AdSlot } from '@/components/ads/ad-slot';
import { MedicareEnrollmentDatesCalculator } from './calculator';
import {
  AnswerCapsule,
  Faq,
  KeyFacts,
  SourceTable,
  WhatChanged,
} from '@/components/calc/content';
import { EmailCapture } from '@/components/calc/email-capture';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { AuthorLine } from '@/components/trust/author-line';
import { CiteThisPage } from '@/components/trust/cite-this-page';
import { IndependenceNote } from '@/components/trust/independence-note';
import { LastUpdated } from '@/components/trust/last-updated';
import { glossaryTipsFor } from '@/data/glossary';
import { contactByKey } from '@/data/contacts';
import { partA2026 } from '@/data/medicare-part-a';
import { partA2025 } from '@/data/medicare-part-a-2025';
import { partB2025 } from '@/data/medicare-part-b-2025';
import { partB2026 } from '@/data/medicare-part-b';
import { sources } from '@/data/sources';
import { dataVerifiedOn, figureYears } from '@/data/verified';
import { enrollmentDatesCalculator } from '@/lib/formulas/enrollment-dates';
import { calculatorSchema, medicalWebPageSchema } from '@/lib/schema';
import { clampMetaDescription } from '@/lib/seo';
import { formatMoney } from '@/lib/utils';

const year = figureYears.current;
const priorYear = figureYears.prior;
const path = '/calculators/medicare-enrollment-dates/';
const glossaryTips = glossaryTipsFor(['IEP', 'SEP', 'General enrollment period', 'Part B']);

export const metadata: Metadata = {
  title: { absolute: `When can I sign up for Medicare? (${year})` },
  description: clampMetaDescription(
    `When can I sign up for Medicare? Enter your birthday to see your seven-month window, exact coverage start date, and what to do if you missed it.`,
  ),
  alternates: { canonical: path },
  openGraph: {
    type: 'website',
    title: `When can I sign up for Medicare? (${year})`,
    description:
      'Find your seven-month Medicare sign-up window, the first day coverage can start, and the General and Special Enrollment Period dates that apply if you missed it.',
    url: path,
    images: [
      {
        url: `/og${path.replace(/\/$/, '')}.png`,
        width: 1200,
        height: 630,
        alt: `Medicare sign-up dates calculator (${year})`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/og${path.replace(/\/$/, '')}.png`],
  },
};

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
  const [yearPart, monthPart, dayPart] = isoDate.split('-').map(Number);
  return `${monthNames[monthPart - 1]} ${dayPart}, ${yearPart}`;
}

const examplePlain = enrollmentDatesCalculator({
  birthYear: 1961,
  birthMonth: 3,
  today: new Date(),
});
const exampleFirstOfMonth = enrollmentDatesCalculator({
  birthYear: 1961,
  birthMonth: 7,
  birthdayOnFirst: true,
  today: new Date(),
});
const exampleMissed = enrollmentDatesCalculator({
  birthYear: 1960,
  birthMonth: 10,
  today: new Date(),
});

const faqItems = [
  {
    question: 'Can I sign up for Medicare before 65?',
    answer:
      'Your seven-month window opens three months before the month you turn 65, so for many people the sign-up window starts at 64. You cannot enroll in Parts A and B earlier than 65 unless you qualify through disability or a Special Enrollment Period.',
  },
  {
    question: 'How many months is the Medicare enrollment period?',
    answer:
      'Seven months: the three months before your 65th birthday month, your birthday month itself, and the three months after. If your birthday falls on the first, the whole window shifts back one month.',
  },
  {
    question: 'How soon does Medicare coverage start after I sign up?',
    answer:
      'If you sign up in the three months before your birthday month, coverage starts the first day of your birthday month. If you sign up during or after that month, coverage starts the first day of the month after you sign up.',
  },
  {
    question: 'What happens if I miss Medicare enrollment?',
    answer:
      `You wait for the General Enrollment Period, January 1 through March 31 of the next year, and coverage usually starts the month after you sign up. A Part B late enrollment penalty of 10% for each full year you delayed may then apply.`,
  },
  {
    question: 'Do I have to sign up for Medicare at 65?',
    answer:
      'If you or your spouse are still working with employer group coverage, you can usually delay without a penalty, and you should tell the marketplace if you have marketplace coverage. If you are not covered that way, enrolling during your window avoids a permanent Part B penalty.',
  },
  {
    question: 'When does Medicare start if I sign up late?',
    answer:
      'In the General Enrollment Period, coverage usually starts the first day of the month after you sign up. With employer coverage, your Special Enrollment Period starts the month after your first window ends and runs through the eighth month after your job coverage ends.',
  },
];

export default function MedicareEnrollmentDatesPage() {
  return (
    <>
      <JsonLd
        data={[
          calculatorSchema({
            name: `Medicare sign-up dates calculator ${year}`,
            description:
              'Enter a birthday to see the seven-month Medicare enrollment window, coverage start dates, and the General and Special Enrollment Periods.',
            url: path,
            image: `/og${path.replace(/\/$/, '')}.png`,
          }),
          medicalWebPageSchema({
            name: 'When can I sign up for Medicare?',
            description:
              'Your seven-month Medicare sign-up window, when coverage starts, and what applies if you missed your first chance to enroll.',
            path,
            image: `/og${path.replace(/\/$/, '')}.png`,
            about: ['Medicare enrollment periods', 'Coverage start dates', 'Social Security sign-up'],
            breadcrumb: [
              { name: 'Home', url: '/' },
              { name: 'Calculators', url: '/calculators/' },
              { name: 'Medicare enrollment dates', url: path },
            ],
          }),
        ]}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators/' },
            { name: 'Medicare enrollment dates', href: path },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Enrollment · {year}</p>
          <h1 className="page-title">When can I sign up for Medicare?</h1>
          <p className="page-lede">
            Enter your birthday and we place your seven-month sign-up window, the first day
            coverage can start, and any General or Special Enrollment Period that applies.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <div className="wrap">
        <AnswerCapsule>
          When can I sign up for Medicare? Your first window is seven months: the three months
          before the month you turn 65, your birthday month, and three months after. Miss it and
          you wait for the January-to-March General Enrollment Period, or an eight-month window
          after job coverage ends.
        </AnswerCapsule>
      </div>

      <section className="section section-tight">
        <div className="wrap">
          <KeyFacts
            caption="Medicare sign-up key facts"
            rows={[
              {
                label: 'First sign-up window',
                value: '7 months',
                note: 'Three months before your 65th birthday month, that month, and three months after.',
              },
              {
                label: 'Coverage if you sign up early',
                value: 'First day of your birthday month',
                note: 'Applies when you sign up during the three months before it.',
              },
              {
                label: 'Coverage if you sign up during or after',
                value: 'First day of the next month',
                note: 'Coverage never backdates more than the birthday-month rule.',
              },
              {
                label: 'Birthday on the first',
                value: 'Window shifts back one month',
                note: 'Eligibility starts the month before your birthday month.',
              },
              {
                label: 'General Enrollment Period',
                value: 'January 1 to March 31',
                note: 'The usual path if your first window has closed.',
              },
              {
                label: 'After job coverage ends',
                value: '8-month Special Enrollment Period',
                note: 'Starts the month after your first window closes and runs through the eighth month after coverage ends.',
              },
            ]}
          />
        </div>
      </section>

      <div className="wrap">
        <MedicareEnrollmentDatesCalculator tips={glossaryTips} />
        <AdSlot placement="below-calculator" />
      </div>

      <section className="section">
        <div className="wrap prose">
          <h2>When does Medicare coverage start</h2>
          <p>
            Coverage starts the first day of the month you sign up in, with one important exception:
            sign up during the three months before your 65th birthday month and coverage begins on
            the first day of that birthday month. Sign up in your birthday month or later and you
            wait until the first of the month after you apply.
          </p>
          <p>
            That is why the dates in the calculator matter more than the enrollment window alone.
            Two people with the same birthday month can get different coverage start dates from the
            timing of a single sign-up.
          </p>

          <h2>Your initial enrollment period dates</h2>
          <p>
            In plain words, these Medicare sign-up dates depend only on your birthday. Your Initial
            Enrollment Period is seven months long: it opens on the first day of the third month
            before your 65th birthday month and closes on the last day of the third month after it.
            One rule shifts the whole window: if your birthday is on the first of the month,
            Medicare treats you as eligible the month before, which moves both dates back one month.
          </p>
          <p>
            The window is fixed by your birthday, so the only decision inside it is when to act.
            This medicare enrollment calculator turns that decision into exact dates. Signing up in
            the first three months gives you coverage on time; waiting until the last three months
            usually delays the start date to the month after sign-up.
          </p>

          <h2>Special enrollment period dates</h2>
          <p>
            If you or your spouse are still working with employer group health coverage, you get a
            Special Enrollment Period that starts the month after your first sign-up window closes
            and runs through the eighth month after your employer coverage (or the job itself)
            ends, whichever comes first. Enter your coverage end month in the calculator to see
            those exact dates. When you are weighing when to enroll in Medicare against a job change
            or retirement date, that window is the number to check first.
          </p>
          <p>
            The eight-month window is the practical reason many people can delay Part B without a
            penalty. The full rules, including what counts as employer coverage, are explained in{' '}
            <Link href="/guides/medicare-special-enrollment-period-while-working/">
              the Special Enrollment Period while working guide
            </Link>
            .
          </p>

          <h2>General enrollment period dates</h2>
          <p>
            If your first window has closed and no Special Enrollment Period applies, the General
            Enrollment Period runs January 1 through March 31. You can sign up then, but coverage
            usually does not start until the first day of the month after you sign up, and a Part B
            late enrollment penalty may apply for the delay. The full mechanics are in the{' '}
            <Link href="/guides/medicare-general-enrollment-period/">
              General Enrollment Period guide
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <WhatChanged
            year={year}
            priorYear={priorYear}
            rows={[
              {
                label: 'Standard Part B premium',
                prior: formatMoney(partB2025.standardPremium.amount),
                current: formatMoney(partB2026.standardPremium.amount),
                note: 'What you start paying the month coverage begins, if you take Part B.',
              },
              {
                label: 'Part B deductible',
                prior: formatMoney(partB2025.deductible.amount),
                current: formatMoney(partB2026.deductible.amount),
                note: 'The amount you pay before Part B cost sharing starts.',
              },
              {
                label: 'Part A inpatient deductible',
                prior: formatMoney(partA2025.inpatientDeductible.amount),
                current: formatMoney(partA2026.inpatientDeductible.amount),
                note: 'Per benefit period, and the same at every premium tier.',
              },
              {
                label: 'Enrollment window rules',
                prior: '7 months, GEP Jan 1–Mar 31',
                current: '7 months, GEP Jan 1–Mar 31',
                note: 'The window length and General Enrollment Period dates did not change.',
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Worked examples</h2>
          <p>
            Three birthdays run through the same rule: find the month you turn 65, apply the
            first-of-the-month shift if it applies, then count three months before and three months
            after.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Medicare sign-up window worked examples</caption>
              <thead>
                <tr>
                  <th scope="col">Input or result</th>
                  <th scope="col">Born March 1961</th>
                  <th scope="col">Born July 1, 1961</th>
                  <th scope="col">Born October 1960</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Month you turn 65</th>
                  <td>{examplePlain.eligibleMonthLabel}</td>
                  <td>{exampleFirstOfMonth.eligibleMonthLabel}</td>
                  <td>{exampleMissed.eligibleMonthLabel}</td>
                </tr>
                <tr>
                  <th scope="row">Window opens</th>
                  <td>{formatDate(examplePlain.iepStart)}</td>
                  <td>{formatDate(exampleFirstOfMonth.iepStart)}</td>
                  <td>{formatDate(exampleMissed.iepStart)}</td>
                </tr>
                <tr>
                  <th scope="row">Window closes</th>
                  <td>{formatDate(examplePlain.iepEnd)}</td>
                  <td>{formatDate(exampleFirstOfMonth.iepEnd)}</td>
                  <td>{formatDate(exampleMissed.iepEnd)}</td>
                </tr>
                <tr>
                  <th scope="row">Earliest coverage</th>
                  <td>{formatDate(examplePlain.earliestCoverageStart)}</td>
                  <td>{formatDate(exampleFirstOfMonth.earliestCoverageStart)}</td>
                  <td>{formatDate(exampleMissed.earliestCoverageStart)}</td>
                </tr>
                <tr>
                  <th scope="row">What applies if the window has passed</th>
                  <td>
                    {examplePlain.windowStatus === 'closed'
                      ? `General Enrollment Period ${formatDate(examplePlain.gep?.start ?? '')} to ${formatDate(examplePlain.gep?.end ?? '')}`
                      : 'Window still ahead or open'}
                  </td>
                  <td>
                    {exampleFirstOfMonth.windowStatus === 'closed'
                      ? `General Enrollment Period ${formatDate(exampleFirstOfMonth.gep?.start ?? '')} to ${formatDate(exampleFirstOfMonth.gep?.end ?? '')}`
                      : 'Window still ahead or open'}
                  </td>
                  <td>
                    {exampleMissed.windowStatus === 'closed'
                      ? `General Enrollment Period ${formatDate(exampleMissed.gep?.start ?? '')} to ${formatDate(exampleMissed.gep?.end ?? '')}`
                      : 'Window still ahead or open'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="stat-note">
            Source:{' '}
            <a href={sources.medicareSignUp} target="_blank" rel="noreferrer">
              Medicare.gov, sign up for Medicare
            </a>{' '}
            and{' '}
            <a href={sources.ssaWhenToSignUp} target="_blank" rel="noreferrer">
              Social Security, when to sign up for Medicare
            </a>
            , checked {dataVerifiedOn}.
          </p>
          <IndependenceNote />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>What to do next</h2>
          <ol>
            <li>
              Put your window dates in your calendar now. The reminder button above downloads a
              deadline file for any phone or desktop calendar.
            </li>
            <li>
              Decide about Part B while your window is open. If you are delaying because of job
              coverage, confirm the coverage qualifies and ask your benefits office when it ends.
            </li>
            <li>
              Enroll through{' '}
              <a href={sources.ssaWhenToSignUp} target="_blank" rel="noreferrer">
                Social Security
              </a>
              , by phone at {contactByKey.ssa.phone}, or in person. Have your Social Security
              number and employer coverage details ready.
            </li>
            <li>
              If your window has already closed, check the General Enrollment Period dates above
              and ask Social Security whether a Special Enrollment Period or a penalty exception
              applies to you.
            </li>
          </ol>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Three honest caveats</h2>
          <ol>
            <li>
              These dates come from your birthday, not from an official record. Social Security
              confirms the final dates when you apply, and a mismatch in your birthday or work
              history can move them.
            </li>
            <li>
              Whether employer coverage counts for a Special Enrollment Period depends on the size
              of the employer and how the plan works. If you are unsure, ask your benefits office
              and Social Security before you delay.
            </li>
            <li>
              Coverage start dates say nothing about cost. The Part B premium, the deductible, and
              any late penalty are separate numbers, calculated on the{' '}
              <Link href="/calculators/medicare-premium-calculator/">
                Medicare premium calculator
              </Link>
              .
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Faq items={faqItems} />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <h2>Related help</h2>
          <ul className="related-list">
            <li>
              <Link href="/guides/turning-65-medicare-checklist/">
                What do I need to do when I turn 65?
              </Link>
            </li>
            <li>
              <Link href="/guides/medicare-initial-enrollment-period/">
                Medicare initial enrollment period explained
              </Link>
            </li>
            <li>
              <Link href="/guides/medicare-special-enrollment-period-while-working/">
                Special Enrollment Period while working
              </Link>
            </li>
            <li>
              <Link href="/calculators/part-b-late-enrollment-penalty/">
                Part B late enrollment penalty calculator
              </Link>
            </li>
            <li>
              <Link href="/calculators/medicare-premium-calculator/">
                Medicare premium calculator
              </Link>
            </li>
            <li>
              <a href={sources.medicareSignUp} target="_blank" rel="noreferrer">
                Medicare.gov: sign up for Medicare
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SourceTable
            rows={[
              {
                label: 'First sign-up window',
                value: '7 months around your 65th birthday',
                source: sources.ssaWhenToSignUp,
                sourceLabel: 'Social Security, when to sign up',
              },
              {
                label: 'Coverage start rule',
                value: 'First of the birthday month if you sign up early, otherwise the first of the next month',
                source: sources.medicareSignUp,
                sourceLabel: 'Medicare.gov sign-up',
              },
              {
                label: 'General Enrollment Period',
                value: 'January 1 to March 31',
                source: sources.medicareSignUp,
                sourceLabel: 'Medicare.gov sign-up',
              },
              {
                label: 'Special Enrollment Period',
                value: 'Starts the month after your first window ends; ends 8 months after employer coverage or the job ends',
                source: sources.medicareCoverageStarts,
                sourceLabel: 'Medicare.gov, when coverage starts',
              },
              {
                label: 'Where to apply',
                value: `Social Security, ${contactByKey.ssa.phone}`,
                source: sources.ssaMedicareSignupForm,
                sourceLabel: 'Social Security Medicare application',
              },
            ]}
          />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <CiteThisPage
            title="When can I sign up for Medicare?"
            path="/calculators/medicare-enrollment-dates/"
          />
          <EmailCapture />
          <TakeHomePack pageTitle="Medicare sign-up dates calculator" />
          <p className="disclaimer">
            MedicareClear is independent and is not connected to Medicare.gov, Social Security, or
            any government agency. This page is educational and does not provide legal, tax, or
            insurance advice. Confirm your dates with Social Security before you act.
          </p>
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
