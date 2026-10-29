import { S, F, CHECKED, money, num, pct, link, row } from './text';
import { ACA, A, B, D, IRS, MSP } from './figures';
import type { GlossaryTerm } from './types';

export const termsP2: GlossaryTerm[] = [
  {
    term: 'Premium',
    definition:
      'The monthly amount charged to keep a health, drug, or supplemental plan active, separate from the deductibles and coinsurance used inside the year.',
    whyItMatters: [
      'Premiums are the only Medicare cost most people can see coming months ahead, which makes them the anchor of every budget on this site. The standard Part B premium, the drug plan base, and any income-based surcharge all arrive monthly, while deductibles and coinsurance only show up when care happens. Comparing coverage means lining up the fixed monthly amount against the inside-the-year cost sharing.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `Part B charges a standard premium of ${money(B.standardPremium.amount)} a month in ${F}, rising in IRMAA tiers for higher MAGI. Most people pay no Part A premium, and Part D plans charge their own premium on top of a base of ${money(D.baseBeneficiaryPremium.amount)}, per the CMS and Medicare.gov sources below.`,
      `Employer and marketplace premiums run on the same monthly rhythm, tested against household income at ${pct(ACA.affordabilityPercentage.rate)} for the employer affordability question.`,
    ],
    worked:
      `A single member with no IRMAA pays ${money(B.standardPremium.amount)} for Part B and a drug plan premium of, say, ${money(D.baseBeneficiaryPremium.amount)}, which rings up ${money(B.standardPremium.amount * 12 + D.baseBeneficiaryPremium.amount * 12)} across the year before any care. A Medigap policy and an IRMAA tier would add to that fixed floor, not to the deductible.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Separates the income surcharge from the standard premium month by month.'),
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Values the premiums these programs absorb, per month and per year.'),
    ],
    related: ['Part B', 'Part D', 'Coinsurance', 'IRMAA'],
    sources: [
      row(`Part B standard premium, ${F}`, money(B.standardPremium.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row(`Part D base premium, ${F}`, money(D.baseBeneficiaryPremium.amount), S.cms2026PartD, 'CMS fact sheet, Part D bid information'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Premium tax credit',
    definition:
      'The marketplace subsidy that lowers the monthly premium for eligible households, sized from household income and the price of a benchmark plan.',
    whyItMatters: [
      'The premium tax credit is the reason marketplace math and employer-offered math are genuinely intertwined: an unaffordable employer plan generally opens the door to the credit, and the credit is sized from the household income the marketplace reads, not the paycheck. The share of income a household pays is capped by a published applicable percentage, and the subsidy is the gap between that contribution and the benchmark plan price.',
    ],
    exactHeading: `The exact structure for ${F}`,
    exact: [
      `Households between 100 percent and 400 percent of the poverty guidelines generally qualify, and the applicable percentage scales across the band from ${pct(ACA.applicablePercentageTable[0].initialRate)} near poverty up to the top rate of ${pct(ACA.applicablePercentageTable[5].finalRate)} at and above 300 percent of FPL, per the IRS Q&A page (${S.irsPtcQa}). Dollar figures hang on the poverty guidelines from one year earlier.`,
      `For ${F}, the enhanced provisions that had already stretched credits above the 400 percent line expired at the end of the prior year, so the ordinary cap is back in force, per the guidance noted in the site's data and documented on the CRS summary below.`,
    ],
    worked:
      `A two-person household at 350 percent of the poverty guidelines used for that year's subsidies, ${money(21640 * 3.5)} a year, sits in the flat top band and owes the benchmark contribution of ${pct(ACA.applicablePercentageTable[5].finalRate)}, or ${money(0.0996 * 21640 * 3.5)}. Against a benchmark plan priced at ${money(900)} a month, the household contributes ${money((0.0996 * 21640 * 3.5) / 12)} of its own each month and the credit covers the rest, ${money(900 - (0.0996 * 21640 * 3.5) / 12)}, which is the column the site's calculators reproduce.`,
    calculators: [
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Runs both sides: the employer affordability test and the credit it unlocks.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Compares subsidized marketplace coverage beside Medicare premiums and surcharges.'),
    ],
    related: ['Household income', 'FPL', 'Cost-sharing reduction', 'Subsidy'],
    sources: [
      row('Applicable percentage band', `Rises from ${pct(ACA.applicablePercentageTable[0].initialRate)} to ${pct(ACA.applicablePercentageTable[5].finalRate)} across FPL`, S.irsPtcQa, 'IRS, premium tax credit Q&A'),
      row('Subsidy structure status', 'Enhanced provisions expired at the end of 2025', S.crsEnhancedPtc, 'CRS report, enhanced premium tax credits'),
      row('Tax form linkage', 'Form 1095-A reconciles advance credits each year', S.irs1095a, 'IRS, health coverage statements'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Premium-free Part A',
    definition:
      'Part A with no monthly premium, granted to people with enough work credits or another qualifying basis such as a spouse or Social Security retirement entitlement.',
    whyItMatters: [
      'Entitlement to premium-free Part A is the hinge of several decisions around 65: it generally ends marketplace premium tax credits once Medicare is in effect, it starts the HSA contribution stop clock, and its presence lets a worker delay Part B cleanly. People without the credits face monthly Part A premiums instead, which changes the whole cost comparison.',
    ],
    exactHeading: `The exact bar`,
    exact: [
      `The standard bar is ${num(40)} quarters of Medicare-covered employment (ten years of credits), which Medicare.gov lists on its other-paths page (${S.medicareOtherPaths}); a spouse's work or a retirement entitlement can carry the same result. Fewer than ${num(40)} quarters means paying a Part A premium, with buy-back credits on the source table below.`,
      `Once premium-free Part A is in effect, the marketplace subsidy questions and the HSA contribution rules that protect under-65 households stop applying.`,
    ],
    worked:
      `A worker with 43 quarters qualifies for premium-free Part A and keeps the HSA discussion live only until enrollment; a co-worker with 31 quarters pays the reduced premium of ${money(A.reducedPremium.amount)} a month in ${F}, or ${money(A.reducedPremium.amount * 12)} a year, which reshapes the whole comparison against staying on marketplace coverage.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Checks the premium-free Part A bar inside the total coverage decision.'),
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Explains how Part A entitlement interacts with subsidy eligibility.'),
    ],
    related: ['Part A', 'Work credits', 'Reduced Part A premium', 'HSA'],
    sources: [
      row('Premium-free bar', `${num(40)} quarters of coverage or another qualifying basis`, S.medicareOtherPaths, 'Medicare.gov, other paths to Medicare'),
      row(`Reduced and full Part A premiums, ${F}`, `${money(A.reducedPremium.amount)} / ${money(A.fullPremium.amount)}`, S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Prior authorization',
    definition:
      'A plan requirement that certain drugs or services get insurer approval before they are covered rather than after the bill arrives.',
    whyItMatters: [
      'Prior authorization is where expensive plans quietly narrow. The term matters for households planning surgery, MRI imaging, or a required higher-tier drug: the care can be denied or delayed at approval time even when it is on the plan. Delays shift care, so planning a procedure inside a plan year needs an authorization conversation before the calendar, not after a denial.',
    ],
    exactHeading: 'The exact mechanism',
    exact: [
      `Plans publish which drugs and services require prior authorization in plan materials, listed alongside step therapy and quantity limits, and the Medicare Plan Finder (${S.medicarePlanFinder}) shows drug-level requirements before choosing a plan. Appeals run up the same plan appeal path used for denials.`,
      `Approval applies at plan level, so switching plans is also switching the authorization rules; Original Medicare has far fewer of these requirements at the fee-for-service claiming level.`,
    ],
    worked:
      `A plan lists an imaging test with a prior-authorization flag. The member's doctor files the request with medical notes, and the plan approves before the procedure, avoiding a denial and the appeal afterward. A neighbor whose care needed the same test under a different plan with no flag schedules it without any paperwork at all.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', `Contrasts plan-managed rules with Original Medicare's looser claiming structure.`),
    ],
    related: ['Formulary', 'Appeal', 'Network', 'Medicare Advantage'],
    sources: [
      row('Plan requirements', 'Prior authorization, step therapy, quantity limits in plan materials', S.medicarePlanFinder, 'Medicare.gov, Plan Finder'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'QI',
    definition:
      'Qualifying Individual: the Medicare Savings Program tier that pays the Part B premium for people between the SLMB line and roughly 135 percent of poverty.',
    whyItMatters: [
      'QI is the top rung of the Part B premium-only tiers, which makes it the answer for households that just clear SLMB. Losing it means paying the full Part B premium out of Social Security checks, so the dollar value is easy to state. Funding rules differ from the other rungs because this benefit is supported by a capped federal allocation in some states, and applications are prioritized.',
    ],
    exactHeading: `The exact line for ${F}`,
    exact: [
      `QI covers counted monthly income up to about ${money(MSP.qi.anchorMonthlySingle)} for one person in ${F}, which is 135 percent of the poverty guideline with the disregard applied, and ${money(MSP.qi.anchorMonthlyCouple)} for a couple, per Medicare.gov (${S.medicareMsp}). Used assets are tested at ${money(MSP.qmb.resourceSingle.amount)} single and ${money(MSP.qmb.resourceCouple.amount)} couple.`,
      `The benefit is the Part B premium itself, which is ${money(B.standardPremium.amount)} a month in ${F} at the standard rate, worth about ${money(B.standardPremium.amount * 12)} a year before any IRMAA surcharge.`,
    ],
    worked:
      `A single retiree over SLMB but under the QI line applies in the spring and is approved mid-year. The state pays her Part B premium of ${money(B.standardPremium.amount)} from approval forward, saving about ${money(B.standardPremium.amount * 7)} across the remaining months of the approval year, and the drug-cost Extra Help arrives with the approval.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Runs all three Part B-paying tiers and shows the dollar value of each.'),
    ],
    related: ['QMB', 'SLMB', 'MSP', 'Extra Help'],
    sources: [
      row(`QI income anchor, ${F}`, money(MSP.qi.anchorMonthlySingle ?? 0), S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
      row(`Part B premium paid, ${F}`, money(B.standardPremium.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'QMB',
    definition:
      'Qualified Medicare Beneficiary: the strongest Medicare Savings Program tier, paying Part A and Part B premiums and the cost sharing for covered care.',
    whyItMatters: [
      'QMB is the tier people on tight budgets should aim for, because its package absorbs premiums and the cost-sharing gaps where Medicare leaves patients exposed. Providers follow its billing rules, and the state handles the claim structure. The income test sits at the poverty guideline, with the disregards that let near-line households through the door.',
    ],
    exactHeading: `The exact line for ${F}`,
    exact: [
      `Counted monthly income tops out at about ${money(MSP.qmb.anchorMonthlySingle)} for one person and ${money(MSP.qmb.anchorMonthlyCouple)} for a couple in ${F}, with resources at ${money(MSP.qmb.resourceSingle.amount)} and ${money(MSP.qmb.resourceCouple.amount)}, per Medicare.gov's savings-program page (${S.medicareMsp}). QMB pays Part A and Part B premiums, deductibles, coinsurance, and copayments for covered services.`,
      `The billing protection is real: Medicare providers cannot bill a QMB more than Medicare allows for covered care, which is why the QMB designation shows up in hospital billing systems.`,
    ],
    worked:
      `A widow with ${money(1320)} a month of counted income clears the QMB line for ${F}. The program pays her Part B premium of ${money(B.standardPremium.amount)}, her deductible, and her coinsurance on covered care, and the pharmacy billing drops her drug copays to small amounts through Extra Help, which comes with the QMB approval.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Screens QMB exactly, with the dollar amount the approval saves each month.'),
    ],
    related: ['SLMB', 'QI', 'MSP', 'Dual eligible'],
    sources: [
      row(`QMB income anchor, ${F}`, money(MSP.qmb.anchorMonthlySingle ?? 0), S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
      row(`QMB resource limits, ${F}`, `${money(MSP.qmb.resourceSingle.amount)} / ${money(MSP.qmb.resourceCouple.amount)}`, S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
    ],
    updatedOn: CHECKED,
  },
];
