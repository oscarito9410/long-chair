import { cn } from "../../lib/cn.ts";
import { hueWashClass } from "../../tokens/hue-styles.ts";
import type { Hue } from "../../tokens/tokens.ts";
import { AvoidedRow } from "../ui/AvoidedRow.tsx";
import { BecauseList } from "../ui/BecauseList.tsx";
import type { IconName } from "../ui/icon-names.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export type TimelineCardProps = {
  href: string;
  startLabel: string;
  endLabel: string;
  kindLabel: string;
  title: string;
  maker: string;
  hue: Hue;
  icon: IconName;
  because: readonly string[];
  avoided: readonly string[];
};

export function TimelineCard({
  href,
  startLabel,
  endLabel,
  kindLabel,
  title,
  maker,
  hue,
  icon,
  because,
  avoided,
}: TimelineCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "pastel-card flex flex-col gap-4 rounded-card p-6 sm:flex-row",
        hueWashClass[hue],
      )}
    >
      <div className="shrink-0">
        <p className="text-2xl font-extrabold">{startLabel}</p>
        <p className="text-lg text-ink-soft">to {endLabel}</p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex items-start gap-4">
          <IconWell hue={hue}>
            <Icon name={icon} />
          </IconWell>
          <div className="min-w-0">
            <p className="text-lg font-bold">{kindLabel}</p>
            <p className="text-2xl font-extrabold">{title}</p>
            <p className="text-lg">{maker}</p>
          </div>
        </div>
        <BecauseList names={because} />
        <AvoidedRow labels={avoided} />
      </div>
    </a>
  );
}
