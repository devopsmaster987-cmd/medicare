import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { guides, resolveGuide } from '../content/guides/meta';
import { author } from '../data/entities';
import { glossary, glossarySlug } from '../data/glossary';
import { site } from '../data/site';
import { figureYears } from '../data/verified';
import { root } from './file-walk';

type OgPage = {
  file: string;
  title: string;
  kicker: string;
};

const year = figureYears.current;

const calculators: Array<{ slug: string; title: string; kicker: string }> = [
  {
    slug: 'employer-coverage-affordability',
    title: 'Is employer health insurance affordable?',
    kicker: 'The 2026 affordability test, with the family premium rule',
  },
  {
    slug: 'medicare-savings-program-extra-help',
    title: 'Medicare Savings Program income limits',
    kicker: 'QMB, SLMB, QI, and Extra Help by household',
  },
  {
    slug: 'part-b-late-enrollment-penalty',
    title: 'Part B late enrollment penalty',
    kicker: 'The monthly cost, the annual cost, and the 10-year view',
  },
  {
    slug: 'irmaa-cliff-checker',
    title: 'IRMAA brackets and the next cliff',
    kicker: 'Part B and Part D surcharges with a two-year lookback',
  },
  {
    slug: 'medicare-vs-aca',
    title: 'Medicare vs ACA',
    kicker: 'The 20-employee rule, work credits, and the subsidy decision',
  },
];

const sitePages: OgPage[] = [
  {
    file: 'about.png',
    title: 'About MedicareClear',
    kicker: 'Who publishes the site and why',
  },
  {
    file: 'contact.png',
    title: 'Contact MedicareClear',
    kicker: 'Email, response time, and official help',
  },
  {
    file: 'privacy-policy.png',
    title: 'Privacy Policy',
    kicker: 'What the site stores and what it never sends',
  },
  {
    file: 'terms-of-service.png',
    title: 'Terms of Service',
    kicker: 'The rules for using these calculators',
  },
  {
    file: 'disclaimer.png',
    title: 'Disclaimer',
    kicker: 'General information, not advice',
  },
  {
    file: 'editorial-policy.png',
    title: 'Editorial Policy',
    kicker: 'How sources are checked and corrections are handled',
  },
  {
    file: 'methodology.png',
    title: 'Methodology',
    kicker: 'Sources, update schedule, and known limits',
  },
  {
    file: 'corrections.png',
    title: 'Corrections',
    kicker: 'Report an error and read the change log',
  },
  {
    file: 'cookie-policy.png',
    title: 'Cookie Policy',
    kicker: 'Storage, analytics, and advertising choices',
  },
  {
    file: 'sitemap-page.png',
    title: 'MedicareClear Sitemap',
    kicker: 'Every page in one place',
  },
  {
    file: 'what-changed-2026.png',
    title: 'What changed for 2026',
    kicker: 'Part B, Part D, IRMAA, Part A, and ACA figures beside 2025',
  },
  {
    file: 'medicare-deadlines.png',
    title: 'Medicare enrollment deadlines',
    kicker: 'Initial, general, special, annual, HSA, and ACA windows',
  },
  {
    file: 'scenarios.png',
    title: 'Medicare decisions, worked through',
    kicker: 'Three common situations with the numbers and next steps',
  },
  {
    file: 'verification-log.png',
    title: 'Verification log',
    kicker: 'Hand-worked examples, sources, and checked dates',
  },
  {
    file: 'authors/abdul-samad.png',
    title: author.name,
    kicker: 'Independent publisher, Punjab, Pakistan',
  },
];

const pages: OgPage[] = [
  {
    file: 'default.png',
    title: 'MedicareClear',
    kicker: 'Independent Medicare and ACA calculators',
  },
  {
    file: 'home.png',
    title: 'Free Medicare calculator',
    kicker: 'The number, the reason, and the next step',
  },
  {
    file: 'calculators.png',
    title: 'Medicare calculator',
    kicker: 'Five questions, answered with dated sources',
  },
  {
    file: 'guides.png',
    title: 'Medicare and ACA guides',
    kicker: 'The rule behind the number',
  },
  {
    file: 'glossary.png',
    title: 'Medicare glossary',
    kicker: 'Plain-language definitions for the terms that matter',
  },
  ...calculators.map((calculator) => ({
    file: `calculators/${calculator.slug}.png`,
    title: calculator.title,
    kicker: calculator.kicker,
  })),
  ...sitePages,
  ...guides.map((guide) => ({
    file: `guides/${guide.slug}.png`,
    title: resolveGuide(guide.h1, year),
    kicker: guide.summary,
  })),
  ...glossary.map((entry) => ({
    file: `glossary/${glossarySlug(entry.term)}.png`,
    title: `${entry.term} definition`,
    kicker: 'Medicare glossary',
  })),
];

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapText(value: string, maxChars: number): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 4);
}

function buildSvg(title: string, kicker: string): string {
  const fontSize = title.length > 74 ? 46 : title.length > 54 ? 54 : 62;
  const maxChars = Math.floor(980 / (fontSize * 0.52));
  const lines = wrapText(title, maxChars);
  const lineHeight = Math.round(fontSize * 1.12);
  const titleTop = 268;
  const titleSvg = lines
    .map(
      (line, index) =>
        `<text x="120" y="${titleTop + index * lineHeight}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="700" fill="#0B2545">${escapeXml(line)}</text>`,
    )
    .join('');

  const kickerLines = wrapText(kicker, 74).slice(0, 2);
  const kickerSvg = kickerLines
    .map(
      (line, index) =>
        `<text x="120" y="${titleTop + lines.length * lineHeight + 30 + index * 34}" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#4A5568">${escapeXml(line)}</text>`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FAFAF7"/>
  <rect x="120" y="160" width="4" height="${Math.max(210, lines.length * lineHeight + 20)}" fill="#F2A03D"/>
  <text x="120" y="104" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="6" fill="#1D6FB8">${escapeXml(site.siteName.toUpperCase())}</text>
  <text x="120" y="136" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#6B7280">Independent tools. Dated sources.</text>
  ${titleSvg}
  ${kickerSvg}
  <line x1="120" y1="526" x2="1080" y2="526" stroke="#E6E4DD" stroke-width="1"/>
  <text x="120" y="566" font-family="Arial, Helvetica, sans-serif" font-size="19" fill="#0B2545">Every figure links to an official source and a checked date.</text>
  <text x="120" y="596" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#6B7280">Independent. No lead form before your result. ${year} figures.</text>
  <circle cx="1062" cy="566" r="38" fill="none" stroke="#1D6FB8" stroke-width="1.5" opacity="0.25"/>
  <text x="1062" y="574" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="24" font-weight="700" fill="#1D6FB8" opacity="0.75">MC</text>
</svg>`;
}

async function main(): Promise<void> {
  const outputDirectory = path.join(root, 'public/og');
  for (const page of pages) {
    const file = path.join(outputDirectory, page.file);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await sharp(Buffer.from(buildSvg(page.title, page.kicker)))
      .png({ compressionLevel: 9 })
      .toFile(file);
  }
  console.log(`generate:og wrote ${pages.length} images to public/og`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
