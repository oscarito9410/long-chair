import { kindLabels, placeLabels } from "@long-chair/core";
import type { CharacterVariant, ContentKind, PlaceKind } from "@long-chair/core";
import type { IconName } from "../components/ui/icon-names.ts";
import type { Hue } from "../tokens/tokens.ts";

/**
 * Hue roles: apricot is warmth, film, and listening. Seaglass is the path
 * forward, episodes, and podcasts. Honey is food and a pause. Wisteria is
 * reading and themes held back. Two kinds may share a hue. Every chromatic
 * surface still uses one of the four.
 */
export const kindMeta: Record<ContentKind, { hue: Hue; icon: IconName; label: string }> = {
  movie: { hue: "apricot", icon: "film", label: kindLabels.movie },
  tv_show: { hue: "seaglass", icon: "screen", label: kindLabels.tv_show },
  podcast: { hue: "seaglass", icon: "headphones", label: kindLabels.podcast },
  book: { hue: "wisteria", icon: "book", label: kindLabels.book },
  artist: { hue: "apricot", icon: "note", label: kindLabels.artist },
};

const fallbackCharacter: CharacterVariant = {
  shape: "pebble",
  hue: "apricot",
  mood: "smile",
  accessory: "none",
};

export const tasteCharacters: Record<string, CharacterVariant> = {
  "mira-solano": { shape: "bun", hue: "apricot", mood: "grin", accessory: "bow" },
  "harbor-lights": { shape: "drop", hue: "seaglass", mood: "curious", accessory: "star" },
  "paper-kite": { shape: "bean", hue: "apricot", mood: "wink", accessory: "glasses" },
  "salt-windowlight": { shape: "arch", hue: "wisteria", mood: "content", accessory: "scarf" },
  "slow-kitchen": { shape: "pebble", hue: "honey", mood: "smile", accessory: "none" },
  "sunday-engines": { shape: "sprout", hue: "seaglass", mood: "grin", accessory: "leaf" },
};

export const themeCharacters: Record<string, CharacterVariant> = {
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

export const placeMeta: Record<PlaceKind, { hue: Hue; icon: IconName; label: string }> = {
  bakery: { hue: "honey", icon: "bread", label: placeLabels.bakery },
  kitchen: { hue: "apricot", icon: "bowl", label: placeLabels.kitchen },
  coffee: { hue: "seaglass", icon: "cup", label: placeLabels.coffee },
};
