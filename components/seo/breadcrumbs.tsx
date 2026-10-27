import Link from 'next/link';
import { site } from '@/data/site';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from './json-ld';

export type BreadcrumbItem = {
  name: string;
  href: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const schemaItems = items.map((item) => ({
    name: item.name,
    url: `${site.siteUrl}${item.href === '/' ? '' : item.href}`,
  }));

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href}>
                {isLast ? (
                  <span aria-current="page">{item.name}</span>
                ) : (
                  <Link href={item.href}>{item.name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(schemaItems)} />
    </>
  );
}
