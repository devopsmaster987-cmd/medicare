import { dataVerifiedOn } from '@/data/verified';
import { formatDate } from '@/lib/utils';

export function LastUpdated({ label = 'Last updated' }: { label?: string }) {
  return (
    <p className="trust-line">
      <span>
        {label} <time dateTime={dataVerifiedOn}>{formatDate(dataVerifiedOn)}</time>
      </span>
    </p>
  );
}
