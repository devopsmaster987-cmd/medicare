import fs from 'node:fs';
import path from 'node:path';
import { aca2026 } from '../data/aca';
import { fpl2025, fpl2026, fplAnnual } from '../data/fpl';
import { partA2026 } from '../data/medicare-part-a';
import { partB2026 } from '../data/medicare-part-b';
import { partD2026 } from '../data/medicare-part-d';
import { burialExclusion, extraHelpBaseResource, mspPrograms, stateMspRules } from '../data/msp';
import { site } from '../data/site';
import { dataVerifiedOn, figureYears } from '../data/verified';
import { root } from './file-walk';

type Figure = {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  year: number;
  source: string;
  verifiedOn: string;
  note?: string;
};

type MoneyLike = {
  amount: number;
  year: number;
  source: string;
  verifiedOn: string;
  note?: string;
};

function moneyFigure(
  id: string,
  label: string,
  value: MoneyLike,
  unit = 'USD/month',
): Figure {
  return {
    id,
    label,
    value: value.amount,
    unit,
    year: value.year,
    source: value.source,
    verifiedOn: value.verifiedOn,
    ...(value.note ? { note: value.note } : {}),
  };
}

const year = figureYears.current;

const figures: Figure[] = [
  moneyFigure('part-a-standard-premium', 'Part A standard monthly premium', partA2026.standardPremium),
  moneyFigure('part-a-reduced-premium', 'Part A reduced monthly premium', partA2026.reducedPremium),
  moneyFigure('part-a-full-premium', 'Part A full monthly premium', partA2026.fullPremium),
  moneyFigure('part-a-inpatient-deductible', 'Part A inpatient deductible', partA2026.inpatientDeductible, 'USD per benefit period'),
  moneyFigure('part-a-coinsurance-days-61-90', 'Part A hospital coinsurance, days 61-90', partA2026.hospitalCoinsuranceDays61to90, 'USD per day'),
  moneyFigure('part-a-lifetime-reserve-days', 'Part A lifetime reserve day coinsurance', partA2026.lifetimeReserveDays, 'USD per day'),
  moneyFigure('part-a-skilled-nursing-days-21-100', 'Part A skilled nursing coinsurance, days 21-100', partA2026.skilledNursingDays21to100, 'USD per day'),
  moneyFigure('part-b-standard-premium', 'Part B standard monthly premium', partB2026.standardPremium),
  moneyFigure('part-b-deductible', 'Part B annual deductible', partB2026.deductible, 'USD/year'),
  moneyFigure('part-b-immunosuppressive-premium', 'Part B immunosuppressive drug premium', partB2026.immunosuppressivePremium),
  {
    id: 'part-b-coinsurance-rate',
    label: 'Part B coinsurance rate after the deductible',
    value: partB2026.coinsuranceRate.rate,
    unit: 'share of approved amount',
    year: partB2026.coinsuranceRate.year,
    source: partB2026.coinsuranceRate.source,
    verifiedOn: partB2026.coinsuranceRate.verifiedOn,
  },
  moneyFigure('part-d-base-beneficiary-premium', 'Part D base beneficiary premium', partD2026.baseBeneficiaryPremium),
  moneyFigure('part-d-deductible', 'Part D deductible', partD2026.deductible, 'USD/year'),
  moneyFigure('part-d-out-of-pocket-cap', 'Part D out-of-pocket cap', partD2026.outOfPocketCap, 'USD/year'),
  moneyFigure('extra-help-income-single', 'Extra Help annual income limit, single', partD2026.extraHelp.incomeAnnualSingle, 'USD/year'),
  moneyFigure('extra-help-income-couple', 'Extra Help annual income limit, married', partD2026.extraHelp.incomeAnnualCouple, 'USD/year'),
  moneyFigure('extra-help-resource-single', 'Extra Help resource limit, single', partD2026.extraHelp.resourceSingle, 'USD'),
  moneyFigure('extra-help-resource-couple', 'Extra Help resource limit, married', partD2026.extraHelp.resourceCouple, 'USD'),
  {
    id: 'aca-affordability-percentage',
    label: 'ACA employer coverage affordability percentage',
    value: aca2026.affordabilityPercentage.rate,
    unit: 'share of household income',
    year: aca2026.affordabilityPercentage.year,
    source: aca2026.affordabilityPercentage.source,
    verifiedOn: aca2026.affordabilityPercentage.verifiedOn,
  },
  moneyFigure('aca-out-of-pocket-max-self-only', 'ACA self-only out-of-pocket maximum', aca2026.outOfPocketMaxSelfOnly, 'USD/year'),
  moneyFigure('aca-out-of-pocket-max-family', 'ACA family out-of-pocket maximum', aca2026.outOfPocketMaxFamily, 'USD/year'),
  {
    id: 'aca-subsidy-cliff',
    label: 'Premium tax credit income limit',
    value: aca2026.subsidyCliffFplPercent,
    unit: 'percent of federal poverty level',
    year: year,
    source: aca2026.enhancedSubsidies.source,
    verifiedOn: aca2026.enhancedSubsidies.verifiedOn,
    note: aca2026.enhancedSubsidies.note,
  },
  {
    id: 'aca-enhanced-subsidies-status',
    label: 'Enhanced premium tax credit status',
    value: aca2026.enhancedSubsidies.status,
    unit: 'status',
    year: aca2026.enhancedSubsidies.year,
    source: aca2026.enhancedSubsidies.source,
    verifiedOn: aca2026.enhancedSubsidies.verifiedOn,
    note: aca2026.enhancedSubsidies.note,
  },
];

for (const [householdSize, amount] of Object.entries(fpl2026.annual)) {
  figures.push({
    id: `fpl-${year}-household-${householdSize}`,
    label: `Federal poverty level, ${year}, household of ${householdSize}`,
    value: amount,
    unit: 'USD/year',
    year: fpl2026.year,
    source: fpl2026.source,
    verifiedOn: fpl2026.verifiedOn,
    note: fpl2026.note,
  });
}
for (const [householdSize, amount] of Object.entries(fpl2025.annual)) {
  figures.push({
    id: `fpl-${fpl2025.year}-household-${householdSize}`,
    label: `Federal poverty level, ${fpl2025.year}, household of ${householdSize}`,
    value: amount,
    unit: 'USD/year',
    year: fpl2025.year,
    source: fpl2025.source,
    verifiedOn: fpl2025.verifiedOn,
    note: fpl2025.note,
  });
}
figures.push(
  {
    id: `fpl-${year}-add-per-person`,
    label: `Federal poverty level, ${year}, added amount per person above 8`,
    value: fpl2026.addPerPerson,
    unit: 'USD/year',
    year: fpl2026.year,
    source: fpl2026.source,
    verifiedOn: fpl2026.verifiedOn,
  },
  {
    id: `fpl-${fpl2025.year}-add-per-person`,
    label: `Federal poverty level, ${fpl2025.year}, added amount per person above 8`,
    value: fpl2025.addPerPerson,
    unit: 'USD/year',
    year: fpl2025.year,
    source: fpl2025.source,
    verifiedOn: fpl2025.verifiedOn,
  },
);

for (const program of Object.values(mspPrograms)) {
  if (program.anchorMonthlySingle !== undefined) {
    figures.push({
      id: `msp-${program.key}-monthly-single`,
      label: `${program.shortName} monthly income limit, single`,
      value: program.anchorMonthlySingle,
      unit: 'USD/month',
      year: program.year,
      source: program.source,
      verifiedOn: program.verifiedOn,
      note: program.note,
    });
  }
  if (program.anchorMonthlyCouple !== undefined) {
    figures.push({
      id: `msp-${program.key}-monthly-couple`,
      label: `${program.shortName} monthly income limit, married`,
      value: program.anchorMonthlyCouple,
      unit: 'USD/month',
      year: program.year,
      source: program.source,
      verifiedOn: program.verifiedOn,
      note: program.note,
    });
  }
  figures.push(
    {
      id: `msp-${program.key}-fpl-percent`,
      label: `${program.shortName} income test`,
      value: program.fplPercent,
      unit: 'multiple of the federal poverty level',
      year: program.year,
      source: program.source,
      verifiedOn: program.verifiedOn,
    },
    {
      id: `msp-${program.key}-resource-single`,
      label: `${program.shortName} resource limit, single`,
      value: program.resourceSingle.amount,
      unit: 'USD',
      year: program.resourceSingle.year,
      source: program.resourceSingle.source,
      verifiedOn: program.resourceSingle.verifiedOn,
    },
    {
      id: `msp-${program.key}-resource-couple`,
      label: `${program.shortName} resource limit, married`,
      value: program.resourceCouple.amount,
      unit: 'USD',
      year: program.resourceCouple.year,
      source: program.resourceCouple.source,
      verifiedOn: program.resourceCouple.verifiedOn,
    },
  );
}

figures.push(
  moneyFigure('extra-help-base-resource-single', 'Extra Help base resource limit, single', extraHelpBaseResource.single, 'USD'),
  moneyFigure('extra-help-base-resource-couple', 'Extra Help base resource limit, married', extraHelpBaseResource.couple, 'USD'),
  moneyFigure('burial-exclusion', 'Burial exclusion included in the Extra Help resource limit', burialExclusion, 'USD per person'),
);

const dataset = {
  site: {
    name: site.siteName,
    url: site.siteUrl,
    operator: site.ownerName,
    location: site.location,
    contact: site.contactEmail,
  },
  dataYear: year,
  verifiedOn: dataVerifiedOn,
  note: 'Each value keeps the official source URL and the date it was checked. Figures are updated by editing the data layer and redeploying.',
  figures,
  tables: {
    irmaa: {
      single: partB2026.irmaa.single,
      marriedJoint: partB2026.irmaa.marriedJoint,
      marriedSeparate: partB2026.irmaa.marriedSeparate,
      lookbackYears: partB2026.lookbackYears,
    },
    fpl: {
      [fpl2026.year]: fpl2026,
      [fpl2025.year]: fpl2025,
      annual: {
        [fpl2026.year]: Object.fromEntries(
          Array.from({ length: 8 }, (_, index) => {
            const size = index + 1;
            return [size, fplAnnual(fpl2026.year, size)];
          }),
        ),
        [fpl2025.year]: Object.fromEntries(
          Array.from({ length: 8 }, (_, index) => {
            const size = index + 1;
            return [size, fplAnnual(fpl2025.year, size)];
          }),
        ),
      },
    },
    msp: {
      federal: mspPrograms,
      states: stateMspRules,
    },
    aca: {
      applicablePercentageTable: aca2026.applicablePercentageTable,
      fplYearForSubsidies: aca2026.fplYearForSubsidies,
      openEnrollment: aca2026.openEnrollment,
      enhancedSubsidies: aca2026.enhancedSubsidies,
    },
  },
};

const outputDir = path.join(root, 'public/data');
fs.mkdirSync(outputDir, { recursive: true });
const output = path.join(outputDir, `medicare-figures-${year}.json`);
fs.writeFileSync(output, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');
console.log(`generate:data wrote ${path.relative(root, output).replaceAll('\\', '/')}`);
