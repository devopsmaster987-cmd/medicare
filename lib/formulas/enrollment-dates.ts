export type EnrollmentSituation =
  | 'not-yet-eligible'
  | 'within-iep'
  | 'working-employer-coverage'
  | 'missed-iep';

export type EnrollmentDatesInput = {
  birthYear: number;
  birthMonth: number;
  birthdayOnFirst?: boolean;
  situation?: EnrollmentSituation;
  coverageEndMonth?: string;
  today?: Date;
};

export type CoverageStartRow = {
  signupMonth: string;
  coverageStart: string;
};

export type EnrollmentDatesResult = {
  sixtyFifthBirthdayYear: number;
  eligibleMonth: number;
  eligibleYear: number;
  eligibleMonthLabel: string;
  firstOfMonthRuleApplied: boolean;
  iepStart: string;
  iepEnd: string;
  windowStatus: 'not-open' | 'open' | 'closing-soon' | 'closed';
  daysUntilIEPEnd: number | null;
  coverageStartTable: CoverageStartRow[];
  earliestCoverageStart: string;
  gep: { start: string; end: string; openNow: boolean } | null;
  sep: { start: string; end: string } | null;
  situation: EnrollmentSituation;
  note: string;
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_MS = 24 * 60 * 60 * 1000;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function iso(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function monthStart(year: number, month: number): Date {
  return new Date(Date.UTC(year, month - 1, 1));
}

function monthEnd(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 0));
}

function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

function formatMonthYear(year: number, month: number): string {
  return `${monthNames[month - 1]} ${year}`;
}

function buildNote(
  windowStatus: EnrollmentDatesResult['windowStatus'],
  situation: EnrollmentSituation,
  hasSep: boolean,
): string {
  if (windowStatus === 'not-open') {
    return 'Your seven-month window has not opened yet. Mark the start date now; you can sign up as soon as it opens.';
  }
  if (windowStatus === 'closing-soon') {
    return 'Your Initial Enrollment Period closes soon. Sign up before the last day of the window to avoid a Part B late enrollment penalty.';
  }
  if (windowStatus === 'open') {
    return 'Your Initial Enrollment Period is open. Signing up in the three months before your birthday month gives you coverage on the first day of your birthday month.';
  }
  if (situation === 'working-employer-coverage' || hasSep) {
    return 'Your Initial Enrollment Period has closed. Employer coverage may open an eight-month Special Enrollment Period, so check the dates below before you act.';
  }
  return 'Your Initial Enrollment Period has closed. The General Enrollment Period below is the usual path to sign up, and a late enrollment penalty may apply to Part B.';
}

export function enrollmentDatesCalculator(input: EnrollmentDatesInput): EnrollmentDatesResult {
  if (!Number.isInteger(input.birthMonth) || input.birthMonth < 1 || input.birthMonth > 12) {
    throw new Error('Birth month must be between 1 and 12.');
  }
  if (!Number.isInteger(input.birthYear) || input.birthYear < 1900 || input.birthYear > 2100) {
    throw new Error('Birth year must be between 1900 and 2100.');
  }
  const today = input.today ?? new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  const sixtyFifthBirthdayYear = input.birthYear + 65;
  const firstOfMonthRuleApplied = input.birthdayOnFirst === true;

  const shifted = firstOfMonthRuleApplied
    ? addMonths(sixtyFifthBirthdayYear, input.birthMonth, -1)
    : { year: sixtyFifthBirthdayYear, month: input.birthMonth };
  const eligibleYear = shifted.year;
  const eligibleMonth = shifted.month;

  const iepStartParts = addMonths(eligibleYear, eligibleMonth, -3);
  const iepEndParts = addMonths(eligibleYear, eligibleMonth, 3);
  const iepStart = monthStart(iepStartParts.year, iepStartParts.month);
  const iepEnd = monthEnd(iepEndParts.year, iepEndParts.month);

  const iepStartMs = iepStart.getTime();
  const iepEndMs = iepEnd.getTime();

  let windowStatus: EnrollmentDatesResult['windowStatus'];
  let daysUntilIEPEnd: number | null = null;
  if (todayUtc < iepStartMs) {
    windowStatus = 'not-open';
  } else if (todayUtc > iepEndMs) {
    windowStatus = 'closed';
  } else {
    daysUntilIEPEnd = Math.round((iepEndMs - todayUtc) / DAY_MS);
    windowStatus = daysUntilIEPEnd <= 30 ? 'closing-soon' : 'open';
  }

  const coverageStartTable: CoverageStartRow[] = [];
  for (let offset = -3; offset <= 3; offset += 1) {
    const signup = addMonths(eligibleYear, eligibleMonth, offset);
    const coverageStart =
      offset < 0
        ? monthStart(eligibleYear, eligibleMonth)
        : monthStart(...(offsetMonth(signup.year, signup.month, 1)));
    coverageStartTable.push({
      signupMonth: formatMonthYear(signup.year, signup.month),
      coverageStart: iso(coverageStart),
    });
  }
  const earliestCoverageStart =
    coverageStartTable[0]?.coverageStart ?? iso(monthStart(eligibleYear, eligibleMonth));

  let gep: EnrollmentDatesResult['gep'] = null;
  if (windowStatus === 'closed') {
    const todayYear = today.getUTCFullYear();
    const todayMonth = today.getUTCMonth() + 1;
    const gepOpenNow = todayMonth <= 3;
    const gepYear = gepOpenNow ? todayYear : todayYear + 1;
    gep = {
      start: iso(monthStart(gepYear, 1)),
      end: iso(monthEnd(gepYear, 3)),
      openNow: gepOpenNow,
    };
  }

  let sep: EnrollmentDatesResult['sep'] = null;
  if (input.coverageEndMonth && /^\d{4}-(0[1-9]|1[0-2])$/.test(input.coverageEndMonth)) {
    const [endYearRaw, endMonthRaw] = input.coverageEndMonth.split('-');
    const coverageEndYear = Number(endYearRaw);
    const coverageEndMonth = Number(endMonthRaw);
    // Medicare.gov: SEP starts the first month after the IEP ends and runs
    // through the eighth month after the job-based coverage (or employment)
    // ends, whichever happens first. POMS HI 00805.275 confirms the
    // eight consecutive months following the last month of coverage.
    const start = addMonths(iepEndParts.year, iepEndParts.month, 1);
    const end = addMonths(coverageEndYear, coverageEndMonth, 8);
    const startOrd = start.year * 12 + start.month;
    const endOrd = end.year * 12 + end.month;
    if (endOrd >= startOrd) {
      sep = {
        start: iso(monthStart(start.year, start.month)),
        end: iso(monthEnd(end.year, end.month)),
      };
    }
  }

  const situation = input.situation ?? 'within-iep';
  const note = buildNote(windowStatus, situation, Boolean(sep));

  return {
    sixtyFifthBirthdayYear,
    eligibleMonth,
    eligibleYear,
    eligibleMonthLabel: formatMonthYear(eligibleYear, eligibleMonth),
    firstOfMonthRuleApplied,
    iepStart: iso(iepStart),
    iepEnd: iso(iepEnd),
    windowStatus,
    daysUntilIEPEnd,
    coverageStartTable,
    earliestCoverageStart,
    gep,
    sep,
    situation,
    note,
  };
}

function offsetMonth(year: number, month: number, delta: number): [number, number] {
  const next = addMonths(year, month, delta);
  return [next.year, next.month];
}
