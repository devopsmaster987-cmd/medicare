import { site } from '@/data/site';

export function IndependenceNote() {
  return (
    <p className="notice">
      {site.siteName} is independent. We do not sell plans, rank carriers, or claim an official
      connection to Medicare.gov or any government agency.
    </p>
  );
}
