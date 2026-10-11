import { CoverArt } from "../components/art/CoverArt.tsx";
import { GlassLink } from "../components/glass/GlassLink.tsx";
import { GlassSurface } from "../components/glass/GlassSurface.tsx";
import { BecauseChip } from "../components/ui/BecauseChip.tsx";
import { EmptyState } from "../components/ui/EmptyState.tsx";
import { Icon } from "../components/ui/Icon.tsx";
import { kindMeta } from "../content/presentation.ts";
import { itemById } from "../data/catalog.ts";
import { formatHoursMinutes } from "../lib/format-duration.ts";
import { avoidedLabels, matchingSeedNames } from "../lib/match-taste.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

function checkedLine(labels: readonly string[]): string {
  if (labels.length === 0) {
    return "Checked: nothing held back";
  }
  return `Checked: no ${labels.map((label) => label.toLowerCase()).join(", ")}`;
}

export function ItemDetailScreen({ itemId }: { itemId: string }) {
  const { draft } = useSession();
  const item = itemById(itemId);

  if (!item) {
    return (
      <div data-screen="item">
        <EmptyState
          heading="h1"
          title="That piece is not on the shelf"
          href={paths.kit}
          action="Back to the kit"
        />
      </div>
    );
  }

  const meta = kindMeta[item.kind];
  const because = matchingSeedNames(item, draft)[0];

  return (
    <div className="flex flex-col gap-6" data-screen="item">
      <GlassLink href={paths.kit} tone="quiet" className="w-full">
        <Icon name="arrow" />
        Back to the kit
      </GlassLink>
      <div className="cover-frame">
        <CoverArt
          seed={item.id}
          title={item.title}
          hue={meta.hue}
          kind={item.kind}
          frame="poster"
          decorative
        />
        <GlassSurface variant="badge" thickness="regular" className="cover-badge px-4 py-2">
          <span className="text-lg font-bold">{formatHoursMinutes(item.minutes)}</span>
        </GlassSurface>
      </div>
      <GlassSurface
        variant="sheet"
        thickness="thick"
        className="detail-sheet flex flex-col gap-4 p-6"
      >
        <h1 className="text-4xl font-extrabold leading-tight">{item.title}</h1>
        <p className="text-lg">{item.maker}</p>
        {because ? <BecauseChip name={because} /> : null}
        <p className="text-lg">{checkedLine(avoidedLabels(item, draft))}</p>
      </GlassSurface>
    </div>
  );
}
