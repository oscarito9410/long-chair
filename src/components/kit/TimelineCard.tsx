import type { ContentKind } from "../../data/types.ts";
import type { Hue } from "../../tokens/tokens.ts";
import { CoverArt } from "../art/CoverArt.tsx";
import { GlassSurface } from "../glass/GlassSurface.tsx";
import { glassClass, onGlassPointerMove } from "../glass/glass-styles.ts";
import { BecauseList } from "../ui/BecauseList.tsx";
import { ThemeCheck } from "../ui/ThemeCheck.tsx";
import type { IconName } from "../ui/icon-names.ts";
import { Icon } from "../ui/Icon.tsx";

export type TimelineCardProps = {
  href: string;
  seed: string;
  rangeLabel: string;
  kindLabel: string;
  kind: ContentKind;
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
  kind,
  title,
  maker,
  hue,
  icon,
  because,
  themeCount,
  exceptions,
}: TimelineCardProps) {
  return (
    <a href={href} className="kit-shell">
      <span className="kit-bleed" aria-hidden="true">
        <CoverArt seed={seed} title={title} hue={hue} kind={kind} frame="square" decorative />
      </span>
      <span
        className={glassClass({
          thickness: "thick",
          shape: "card",
          press: true,
          follow: true,
          className: "kit-face",
        })}
        onPointerMove={onGlassPointerMove}
      >
        <div className="cover-frame kit-cover">
          <CoverArt seed={seed} title={title} hue={hue} kind={kind} frame="square" decorative />
          <GlassSurface
            variant="badge"
            thickness="regular"
            className="cover-badge flex items-center gap-2 px-4 py-2"
          >
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
      </span>
    </a>
  );
}
