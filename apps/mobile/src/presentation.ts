import type { CharacterVariant, ContentKind, Hue, PlaceKind } from "@long-chair/core";
import { kindLabels, placeLabels } from "@long-chair/core";

import type { IconName } from "./components/chrome/icon-names";

export const kindHue: Record<ContentKind, Hue> = {
  movie: "apricot",
  tv_show: "seaglass",
  podcast: "seaglass",
  book: "wisteria",
  artist: "apricot",
};

export const kindLabel = kindLabels;

export const kindIcon: Record<ContentKind, IconName> = {
  movie: "film",
  tv_show: "screen",
  podcast: "headphones",
  book: "book",
  artist: "note",
};

export const placeIcon: Record<PlaceKind, IconName> = {
  bakery: "bread",
  kitchen: "bowl",
  coffee: "cup",
};

const fallbackCharacter: CharacterVariant = {
  shape: "pebble",
  hue: "apricot",
  mood: "smile",
  accessory: "none",
};

const tasteCharacters: Record<string, CharacterVariant> = {
  "mira-solano": { shape: "bun", hue: "apricot", mood: "grin", accessory: "bow" },
  "harbor-lights": { shape: "drop", hue: "seaglass", mood: "curious", accessory: "star" },
  "paper-kite": { shape: "bean", hue: "apricot", mood: "wink", accessory: "glasses" },
  "salt-windowlight": { shape: "arch", hue: "wisteria", mood: "content", accessory: "scarf" },
  "slow-kitchen": { shape: "pebble", hue: "honey", mood: "smile", accessory: "none" },
  "sunday-engines": { shape: "sprout", hue: "seaglass", mood: "grin", accessory: "leaf" },
};

const themeCharacters: Record<string, CharacterVariant> = {
  illness: { shape: "pebble", hue: "apricot", mood: "content", accessory: "none" },
  hospitals: { shape: "arch", hue: "seaglass", mood: "smile", accessory: "glasses" },
  cancer: { shape: "bean", hue: "wisteria", mood: "wink", accessory: "star" },
  "parent-death": { shape: "bun", hue: "honey", mood: "content", accessory: "scarf" },
  grief: { shape: "drop", hue: "wisteria", mood: "curious", accessory: "leaf" },
};

export function tasteCharacter(id: string): CharacterVariant {
  return tasteCharacters[id] ?? fallbackCharacter;
}

export function themeCharacter(id: string): CharacterVariant {
  return themeCharacters[id] ?? fallbackCharacter;
}

export const placeHue: Record<PlaceKind, Hue> = {
  bakery: "honey",
  kitchen: "apricot",
  coffee: "seaglass",
};

export const placeLabel = placeLabels;
