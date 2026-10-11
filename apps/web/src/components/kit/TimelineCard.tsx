import type { ContentKind } from "@long-chair/core";
import type { Hue } from "../../tokens/tokens.ts";
import { CoverArt } from "../art/CoverArt.tsx";
import { CoverBadge } from "../art/CoverBadge.tsx";
import { glassClass, onGlassPointerMove } from "../glass/glass-styles.ts";
import { BecauseChip } from "../ui/BecauseChip.tsx";
import type { IconName } from "../ui/icon-names.ts";

export type TimelineCardProps = {
  href: string;
  seed: string;
  rangeLabel: string;
  kindLabel: string;
  kind: ContentKind;
  title: string;
  hue: Hue;
  icon: IconName;
  because?: string;
};

export function TimelineCard({
  href,
  seed,
  rangeLabel,
  kindLabel,
  kind,
  title,
  hue,
  icon,
  because,
}: TimelineCardProps) {
  return (
    <a href={href} className="kit-shell">
      <span className="kit-clip">
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
            <CoverBadge icon={icon} label={kindLabel} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <p className="text-lg">{rangeLabel}</p>
            <p className="text-2xl font-extrabold">{title}</p>
            {because ? <BecauseChip name={because} /> : null}
          </div>
        </span>
      </span>
    </a>
  );
}
