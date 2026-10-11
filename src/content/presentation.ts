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

export const placeMeta: Record<PlaceKind, { hue: Hue; icon: IconName; label: string }> = {
  bakery: { hue: "honey", icon: "bread", label: "Bakery" },
  kitchen: { hue: "apricot", icon: "bowl", label: "Kitchen" },
  coffee: { hue: "seaglass", icon: "cup", label: "Coffee" },
};
