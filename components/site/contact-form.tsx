'use client';

import { useState } from 'react';
import { site } from '@/data/site';

const endpoint = site.integrations.formspreeId
  ? `https://formspree.io/f/${site.integrations.formspreeId}`
  : '';

export function ContactForm() {
  const [status, setStatus] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!endpoint) {
      const name = String(data.get('name') ?? '');
      const email = String(data.get('email') ?? '');
      const message = String(data.get('message') ?? '');
      const subject = encodeURIComponent('MedicareClear question');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${site.contactEmail}?subject=${subject}&body=${body}`;
      setStatus('Your email app should open with the message filled in.');
      return;
    }

    setStatus('Sending your message...');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Form submission failed');
      form.reset();
      setStatus('Thank you. Your message was sent.');
    } catch {
      setStatus(`The form did not send. Please email ${site.contactEmail} instead.`);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="contact-name">Your name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email address</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="contact-message">What do you need help with?</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          aria-describedby="contact-message-hint"
        />
        <p className="field-hint" id="contact-message-hint">
          Do not include a Social Security number, medical records, or other sensitive details.
        </p>
      </div>
      <button className="button button-primary" type="submit">
        Send message
      </button>
      <p className="contact-form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
