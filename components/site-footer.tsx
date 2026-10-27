import Link from 'next/link';
import { CookieSettingsLink } from '@/components/consent/cookie-settings-link';
import { site } from '@/data/site';

const exploreLinks = [
  { href: '/calculators', label: 'All calculators' },
  { href: '/guides', label: 'Guides' },
  { href: '/glossary', label: 'Medicare glossary' },
  { href: '/sitemap-page', label: 'Sitemap' },
];

const aboutLinks = [
  { href: '/about', label: 'About' },
  { href: '/authors/abdul-samad', label: 'Author' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/editorial-policy', label: 'Editorial policy' },
  { href: '/corrections', label: 'Corrections' },
];

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy policy' },
  { href: '/terms-of-service', label: 'Terms of service' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/cookie-policy', label: 'Cookie policy' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-brand">{site.siteName}</p>
          <p className="footer-copy">
            Independent Medicare and ACA tools. Every figure is tied to an official source and a
            checked date.
          </p>
          <ul className="footer-list footer-contact">
            <li>
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </li>
            <li>{site.location}</li>
            <li>Replies in {site.responseTime}</li>
          </ul>
        </div>

        <div>
          <p className="footer-heading">Explore</p>
          <ul className="footer-list">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="footer-heading">About</p>
          <ul className="footer-list">
            {aboutLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="footer-heading">Policies</p>
          <ul className="footer-list">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <CookieSettingsLink />
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <p>
          &copy; {year} {site.siteName}. All rights reserved.
        </p>
        <p>
          {site.siteName} is independent and is not affiliated with Medicare.gov, the Centers for
          Medicare &amp; Medicaid Services, the Social Security Administration, or any government
          agency. This site provides general information, not legal, tax, medical, or insurance
          advice.
        </p>
      </div>
    </footer>
  );
}
