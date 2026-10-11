import type { ContentKind, PlaceKind } from "../data/types.ts";

export const kindLabels: Record<ContentKind, string> = {
  movie: "Film",
  tv_show: "Episode",
  podcast: "Podcast",
  book: "Reading",
  artist: "Listening",
};

export const placeLabels: Record<PlaceKind, string> = {
  bakery: "Bakery",
  kitchen: "Kitchen",
  coffee: "Coffee",
};
