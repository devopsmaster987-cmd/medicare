export type DiagramPalette = {
  ink: string;
  field: string;
  accent: string;
  soft: string;
  muted: string;
};

export type DiagramSlugValue =
  | 'employer-coverage-affordability'
  | 'medicare-savings-program-extra-help'
  | 'part-b-late-enrollment-penalty'
  | 'irmaa-cliff-checker'
  | 'medicare-vs-aca';

export const diagramSlugs: DiagramSlugValue[] = [
  'employer-coverage-affordability',
  'medicare-savings-program-extra-help',
  'part-b-late-enrollment-penalty',
  'irmaa-cliff-checker',
  'medicare-vs-aca',
];

export const diagramCssPalette: DiagramPalette = {
  ink: 'var(--diagram-ink)',
  field: 'var(--diagram-field)',
  accent: 'var(--diagram-accent)',
  soft: 'var(--diagram-soft)',
  muted: 'var(--diagram-muted)',
};

export const diagramLightPalette: DiagramPalette = {
  ink: '#0b4f4a',
  field: '#f7f9f8',
  accent: '#c2410c',
  soft: 'rgba(11, 79, 74, 0.12)',
  muted: '#40615c',
};

export const diagramDarkPalette: DiagramPalette = {
  ink: '#7fd1c4',
  field: '#0d1412',
  accent: '#ff9d72',
  soft: 'rgba(127, 209, 196, 0.14)',
  muted: '#9fd8cc',
};

export type DiagramLabels = {
  affordabilityThreshold: string;
  employeePremium: string;
  irsLine: string;
  ladderLevels: string[];
  ladderBand: string;
  ladderLow: string;
  ladderHigh: string;
  penaltyBaseline: string;
  penaltySteps: string[];
  irmaaLowLabel: string;
  irmaaHighLabel: string;
  irmaaCliffFlag: string;
  irmaaHeadroom: string;
  irmaaYAxis: string;
  forkLeft: string;
  forkRight: string;
  forkLeftSub: string;
  forkRightSub: string;
  forkStart: string;
};

const FONT = `font-family="Inter, 'Segoe UI', system-ui, -apple-system, sans-serif"`;

function text(
  x: number,
  y: number,
  label: string,
  fill: string,
  size = 15,
  anchor = 'start',
  weight: number | string = 500,
): string {
  return `<text x="${x}" y="${y}" ${FONT} font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}">${label}</text>`;
}

function hatch(id: string, color: string): string {
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
      <rect width="12" height="12" fill="none"/>
      <line x1="0" y1="0" x2="0" y2="12" stroke="${color}" stroke-width="3"/>
    </pattern>`;
}

function frame(p: DiagramPalette, defs: string, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>${defs}</defs>
  <rect x="1" y="1" width="1198" height="673" rx="10" fill="${p.field}" stroke="${p.soft}" stroke-width="2"/>
  ${body}
</svg>`;
}

function employerAffordabilitySvg(p: DiagramPalette, l: DiagramLabels): string {
  const lineX = 690;
  const baseline = `
  <line x1="170" y1="556" x2="1030" y2="556" stroke="${p.muted}" stroke-width="2"/>
  <line x1="170" y1="546" x2="170" y2="566" stroke="${p.muted}" stroke-width="2"/>
  <line x1="870" y1="546" x2="870" y2="566" stroke="${p.muted}" stroke-width="2"/>
  <line x1="${lineX}" y1="546" x2="${lineX}" y2="566" stroke="${p.accent}" stroke-width="2"/>`;
  return frame(
    p,
    hatch('daHatch', p.accent),
    `
  ${text(598, 118, l.irsLine, p.ink, 15, 'end', '600')}
  <path d="M ${lineX} 104 L ${lineX - 9} 118 L ${lineX + 9} 118 Z" fill="${p.accent}"/>
  <line x1="${lineX}" y1="126" x2="${lineX}" y2="556" stroke="${p.accent}" stroke-width="2" stroke-dasharray="7 8"/>
  <rect x="170" y="188" width="833" height="64" fill="none" stroke="${p.ink}" stroke-width="2" stroke-dasharray="3 6"/>
  ${text(170, 172, l.affordabilityThreshold, p.ink, 15, 'start', '600')}
  <rect x="170" y="402" width="700" height="64" fill="${p.soft}" stroke="${p.ink}" stroke-width="2"/>
  ${text(170, 386, l.employeePremium, p.ink, 15, 'start', '600')}
  <rect x="${lineX}" y="402" width="${870 - lineX}" height="64" fill="url(#daHatch)" stroke="${p.accent}" stroke-width="2"/>
  ${baseline}`,
  );
}

function mspLadderSvg(p: DiagramPalette, l: DiagramLabels): string {
  const rungY = [214, 300, 386, 472];
  const left = 300;
  const right = 920;
  const rungs = l.ladderLevels
    .map((label, index) => {
      const y = rungY[index];
      return `
      <line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${p.ink}" stroke-width="4"/>
      <rect x="${left - 10}" y="${y - 9}" width="20" height="18" fill="${p.field}" stroke="${p.ink}" stroke-width="2"/>
      <rect x="${right - 10}" y="${y - 9}" width="20" height="18" fill="${p.field}" stroke="${p.ink}" stroke-width="2"/>
      ${text(left + 26, y - 16, label, p.ink, 16, 'start', '600')}`;
    })
    .join('');
  const bandTop = rungY[1];
  const bandBottom = rungY[2];
  const bandMid = Math.round((bandTop + bandBottom) / 2);
  return frame(
    p,
    '',
    `
  <line x1="${left}" y1="150" x2="${left}" y2="${rungY[3]}" stroke="${p.muted}" stroke-width="2"/>
  <line x1="${right}" y1="150" x2="${right}" y2="${rungY[3]}" stroke="${p.muted}" stroke-width="2"/>
  ${text(left, 118, l.ladderLow, p.muted)}
  ${text(right, rungY[3] + 46, l.ladderHigh, p.muted, 15, 'end')}
  ${rungs}
  <path d="M 640 ${bandTop} L 640 ${bandBottom} M 640 ${bandTop} L 668 ${bandTop} M 640 ${bandBottom} L 668 ${bandBottom}" stroke="${p.accent}" stroke-width="2.5" fill="none"/>
  <circle cx="596" cy="${bandMid}" r="9" fill="${p.accent}"/>
  ${text(688, bandMid + 5, l.ladderBand, p.accent, 15, 'start', '600')}`,
  );
}

function partBPenaltySvg(p: DiagramPalette, l: DiagramLabels): string {
  const baseY = 470;
  const steps = l.penaltySteps
    .map((penaltyLabel, index) => {
      const x = 168 + index * 176;
      const w = 164;
      const top = 396 - index * 46;
      const prevTop = index === 0 ? baseY : 396 - (index - 1) * 46;
      const rise = `<line x1="${x}" y1="${prevTop}" x2="${x}" y2="${top}" stroke="${p.accent}" stroke-width="3"/>`;
      const tread = `<rect x="${x}" y="${top}" width="${w}" height="${baseY - top}" fill="${p.soft}" stroke="${p.ink}" stroke-width="2"/>
      ${text(x + 12, top + 26, `${index + 1} full year${index > 0 ? 's' : ''}`, p.ink, 14, 'start', '600')}
      ${text(x + 12, top + 48, penaltyLabel, p.accent, 14)}`;
      const coins = Array.from({ length: index + 2 }, (_, coinIndex) => {
        const coinY = top - 12 - coinIndex * 12;
        return `<rect x="${x + w - 46}" y="${coinY}" width="38" height="10" rx="3" fill="${p.field}" stroke="${p.ink}" stroke-width="2"/>`;
      }).join('');
      return `${rise}${tread}${coins}`;
    })
    .join('');
  return frame(
    p,
    '',
    `
  <line x1="140" y1="${baseY}" x2="1090" y2="${baseY}" stroke="${p.muted}" stroke-width="2" stroke-dasharray="7 8"/>
  ${steps}
  ${text(1084, baseY + 34, l.penaltyBaseline, p.ink, 15, 'end', '600')}`,
  );
}

function irmaaCliffSvg(p: DiagramPalette, l: DiagramLabels): string {
  const axisX = 160;
  const axisY = 520;
  const dropX = 640;
  const lowY = 470;
  const highY = 250;
  return frame(
    p,
    '',
    `
  <line x1="${axisX}" y1="130" x2="${axisX}" y2="${axisY}" stroke="${p.muted}" stroke-width="2"/>
  <line x1="${axisX}" y1="${axisY}" x2="1080" y2="${axisY}" stroke="${p.muted}" stroke-width="2"/>
  ${text(430, 140, l.irmaaYAxis, p.muted, 14, 'middle')}
  ${text(360, lowY - 18, l.irmaaLowLabel, p.muted, 14, 'middle')}
  ${text(830, highY - 18, l.irmaaHighLabel, p.muted, 14, 'middle')}

  <line x1="200" y1="${lowY}" x2="${dropX}" y2="${lowY}" stroke="${p.ink}" stroke-width="3"/>
  <line x1="200" y1="${highY}" x2="1020" y2="${highY}" stroke="${p.ink}" stroke-width="3"/>
  <line x1="${dropX}" y1="${lowY}" x2="${dropX}" y2="${highY}" stroke="${p.accent}" stroke-width="4"/>

  <path d="M ${dropX + 18} ${highY} L ${dropX + 18} ${highY - 44} L ${dropX + 66} ${highY - 33} L ${dropX + 18} ${highY - 20} Z" fill="${p.accent}"/>
  ${text(dropX + 78, highY - 28, l.irmaaCliffFlag, p.accent, 15, 'start', '600')}

  <circle cx="560" cy="${lowY}" r="9" fill="${p.ink}"/>
  <line x1="560" y1="${lowY}" x2="${dropX}" y2="${lowY}" stroke="${p.accent}" stroke-width="2" stroke-dasharray="5 6"/>
  <line x1="560" y1="502" x2="${dropX}" y2="502" stroke="${p.accent}" stroke-width="2"/>
  <line x1="560" y1="494" x2="560" y2="510" stroke="${p.accent}" stroke-width="2"/>
  <line x1="${dropX}" y1="494" x2="${dropX}" y2="510" stroke="${p.accent}" stroke-width="2"/>
  ${text(600, 548, l.irmaaHeadroom, p.accent, 14, 'middle', '600')}`,
  );
}

function medicareVsAcaSvg(p: DiagramPalette, l: DiagramLabels): string {
  const nodeX = 600;
  const nodeY = 350;
  return frame(
    p,
    '',
    `
  <path d="M 250 170 C 360 240, 480 330, ${nodeX} ${nodeY}" fill="none" stroke="${p.ink}" stroke-width="4"/>
  <path d="M 950 170 C 840 240, 720 330, ${nodeX} ${nodeY}" fill="none" stroke="${p.ink}" stroke-width="4"/>
  <path d="M 170 560 C 340 560, 450 430, ${nodeX - 8} ${nodeY + 8}" fill="none" stroke="${p.ink}" stroke-width="4"/>
  <circle cx="${nodeX}" cy="${nodeY}" r="16" fill="${p.accent}"/>

  ${text(250, 150, l.forkLeft, p.ink, 17, 'middle', '700')}
  ${text(250, 178, l.forkLeftSub, p.muted, 14, 'middle')}
  ${text(950, 150, l.forkRight, p.ink, 17, 'middle', '700')}
  ${text(950, 178, l.forkRightSub, p.muted, 14, 'middle')}
  ${text(150, 590, l.forkStart, p.muted, 15, 'start')}`,
  );
}

export function heroDiagramSvg(slug: DiagramSlugValue, p: DiagramPalette, l: DiagramLabels): string {
  switch (slug) {
    case 'employer-coverage-affordability':
      return employerAffordabilitySvg(p, l);
    case 'medicare-savings-program-extra-help':
      return mspLadderSvg(p, l);
    case 'part-b-late-enrollment-penalty':
      return partBPenaltySvg(p, l);
    case 'irmaa-cliff-checker':
      return irmaaCliffSvg(p, l);
    case 'medicare-vs-aca':
      return medicareVsAcaSvg(p, l);
  }
}

export function diagramOgFallback(slug: DiagramSlugValue, p: DiagramPalette, l: DiagramLabels): string {
  return heroDiagramSvg(slug, p, l);
}
