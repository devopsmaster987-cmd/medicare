export type GlossarySourceRow = {
  label: string;
  value: string;
  source: string;
  sourceLabel: string;
  checkedOn: string;
};

export type GlossaryCalculatorLink = {
  href: string;
  label: string;
  note: string;
};

export type GlossaryTerm = {
  term: string;
  definition: string;
  whyItMatters: string[];
  exactHeading: string;
  exact: string[];
  worked: string;
  calculators: GlossaryCalculatorLink[];
  related: string[];
  sources: GlossarySourceRow[];
  updatedOn: string;
};
