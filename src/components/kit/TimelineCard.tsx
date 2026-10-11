import type { Hue } from "../../tokens/tokens.ts";
import { CoverArt } from "../art/CoverArt.tsx";
import { GlassSurface } from "../glass/GlassSurface.tsx";
import { BecauseList } from "../ui/BecauseList.tsx";
import { ThemeCheck } from "../ui/ThemeCheck.tsx";
import type { IconName } from "../ui/icon-names.ts";
import { Icon } from "../ui/Icon.tsx";

export type TimelineCardProps = {
  href: string;
  seed: string;
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
  seed,
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
    <a href={href} className="kit-card">
      <div className="cover-frame kit-cover">
        <CoverArt seed={seed} title={title} hue={hue} frame="square" decorative />
        <GlassSurface variant="badge" className="cover-badge flex items-center gap-2 px-4 py-2">
          <Icon name={icon} />
          <span className="text-base font-bold">{kindLabel}</span>
        </GlassSurface>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="text-lg font-normal">{rangeLabel}</p>
        <div>
          <p className="text-2xl font-extrabold">{title}</p>
          <p className="text-lg">{maker}</p>
        </div>
        <BecauseList names={because} />
        <ThemeCheck count={themeCount} exceptions={exceptions} />
      </div>
    </a>
  );
}
