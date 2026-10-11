import { CoverArt } from "../components/art/CoverArt.tsx";
import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { glassClass } from "../components/glass/glass-styles.ts";
import { Icon } from "../components/ui/Icon.tsx";
import { IconWell } from "../components/ui/IconWell.tsx";
import { kindMeta } from "../content/presentation.ts";
import { itemById } from "../data/catalog.ts";
import { FALLBACK_COMPARE_ID, plainModelExample } from "../data/comparison.ts";
import type { CatalogItem, PackedSession } from "../data/types.ts";
import { usePackedSession } from "../hooks/use-packed-session.ts";
import { matchingSeedNames, plainThemeLabels } from "../lib/match-taste.ts";
import { useSession } from "../state/SessionContext.tsx";

function keptItem(packed: PackedSession): CatalogItem | undefined {
  for (const slot of packed.slots) {
    const item = itemById(slot.itemId);
    if (item?.kind === "movie") {
      return item;
    }
  }
  return itemById(FALLBACK_COMPARE_ID);
}

export function CompareScreen() {
  const { draft } = useSession();
  const packed = usePackedSession();
  const themes = plainThemeLabels(draft);
  const kept = keptItem(packed);
  const keptMeta = kept ? kindMeta[kept.kind] : undefined;
  const because = kept ? matchingSeedNames(kept, draft)[0] : undefined;

  return (
    <div className="flex flex-col gap-8" data-screen="compare">
      <ScreenIntro
        hero={String(themes.length)}
        caption="themes held back"
        title="What a plain model misses"
      />
      <div className="grid gap-6 md:grid-cols-2">
        <article
          className={glassClass({
            thickness: "thin",
            shape: "card",
            tint: "wisteria",
            className: "flex flex-col gap-4 p-6",
          })}
        >
          <IconWell hue="wisteria">
            <Icon name="x" />
          </IconWell>
          <h2 className="text-2xl font-bold">{plainModelExample.title}</h2>
          <p className="text-lg">A famous story about cancer.</p>
        </article>
        {kept && keptMeta ? (
          <article
            className={glassClass({
              thickness: "thin",
              shape: "card",
              className: "flex flex-col gap-4 p-6",
            })}
          >
            <div className="cover-frame">
              <CoverArt
                seed={kept.id}
                title={kept.title}
                hue={keptMeta.hue}
                kind={kept.kind}
                frame="banner"
                decorative
              />
            </div>
            <IconWell hue="seaglass">
              <Icon name="check" />
            </IconWell>
            <h2 className="text-2xl font-bold">{kept.title}</h2>
            <p className="text-lg">
              {because ? `Because you love ${because}.` : "Kept for the taste, not the plot."}
            </p>
          </article>
        ) : (
          <article
            className={glassClass({
              thickness: "thin",
              shape: "card",
              className: "flex flex-col gap-4 p-6",
            })}
          >
            <h2 className="text-2xl font-bold">Nothing kept yet</h2>
            <p className="text-lg">Add a film you love.</p>
          </article>
        )}
      </div>
    </div>
  );
}
