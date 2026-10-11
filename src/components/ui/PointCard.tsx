import { cn } from "../../lib/cn.ts";
import { hueWashClass } from "../../tokens/hue-styles.ts";
import type { Hue } from "../../tokens/tokens.ts";
import type { IconName } from "./icon-names.ts";
import { Icon } from "./Icon.tsx";
import { IconWell } from "./IconWell.tsx";

type PointCardProps = {
  hue: Hue;
  icon: IconName;
  title: string;
  body: string;
};

export function PointCard({ hue, icon, title, body }: PointCardProps) {
  return (
    <article className={cn("pastel-card flex flex-col gap-4 rounded-card p-6", hueWashClass[hue])}>
      <IconWell hue={hue}>
        <Icon name={icon} />
      </IconWell>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-lg leading-relaxed">{body}</p>
    </article>
  );
}
