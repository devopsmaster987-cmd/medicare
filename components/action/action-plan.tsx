export type ActionStep = {
  title: string;
  detail: string;
};

export function ActionPlan({
  title = 'What to do next',
  steps,
}: {
  title?: string;
  steps: ActionStep[];
}) {
  return (
    <section className="action-plan" aria-labelledby="action-plan-title">
      <h2 className="action-plan-title" id="action-plan-title">
        {title}
      </h2>
      <ol className="action-plan-list">
        {steps.map((step) => (
          <li className="action-plan-item" key={step.title}>
            <div>
              <strong>{step.title}</strong>
              <span>{step.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
