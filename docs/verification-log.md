# Verification log

All figures were checked against the official source listed in each section on 2026-10-26. The employer family rule and the California, New York, and Arizona MSP rules were rechecked on 2026-10-28. The owner, Abdul Samad, still needs to sign off before launch. "Policy maths" means a hand-worked application of the published rule because the agency does not publish a worked example with these exact inputs.

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
