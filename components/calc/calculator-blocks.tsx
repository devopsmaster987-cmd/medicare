import type { ReactNode } from 'react';

export function ShowMath({ children }: { children: ReactNode }) {
  return (
    <details className="show-math">
      <summary>Show the math</summary>
      <div className="show-math-body">{children}</div>
    </details>
  );
}

export function ScenarioCompare({
  currentLabel,
  currentValue,
  alternateLabel,
  alternateValue,
  rows,
  children,
}: {
  currentLabel: string;
  currentValue: string;
  alternateLabel: string;
  alternateValue: string;
  rows: Array<{ label: string; current: string; alternate: string }>;
  children?: ReactNode;
}) {
  return (
    <section className="scenario-compare" aria-labelledby="scenario-title">
      <h2 id="scenario-title">Scenario compare</h2>
      <p>
        Change one fact to see how the answer moves. The alternate column uses the same rules and
        the same sources.
      </p>
      {children}
      <div className="scenario-values">
        <div>
          <span>{currentLabel}</span>
          <strong>{currentValue}</strong>
        </div>
        <div>
          <span>{alternateLabel}</span>
          <strong>{alternateValue}</strong>
        </div>
      </div>
      <div className="table-scroll">
        <table className="fact-table">
          <thead>
            <tr>
              <th scope="col">Result</th>
              <th scope="col">Current</th>
              <th scope="col">Alternate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.current}</td>
                <td>{row.alternate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function StickySummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="sticky-summary no-print">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <a className="button button-primary" href="#action-plan-title">
        Next step
      </a>
    </div>
  );
}
