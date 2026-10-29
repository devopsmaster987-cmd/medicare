import type { Metadata } from 'next';
import Link from 'next/link';
import { AnswerCapsule, SourceTable } from '@/components/calc/content';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AuthorLine } from '@/components/trust/author-line';
import { LastUpdated } from '@/components/trust/last-updated';
import { ReportError } from '@/components/trust/report-error';
import { partBPenalty } from '@/data/penalties';
import { sources } from '@/data/sources';
import { dataVerifiedOn, figureYears } from '@/data/verified';
import { partBPenaltyCalculator } from '@/lib/formulas/part-b-penalty';
import { irmaaCalculator } from '@/lib/formulas/irmaa';
import { medicareVsAca } from '@/lib/formulas/medicare-vs-aca';
import { formatMoney, formatPercent } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Medicare scenarios',
  description:
    'Three worked Medicare decisions: working past 65, a missed Special Enrollment Period, and a Roth conversion near the IRMAA cliff.',
  alternates: { canonical: '/scenarios/' },
  openGraph: {
    title: 'Medicare scenarios | MedicareClear',
    description:
      'Three worked Medicare decisions with the numbers, the rule, and the next official step.',
    url: '/scenarios/',
    images: [
      {
        url: '/og/scenarios.png',
        width: 1200,
        height: 630,
        alt: 'Worked Medicare scenarios',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/scenarios.png'],
  },
};

const workingPast65 = medicareVsAca({
  age: 66,
  employerSize: 25,
  coverageType: 'active',
  creditableCoverage: true,
  workCredits: 40,
});

const missedSep = partBPenaltyCalculator({
  monthsDelayed: 12,
  hadCreditableCoverage: true,
  sepEligible: false,
});

const keptSep = partBPenaltyCalculator({
  monthsDelayed: 12,
  hadCreditableCoverage: true,
  sepEligible: true,
});

const irmaaAtLine = irmaaCalculator({
  filingStatus: 'single',
  magiTwoYearsBack: 137000,
});

const irmaaOneOver = irmaaCalculator({
  filingStatus: 'single',
  magiTwoYearsBack: 137001,
});

export default function ScenariosPage() {
  return (
    <>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Scenarios', href: '/scenarios/' },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Worked decisions</p>
          <h1 className="page-title">Medicare scenarios</h1>
          <AnswerCapsule>
            A rule becomes useful when it meets a real date and a real dollar amount. These three
            scenarios show how the calculators handle working past 65, a missed Special Enrollment
            Period, and a Roth conversion near the IRMAA cliff. The inputs are examples, not
            recommendations.
          </AnswerCapsule>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>How to read these scenarios</h2>
          <p>
            Each scenario uses the same data layer as the calculators. The point is not to predict
            your own result. The point is to show which fact changes the answer, which deadline
            matters, and which official page to open next. Use the linked calculator with your own
            numbers before you act.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Scenario 1: working past 65 with a large employer</h2>
          <p>
            A 66-year-old has active coverage from an employer with 25 employees, the plan is
            creditable, and the person has 40 work credits. The calculator recommends{' '}
            <strong>{workingPast65.pathLabel.toLowerCase()}</strong>.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Scenario 1 result</caption>
              <tbody>
                <tr>
                  <th scope="row">Premium-free Part A</th>
                  <td>{workingPast65.premiumFreePartA ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <th scope="row">Annual standard Part B premium</th>
                  <td>{formatMoney(workingPast65.annualPartBPremium)}</td>
                </tr>
                <tr>
                  <th scope="row">ACA subsidy status</th>
                  <td>{workingPast65.acaSubsidyStatus.replaceAll('-', ' ')}</td>
                </tr>
                <tr>
                  <th scope="row">Main warning</th>
                  <td>{workingPast65.warnings[0] ?? 'None'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The employer size matters because a plan with 20 or more employees generally pays first
            for a worker age 65 or older. The person can usually delay Part B while the active
            coverage continues. The eight-month Special Enrollment Period starts when the coverage or
            employment ends, not when the person turns 65.
          </p>
          <p>
            The trade-off is the Marketplace. Premium-free Part A generally ends premium tax credits,
            even if the person is still working. The calculator says the subsidy status is{' '}
            {workingPast65.acaSubsidyStatus.replaceAll('-', ' ')}.
          </p>
          <p>
            Next step: confirm the employer size and the creditable coverage notice, then use the{' '}
            <Link href="/calculators/medicare-vs-aca/">Medicare vs ACA tool</Link> with your own
            dates. The <Link href="/guides/medicare-special-enrollment-period-while-working/">working past 65 guide</Link>{' '}
            lists the proof to keep.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Scenario 2: creditable coverage, but the Special Enrollment Period ended</h2>
          <p>
            A person went 12 months without Part B and had creditable employer coverage. If the
            Special Enrollment Period was still open, the calculator counts no penalty. If the
            window had already ended, the same 12 months produce a penalty. That is the difference
            between the two results below.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Scenario 2 result</caption>
              <thead>
                <tr>
                  <th scope="col">Fact</th>
                  <th scope="col">Special Enrollment Period open</th>
                  <th scope="col">Special Enrollment Period ended</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Months counted</th>
                  <td>{keptSep.monthsCounted}</td>
                  <td>{missedSep.monthsCounted}</td>
                </tr>
                <tr>
                  <th scope="row">Monthly penalty</th>
                  <td>{formatMoney(keptSep.monthlyPenalty)}</td>
                  <td>{formatMoney(missedSep.monthlyPenalty)}</td>
                </tr>
                <tr>
                  <th scope="row">Total monthly premium</th>
                  <td>{formatMoney(keptSep.totalMonthlyPremium)}</td>
                  <td>{formatMoney(missedSep.totalMonthlyPremium)}</td>
                </tr>
                <tr>
                  <th scope="row">Ten-year penalty</th>
                  <td>{formatMoney(keptSep.tenYearPenalty)}</td>
                  <td>{formatMoney(missedSep.tenYearPenalty)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Creditable coverage is not a permanent exemption. It can protect a delay while the
            Special Enrollment Period is available. Once the window closes, the months can count.
            The calculator shows the difference instead of assuming that creditable coverage always
            means zero.
          </p>
          <p>
            Next step: ask Social Security for the exact date the Special Enrollment Period ended
            and the months it counted. Then use the{' '}
            <Link href="/calculators/part-b-late-enrollment-penalty/">Part B penalty calculator</Link>{' '}
            with those dates. The <Link href="/guides/medicare-special-enrollment-period-while-working/">Special Enrollment Period guide</Link>{' '}
            explains the eight-month window.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <h2>Scenario 3: one dollar over the IRMAA line</h2>
          <p>
            A single filer has {formatMoney(irmaaAtLine.magi)} of MAGI in the two-year lookback. The
            next dollar crosses into the next IRMAA tier. The calculator shows the current monthly
            surcharge, the annual cost, and the cost of crossing the line.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Scenario 3 result</caption>
              <tbody>
                <tr>
                  <th scope="row">Monthly surcharge at {formatMoney(irmaaAtLine.magi)}</th>
                  <td>{formatMoney(irmaaAtLine.monthlySurcharge)}</td>
                </tr>
                <tr>
                  <th scope="row">Annual surcharge at {formatMoney(irmaaAtLine.magi)}</th>
                  <td>{formatMoney(irmaaAtLine.annualSurcharge)}</td>
                </tr>
                <tr>
                  <th scope="row">Monthly surcharge one dollar over</th>
                  <td>{formatMoney(irmaaOneOver.monthlySurcharge)}</td>
                </tr>
                <tr>
                  <th scope="row">Extra annual cost one dollar over</th>
                  <td>
                    {formatMoney(
                      irmaaOneOver.annualSurcharge - irmaaAtLine.annualSurcharge,
                    )}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Headroom to the next tier</th>
                  <td>{formatMoney(irmaaAtLine.headroomToNextBracket ?? 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A Roth conversion adds the converted amount to MAGI in the year of the conversion. The
            Medicare premium can change two years later. The relevant question is not only the tax
            on the conversion, but whether the extra income crosses an IRMAA threshold in the
            lookback year.
          </p>
          <p>
            The first surcharge tier starts at {formatMoney(irmaaAtLine.tier.min)}. The next tier
            starts at {formatMoney(irmaaAtLine.nextTier?.min ?? irmaaAtLine.tier.min)}. Crossing
            that line adds {formatMoney(irmaaOneOver.annualSurcharge - irmaaAtLine.annualSurcharge)}{' '}
            a year for one person. That is a Medicare premium change, not a tax rate.
          </p>
          <p>
            Next step: measure the conversion headroom before you convert. Use the{' '}
            <Link href="/calculators/irmaa-cliff-checker/">IRMAA cliff checker</Link> with the income
            figure SSA actually used. The{' '}
            <Link href="/guides/roth-conversion-irmaa/">Roth conversion and IRMAA guide</Link>{' '}
            explains the two-year trap.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <SourceTable
            rows={[
              {
                label: 'Employer size and working past 65',
                value: `${workingPast65.reasons.length} decision factors`,
                source: sources.medicareWorkingPast65,
                sourceLabel: 'Medicare.gov working past 65',
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'Part B penalty rate',
                value: `${formatPercent(partBPenalty.ratePerFullYear.rate)} per full 12-month period`,
                source: sources.medicareAvoidPenalties,
                sourceLabel: 'Medicare.gov avoid late enrollment penalties',
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'Part B standard premium',
                value: formatMoney(keptSep.standardPremium),
                source: sources.cms2026AB,
                sourceLabel: `CMS ${figureYears.current} Part B premium fact sheet`,
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'IRMAA thresholds and surcharges',
                value: `${formatMoney(irmaaAtLine.tier.min)} tier start`,
                source: sources.cms2026AB,
                sourceLabel: `CMS ${figureYears.current} Part B premium fact sheet`,
                checkedOn: dataVerifiedOn,
              },
              {
                label: 'Two-year lookback',
                value: `${irmaaAtLine.lookbackYears} years`,
                source: sources.ssaPomsLce,
                sourceLabel: 'SSA Program Operations Manual',
                checkedOn: dataVerifiedOn,
              },
            ]}
          />
          <p className="stat-note">
            These are examples, not recommendations. Your own dates, income, and plan documents can
            change the result. Use the calculators with your numbers and confirm the official dates
            with Social Security.
          </p>
          <ReportError pageTitle="Medicare scenarios" />
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
