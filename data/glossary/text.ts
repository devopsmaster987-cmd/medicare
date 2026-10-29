import { dataVerifiedOn, figureYears } from '../verified';
import { sources } from '../sources';

export const S = sources;

export const F = figureYears.current;
export const P = figureYears.prior;

export const CHECKED = dataVerifiedOn;

const wholeMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const fractionMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function money(amount: number | undefined): string {
  if (amount === undefined) {
    throw new Error('glossary: money called with an undefined figure');
  }
  return amount % 1 === 0 ? wholeMoney.format(amount) : fractionMoney.format(amount);
}

const plainNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function num(value: number): string {
  return plainNumber.format(value);
}

export function pct(rate: number, digits = 2): string {
  const percent = rate * 100;
  return `${plainNumber.format(Number(percent.toFixed(digits)))}%`;
}

const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' });

export function day(month: number, date: number): string {
  return `${monthName.format(new Date(Date.UTC(2026, month - 1, date)))} ${date}`;
}

export function dateRange(startMonth: number, startDay: number, endMonth: number, endDay: number): string {
  return `${day(startMonth, startDay)} through ${day(endMonth, endDay)}`;
}

import type { GlossaryCalculatorLink, GlossarySourceRow } from './types';

export function row(
  label: string,
  value: string,
  source: string,
  sourceLabel: string,
): GlossarySourceRow {
  return { label, value, source, sourceLabel, checkedOn: CHECKED };
}

export function link(href: string, label: string, note: string): GlossaryCalculatorLink {
  return { href, label, note };
}
