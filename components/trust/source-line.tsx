import { dataVerifiedOn } from '@/data/verified';
import { formatDate } from '@/lib/utils';

export function SourceLine({
  href,
  label,
  checkedOn = dataVerifiedOn,
}: {
  href: string;
  label: string;
  checkedOn?: string;
}) {
  return (
    <p className="trust-line">
      <span>
        Source:{' '}
        <a href={href} target="_blank" rel="noreferrer">
          {label}
        </a>
      </span>
      <span>
        Checked <time dateTime={checkedOn}>{formatDate(checkedOn)}</time>
      </span>
    </p>
  );
}
