import { ReportError } from '@/components/trust/report-error';
import { PrintButton } from './print-button';

export function TakeHomePack({ pageTitle }: { pageTitle?: string }) {
  return (
    <div className="trust-card">
      <strong>Take this page with you</strong>
      <p>
        Print the checklist for a parent or keep a copy for your records. If a figure looks wrong,
        send the page and the official source you used.
      </p>
      <div className="hero-actions">
        <PrintButton label="Print this page" />
      </div>
      <ReportError pageTitle={pageTitle} />
    </div>
  );
}
