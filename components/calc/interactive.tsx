'use client';

import { useState, type MouseEvent } from 'react';
import { site } from '@/data/site';
import { trackEvent } from '@/lib/analytics';
import { buildIcs } from '@/lib/ics';

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  document.execCommand('copy');
  document.body.removeChild(field);
}

export function ShareResult({
  summary,
  label = 'Copy my results',
}: {
  summary: string;
  label?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function handleCopy() {
    try {
      await copyText(`${summary}\n\n${window.location.href}`);
      trackEvent('copy_result', { page: window.location.pathname });
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <div className="share-result no-print">
      <button type="button" className="button button-secondary" onClick={handleCopy}>
        {label}
      </button>
      <p aria-live="polite" className="share-status">
        {status === 'copied'
          ? 'Results and page link copied.'
          : status === 'failed'
            ? 'Could not copy automatically. Select the result text and copy it manually.'
            : 'Copies the result, the source page, and your current inputs.'}
      </p>
    </div>
  );
}

export function ReminderIcs({
  title,
  description,
  days = 7,
  path,
}: {
  title: string;
  description: string;
  days?: number;
  path: string;
}) {
  function handleDownload() {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const eventDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const ics = buildIcs({
      title,
      description,
      date: eventDate,
      url: `${site.siteUrl}${path}`,
      durationMinutes: 30,
    });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'medicareclear-reminder.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    trackEvent('calendar_download', { page: path });
  }

  return (
    <button type="button" className="button button-secondary" onClick={handleDownload}>
      Add a review reminder to my calendar
    </button>
  );
}

export function CalculatorReportError({
  pageTitle,
  path,
  summary,
}: {
  pageTitle: string;
  path: string;
  summary: string;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const pageUrl = `${site.siteUrl}${path}`;
    const subject = encodeURIComponent(`Correction request on "${pageTitle}"`);
    const body = encodeURIComponent(
      `Page: ${pageUrl}\n\nInputs and result:\n${summary}\n\nWhat looks wrong:\n\nOfficial source that supports the correction:\n\n`,
    );
    window.location.href = `mailto:${site.contactEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="calculator-report no-print">
      <p>
        A result can be right for the inputs and still be wrong for your state or tax household.
      </p>
      <a href={`mailto:${site.contactEmail}`} onClick={handleClick}>
        Report an error in this calculator
      </a>
    </div>
  );
}
