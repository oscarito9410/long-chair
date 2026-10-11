/**
 * Shapes the screens render. A future Qloo adapter can map search hits,
 * insight rows, and explainability onto these types without changing the UI.
 * Nothing in this folder is a live API response.
 */

export const contentKinds = ["movie", "tv_show", "podcast", "book", "artist"] as const;

export type ContentKind = (typeof contentKinds)[number];

export const placeKinds = ["bakery", "kitchen", "coffee"] as const;

export type PlaceKind = (typeof placeKinds)[number];

export type TasteSeed = {
  id: string;
  kind: ContentKind;
  name: string;
  detail: string;
};

export type AvoidTheme = {
  id: string;
  label: string;
  detail: string;
};

export type CatalogItem = {
  id: string;
  kind: ContentKind;
  title: string;
  maker: string;
  minutes: number;
  rank: number;
  synopsis: string;
  why: string;
  becauseOf: readonly string[];
  avoidedThemeIds: readonly string[];
};

export type SessionDraft = {
  seedIds: readonly string[];
  avoidIds: readonly string[];
  durationMinutes: number;
  companionId: string;
};

export type PackedSlot = {
  itemId: string;
  startMinute: number;
  endMinute: number;
};

export type PackedSession = {
  slots: readonly PackedSlot[];
  filledMinutes: number;
  durationMinutes: number;
  openMinutes: number;
};

export type CompanionTopic = {
  id: string;
  seedId: string;
  title: string;
  prompt: string;
};

export type NearbyPlace = {
  id: string;
  kind: PlaceKind;
  name: string;
  offer: string;
  walkMinutes: number;
  openUntil: string;
  priceLabel: string;
};

export type AgentStep = {
  id: string;
  title: string;
  detail: string;
};
