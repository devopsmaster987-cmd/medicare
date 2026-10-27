import { sources } from './sources';
import { dataVerifiedOn } from './verified';

export type OfficialContact = {
  key: string;
  name: string;
  url: string;
  phone?: string;
  whatFor: string;
  source: string;
  verifiedOn: string;
  year: number;
};

export const officialContacts: OfficialContact[] = [
  {
    key: 'medicare',
    name: 'Medicare',
    url: sources.medicareGov,
    phone: '1-800-633-4227',
    whatFor: 'Medicare enrollment, Part B, Part D, and billing questions.',
    source: sources.medicareGov,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'ssa',
    name: 'Social Security Administration',
    url: sources.ssaGov,
    phone: '1-800-772-1213',
    whatFor: 'Medicare enrollment, Extra Help applications, and SSA-44 appeals.',
    source: sources.ssaGov,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'ship',
    name: 'State Health Insurance Assistance Program (SHIP)',
    url: sources.shipHelp,
    whatFor: 'Free, local counseling about Medicare choices and costs.',
    source: sources.shipHelp,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'healthcare',
    name: 'HealthCare.gov',
    url: sources.healthcareGov,
    phone: '1-800-318-2596',
    whatFor: 'Marketplace applications, plan comparisons, and premium tax credits.',
    source: sources.healthcareGov,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'irs',
    name: 'Internal Revenue Service',
    url: sources.irsGov,
    phone: '1-800-829-1040',
    whatFor: 'Tax questions about premium tax credits and household income.',
    source: sources.irsGov,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'medicaid',
    name: 'Medicaid.gov',
    url: sources.medicaidGovByState,
    whatFor: 'Find your state Medicaid agency and Medicare Savings Program.',
    source: sources.medicaidGovByState,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
];

export const contactByKey = Object.fromEntries(
  officialContacts.map((contact) => [contact.key, contact]),
) as Record<string, OfficialContact>;
