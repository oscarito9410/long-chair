import { CoverArt } from "../components/art/CoverArt.tsx";
import { CoverBadge } from "../components/art/CoverBadge.tsx";
import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { glassClass } from "../components/glass/glass-styles.ts";
import { Icon } from "../components/ui/Icon.tsx";
import { IconWell } from "../components/ui/IconWell.tsx";
import { ThemeBadge } from "../components/ui/ThemeBadge.tsx";
import { kindMeta } from "../content/presentation.ts";
import { itemById } from "../data/catalog.ts";
import { FALLBACK_COMPARE_ID, plainModelExample } from "../data/comparison.ts";
import type { CatalogItem, PackedSession } from "../data/types.ts";
import { usePackedSession } from "../hooks/use-packed-session.ts";
import { compareBroughtLabels } from "../lib/compare-brought.ts";
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
  const because = kept ? matchingSeedNames(kept, draft)[0] : undefined;

  return (
    <div className="flex flex-col gap-8" data-screen="compare">
      <ScreenIntro
        hero={String(themes.length)}
        caption="themes held back"
        title="What a plain model misses"
      />
      <div className="compare-grid">
        <PlainMiss />
        <KeptPanel item={kept} because={because} />
      </div>
    </div>
  );
}

function PlainMiss() {
  const brought = compareBroughtLabels();
  return (
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
      <p className="text-lg font-bold">Would bring:</p>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Would bring">
        {brought.map((label) => (
          <li key={label}>
            <ThemeBadge label={label} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function KeptPanel({
  item,
  because,
}: {
  item: CatalogItem | undefined;
  because: string | undefined;
}) {
  const meta = item ? kindMeta[item.kind] : undefined;
  if (!item || !meta) {
    return (
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
    );
  }

  return (
    <article
      className={glassClass({
        thickness: "thin",
        shape: "card",
        className: "flex flex-col gap-4 p-6",
      })}
    >
      <div className="cover-frame">
        <CoverArt
          seed={item.id}
          title={item.title}
          hue={meta.hue}
          kind={item.kind}
          frame="banner"
          decorative
        />
        <CoverBadge icon={meta.icon} label={meta.label} />
      </div>
      <IconWell hue="seaglass">
        <Icon name="check" />
      </IconWell>
      <h2 className="text-2xl font-bold">{item.title}</h2>
      <p className="text-lg">
        {because ? `Because you love ${because}.` : "Kept for the taste, not the plot."}
      </p>
    </article>
  );
}
