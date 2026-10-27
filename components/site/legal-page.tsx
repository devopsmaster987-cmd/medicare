import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { LastUpdated } from '@/components/trust/last-updated';
import { ReportError } from '@/components/trust/report-error';

type LegalPageProps = {
  title: string;
  lede: string;
  path: string;
  eyebrow?: string;
  children: ReactNode;
};

export function LegalPage({
  title,
  lede,
  path,
  eyebrow = 'Site information',
  children,
}: LegalPageProps) {
  return (
    <>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: title, href: path },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-lede">{lede}</p>
          <LastUpdated />
        </div>
      </section>

      <section className="section">
        <div className="wrap prose">
          {children}
          <ReportError pageTitle={title} />
        </div>
      </section>
    </>
  );
}
