import { cn } from "../../lib/cn.ts";
import { formatHoursMinutes } from "../../lib/format-duration.ts";
import { hueWashClass } from "../../tokens/hue-styles.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export function PauseCard({ minutes }: { minutes: number }) {
  return (
    <article
      className={cn("pastel-card flex items-center gap-4 rounded-card p-6", hueWashClass.honey)}
    >
      <IconWell hue="honey">
        <Icon name="pause" />
      </IconWell>
      <div>
        <p className="text-2xl font-extrabold">{formatHoursMinutes(minutes)} open</p>
        <p className="text-lg">Unscheduled on purpose. A pause is part of the chair.</p>
      </div>
    </article>
  );
}
