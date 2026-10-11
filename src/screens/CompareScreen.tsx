import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { SectionHeading } from "../components/ui/SectionHeading.tsx";
import { SolidPanel } from "../components/ui/SolidPanel.tsx";
import { tagClass } from "../components/ui/tag-class.ts";
import { AvoidedRow } from "../components/ui/AvoidedRow.tsx";
import { BecauseList } from "../components/ui/BecauseList.tsx";
import { kindMeta } from "../content/presentation.ts";
import { itemById } from "../data/catalog.ts";
import { FALLBACK_COMPARE_ID, plainModelExample } from "../data/comparison.ts";
import type { CatalogItem, PackedSession } from "../data/types.ts";
import { avoidedLabels, matchingSeedNames, plainThemeLabels } from "../lib/match-taste.ts";
import { cn } from "../lib/cn.ts";
import { hueWashClass } from "../tokens/hue-styles.ts";
import { usePackedSession } from "../hooks/use-packed-session.ts";
import { useSession } from "../state/SessionContext.tsx";
import { Icon } from "../components/ui/Icon.tsx";
import { IconWell } from "../components/ui/IconWell.tsx";

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

  return (
    <div className="flex flex-col gap-8" data-screen="compare">
      <ScreenIntro
        hero={String(themes.length)}
        caption="themes held back"
        title="What a plain model misses"
        lede="Asked for comfort during treatment, a general model often reaches for a famous illness story. Long Chair starts from taste and refuses those themes."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <article className="pastel-card flex flex-col gap-4 rounded-card p-6 wash-wisteria">
          <IconWell hue="wisteria">
            <Icon name="aside" />
          </IconWell>
          <p className="text-lg font-bold">Often suggested, unfiltered</p>
          <h2 className="text-2xl font-bold">{plainModelExample.title}</h2>
          <p className="text-lg">{plainModelExample.meta}</p>
          <p className="text-lg leading-relaxed">{plainModelExample.summary}</p>
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold">Would come with it</p>
            {themes.length === 0 ? (
              <p className="text-lg text-ink-soft">You have not asked to hold any themes back.</p>
            ) : (
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {themes.map((label) => (
                  <li key={label}>
                    <span className={cn(tagClass, "bg-wisteria-deep text-page")}>{label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
        {kept && keptMeta ? (
          <article
            className={cn(
              "pastel-card flex flex-col gap-4 rounded-card p-6",
              hueWashClass[keptMeta.hue],
            )}
          >
            <IconWell hue={keptMeta.hue}>
              <Icon name={keptMeta.icon} />
            </IconWell>
            <p className="text-lg font-bold">Long Chair kept</p>
            <h2 className="text-2xl font-bold">{kept.title}</h2>
            <p className="text-lg">{kept.maker}</p>
            <p className="text-lg leading-relaxed">{kept.why}</p>
            <BecauseList names={matchingSeedNames(kept, draft)} />
            <AvoidedRow labels={avoidedLabels(kept, draft)} />
          </article>
        ) : (
          <SolidPanel>
            <SectionHeading>Nothing kept yet</SectionHeading>
            <p className="mt-4 text-lg">Add a film you love and the contrast will fill in.</p>
          </SolidPanel>
        )}
      </div>
      <p className="text-lg">
        The unfiltered title is a real book, named only as the miss. Every Long Chair title is
        fictional.
      </p>
    </div>
  );
}
