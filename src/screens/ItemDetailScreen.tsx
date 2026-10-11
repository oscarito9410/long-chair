import { useCallback } from "react";
import { CoverArt } from "../components/art/CoverArt.tsx";
import { CoverBadge } from "../components/art/CoverBadge.tsx";
import { BottomSheet } from "../components/chrome/BottomSheet.tsx";
import { BecauseChip } from "../components/ui/BecauseChip.tsx";
import { EmptyState } from "../components/ui/EmptyState.tsx";
import { kindMeta } from "../content/presentation.ts";
import { itemThemeCheck } from "../content/screen-copy.ts";
import { itemById } from "../data/catalog.ts";
import type { CatalogItem, SessionDraft } from "../data/types.ts";
import { formatHoursMinutes } from "../lib/format-duration.ts";
import { matchingSeedNames } from "../lib/match-taste.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

const titleId = "item-sheet-title";

export function ItemDetailScreen({ itemId }: { itemId: string }) {
  const { draft } = useSession();
  const item = itemById(itemId);
  const close = useCallback(() => {
    window.location.hash = paths.kit;
  }, []);

  return (
    <BottomSheet
      onClose={close}
      labelledBy={item ? titleId : undefined}
      label={item ? undefined : "That piece is not on the shelf"}
    >
      {item ? (
        <ItemBody item={item} draft={draft} />
      ) : (
        <EmptyState
          heading="h1"
          title="That piece is not on the shelf"
          href={paths.kit}
          action="Back to the kit"
        />
      )}
    </BottomSheet>
  );
}

function ItemBody({ item, draft }: { item: CatalogItem; draft: SessionDraft }) {
  const meta = kindMeta[item.kind];
  const because = matchingSeedNames(item, draft)[0];

  return (
    <div className="flex flex-col gap-4" data-screen="item">
      <div className="cover-frame">
        <CoverArt
          seed={item.id}
          title={item.title}
          hue={meta.hue}
          kind={item.kind}
          frame="poster"
          decorative
        />
        <CoverBadge icon={meta.icon} label={meta.label} />
      </div>
      <h1 id={titleId} className="text-4xl font-extrabold leading-tight">
        {item.title}
      </h1>
      <p className="text-lg">{item.maker}</p>
      <p className="text-lg">{formatHoursMinutes(item.minutes)}</p>
      {because ? <BecauseChip name={because} /> : null}
      <p className="text-lg">{itemThemeCheck}</p>
    </div>
  );
}
