import { cn } from "../../lib/cn.ts";
import { hueWashClass } from "../../tokens/hue-styles.ts";
import type { Hue } from "../../tokens/tokens.ts";
import { BecauseList } from "../ui/BecauseList.tsx";
import { ThemeCheck } from "../ui/ThemeCheck.tsx";
import type { IconName } from "../ui/icon-names.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export type TimelineCardProps = {
  href: string;
  rangeLabel: string;
  kindLabel: string;
  title: string;
  maker: string;
  hue: Hue;
  icon: IconName;
  because: readonly string[];
  themeCount: number;
  exceptions: readonly string[];
};

export function TimelineCard({
  href,
  rangeLabel,
  kindLabel,
  title,
  maker,
  hue,
  icon,
  because,
  themeCount,
  exceptions,
}: TimelineCardProps) {
  return (
    <a
      href={href}
      className={cn("pastel-card flex flex-col gap-4 rounded-card p-6", hueWashClass[hue])}
    >
      <p className="text-lg font-normal">{rangeLabel}</p>
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
      <ThemeCheck count={themeCount} exceptions={exceptions} />
    </a>
  );
}
