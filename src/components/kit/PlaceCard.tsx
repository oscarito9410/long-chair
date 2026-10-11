import { placeMeta } from "../../content/presentation.ts";
import type { NearbyPlace } from "../../data/types.ts";
import { CoverArt } from "../art/CoverArt.tsx";
import { GlassSurface } from "../glass/GlassSurface.tsx";
import { Icon } from "../ui/Icon.tsx";

export function PlaceCard({ place }: { place: NearbyPlace }) {
  const meta = placeMeta[place.kind];
  return (
    <article className="overflow-hidden rounded-card bg-card shadow-[0_12px_32px_var(--lc-shadow)]">
      <div className="cover-frame">
        <CoverArt seed={place.id} title={place.name} hue={meta.hue} frame="banner" decorative />
        <GlassSurface variant="badge" className="cover-badge flex items-center gap-2 px-4 py-2">
          <Icon name={meta.icon} />
          <span className="text-base font-bold">{meta.label}</span>
        </GlassSurface>
      </div>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-2xl font-bold">{place.name}</h3>
        <p className="text-lg leading-relaxed">{place.offer}</p>
        <p className="text-lg font-bold">
          {place.walkMinutes} min walk · open until {place.openUntil} · {place.priceLabel}
        </p>
      </div>
    </article>
  );
}
