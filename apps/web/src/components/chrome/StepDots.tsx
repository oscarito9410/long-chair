import { cn } from "../../lib/cn.ts";

export function StepDots({ step, total }: { step: number; total: number }) {
  const dots = Array.from({ length: total }, (_, index) => index + 1);
  return (
    <ol className="step-dots" aria-label={`Step ${step} of ${total}`}>
      {dots.map((dot) => {
        const current = dot === step;
        return (
          <li key={dot}>
            <span className={cn("step-dot", current && "is-current")} />
            {current ? <span className="visually-hidden">Current</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
