import { formatHoursMinutes } from "../../lib/format-duration.ts";
import { GlassPanel } from "../glass/GlassPanel.tsx";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export function PauseCard({ minutes }: { minutes: number }) {
  return (
    <GlassPanel>
      <div className="flex items-center gap-4">
        <IconWell hue="honey">
          <Icon name="pause" />
        </IconWell>
        <div>
          <p className="text-2xl font-extrabold">{formatHoursMinutes(minutes)} open</p>
          <p className="text-lg">Unscheduled on purpose. A pause is part of the chair.</p>
        </div>
      </div>
    </GlassPanel>
  );
}
