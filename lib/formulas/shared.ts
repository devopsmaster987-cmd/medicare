export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function isFiniteNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}
