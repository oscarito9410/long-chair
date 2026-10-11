import { cn } from "../../lib/cn.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export type StepState = "pending" | "active" | "done";

const stateHue = {
  pending: "wisteria",
  active: "honey",
  done: "seaglass",
} as const;

export function StepRow({
  index,
  title,
  detail,
  state,
}: {
  index: number;
  title: string;
  detail: string;
  state: StepState;
}) {
  return (
    <li
      className={cn(
        "option-row cursor-default",
        state === "done" && "is-selected",
        state === "active" && "wash-honey",
      )}
      aria-current={state === "active" ? "step" : undefined}
    >
      <IconWell hue={stateHue[state]}>
        {state === "done" ? (
          <Icon name="check" />
        ) : (
          <span className="text-lg font-extrabold">{index + 1}</span>
        )}
      </IconWell>
      <div className="min-w-0">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-lg text-ink-soft">{detail}</p>
      </div>
    </li>
  );
}
