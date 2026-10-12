import { useCallback, useState } from "react";
import { CoverArt } from "../components/art/CoverArt.tsx";
import { CoverBadge } from "../components/art/CoverBadge.tsx";
import { BottomSheet } from "../components/chrome/BottomSheet.tsx";
import { BecauseChip } from "../components/ui/BecauseChip.tsx";
import { EmptyState } from "../components/ui/EmptyState.tsx";
import { kindMeta } from "../content/presentation.ts";
import {
  avoidThemes,
  customThemesOf,
  evidenceSampleNote,
  explainItem,
  formatHoursMinutes,
  itemById,
  justWatchCredit,
  sampleWatchNote,
  matchingSeedNames,
  whyItPassed,
} from "@long-chair/core";
import type { CatalogItem, CustomTheme, SessionDraft, ThemeVerdict } from "@long-chair/core";
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

function verdictName(verdict: ThemeVerdict, custom: readonly CustomTheme[]): string {
  const known = avoidThemes.find((theme) => theme.id === verdict.themeId);
  const added = custom.find((theme) => theme.id === verdict.themeId);
  return known?.label ?? added?.label ?? verdict.themeId;
}

function evidenceCopy(item: CatalogItem, draft: SessionDraft): string[] {
  const custom = customThemesOf(draft.customThemes);
  return explainItem(item, draft.avoidIds, custom).map((verdict) => {
    const detail = verdict.evidence.map((entry) => entry.detail).join(" ");
    return `${verdictName(verdict, custom)}: ${verdict.verdict}. ${detail}`;
  });
}

function ItemBody({ item, draft }: { item: CatalogItem; draft: SessionDraft }) {
  const meta = kindMeta[item.kind];
  const because = matchingSeedNames(item, draft)[0];
  const [open, setOpen] = useState(false);
  const lines = evidenceCopy(item, draft);

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
      {item.durationNote ? <p className="text-base">{item.durationNote}</p> : null}
      {because ? <BecauseChip name={because} /> : null}
      {item.links?.map((link) => (
        <a key={link.href} className="theme-add-button" href={link.href}>
          {link.label}
        </a>
      ))}
      {item.watchProviders && item.watchProviders.length > 0 ? (
        <div>
          <p className="text-base">{sampleWatchNote}</p>
          <ul className="evidence-list">
            {item.watchProviders.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p className="text-base">{justWatchCredit}</p>
        </div>
      ) : null}
      <button
        type="button"
        className="theme-add-button"
        onClick={() => {
          setOpen(true);
        }}
      >
        {whyItPassed}
      </button>
      {open ? (
        <div className="evidence-sheet" role="dialog" aria-label={whyItPassed}>
          <p className="text-lg font-bold">{whyItPassed}</p>
          <p className="text-base">{evidenceSampleNote}</p>
          <ul className="evidence-list">
            {lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <button
            type="button"
            className="theme-add-button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}
