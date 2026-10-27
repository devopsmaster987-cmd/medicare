import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { ContactForm } from '@/components/site/contact-form';
import { LastUpdated } from '@/components/trust/last-updated';
import { officialContacts } from '@/data/contacts';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact MedicareClear about a calculator result, a source, a correction, or a page that needs attention.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact MedicareClear',
    description:
      'Contact MedicareClear about a calculator result, a source, a correction, or a page that needs attention.',
    url: '/contact',
    images: [
      {
        url: '/og/contact.png',
        width: 1200,
        height: 630,
        alt: 'Contact MedicareClear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/contact.png'],
  },
};

export default function ContactPage() {
  return (
    <>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Contact', href: '/contact' },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title">Contact MedicareClear</h1>
          <p className="page-lede">
            Send a correction, a source question, or a note about a page that did not help. Email is
            the most reliable route, and the form below opens a message in your email app when no
            form provider is connected.
          </p>
          <LastUpdated />
        </div>
      </section>

      <section className="section">
        <div className="wrap contact-layout">
          <div className="prose">
            <h2>Email and response time</h2>
            <p>
              Write to <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. The owner is
              based in {site.location}. Replies usually take {site.responseTime}.
            </p>
            <p>
              MedicareClear cannot access a Medicare account, change an enrollment, or give
              case-specific legal, tax, medical, or insurance advice. For an official decision,
              contact the agency that handled your case.
            </p>
            <ContactForm />
          </div>

          <aside className="contact-aside">
            <h2>Official help</h2>
            <p>
              These agencies can answer questions about your own enrollment, claim, or application.
            </p>
            <ul className="contact-list">
              {officialContacts.map((contact) => (
                <li key={contact.key}>
                  <a href={contact.url} rel="noreferrer">
                    {contact.name}
                  </a>
                  <span>{contact.whatFor}</span>
                  {contact.phone ? (
                    <a href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}>{contact.phone}</a>
                  ) : null}
                </li>
              ))}
            </ul>
            <p className="stat-note">
              <Link href="/methodology">Read how figures and sources are checked</Link>
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
