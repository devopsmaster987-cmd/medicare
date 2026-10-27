export type IsoDate = string;

export type Sourced = {
  year: number;
  source: string;
  verifiedOn: IsoDate;
  note?: string;
  verify?: boolean;
};

export type Money = Sourced & { amount: number };

export type Rate = Sourced & { rate: number };

export type Bracket = Sourced & { upTo: number | null; value: number };

export type FilingStatus = 'single' | 'marriedJoint' | 'marriedSeparate';

export type HouseholdSize = number;

export type PayFrequency =
  | 'weekly'
  | 'biweekly'
  | 'semimonthly'
  | 'monthly'
  | 'annual';
