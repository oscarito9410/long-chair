import type { CharacterVariant } from "../data/character-kinds.ts";
import type { IconName } from "../components/ui/icon-names.ts";
import type { ContentKind, PlaceKind } from "../data/types.ts";
import type { Hue } from "../tokens/tokens.ts";

/**
 * Hue roles: apricot is warmth, film, and listening. Seaglass is the path
 * forward, episodes, and podcasts. Honey is food and a pause. Wisteria is
 * reading and themes held back. Two kinds may share a hue. Every chromatic
 * surface still uses one of the four.
 */
export const kindMeta: Record<ContentKind, { hue: Hue; icon: IconName; label: string }> = {
  movie: { hue: "apricot", icon: "film", label: "Film" },
  tv_show: { hue: "seaglass", icon: "screen", label: "Episode" },
  podcast: { hue: "seaglass", icon: "headphones", label: "Podcast" },
  book: { hue: "wisteria", icon: "book", label: "Reading" },
  artist: { hue: "apricot", icon: "note", label: "Listening" },
};

const fallbackCharacter: CharacterVariant = { shape: "pebble", hue: "apricot" };

export const tasteCharacters: Record<string, CharacterVariant> = {
  "mira-solano": { shape: "bun", hue: "apricot" },
  "harbor-lights": { shape: "drop", hue: "seaglass" },
  "paper-kite": { shape: "bean", hue: "apricot" },
  "salt-windowlight": { shape: "arch", hue: "wisteria" },
  "slow-kitchen": { shape: "pebble", hue: "honey" },
  "sunday-engines": { shape: "sprout", hue: "seaglass" },
};

export const themeCharacters: Record<string, CharacterVariant> = {
  illness: { shape: "pebble", hue: "apricot" },
  hospitals: { shape: "arch", hue: "seaglass" },
  cancer: { shape: "bean", hue: "wisteria" },
  "parent-death": { shape: "bun", hue: "honey" },
  grief: { shape: "drop", hue: "wisteria" },
};

export function tasteCharacter(id: string): CharacterVariant {
  return tasteCharacters[id] ?? fallbackCharacter;
}

export function themeCharacter(id: string): CharacterVariant {
  return themeCharacters[id] ?? fallbackCharacter;
}

export const placeMeta: Record<PlaceKind, { hue: Hue; icon: IconName; label: string }> = {
  bakery: { hue: "honey", icon: "bread", label: "Bakery" },
  kitchen: { hue: "apricot", icon: "bowl", label: "Kitchen" },
  coffee: { hue: "seaglass", icon: "cup", label: "Coffee" },
};
