import { cn } from "../../lib/cn.ts";
import { hueWashClass } from "../../tokens/hue-styles.ts";
import type { Hue } from "../../tokens/tokens.ts";
import type { IconName } from "../ui/icon-names.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export function TopicCard({
  title,
  prompt,
  hue,
  icon,
}: {
  title: string;
  prompt: string;
  hue: Hue;
  icon: IconName;
}) {
  return (
    <article className={cn("pastel-card flex flex-col gap-4 rounded-card p-6", hueWashClass[hue])}>
      <IconWell hue={hue}>
        <Icon name={icon} />
      </IconWell>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-lg leading-relaxed">{prompt}</p>
    </article>
  );
}
