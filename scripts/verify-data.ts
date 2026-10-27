import { fpl2025, fpl2026 } from '../data/fpl';
import { partA2026 } from '../data/medicare-part-a';
import { partA2025 } from '../data/medicare-part-a-2025';
import { partB2025 } from '../data/medicare-part-b-2025';
import { partB2026 } from '../data/medicare-part-b';
import { partD2026 } from '../data/medicare-part-d';
import { partD2025 } from '../data/medicare-part-d-2025';
import { aca2026 } from '../data/aca';
import { aca2025 } from '../data/aca-2025';
import { irs2026 } from '../data/irs';
import { irs2025 } from '../data/irs-2025';
import { partAPenalty, partBPenalty, partDPenalty } from '../data/penalties';
import { mspPrograms } from '../data/msp';
import { states } from '../data/states';
import { lifeEvents } from '../data/lifeEvents';
import { officialContacts } from '../data/contacts';
import { keywords } from '../data/keywords';
import { site } from '../data/site';

type Jsonish = { [key: string]: unknown };

const modules: Record<string, unknown> = {
  fpl2025,
  fpl2026,
  partA2025,
  partA2026,
  partB2025,
  partB2026,
  partD2025,
  partD2026,
  aca2025,
  aca2026,
  irs2025,
  irs2026,
  partAPenalty,
  partBPenalty,
  partDPenalty,
  mspPrograms,
  states,
  lifeEvents,
  officialContacts,
  keywords,
  site,
};

const errors: string[] = [];
const warnings: string[] = [];
const seen = new WeakSet<object>();

function isObject(value: unknown): value is Jsonish {
  return typeof value === 'object' && value !== null;
}

function validateFigure(obj: Jsonish, path: string): void {
  const source = obj.source;
  const verifiedOn = obj.verifiedOn;
  const year = obj.year;

  if (typeof source !== 'string' || !/^https?:\/\//.test(source)) {
    errors.push(`${path}: missing or invalid source URL`);
  }
  if (typeof verifiedOn !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(verifiedOn)) {
    errors.push(`${path}: missing or invalid verifiedOn ISO date`);
  } else if (Number.isNaN(Date.parse(verifiedOn))) {
    errors.push(`${path}: verifiedOn is not a real date`);
  }
  if (typeof year !== 'number' || !Number.isInteger(year) || year < 1900 || year > 2100) {
    errors.push(`${path}: missing or invalid year`);
  }
  if (obj.verify === true) {
    warnings.push(`${path}: flagged verify: true`);
  }
}

function walk(value: unknown, path: string): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`));
    return;
  }
  if (!isObject(value)) return;
  if (seen.has(value)) return;
  seen.add(value);

  const hasSource = Object.prototype.hasOwnProperty.call(value, 'source');
  const hasVerifiedOn = Object.prototype.hasOwnProperty.call(value, 'verifiedOn');
  const hasAmount = Object.prototype.hasOwnProperty.call(value, 'amount');
  const hasRate = Object.prototype.hasOwnProperty.call(value, 'rate');
  if (hasSource || hasVerifiedOn || hasAmount || hasRate) {
    validateFigure(value, path);
  }

  for (const [key, child] of Object.entries(value)) {
    walk(child, `${path}.${key}`);
  }
}

walk(modules, 'data');

const requiredSiteStrings = [
  'siteName',
  'ownerName',
  'contactEmail',
  'location',
  'mailingAddress',
  'governingLaw',
] as const;

for (const key of requiredSiteStrings) {
  if (!site[key]) errors.push(`data.site.${key}: required value is empty`);
}

if (!site.siteUrl) {
  errors.push('data.site.siteUrl: required value is empty');
}

if (errors.length > 0) {
  console.error('verify:data failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify:data passed (${warnings.length} verify flags)`);
for (const warning of warnings) console.log(`  warning: ${warning}`);
