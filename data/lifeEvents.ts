import { sources } from './sources';
import { dataVerifiedOn } from './verified';

export type LifeEvent = {
  key: string;
  name: string;
  proofUsuallyAskedFor: string;
  source: string;
  verifiedOn: string;
  year: number;
};

export const lifeEvents: LifeEvent[] = [
  {
    key: 'death-of-spouse',
    name: 'Death of your spouse',
    proofUsuallyAskedFor: 'Death certificate or SSA notice.',
    source: sources.ssaForm44,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'marriage',
    name: 'Marriage',
    proofUsuallyAskedFor: 'Marriage certificate.',
    source: sources.ssaForm44,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'divorce',
    name: 'Divorce or annulment',
    proofUsuallyAskedFor: 'Divorce decree or annulment order.',
    source: sources.ssaForm44,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'work-stoppage',
    name: 'Work stoppage',
    proofUsuallyAskedFor: 'Employer statement or pay records showing the stop date.',
    source: sources.ssaForm44,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'work-reduction',
    name: 'Work reduction',
    proofUsuallyAskedFor: 'Pay records or an employer statement showing reduced hours or pay.',
    source: sources.ssaForm44,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'loss-of-income-property',
    name: 'Loss of income-producing property',
    proofUsuallyAskedFor:
      'Insurance, disaster, or legal documents showing the loss was not a normal investment loss.',
    source: sources.ssaForm44,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'loss-of-pension',
    name: 'Loss of pension income',
    proofUsuallyAskedFor: 'Pension administrator letter or plan termination notice.',
    source: sources.ssaForm44,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  {
    key: 'employer-settlement',
    name: 'Employer settlement payment',
    proofUsuallyAskedFor: 'Settlement agreement or employer statement.',
    source: sources.ssaForm44,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
];
