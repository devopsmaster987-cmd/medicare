import { site } from '@/data/site';

export function ReportError({ pageTitle }: { pageTitle?: string }) {
  const where = pageTitle ? ` on "${pageTitle}"` : '';
  const subject = encodeURIComponent(`Correction request${where}`);
  const body = encodeURIComponent(
    `Page: ${pageTitle ?? 'MedicareClear'}\n\nWhat looks wrong:\n\nOfficial source that supports the correction:\n\n`,
  );

  return (
    <p className="trust-line">
      <span>Found a mistake?</span>
      <a href={`mailto:${site.contactEmail}?subject=${subject}&body=${body}`}>
        Report an error
      </a>
    </p>
  );
}
