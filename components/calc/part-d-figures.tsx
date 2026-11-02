import { formatMoney, formatPercent } from '@/lib/utils';

type TimelineRow = {
  label: string;
  penalty: number;
  rate: number;
};

export function PartDPenaltyTimeline({
  rows,
  basePremium,
  sourceUrl,
  sourceName,
  checkedOn,
}: {
  rows: TimelineRow[];
  basePremium: number;
  sourceUrl: string;
  sourceName: string;
  checkedOn: string;
}) {
  const maxPenalty = Math.max(...rows.map((row) => row.penalty), 1);
  const baseline = 276;
  const barWidth = 68;
  const gap = 26;
  const startX = 78;
  return (
    <figure className="calc-diagram">
      <div
        className="calc-diagram-frame"
        role="img"
        aria-label={`Part D late enrollment penalty calculator: bar chart of the penalty after 1, 6, 12, 24, and 36 months without creditable drug coverage, based on the ${formatMoney(basePremium)} national base beneficiary premium.`}
      >
        <svg viewBox="0 0 600 338" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="1"
            y="1"
            width="598"
            height="336"
            rx="8"
            fill="var(--diagram-field)"
            stroke="var(--diagram-soft)"
            strokeWidth="2"
          />
          <text x="40" y="44" fontSize="22" fontWeight="700" fill="var(--diagram-ink)">
            Penalty grows with every uncovered month
          </text>
          <text x="40" y="68" fontSize="15" fill="var(--diagram-muted)">
            Monthly penalty at the {formatMoney(basePremium)} national base beneficiary premium
          </text>
          <line
            x1="40"
            y1={baseline}
            x2="560"
            y2={baseline}
            stroke="var(--diagram-muted)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          {rows.map((row, index) => {
            const x = startX + index * (barWidth + gap);
            const height = Math.max(6, Math.round((row.penalty / maxPenalty) * 168));
            const top = baseline - height;
            return (
              <g key={row.label}>
                <rect
                  x={x}
                  y={top}
                  width={barWidth}
                  height={height}
                  rx="4"
                  fill="var(--diagram-soft)"
                  stroke="var(--diagram-ink)"
                  strokeWidth="2"
                />
                <text
                  x={x + barWidth / 2}
                  y={top - 10}
                  fontSize="16"
                  fontWeight="700"
                  textAnchor="middle"
                  fill="var(--diagram-accent)"
                >
                  {formatMoney(row.penalty)}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={baseline + 24}
                  fontSize="15"
                  fontWeight="600"
                  textAnchor="middle"
                  fill="var(--diagram-ink)"
                >
                  {row.label}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={baseline + 44}
                  fontSize="14"
                  textAnchor="middle"
                  fill="var(--diagram-muted)"
                >
                  {formatPercent(row.rate, 0)} rate
                </text>
              </g>
            );
          })}
          <text x="40" y="318" fontSize="14" fill="var(--diagram-muted)">
            Rounded to the nearest 10 cents. The penalty is generally permanent.
          </text>
        </svg>
      </div>
      <figcaption className="calc-diagram-caption">
        Illustration. The Part D penalty timeline uses the national base beneficiary premium and the
        1% rate for each uncovered month. Figures checked{' '}
        <time dateTime={checkedOn}>{checkedOn}</time>. Source:{' '}
        <a href={sourceUrl}>{sourceName}</a>.
      </figcaption>
    </figure>
  );
}

export function PartDCoverageDecision({
  sourceUrl,
  sourceName,
  checkedOn,
}: {
  sourceUrl: string;
  sourceName: string;
  checkedOn: string;
}) {
  return (
    <figure className="calc-diagram">
      <div
        className="calc-diagram-frame"
        role="img"
        aria-label="Flowchart asking whether a written creditable drug coverage notice covers the gap. If yes, ask Medicare to review the penalty. If no or not sure, the months usually count."
      >
        <svg viewBox="0 0 600 338" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="1"
            y="1"
            width="598"
            height="336"
            rx="8"
            fill="var(--diagram-field)"
            stroke="var(--diagram-soft)"
            strokeWidth="2"
          />
          <rect
            x="150"
            y="28"
            width="300"
            height="54"
            rx="6"
            fill="var(--diagram-soft)"
            stroke="var(--diagram-ink)"
            strokeWidth="2"
          />
          <text
            x="300"
            y="61"
            fontSize="18"
            fontWeight="700"
            textAnchor="middle"
            fill="var(--diagram-ink)"
          >
            Did you have a gap in drug coverage?
          </text>
          <line x1="300" y1="82" x2="300" y2="112" stroke="var(--diagram-muted)" strokeWidth="2" />
          <path d="M 300 112 L 292 102 L 308 102 Z" fill="var(--diagram-muted)" />
          <rect
            x="120"
            y="118"
            width="360"
            height="62"
            rx="6"
            fill="var(--diagram-field)"
            stroke="var(--diagram-ink)"
            strokeWidth="2"
          />
          <text
            x="300"
            y="144"
            fontSize="17"
            fontWeight="700"
            textAnchor="middle"
            fill="var(--diagram-ink)"
          >
            Does a written notice confirm
          </text>
          <text
            x="300"
            y="166"
            fontSize="17"
            fontWeight="700"
            textAnchor="middle"
            fill="var(--diagram-ink)"
          >
            creditable coverage for the whole gap?
          </text>
          <line x1="210" y1="180" x2="150" y2="220" stroke="var(--diagram-muted)" strokeWidth="2" />
          <path d="M 150 220 L 152 208 L 162 215 Z" fill="var(--diagram-muted)" />
          <line x1="390" y1="180" x2="450" y2="220" stroke="var(--diagram-muted)" strokeWidth="2" />
          <path d="M 450 220 L 438 215 L 448 208 Z" fill="var(--diagram-muted)" />
          <rect
            x="36"
            y="226"
            width="228"
            height="82"
            rx="6"
            fill="var(--diagram-soft)"
            stroke="var(--diagram-ink)"
            strokeWidth="2"
          />
          <text x="150" y="254" fontSize="16" fontWeight="700" textAnchor="middle" fill="var(--diagram-ink)">
            Yes
          </text>
          <text x="150" y="278" fontSize="15" textAnchor="middle" fill="var(--diagram-ink)">
            Ask Medicare to review.
          </text>
          <text x="150" y="298" fontSize="15" textAnchor="middle" fill="var(--diagram-ink)">
            Keep the plan notice.
          </text>
          <rect
            x="336"
            y="226"
            width="228"
            height="82"
            rx="6"
            fill="var(--diagram-field)"
            stroke="var(--diagram-accent)"
            strokeWidth="2"
          />
          <text x="450" y="254" fontSize="16" fontWeight="700" textAnchor="middle" fill="var(--diagram-accent)">
            No or not sure
          </text>
          <text x="450" y="278" fontSize="15" textAnchor="middle" fill="var(--diagram-ink)">
            The months usually count.
          </text>
          <text x="450" y="298" fontSize="15" textAnchor="middle" fill="var(--diagram-ink)">
            Get the notice before paying.
          </text>
          <text x="300" y="328" fontSize="13" textAnchor="middle" fill="var(--diagram-muted)">
            A few days inside a month do not add a month; enrollment records set the month count.
          </text>
        </svg>
      </div>
      <figcaption className="calc-diagram-caption">
        Illustration. The decision path follows Medicare&apos;s creditable coverage and penalty
        review rules. Figures checked <time dateTime={checkedOn}>{checkedOn}</time>. Source:{' '}
        <a href={sourceUrl}>{sourceName}</a>.
      </figcaption>
    </figure>
  );
}

export function PartDWorkedExampleGraphic({
  months,
  rate,
  basePremium,
  unrounded,
  rounded,
  sourceUrl,
  sourceName,
  checkedOn,
}: {
  months: number;
  rate: number;
  basePremium: number;
  unrounded: number;
  rounded: number;
  sourceUrl: string;
  sourceName: string;
  checkedOn: string;
}) {
  return (
    <figure className="calc-diagram">
      <div
        className="calc-diagram-frame"
        role="img"
        aria-label={`Worked example showing ${months} months times ${formatPercent(rate, 0)} times ${formatMoney(basePremium)} equals about ${formatMoney(unrounded)}, rounded to ${formatMoney(rounded)} per month.`}
      >
        <svg viewBox="0 0 600 338" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="1"
            y="1"
            width="598"
            height="336"
            rx="8"
            fill="var(--diagram-field)"
            stroke="var(--diagram-soft)"
            strokeWidth="2"
          />
          <text x="40" y="44" fontSize="22" fontWeight="700" fill="var(--diagram-ink)">
            Worked example, step by step
          </text>
          <text x="40" y="68" fontSize="15" fill="var(--diagram-muted)">
            The same inputs the calculator uses, written out.
          </text>
          <g fontSize="17" fill="var(--diagram-ink)">
            <text x="44" y="116">Uncovered months</text>
            <text x="556" y="116" textAnchor="end" fontWeight="700">
              {months}
            </text>
            <line x1="44" y1="132" x2="556" y2="132" stroke="var(--diagram-soft)" strokeWidth="2" />
            <text x="44" y="166">Penalty rate, 1% per month</text>
            <text x="556" y="166" textAnchor="end" fontWeight="700">
              {formatPercent(rate, 0)}
            </text>
            <line x1="44" y1="182" x2="556" y2="182" stroke="var(--diagram-soft)" strokeWidth="2" />
            <text x="44" y="216">National base premium</text>
            <text x="556" y="216" textAnchor="end" fontWeight="700">
              {formatMoney(basePremium)}
            </text>
            <line x1="44" y1="232" x2="556" y2="232" stroke="var(--diagram-soft)" strokeWidth="2" />
          </g>
          <text x="44" y="268" fontSize="16" fill="var(--diagram-muted)">
            {months} x {formatPercent(rate, 0)} x {formatMoney(basePremium)} ={' '}
            {formatMoney(unrounded)}
          </text>
          <rect
            x="352"
            y="246"
            width="204"
            height="56"
            rx="6"
            fill="var(--diagram-soft)"
            stroke="var(--diagram-accent)"
            strokeWidth="2"
          />
          <text x="454" y="272" fontSize="15" textAnchor="middle" fill="var(--diagram-ink)">
            Rounded monthly penalty
          </text>
          <text
            x="454"
            y="294"
            fontSize="20"
            fontWeight="700"
            textAnchor="middle"
            fill="var(--diagram-accent)"
          >
            {formatMoney(rounded)}
          </text>
          <text x="40" y="326" fontSize="13" fill="var(--diagram-muted)">
            Medicare rounds the monthly penalty to the nearest 10 cents.
          </text>
        </svg>
      </div>
      <figcaption className="calc-diagram-caption">
        Illustration. Arithmetic checked <time dateTime={checkedOn}>{checkedOn}</time>. Source:{' '}
        <a href={sourceUrl}>{sourceName}</a>.
      </figcaption>
    </figure>
  );
}
