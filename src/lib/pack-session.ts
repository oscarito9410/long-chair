import { catalog } from "../data/catalog.ts";
import type { CatalogItem, ContentKind, PackedSession, SessionDraft } from "../data/types.ts";

/** Show an unscheduled pause only when the gap is long enough to notice. */
export const PAUSE_NOTICE_MINUTES = 8;

/** Below this share of the chair, say plainly that the shelf ran out. */
export const QUIET_FILL_RATIO = 0.5;

const MAX_EXTRAS = 2;
const MIN_EXTRA_MINUTES = 15;

type SlotRequest = {
  kind: ContentKind;
  maxMinutes: number;
};

/**
 * Shapes are the stand-in for the agent's "what fits this chair" decision.
 * A single feature film is reserved for the long chair; shorter visits stay mixed.
 */
const SESSION_SHAPES: readonly { minimumMinutes: number; slots: readonly SlotRequest[] }[] = [
  {
    minimumMinutes: 240,
    slots: [
      { kind: "movie", maxMinutes: 120 },
      { kind: "tv_show", maxMinutes: 50 },
      { kind: "podcast", maxMinutes: 45 },
      { kind: "artist", maxMinutes: 40 },
      { kind: "book", maxMinutes: 30 },
    ],
  },
  {
    minimumMinutes: 180,
    slots: [
      { kind: "movie", maxMinutes: 100 },
      { kind: "tv_show", maxMinutes: 50 },
      { kind: "podcast", maxMinutes: 45 },
    ],
  },
  {
    minimumMinutes: 120,
    slots: [
      { kind: "tv_show", maxMinutes: 50 },
      { kind: "podcast", maxMinutes: 40 },
      { kind: "book", maxMinutes: 30 },
    ],
  },
  {
    minimumMinutes: 0,
    slots: [
      { kind: "podcast", maxMinutes: 40 },
      { kind: "book", maxMinutes: 30 },
    ],
  },
];

function tasteScore(item: CatalogItem, selected: ReadonlySet<string>): number {
  return item.becauseOf.filter((id) => selected.has(id)).length;
}

function shapeFor(minutes: number): readonly SlotRequest[] {
  const match = SESSION_SHAPES.find((shape) => minutes >= shape.minimumMinutes);
  return match ? match.slots : [];
}

function pickForSlot(
  slot: SlotRequest,
  remaining: number,
  used: ReadonlySet<string>,
  selected: ReadonlySet<string>,
): CatalogItem | undefined {
  const cap = Math.min(slot.maxMinutes, remaining);
  const candidates = catalog.filter((item) => {
    if (item.kind !== slot.kind || used.has(item.id) || item.minutes > cap) {
      return false;
    }
    return tasteScore(item, selected) > 0;
  });
  candidates.sort((a, b) => a.rank - b.rank || b.minutes - a.minutes);
  return candidates[0];
}

export function packSession(draft: SessionDraft): PackedSession {
  const selected = new Set(draft.seedIds);
  const used = new Set<string>();
  const chosen: CatalogItem[] = [];
  let remaining = draft.durationMinutes;

  for (const slot of shapeFor(draft.durationMinutes)) {
    const item = pickForSlot(slot, remaining, used, selected);
    if (!item) {
      continue;
    }
    chosen.push(item);
    used.add(item.id);
    remaining -= item.minutes;
  }

  const extras = catalog
    .filter((item) => !used.has(item.id) && tasteScore(item, selected) > 0)
    .sort((a, b) => tasteScore(b, selected) - tasteScore(a, selected) || b.minutes - a.minutes);

  let extraCount = 0;
  for (const item of extras) {
    if (extraCount >= MAX_EXTRAS) {
      break;
    }
    if (item.minutes > remaining || item.minutes < MIN_EXTRA_MINUTES) {
      continue;
    }
    chosen.push(item);
    used.add(item.id);
    remaining -= item.minutes;
    extraCount += 1;
  }

  let cursor = 0;
  const slots = chosen.map((item) => {
    const startMinute = cursor;
    cursor += item.minutes;
    return { itemId: item.id, startMinute, endMinute: cursor };
  });

  const filledMinutes = cursor;
  return {
    slots,
    filledMinutes,
    durationMinutes: draft.durationMinutes,
    openMinutes: Math.max(0, draft.durationMinutes - filledMinutes),
  };
}
