# Verification log

All figures were checked against the official source listed in each section on 2026-10-26. The employer family rule and the California, New York, and Arizona MSP rules were rechecked on 2026-10-28. The Part A premium, enrollment dates, and total Medicare premium formulas were added and checked on 2026-11-07. The owner, Daniel Smith, still needs to sign off before launch. "Policy maths" means a hand-worked application of the published rule because the agency does not publish a worked example with these exact inputs.

## employerAffordability

Source: https://www.irs.gov/pub/irs-drop/rp-25-25.pdf
Supporting sources: https://www.irs.gov/affordable-care-act/individuals-and-families/questions-and-answers-on-the-premium-tax-credit and https://www.federalregister.gov/documents/2022/10/13/2022-22184/affordability-of-employer-coverage-for-family-members

Example 1
- Inputs: household income $30,000; employee-only premium $200 per month; monthly pay frequency.
- Hand calculation: $200 x 12 = $2,400. Affordability threshold = $30,000 x 9.96% = $2,988. $2,400 is below $2,988.
- Expected: affordable, with $588 of headroom.
- Actual: `employeeCoverageAffordable: true`, `annualEmployeeOnlyPremium: 2400`, `annualThreshold: 2988`, `employeeHeadroom: 588`.
- Checked on: 2026-10-26

Example 2
- Inputs: household income $30,000; employee-only premium $249.01 per month; monthly pay frequency.
- Hand calculation: $249.01 x 12 = $2,988.12. This is $0.12 above the $2,988 threshold.
- Expected: not affordable, with a $0.12 shortfall.
- Actual: `employeeCoverageAffordable: false`, `annualEmployeeOnlyPremium: 2988.12`, `annualThreshold: 2988`, `employeeHeadroom: -0.12`.
- Checked on: 2026-10-26

Policy note: under the family glitch fix (Treasury final rule, 2022), the employee is tested with the lowest-cost self-only premium, while a spouse and children are tested with the employee's required contribution for family coverage. Both comparisons use the same household income and affordability percentage. The calculator reports the employee and family signals separately.

Example 3
- Inputs: household income $30,000; employee-only premium $200 per month; family premium $600 per month; monthly pay frequency; plan meets minimum value.
- Hand calculation: employee-only annual premium $2,400 is below the $2,988 threshold. Family annual premium $7,200 is above the same $2,988 threshold, so family members are tested as unaffordable and may qualify for premium tax credits.
- Expected: employee-only coverage affordable; `employeeSubsidyEligibility: 'likely-none'`; `familyCoverageAffordable: false`; `familySubsidyEligibility: 'likely-qualify'`; `familyMembersMayQualifyForHelp: true`; overall `subsidyEligibility: 'likely-qualify'`.
- Actual: `employeeCoverageAffordable: true`, `annualFamilyPremium: 7200`, `familyCoverageAffordable: false`, `employeeSubsidyEligibility: 'likely-none'`, `familySubsidyEligibility: 'likely-qualify'`, `familyMembersMayQualifyForHelp: true`, `subsidyEligibility: 'likely-qualify'`.
- Checked on: 2026-10-28

## mspEligibility

Source: https://www.medicare.gov/basics/costs/help/medicare-savings-programs
Supporting sources:
- https://www.cms.gov/files/document/cy2026-lis-resource-limits-memo.pdf
- California: https://www.dhcs.ca.gov/individuals/Pages/Medicare-Savings-Programs-in-California.aspx
- New York: https://www.health.ny.gov/health_care/medicaid/program/update/savingsprogram/medicaresavingsprogram.htm
- Arizona: https://www.azahcccs.gov/Members/Downloads/EligibilityRequirements.pdf
Policy maths: the published federal limits are used for Texas and the other launch states without a published override. California, New York, and Arizona use the state figures below. State-specific disregards beyond those published figures are not applied by the calculator.

Example 1
- Inputs: Texas; one person; $1,350 monthly income; $9,950 countable assets.
- Hand calculation: QMB monthly limit is $1,350, so income is at the limit. Assets are at the $9,950 QMB resource limit. Extra Help income is $1,350 x 12 = $16,200 against the $23,940 annual limit; assets are below $18,090.
- Expected: QMB and Extra Help likely; estimated value is the Part B standard premium plus the Part D base beneficiary premium.
- Actual: QMB eligible; Extra Help eligible; `estimatedMonthlyValue: 241.89`; `likelyPrograms` includes QMB and Extra Help (the income test also meets SLMB and QI limits).
- Checked on: 2026-10-26

Example 2
- Inputs: Texas; one person; $1,817 monthly income; $0 countable assets.
- Hand calculation: $1,817 is above the $1,816 QI monthly limit, so QMB, SLMB, and QI are not eligible. Annual income is $21,804, below the $23,940 Extra Help limit.
- Expected: Extra Help only; estimated value is the Part D base beneficiary premium.
- Actual: `likelyPrograms: ['extraHelp']`; `estimatedMonthlyValue: 38.99`; `applyAnyway: true` because income is within 10% of a missed limit.
- Checked on: 2026-10-26

Example 3 (California)
- Inputs: California; one person; $1,330 monthly income; $130,000 countable assets.
- Hand calculation: DHCS publishes a $1,330 monthly QMB limit for one person and a $130,000 asset limit from January 1, 2026. Income is at the limit and assets are at the limit.
- Expected: QMB eligible; `assetTestApplied: true`; `resourceLimit: 130000`.
- Actual: `likelyPrograms` includes `qmb`; QMB `incomeLimitMonthly: 1330`; `resourceLimit: 130000`; `assetTestApplied: true`.
- Checked on: 2026-10-28

Example 4 (New York)
- Inputs: New York; one person; $1,856 monthly income; $500,000 countable assets.
- Hand calculation: New York publishes a $1,856 monthly QMB limit (138% of FPL plus the $20 disregard), no asset test, and no separate SLMB program.
- Expected: QMB eligible despite high assets; SLMB `available: false`; `assetTestApplied: false`.
- Actual: QMB `eligible: true`; SLMB `available: false`; `resourceLimit: null`; `assetTestApplied: false`.
- Checked on: 2026-10-28

Example 5 (Arizona)
- Inputs: Arizona; one person; $1,596 monthly income; $500,000 countable assets.
- Hand calculation: AHCCCS publishes $1,596 as the top of the SLMB band and $1,796 as the top of the QI-1 band for one person, with no listed resource test.
- Expected: SLMB eligible at $1,596; QI eligible at $1,796; no asset test.
- Actual: SLMB `eligible: true` at $1,596; at $1,597 SLMB is not eligible and QI is eligible; `assetTestApplied: false`.
- Checked on: 2026-10-28

Example 6 (California, three people)
- Inputs: California; three people; $2,277 monthly income; $260,000 countable assets.
- Hand calculation: 2026 FPL for three is $27,320 a year, or $2,276.67 a month. QMB at 100% rounds up to $2,277. California publishes $130,000 for one person and $65,000 for each additional person, so three people = $130,000 + 2 x $65,000 = $260,000.
- Expected: QMB income limit $2,277; resource limit $260,000; QMB eligible; state note explains the FPL method for households of three or more.
- Actual: `incomeLimitMonthly: 2277`; `resourceLimit: 260000`; `eligible: true`; state note includes "three or more".
- Checked on: 2026-10-28

Extra Help resource note: CMS publishes base 2026 LIS resource limits of $16,590 single / $33,100 married. The consumer figures of $18,090 / $36,100 include the $1,500 per person burial exclusion (20 CFR 416.1231). The calculator uses the consumer figures and the page explains the difference.

## partBPenaltyCalculator

Source: https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties
Supporting source: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles

Example 1
- Inputs: 24 months without creditable coverage.
- Hand calculation: two full 12-month periods x 10% = 20%. 20% of $202.90 = $40.58. $202.90 + $40.58 = $243.48. Medicare's rounded example shows $243.50.
- Expected: $40.58 monthly penalty; $243.48 unrounded total monthly premium; $486.96 annual penalty.
- Actual: `penaltyRate: 0.2`, `monthlyPenalty: 40.58`, `totalMonthlyPremium: 243.48`, `annualPenalty: 486.96`; the result displays Medicare's $243.50 rounding note.
- Checked on: 2026-10-26

Example 2
- Inputs: 12 months without creditable coverage.
- Hand calculation: one full 12-month period x 10% = 10%. 10% of $202.90 = $20.29. Total monthly premium = $223.19.
- Expected: $20.29 monthly penalty; $223.19 total monthly premium; $2,434.80 ten-year penalty.
- Actual: `penaltyRate: 0.1`, `monthlyPenalty: 20.29`, `totalMonthlyPremium: 223.19`, `tenYearPenalty: 2434.8`.
- Checked on: 2026-10-26

Example 3 (creditable coverage during the delay)
- Inputs: 24 months without Part B; employer coverage reported as creditable; no missed Special Enrollment Period.
- Hand calculation: the published exception is coverage through current employment that is creditable. Those 24 months are excluded, so `monthsCounted` is 0 and the penalty is $0.
- Expected: no penalty; `monthsCounted: 0`; `monthsExcluded: 24`; `canAvoid` includes the creditable-coverage reason.
- Actual: `penaltyRate: 0`, `monthlyPenalty: 0`, `monthsCounted: 0`, `monthsExcluded: 24`; `canAvoid` includes `creditableCoverage`.
- Checked on: 2026-10-28

Example 4 (creditable coverage, but the Special Enrollment Period was missed)
- Inputs: 24 months without Part B; employer coverage reported as creditable; user reports the Special Enrollment Period was missed.
- Hand calculation: the coverage exception does not apply after the SEP is missed, so the full 24 months count. Two periods x 10% = 20%. 20% of $202.90 = $40.58.
- Expected: $40.58 monthly penalty; `monthsCounted: 24`; `monthsExcluded: 0`; `canAvoid` does not include creditable coverage.
- Actual: `penaltyRate: 0.2`, `monthlyPenalty: 40.58`, `monthsCounted: 24`, `monthsExcluded: 0`.
- Checked on: 2026-10-28

## partDPenaltyCalculator

Source: https://www.medicare.gov/health-drug-plans/part-d/basics/costs
Supporting source: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-part-d-bid-information-and-part-d-premium-stabilization-demonstration-parameters

Example 1
- Inputs: 12 full months without creditable prescription drug coverage; base beneficiary premium from /data.
- Hand calculation: 1% of $38.99 = $0.3899 per month. 12 months x $0.3899 = $4.6788. Medicare rounds the monthly penalty to the nearest 10 cents, so $4.70. Annual penalty = $4.70 x 12 = $56.40.
- Expected: `penaltyRate: 0.12`; `monthlyPenalty: 4.7`; `annualPenalty: 56.4`; 10-year total $564; 20-year total $1,128.
- Actual: `penaltyRate: 0.12`; `monthlyPenalty: 4.7`; `annualPenalty: 56.4`; `tenYearPenalty: 564`; `twentyYearPenalty: 1128`.
- Checked on: 2026-10-28

Example 2
- Inputs: 24 full months without creditable coverage; same base beneficiary premium.
- Hand calculation: 24 months x $0.3899 = $9.3576. Rounded to the nearest 10 cents = $9.40. Annual penalty = $9.40 x 12 = $112.80.
- Expected: `penaltyRate: 0.24`; `monthlyPenalty: 9.4`; `annualPenalty: 112.8`; 10-year total $1,128; 20-year total $2,256.
- Actual: `penaltyRate: 0.24`; `monthlyPenalty: 9.4`; `annualPenalty: 112.8`; `tenYearPenalty: 1128`; `twentyYearPenalty: 2256`.
- Checked on: 2026-10-28

Example 3 (confirmed creditable coverage)
- Inputs: 12 months without a Part D plan; written plan notice confirms creditable drug coverage for the same 12 months.
- Hand calculation: months with confirmed creditable coverage are excluded, so `monthsCounted` is 0 and the penalty is $0. The plan notice must cover the whole gap.
- Expected: no penalty; `monthsCounted: 0`; `monthsExcluded: 12`; `creditableCoverageStatus: 'confirmed'`; `canBeReviewed: true`.
- Actual: `monthlyPenalty: 0`; `monthsCounted: 0`; `monthsExcluded: 12`; `creditableCoverageStatus: 'confirmed'`; `canBeReviewed: true`.
- Checked on: 2026-10-28

Policy note: the penalty counts full uncovered months, not days. A gap of a few days inside a month does not add a month by itself; the enrollment records decide the month count. The penalty is recalculated each year against the national base beneficiary premium and generally continues while the person has Part D.

## irmaaCalculator

Source: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles
Supporting source: https://www.ssa.gov/benefits/medicare/prescriptionhelp.html

Example 1
- Inputs: single; $109,001 modified adjusted gross income from the two-year lookback.
- Hand calculation: the first IRMAA tier starts at $109,001 for a single filer. Part B becomes $284.10, Part D adds $14.50, and the monthly surcharge is $95.70. Annual surcharge = $95.70 x 12 = $1,148.40. Headroom to the next tier ($137,001) = $28,000.
- Expected: tier index 1; $284.10 Part B; $14.50 Part D; $95.70 monthly surcharge; $1,148.40 annual surcharge; $28,000 headroom; crossing the next cliff adds $1,736.40 a year for one person.
- Actual: tier index 1; `monthlyPartB: 284.1`; `monthlyPartD: 14.5`; `monthlySurcharge: 95.7`; `annualSurcharge: 1148.4`; `headroomToNextBracket: 28000`; `cliffCost.additionalAnnualSurcharge: 1736.4`.
- Checked on: 2026-10-26

Example 2
- Inputs: married filing jointly; $218,001 modified adjusted gross income.
- Hand calculation: the first joint IRMAA tier starts at $218,001. Each spouse may pay $284.10 Part B and $14.50 Part D. Household Part B = $568.20; household Part D = $29; household monthly surcharge = $191.40; annual surcharge = $2,296.80. Headroom to $274,001 = $56,000.
- Expected: tier index 1; household monthly Part B $568.20; household monthly Part D $29; household monthly surcharge $191.40; $56,000 headroom.
- Actual: tier index 1; `householdMonthlyPartB: 568.2`; `householdMonthlyPartD: 29`; `householdMonthlySurcharge: 191.4`; `headroomToNextBracket: 56000`.
- Checked on: 2026-10-26

## medicareVsAca

Source: https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare
Supporting sources: https://www.medicare.gov/health-drug-plans/coordination/who-pays-first and https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties
Policy maths: this is a decision rule, not an agency formula with a published worked example.

Example 1
- Inputs: age 66; active employer coverage; 25 employees; creditable coverage; 40 work credits.
- Hand calculation: the employer has 20 or more employees, so the group plan generally pays first and Part B can usually be delayed. Premium-free Part A ends Marketplace premium tax credits. If Part B were enrolled, the annual standard premium is $202.90 x 12 = $2,434.80.
- Expected: path `delay-part-b`; premium-free Part A true; ACA subsidy status `ends`; annual Part B estimate $2,434.80; eight-month Special Enrollment Period warning.
- Actual: path `delay-part-b`; `annualPartBPremium: 2434.8`; `acaSubsidyStatus: 'ends'`; warning includes the eight-month window.
- Checked on: 2026-10-26

Example 2
- Inputs: age 66; no current coverage; 20 work credits.
- Hand calculation: no premium-free Part A because work credits are below 40. Part A full premium = $565 x 12 = $6,780. Part B = $202.90 x 12 = $2,434.80. Annual Medicare premium estimate = $9,214.80.
- Expected: path `compare-aca`; `premiumFreePartA: false`; annual Part A $6,780; annual Part B $2,434.80; annual total $9,214.80.
- Actual: path `compare-aca`; `annualPartAPremium: 6780`; `annualPartBPremium: 2434.8`; `annualMedicarePremiumEstimate: 9214.8`.
- Checked on: 2026-10-26

Example 3
- Inputs: age 66; no current coverage; 35 work credits.
- Hand calculation: 30 to 39 credits use the reduced Part A premium. Part A = $311 x 12 = $3,732. Part B = $202.90 x 12 = $2,434.80. Annual Medicare premium estimate = $6,166.80.
- Expected: `partAStatus: 'reduced'`; `premiumFreePartA: false`; annual Part A $3,732; annual total $6,166.80.
- Actual: `partAStatus: 'reduced'`; `premiumFreePartA: false`; `annualPartAPremium: 3732`; `annualMedicarePremiumEstimate: 6166.8`.
- Checked on: 2026-10-26

## partAPremium

Source: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles
Supporting sources: https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties and https://www.medicare.gov/publications/11579-medicare-costs.pdf
Policy maths: CMS publishes the three premium amounts and the work-quarter bands; the agency does not publish a worked example with these exact inputs.

Example 1
- Inputs: 40 own quarters of coverage; no delay in signing up.
- Hand calculation: 40 quarters meets the premium-free threshold, so the Part A premium is $0 a month and $0 a year.
- Expected: tier `free`; `monthlyPremium: 0`; `annualPremium: 0`; `premiumFree: true`.
- Actual: `tier: 'free'`, `monthlyPremium: 0`, `annualPremium: 0`, `premiumFree: true`.
- Checked on: 2026-11-07

Example 2
- Inputs: 35 own quarters; signed up 2 full years late.
- Hand calculation: 30 to 39 quarters uses the reduced premium CMS publishes for 2026, $311 a month ($3,732 a year). The late enrollment penalty is 10% of that premium, paid for twice the years delayed: 10% x $311 = $31.10 a month, for 2 x 2 = 4 years. Total during the penalty = $311 + $31.10 = $342.10 a month. Cost across the penalty = $31.10 x 12 x 4 = $1,492.80.
- Expected: tier `reduced`; `monthlyPenalty: 31.1`; `penaltyDurationYears: 4`; `totalMonthlyDuringPenalty: 342.1`; `penaltyCostDuringDuration: 1492.8`.
- Actual: `penaltyRate: 0.1`, `monthlyPenalty: 31.1`, `penaltyDurationYears: 4`, `totalMonthlyDuringPenalty: 342.1`, `penaltyCostDuringDuration: 1492.8`.
- Checked on: 2026-11-07

Example 3 (spouse's record)
- Inputs: 20 own quarters; married; 40 spouse quarters.
- Hand calculation: the calculator takes the higher of the two records, 40 quarters, which meets the premium-free threshold. Social Security requires the marriage generally to have lasted at least one year.
- Expected: `quartersUsed: 40`; tier `free`; `monthlyPremium: 0`.
- Actual: `quartersUsed: 40`, `tier: 'free'`, `monthlyPremium: 0`.
- Checked on: 2026-11-07

## enrollmentDates

Source: https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-does-medicare-coverage-start
Supporting sources: https://www.medicare.gov/basics/get-started-with-medicare/sign-up and https://secure.ssa.gov/poms.nsf/lnx/0600805275
Policy maths: Medicare.gov publishes the window and coverage-start rules in words, not worked date examples for arbitrary birthdays; every date below was counted by hand from those rules. The Special Enrollment Period uses Medicare.gov's stated anchors (starts the first month after the Initial Enrollment Period ends; ends eight months after the group health plan coverage or employment ends) with POMS HI 00805.275 confirming the eight consecutive months after the last month of coverage.

Example 1 (seven-month window and coverage start)
- Inputs: born June 1961; today 2026-05-15.
- Hand calculation: turns 65 in June 2026, so the window opens three months earlier on 2026-03-01 and closes three months after on 2026-09-30 (seven months). Days from 2026-05-15 to 2026-09-30 = 138. Signing up in March 2026 gives coverage on the birthday month, 2026-06-01; signing up in June 2026 gives coverage on 2026-07-01.
- Expected: `windowStatus: 'open'`; `daysUntilIEPEnd: 138`; coverage start for a March 2026 sign-up = 2026-06-01; for a June 2026 sign-up = 2026-07-01.
- Actual: `iepStart: '2026-03-01'`, `iepEnd: '2026-09-30'`, `windowStatus: 'open'`, `daysUntilIEPEnd: 138`; `coverageStartTable[0] = { signupMonth: 'March 2026', coverageStart: '2026-06-01' }`; `coverageStartTable[3] = { signupMonth: 'June 2026', coverageStart: '2026-07-01' }`.
- Checked on: 2026-11-07

Example 2 (birthday on the first of the month)
- Inputs: born January 1, 1961; birthday on the first; today 2026-01-15.
- Hand calculation: Medicare treats a first-of-month birthday as eligible the month before, so the eligibility month shifts from January 2026 back to December 2025. The seven-month window shifts with it: 2025-09-01 through 2026-03-31.
- Expected: `firstOfMonthRuleApplied: true`; `eligibleMonthLabel: 'December 2025'`; `iepStart: '2025-09-01'`; `iepEnd: '2026-03-31'`.
- Actual: `firstOfMonthRuleApplied: true`, `eligibleMonthLabel: 'December 2025'`, `iepStart: '2025-09-01'`, `iepEnd: '2026-03-31'`.
- Checked on: 2026-11-07

Example 3 (Special Enrollment Period)
- Inputs: born June 1961; employer coverage ends 2026-08; today 2026-10-01.
- Hand calculation: the Initial Enrollment Period ended 2026-09-30, so the Special Enrollment Period starts 2026-10-01. Coverage ended in August 2026, so it ends on the eighth month after that, 2027-04-30 (POMS counts the eight consecutive months after the last month of coverage: September 2026 through April 2027; the pre-October months were already inside the Initial Enrollment Period).
- Expected: `sep = { start: '2026-10-01', end: '2027-04-30' }`.
- Actual: `sep = { start: '2026-10-01', end: '2027-04-30' }`.
- Checked on: 2026-11-07

Example 4 (General Enrollment Period after a closed window)
- Inputs: born June 1961; today 2026-11-07; no employer coverage.
- Hand calculation: the Initial Enrollment Period closed on 2026-09-30. The next General Enrollment Period runs January 1 through March 31 of the following year, 2027-01-01 through 2027-03-31, and is not open on 2026-11-07.
- Expected: `windowStatus: 'closed'`; `gep = { start: '2027-01-01', end: '2027-03-31', openNow: false }`.
- Actual: `windowStatus: 'closed'`; `gep = { start: '2027-01-01', end: '2027-03-31', openNow: false }`.
- Checked on: 2026-11-07

## medicarePremium

Source: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles
Supporting sources: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-part-d-bid-information-and-part-d-premium-stabilization-demonstration-parameters and https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties
Policy maths: the CMS fact sheets publish the standard premium, each IRMAA tier amount, and the national base beneficiary premium; the calculator adds them together, and the agency does not publish a combined monthly-bill worked example.

Example 1 (single, under the IRMAA threshold)
- Inputs: single; modified adjusted gross income $80,000 from two years ago; 40 quarters; Part D plan premium $38.99 (the CMS national base beneficiary premium for 2026).
- Hand calculation: $80,000 is under the $109,001 first single bracket, so no surcharge. Part A $0 + Part B $202.90 + Part D $38.99 = $241.89 a month. Annual = $241.89 x 12 = $2,902.68.
- Expected: `partA.monthlyPremium: 0`; `partB.monthlyWithIrmaa: 202.9`; `totalMonthly: 241.89`; `totalAnnual: 2902.68`.
- Actual: `partA.monthlyPremium: 0`, `partB.monthlyWithIrmaa: 202.9`, `partD.monthlyPerPerson: 38.99`, `totalMonthly: 241.89`, `totalAnnual: 2902.68`.
- Checked on: 2026-11-07

Example 2 (single, IRMAA bracket three)
- Inputs: single; $150,000 modified adjusted gross income from two years ago; 40 quarters; Part D plan premium $38.99.
- Hand calculation: $150,000 falls between $137,001 and $171,000, where CMS publishes Part B $405.80 and a Part D adjustment of $37.50. Part B = $405.80. Part D = $38.99 + $37.50 = $76.49. Monthly = $482.29. Annual = $482.29 x 12 = $5,787.48. Headroom to the next bracket at $171,001 = $171,001 - $150,000 = $21,001.
- Expected: `partB.monthlyWithIrmaa: 405.8`; `partD.monthlyPerPerson: 76.49`; `totalMonthly: 482.29`; `totalAnnual: 5787.48`; `headroomToNextBracket: 21001`.
- Actual: `partB.monthlyWithIrmaa: 405.8`, `partB.irmaaAdjustment: 202.9`, `partD.irmaaAdjustment: 37.5`, `partD.monthlyPerPerson: 76.49`, `totalMonthly: 482.29`, `totalAnnual: 5787.48`, `headroomToNextBracket: 21001`.
- Checked on: 2026-11-07

Example 3 (married filing jointly, both spouses enrolled)
- Inputs: married filing jointly; $250,000 modified adjusted gross income from two years ago; 40 quarters each; both spouses enrolled; Part D plan premium $38.99 each.
- Hand calculation: $250,000 falls in the first joint bracket ($218,001 to $274,000), where each person pays Part B $284.10 and a Part D adjustment of $14.50. Part B for two = $568.20. Part D each = $38.99 + $14.50 = $53.49, so $106.98 for two. Monthly household bill = $675.18.
- Expected: `persons: 2`; `partB.monthlyTotal: 568.2`; `partD.monthlyTotal: 106.98`; `totalMonthly: 675.18`.
- Actual: `persons: 2`, `partB.monthlyPerPerson: 284.1`, `partB.monthlyTotal: 568.2`, `partD.monthlyPerPerson: 53.49`, `partD.monthlyTotal: 106.98`, `totalMonthly: 675.18`.
- Checked on: 2026-11-07

Example 4 (buying Part A)
- Inputs: single; $40,000 modified adjusted gross income; 35 own quarters; no Part D plan.
- Hand calculation: 35 quarters uses the reduced Part A premium of $311. Part B standard $202.90 (no surcharge at $40,000). Part D not enrolled = $0. Monthly = $311 + $202.90 = $513.90.
- Expected: `partA.monthlyPremium: 311`; `partD.monthlyTotal: 0`; `totalMonthly: 513.9`.
- Actual: `partA.monthlyPremium: 311`, `partD.monthlyTotal: 0`, `totalMonthly: 513.9`.
- Checked on: 2026-11-07
