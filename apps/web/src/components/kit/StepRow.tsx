import { cn } from "../../lib/cn.ts";
import type { StepState } from "@long-chair/core";
import { glassClass } from "../glass/glass-styles.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export function StepRow({ title, state }: { title: string; state: StepState }) {
  return (
    <li
      className={cn(
        glassClass({
          thickness: "thin",
          shape: "row",
          tint: state === "active" ? "honey" : undefined,
        }),
        "option-row step-row cursor-default",
      )}
      aria-current={state === "active" ? "step" : undefined}
    >
      <StepMark state={state} />
      <p className="min-w-0 text-lg font-bold">
        {state === "active" ? <span className="step-now-label">Now</span> : null}
        {state === "done" ? <span className="visually-hidden">Done. </span> : null}
        {state === "pending" ? <span className="visually-hidden">Waiting. </span> : null}
        {title}
      </p>
    </li>
  );
}

function StepMark({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <IconWell hue="seaglass">
        <Icon name="check" />
      </IconWell>
    );
  }
  if (state === "active") {
    return (
      <span className="step-live-well">
        <span className="step-pulse" />
      </span>
    );
  }
  return <span className="step-well-empty" />;
}
