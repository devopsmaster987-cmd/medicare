import { sources } from './sources';
import { dataVerifiedOn } from './verified';

export type StateInfo = {
  name: string;
  abbr: string;
  agencyName: string;
  agencyUrl: string;
  phone?: string;
  mspCovered: boolean;
  assetTest: boolean;
  source: string;
  verifiedOn: string;
  year: number;
  verify?: boolean;
  note?: string;
};

const generic = {
  agencyName: 'State Medicaid agency',
  agencyUrl: sources.medicaidGovByState,
  mspCovered: false,
  assetTest: true,
  source: sources.medicaidGovByState,
  verifiedOn: dataVerifiedOn,
  year: 2026,
  verify: true,
  note: 'MedicareClear covers ten launch states in this version. Use the state Medicaid directory for this state.',
};

function launchState(
  name: string,
  abbr: string,
  agencyName: string,
  agencyUrl: string,
  options: { assetTest?: boolean; phone?: string } = {},
): StateInfo {
  const stateSpecific = ['CA', 'NY', 'AZ'].includes(abbr);
  const note =
    abbr === 'CA'
      ? 'California uses its own MSP income and asset limits. DHCS publishes the current figures; the calculator applies them.'
      : abbr === 'NY'
        ? 'New York uses its own QMB and QI limits, has no asset test, and no longer runs SLMB as a separate program.'
        : abbr === 'AZ'
          ? 'Arizona uses its own MSP income limits and does not list a resource test for QMB, SLMB, or QI.'
          : 'Federal MSP limits are used in this version. Confirm state-specific income disregards, asset rules, and program names with the state agency.';
  return {
    name,
    abbr,
    agencyName,
    agencyUrl,
    phone: options.phone,
    mspCovered: true,
    assetTest: options.assetTest ?? true,
    source: agencyUrl,
    verifiedOn: dataVerifiedOn,
    year: 2026,
    verify: !stateSpecific,
    note,
  };
}

export const launchStateAbbrs = ['CA', 'NY', 'TX', 'FL', 'PA', 'IL', 'OH', 'MI', 'AZ', 'GA'] as const;

export const states: StateInfo[] = [
  launchState('Arizona', 'AZ', 'Arizona Health Care Cost Containment System (AHCCCS)', 'https://www.azahcccs.gov/', { assetTest: false }),
  launchState('California', 'CA', 'California Department of Health Care Services', 'https://www.dhcs.ca.gov/'),
  launchState('Florida', 'FL', 'Florida Agency for Health Care Administration', 'https://ahca.myflorida.com/'),
  launchState('Georgia', 'GA', 'Georgia Department of Community Health', 'https://dch.georgia.gov/'),
  launchState('Illinois', 'IL', 'Illinois Department of Healthcare and Family Services', 'https://hfs.illinois.gov/'),
  launchState('Michigan', 'MI', 'Michigan Department of Health and Human Services', 'https://www.michigan.gov/mdhhs'),
  launchState('New York', 'NY', 'New York State Department of Health', 'https://www.health.ny.gov/health_care/medicaid/', { assetTest: false }),
  launchState('Ohio', 'OH', 'Ohio Department of Medicaid', 'https://medicaid.ohio.gov/'),
  launchState('Pennsylvania', 'PA', 'Pennsylvania Department of Human Services', 'https://www.pa.gov/agencies/dhs.html'),
  launchState('Texas', 'TX', 'Texas Health and Human Services', 'https://www.hhs.texas.gov/'),
  { ...generic, name: 'Alabama', abbr: 'AL' },
  { ...generic, name: 'Alaska', abbr: 'AK' },
  { ...generic, name: 'Arkansas', abbr: 'AR' },
  { ...generic, name: 'Colorado', abbr: 'CO' },
  { ...generic, name: 'Connecticut', abbr: 'CT' },
  { ...generic, name: 'Delaware', abbr: 'DE' },
  { ...generic, name: 'District of Columbia', abbr: 'DC' },
  { ...generic, name: 'Hawaii', abbr: 'HI' },
  { ...generic, name: 'Idaho', abbr: 'ID' },
  { ...generic, name: 'Indiana', abbr: 'IN' },
  { ...generic, name: 'Iowa', abbr: 'IA' },
  { ...generic, name: 'Kansas', abbr: 'KS' },
  { ...generic, name: 'Kentucky', abbr: 'KY' },
  { ...generic, name: 'Louisiana', abbr: 'LA' },
  { ...generic, name: 'Maine', abbr: 'ME' },
  { ...generic, name: 'Maryland', abbr: 'MD' },
  { ...generic, name: 'Massachusetts', abbr: 'MA' },
  { ...generic, name: 'Minnesota', abbr: 'MN' },
  { ...generic, name: 'Mississippi', abbr: 'MS' },
  { ...generic, name: 'Missouri', abbr: 'MO' },
  { ...generic, name: 'Montana', abbr: 'MT' },
  { ...generic, name: 'Nebraska', abbr: 'NE' },
  { ...generic, name: 'Nevada', abbr: 'NV' },
  { ...generic, name: 'New Hampshire', abbr: 'NH' },
  { ...generic, name: 'New Jersey', abbr: 'NJ' },
  { ...generic, name: 'New Mexico', abbr: 'NM' },
  { ...generic, name: 'North Carolina', abbr: 'NC' },
  { ...generic, name: 'North Dakota', abbr: 'ND' },
  { ...generic, name: 'Oklahoma', abbr: 'OK' },
  { ...generic, name: 'Oregon', abbr: 'OR' },
  { ...generic, name: 'Rhode Island', abbr: 'RI' },
  { ...generic, name: 'South Carolina', abbr: 'SC' },
  { ...generic, name: 'South Dakota', abbr: 'SD' },
  { ...generic, name: 'Tennessee', abbr: 'TN' },
  { ...generic, name: 'Utah', abbr: 'UT' },
  { ...generic, name: 'Vermont', abbr: 'VT' },
  { ...generic, name: 'Virginia', abbr: 'VA' },
  { ...generic, name: 'Washington', abbr: 'WA' },
  { ...generic, name: 'West Virginia', abbr: 'WV' },
  { ...generic, name: 'Wisconsin', abbr: 'WI' },
  { ...generic, name: 'Wyoming', abbr: 'WY' },
];

export const stateByAbbr: Record<string, StateInfo> = Object.fromEntries(
  states.map((state) => [state.abbr, state]),
);

export function getState(abbr: string): StateInfo | undefined {
  return stateByAbbr[abbr.toUpperCase()];
}
