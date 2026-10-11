import { StepDots } from "./StepDots.tsx";
import { glassClass } from "../glass/glass-styles.ts";
import { Icon } from "../ui/Icon.tsx";

export function QuestionProgress({
  step,
  total,
  backHref,
}: {
  step: number;
  total: number;
  backHref: string;
}) {
  return (
    <div className="question-progress">
      <a
        href={backHref}
        className={glassClass({ thickness: "thin", shape: "disc", className: "back-chevron" })}
        aria-label="Back"
      >
        <Icon name="arrow" />
      </a>
      <StepDots step={step} total={total} />
      <span aria-hidden="true" />
    </div>
  );
}
