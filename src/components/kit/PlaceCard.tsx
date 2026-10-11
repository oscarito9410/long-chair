import { placeMeta } from "../../content/presentation.ts";
import { cn } from "../../lib/cn.ts";
import { hueWashClass } from "../../tokens/hue-styles.ts";
import type { NearbyPlace } from "../../data/types.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export function PlaceCard({ place }: { place: NearbyPlace }) {
  const meta = placeMeta[place.kind];
  return (
    <article
      className={cn("pastel-card flex flex-col gap-4 rounded-card p-6", hueWashClass[meta.hue])}
    >
      <div className="flex items-start gap-4">
        <IconWell hue={meta.hue}>
          <Icon name={meta.icon} />
        </IconWell>
        <div>
          <p className="text-lg font-bold">{meta.label}</p>
          <h3 className="text-2xl font-bold">{place.name}</h3>
        </div>
      </div>
      <p className="text-lg leading-relaxed">{place.offer}</p>
      <p className="text-lg font-bold">
        {place.walkMinutes} min walk · open until {place.openUntil} · {place.priceLabel}
      </p>
    </article>
  );
}
