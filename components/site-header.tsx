import Link from 'next/link';
import { site } from '@/data/site';
import { TextSizeControl } from './text-size-control';
import { ThemeControl } from './theme-control';

const navigation = [
  { href: '/calculators/', label: 'Calculators' },
  { href: '/guides/', label: 'Guides' },
  { href: '/glossary/', label: 'Glossary' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            MC
          </span>
          <span className="brand-text">
            <span className="brand-name">{site.siteName}</span>
            <span className="brand-tagline">Clear answers, cited sources</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="preferences">
          <TextSizeControl />
          <ThemeControl />
        </div>
      </div>
    </header>
  );
}
