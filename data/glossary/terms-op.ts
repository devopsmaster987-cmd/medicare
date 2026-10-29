import { S, F, CHECKED, money, num, pct, dateRange, link, row } from './text';
import { A, ACA, B, D, IRS } from './figures';
import type { GlossaryTerm } from './types';

export const termsOP: GlossaryTerm[] = [
  {
    term: 'Open enrollment period',
    definition:
      'The yearly marketplace window, November through mid-January on the federal exchange, when anyone can buy or change health coverage for the next year.',
    whyItMatters: [
      'The marketplace runs one fixed window a year. Outside it, help depends on a qualifying life change such as losing employer coverage or turning 65, which is why late-in-the-year job losses and Medicare transitions land so sharply. Getting the dates straight prevents both a gap in coverage and a season of paying full price for a plan bought in a rush.',
    ],
    exactHeading: 'The exact window',
    exact: [
      `On the federal Marketplace, open enrollment runs ${dateRange(11, 1, 1, 15)} for coverage that begins January 1 of the new year, with most moves taking effect on the latter date, per HealthCare.gov's enrollment glossary (${S.healthcareOpenEnrollment}). State Marketplaces can set their own dates.`,
      `Outside that window, enrollment depends on a special enrollment period, the same structure Medicare uses with its own calendar.`,
    ],
    worked:
      `A household shops in December for plans effective the following January 1: the subsidy estimate changes because the applicable percentages published for that year, topping at ${pct(ACA.applicablePercentageTable[5].finalRate)}, apply against the poverty guidelines from one year earlier. Missing the January 15 close means waiting for a special enrollment reason, such as losing the employer plan.`,
    calculators: [
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Feeds the marketplace plan decision when employer coverage fails the test.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Places the marketplace calendar beside the Medicare windows.'),
    ],
    related: ['Annual enrollment period', 'SEP', 'Premium tax credit', 'Cost-sharing reduction'],
    sources: [
      row('Marketplace enrollment window', `${dateRange(11, 1, 1, 15)} each year`, S.healthcareOpenEnrollment, 'HealthCare.gov, open enrollment period'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Out-of-pocket maximum',
    definition:
      'The most a plan year will collect from you in covered cost sharing; premiums usually do not count toward it.',
    whyItMatters: [
      'The term answers the catastrophic question: after a terrible year of care, how much is the total bill? Marketplace and employer plans must set a ceiling on cost sharing, and drug plans in Part D now have a federal cap too. Original Medicare famously has no such ceiling on its own cost sharing, which is why the term keeps recutting the comparisons on this site.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `For marketplace and similar covered plans, the ${F} maximum is ${money(ACA.outOfPocketMaxSelfOnly.amount)} for self-only coverage and ${money(ACA.outOfPocketMaxFamily.amount)} for family coverage, per the federal cost-sharing parameters below. Deductibles, copays, and coinsurance run against it together.`,
      `In Part D, the yearly out-of-pocket cap for covered drugs is ${money(D.outOfPocketCap.amount)} in ${F}, per Medicare.gov's Part D costs page (${S.medicarePartDCosts}).`,
    ],
    worked:
      `A marketplace member on a self-only plan racks up ${money(9000)} of deductibles, copays and coinsurance in a bad year. The stop-loss is ${money(ACA.outOfPocketMaxSelfOnly.amount)}, so the plan pays 100 percent of covered cost sharing for the rest of the year and the member's share stops. A Medicare member without a supplement has no equivalent stop-loss on Part A or B cost sharing.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Compares the capped marketplace exposure with the uncapped Original Medicare exposure.'),
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Shows where Extra Help caps drug cost sharing below the standard limit.'),
    ],
    related: ['Cost-sharing reduction', 'Deductible', 'Coinsurance', 'Part D'],
    sources: [
      row(`Cost-sharing limit, ${F}`, `${money(ACA.outOfPocketMaxSelfOnly.amount)} / ${money(ACA.outOfPocketMaxFamily.amount)}`, S.hhs2026CostSharing, 'Federal Register, 2026 cost-sharing parameters'),
      row(`Part D out-of-pocket cap, ${F}`, money(D.outOfPocketCap.amount), S.medicarePartDCosts, 'Medicare.gov, Part D costs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Part A',
    definition:
      'The hospital insurance side of Medicare, covering inpatient hospital stays, skilled nursing days, hospice, and some home health care.',
    whyItMatters: [
      'Part A is usually premium-free once you have enough work credits, which makes it the easy part to activate, and it is also the part that can reach backward in time because late enrollment can be backdated up to six months. It is also the part whose deductible resets per benefit period, so real cost exposure lives inside hospital stays rather than across the whole year.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `Most beneficiaries pay no premium, but the inpatient deductible is ${money(A.inpatientDeductible.amount)} per benefit period in ${F}, and covered stays cost ${money(A.hospitalCoinsuranceDays61to90.amount)} per day on days 61-90 and ${money(A.lifetimeReserveDays.amount)} per day on lifetime reserve days, per the CMS fact sheet below.`,
      `Skilled nursing stays charge ${money(A.skilledNursingDays21to100.amount)} per day for days 21-100 after care that qualifies. People without enough work credits pay monthly premiums shown on the table below, per the same fact sheet.`,
    ],
    worked:
      `A member entering Medicare in 2026 with no Medigap spends 70 days in a hospital in one benefit period. The bill runs the Part A deductible of ${money(A.inpatientDeductible.amount)} for days 1-60, then ${money(A.hospitalCoinsuranceDays61to90.amount)} a day for days 61-70, for a total charge of ${money(A.inpatientDeductible.amount + 10 * A.hospitalCoinsuranceDays61to90.amount)} for the stay.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Places Part A enrollment timing beside employer coverage and HSA decisions.'),
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Explains the interplay between Part A backdating and Part B delay costs.'),
    ],
    related: ['Part B', 'Premium-free Part A', 'Deductible', 'Coinsurance'],
    sources: [
      row(`Part A deductible, ${F}`, money(A.inpatientDeductible.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row(`Hospital and SNF coinsurance, ${F}`, `${money(A.hospitalCoinsuranceDays61to90.amount)} / ${money(A.skilledNursingDays21to100.amount)} per day`, S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row(`Reduced and full premiums, ${F}`, `${money(A.reducedPremium.amount)} (30-39 quarters) / ${money(A.fullPremium.amount)} (fewer than 30)`, S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Part B',
    definition:
      'The medical insurance side of Medicare, covering doctor visits, outpatient care, preventive services, and some supplies and medical equipment.',
    whyItMatters: [
      'Part B is where lasting mistakes happen. The premium is income-adjusted, the penalty for late enrollment without creditable coverage is permanent, and the coordination rule with employer coverage changes who pays first at 20 or fewer employees. Delay while a job-based plan covers you is fully defensible; delay without that proof is expensive forever.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `The standard premium is ${money(B.standardPremium.amount)} a month in ${F}, with the annual deductible at ${money(B.deductible.amount)} and cost sharing split at ${pct(0.2)} coinsurance after the deductible, per the CMS fact sheet and Medicare.gov pages below. Income surcharges under IRMAA raise the premium in upward tiers, with the first tier starting at MAGI above ${money(B.irmaa.single[0].max ?? 0)} for single filers.`,
      `The penalty for late enrollment is 10 percent of the standard premium for each full 12-month period of delay without creditable coverage, and it rides on the premium for life.`,
    ],
    worked:
      `A member with no IRMAA and no Medigap has one covered outpatient bill of ${money(1000)} after the year's deductible is met. The plan-side cost to the member is the deductible plus ${money(0.2 * 1000)} of coinsurance, and if the member had delayed enrollment there would be an additional permanent surcharge added monthly to the same bill.`,
    calculators: [
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Prices the permanent surcharge month by month and over a decade or two.'),
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Shows the income surcharge tiers stacked on this premium.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Positions the Part B start date against employer and marketplace options.'),
    ],
    related: ['IRMAA', 'Late enrollment penalty', 'Creditable coverage', 'Medigap'],
    sources: [
      row(`Standard premium, ${F}`, money(B.standardPremium.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row(`Deductible and coinsurance, ${F}`, `${money(B.deductible.amount)} ${pct(0.2)}`, S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Part D',
    definition:
      'The prescription drug benefit of Medicare, sold through private plans with their own formularies, deductibles, and copays on top of a federal structure.',
    whyItMatters: [
      'Drug coverage is where the annual price changes bite hardest: formularies shift, deductibles move, and income surcharges can be billed separately from the plan premium. The new federal out-of-pocket cap bounds what covered drugs can cost in a year, while low-income programs can pull most of the cost out. Plan choice makes a big difference, and it resets once a year.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `The base beneficiary premium is ${money(D.baseBeneficiaryPremium.amount)} in ${F}, and plans set their own premiums inside the stabilized structure reported by CMS (${S.cms2026PartD}). The standard deductible can reach ${money(D.deductible.amount)} and the yearly out-of-pocket cap for covered drugs is ${money(D.outOfPocketCap.amount)}, per Medicare.gov's Part D costs page (${S.medicarePartDCosts}).`,
      `Income surcharges under IRMAA are billed on top of the plan premium, in tiers running from ${money(D.irmaa[1].amount)} up to ${money(D.irmaa[5].amount)}, per the CMS fact sheet below.`,
    ],
    worked:
      `A member buying a plan from the standard structure pays a base of ${money(D.baseBeneficiaryPremium.amount)} and faces the federal deductible of ${money(D.deductible.amount)} before the drug plan steps in. Covered drug spending stops collecting from the member at ${money(D.outOfPocketCap.amount)} for the year, and the member's first-tier drug cost sits inside that cap, not above it.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Shows how Extra Help shrinks the premium, deductible, and per-fill costs.'),
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', `Where an income surcharge is billed separately from your chosen plan's premium.`),
    ],
    related: ['Part B', 'Out-of-pocket maximum', 'Formulary', 'Late enrollment penalty'],
    sources: [
      row(`Part D base premium, ${F}`, money(D.baseBeneficiaryPremium.amount), S.cms2026PartD, 'CMS fact sheet, Part D bid information'),
      row(`Part D deductible and cap, ${F}`, `${money(D.deductible.amount)} / ${money(D.outOfPocketCap.amount)}`, S.medicarePartDCosts, 'Medicare.gov, Part D costs'),
      row(`Part D IRMAA range, ${F}`, `${money(D.irmaa[1].amount)} to ${money(D.irmaa[5].amount)}`, S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
];
