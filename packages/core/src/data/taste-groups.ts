import type { Hue } from "./hues.ts";
import { tasteById } from "./taste-catalog.ts";
import type { TasteEntity } from "./taste-catalog.ts";

export const TASTE_GROUP_PREVIEW = 6;

export const tasteGroupIcons = ["screen", "note", "ball", "pan"] as const;

export type TasteGroupIcon = (typeof tasteGroupIcons)[number];

export type TasteGroup = {
  id: string;
  label: string;
  hue: Hue;
  icon: TasteGroupIcon;
  tasteIds: readonly string[];
};

export const tasteGroups: readonly TasteGroup[] = [
  {
    id: "watch",
    label: "Watch",
    hue: "apricot",
    icon: "screen",
    tasteIds: [
      "anime",
      "studio-ghibli",
      "telenovela",
      "true-crime",
      "comedy",
      "documentary",
      "fantasy",
      "sci-fi",
    ],
  },
  {
    id: "listen",
    label: "Listen",
    hue: "seaglass",
    icon: "note",
    tasteIds: ["bad-bunny", "rock", "classical", "jazz", "kpop"],
  },
  {
    id: "play",
    label: "Follow and play",
    hue: "honey",
    icon: "ball",
    tasteIds: ["soccer", "liga-mx", "nba", "f1", "gaming", "fitness"],
  },
  {
    id: "make",
    label: "Make and learn",
    hue: "wisteria",
    icon: "pan",
    tasteIds: ["cooking", "tech", "history"],
  },
];

const groupByTaste = new Map<string, TasteGroup>();
for (const group of tasteGroups) {
  for (const id of group.tasteIds) {
    groupByTaste.set(id, group);
  }
}

export function groupForTaste(id: string): TasteGroup | undefined {
  return groupByTaste.get(id);
}

export function groupTastes(group: TasteGroup): TasteEntity[] {
  const found: TasteEntity[] = [];
  for (const id of group.tasteIds) {
    const taste = tasteById(id);
    if (taste) {
      found.push(taste);
    }
  }
  return found;
}

export function previewGroupTastes(group: TasteGroup, expanded: boolean): TasteEntity[] {
  const all = groupTastes(group);
  if (expanded) {
    return all;
  }
  return all.slice(0, TASTE_GROUP_PREVIEW);
}

export function groupMoreCount(group: TasteGroup): number {
  return Math.max(0, group.tasteIds.length - TASTE_GROUP_PREVIEW);
}
