'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

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

export function CopyText({
  text,
  label,
  copiedLabel = 'Copied to clipboard.',
  failedLabel = 'Could not copy automatically. Select the text and copy it manually.',
}: {
  text: string;
  label: string;
  copiedLabel?: string;
  failedLabel?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function handleCopy() {
    try {
      await copyText(text);
      trackEvent('copy_citation', { page: window.location.pathname });
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <div className="copy-text no-print">
      <button type="button" className="button button-secondary" onClick={handleCopy}>
        {label}
      </button>
      <p aria-live="polite" className="share-status">
        {status === 'copied' ? copiedLabel : status === 'failed' ? failedLabel : ''}
      </p>
    </div>
  );
}
