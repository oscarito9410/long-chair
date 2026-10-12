import type { CatalogItem, ContentKind, ItemLink } from "./types.ts";

const APPLE_TV = "https://tv.apple.com/search?term=";
const APPLE_PODCASTS = "https://podcasts.apple.com/search?media=podcast&term=";
const APPLE_MUSIC = "https://music.apple.com/search?term=";
const SPOTIFY_SEARCH = "https://open.spotify.com/search/";
const OPEN_LIBRARY = "https://openlibrary.org/search?q=";
const APPLE_MAPS = "https://maps.apple.com/?q=";

function searchLink(label: string, base: string, title: string): ItemLink {
  return { label, href: `${base}${encodeURIComponent(title)}` };
}

export function durationFactFor(kind: ContentKind, title: string): Pick<
  CatalogItem,
  "durationSource" | "durationNote" | "links" | "watchProviders"
> {
  if (kind === "movie" || kind === "tv_show") {
    const note = kind === "movie" ? "Runtime. Sample shelf." : "Episode runtime. Sample shelf.";
    return {
      durationSource: "confirmed",
      durationNote: note,
      links: [searchLink("Open in Apple TV", APPLE_TV, title)],
      watchProviders: ["Sample cinema"],
    };
  }
  if (kind === "podcast") {
    return {
      durationSource: "confirmed",
      durationNote: "Episode length. Sample shelf.",
      links: [searchLink("Open in Apple Podcasts", APPLE_PODCASTS, title)],
      watchProviders: [],
    };
  }
  if (kind === "artist") {
    return {
      durationSource: "confirmed",
      durationNote: "Album length. Sample shelf.",
      links: [
        searchLink("Open in Apple Music", APPLE_MUSIC, title),
        searchLink("Search in Spotify", SPOTIFY_SEARCH, title),
      ],
      watchProviders: [],
    };
  }
  return {
    durationSource: "estimated",
    durationNote: "Estimated from page count. Sample shelf.",
    links: [searchLink("Open in Open Library", OPEN_LIBRARY, title)],
    watchProviders: [],
  };
}

export function mapSearchUrl(name: string): string {
  return `${APPLE_MAPS}${encodeURIComponent(name)}`;
}
