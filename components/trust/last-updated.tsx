import { dataVerifiedOn } from '@/data/verified';
import { formatDate } from '@/lib/utils';

export function LastUpdated({ label = 'Last updated', date }: { label?: string; date?: string }) {
  const isoDate = date ?? dataVerifiedOn;
  return (
    <p className="trust-line">
      <span>
        {label} <time dateTime={isoDate}>{formatDate(isoDate)}</time>
      </span>
    </p>
  );
}
