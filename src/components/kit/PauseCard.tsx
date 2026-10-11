import { formatHoursMinutes } from "../../lib/format-duration.ts";
import { glassClass } from "../glass/glass-styles.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export function PauseCard({ minutes }: { minutes: number }) {
  return (
    <article
      className={glassClass({
        thickness: "thin",
        shape: "card",
        tint: "honey",
        className: "flex items-center gap-4 p-6",
      })}
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
