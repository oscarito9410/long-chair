import { cn } from "../../lib/cn.ts";
import { hueWashClass } from "../../tokens/hue-styles.ts";
import type { Hue } from "../../tokens/tokens.ts";
import type { IconName } from "./icon-names.ts";
import { Icon } from "./Icon.tsx";
import { IconWell } from "./IconWell.tsx";

type SelectCardProps = {
  checked: boolean;
  onChange: () => void;
  hue: Hue;
  icon: IconName;
  title: string;
  detail: string;
  inputType: "checkbox" | "radio";
  name?: string;
  value?: string;
};

export function SelectCard({
  checked,
  onChange,
  hue,
  icon,
  title,
  detail,
  inputType,
  name,
  value,
}: SelectCardProps) {
  return (
    <label
      className={cn(
        "choice flex cursor-pointer items-center gap-4 rounded-card p-6",
        checked ? cn("pastel-card", hueWashClass[hue]) : "glass",
      )}
    >
      <input
        className="clip-input"
        type={inputType}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <IconWell hue={hue}>
        <Icon name={icon} />
      </IconWell>
      <span className="min-w-0">
        <span className="block text-lg font-bold">{title}</span>
        <span className="mt-1 block text-lg text-ink-soft">{detail}</span>
      </span>
    </label>
  );
}
