import { cn } from "../../lib/cn.ts";
import type { IconName } from "../ui/icon-names.ts";
import { glassClass } from "../glass/glass-styles.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export type StepState = "pending" | "active" | "done";

const stateHue = {
  pending: "wisteria",
  active: "honey",
  done: "seaglass",
} as const;

export function StepRow({
  title,
  icon,
  state,
}: {
  title: string;
  icon: IconName;
  state: StepState;
}) {
  return (
    <li
      className={cn(
        glassClass({
          thickness: "thin",
          shape: "row",
          tint: state === "active" ? "honey" : undefined,
        }),
        "option-row step-row cursor-default",
        state === "done" && "is-selected",
      )}
      aria-current={state === "active" ? "step" : undefined}
    >
      <IconWell hue={stateHue[state]}>
        <Icon name={state === "done" ? "check" : icon} />
      </IconWell>
      <p className="min-w-0 text-lg font-bold">
        {state === "done" ? <span className="visually-hidden">Done. </span> : null}
        {title}
      </p>
    </li>
  );
}
