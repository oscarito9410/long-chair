import { placeMeta } from "../../content/presentation.ts";
import type { NearbyPlace } from "@long-chair/core";
import { CoverArt } from "../art/CoverArt.tsx";
import { CoverBadge } from "../art/CoverBadge.tsx";
import { glassClass } from "../glass/glass-styles.ts";

export function PlaceCard({ place }: { place: NearbyPlace }) {
  const meta = placeMeta[place.kind];
  return (
    <article className="place-shell">
      <div className="cover-frame">
        <CoverArt
          seed={place.id}
          title={place.name}
          hue={meta.hue}
          kind={place.kind}
          frame="banner"
          decorative
        />
        <CoverBadge icon={meta.icon} label={meta.label} />
      </div>
      <div
        className={glassClass({
          thickness: "thin",
          shape: "card",
          tint: meta.hue,
          className: "place-body flex flex-col gap-2",
        })}
      >
        <h3 className="text-2xl font-bold">{place.name}</h3>
        <p className="text-lg font-bold">{place.walkMinutes} min walk · Open now</p>
      </div>
    </article>
  );
}
