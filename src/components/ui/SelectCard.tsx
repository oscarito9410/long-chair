import { cn } from "../../lib/cn.ts";
import { hueWashClass } from "../../tokens/hue-styles.ts";
import type { Hue } from "../../tokens/tokens.ts";
import type { IconName } from "./icon-names.ts";
import { Icon } from "./Icon.tsx";
import { IconWell } from "./IconWell.tsx";

type SelectCardCommon = {
  checked: boolean;
  onChange: () => void;
  hue: Hue;
  icon: IconName;
  title: string;
  detail: string;
  selectedLabel: string;
};

type SelectCardProps =
  | (SelectCardCommon & { selection: "toggle" })
  | (SelectCardCommon & { selection: "single"; name: string; value: string });

function TileFace({ checked, hue, icon, title, detail, selectedLabel }: SelectCardCommon) {
  return (
    <>
      <IconWell hue={hue}>
        <Icon name={checked ? "check" : icon} />
      </IconWell>
      <span className="min-w-0">
        <span className="block text-lg font-bold">{title}</span>
        <span className="mt-2 block text-lg text-ink-soft">{detail}</span>
        {checked ? <span className="mt-2 block text-lg font-bold">{selectedLabel}</span> : null}
      </span>
    </>
  );
}

export function SelectCard(props: SelectCardProps) {
  const className = cn(
    "choice-tile flex items-center gap-4 rounded-card p-6",
    props.checked ? hueWashClass[props.hue] : "bg-page",
  );
  const face = <TileFace {...props} />;

  if (props.selection === "single") {
    return (
      <label className={className}>
        <input
          className="clip-input"
          type="radio"
          name={props.name}
          value={props.value}
          checked={props.checked}
          onChange={props.onChange}
        />
        {face}
      </label>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-pressed={props.checked}
      onClick={props.onChange}
    >
      {face}
    </button>
  );
}
