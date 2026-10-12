import { durationFactFor } from "./duration-facts.ts";
import { clearedThemeIdsFor } from "./theme-signals.ts";
import type { CatalogItem } from "./types.ts";

function stamp(item: Omit<CatalogItem, "avoidedThemeIds">): CatalogItem {
  return {
    ...item,
    ...durationFactFor(item.kind, item.title),
    avoidedThemeIds: clearedThemeIdsFor(item),
  };
}

/**
 * Fictional pieces tied to searched tastes. Ranks still mean "offer this first"
 * inside a kind when the minutes fit.
 */
const recorded: Omit<CatalogItem, "avoidedThemeIds">[] = [
  {
    id: "lantern-episode",
    kind: "tv_show",
    title: "Lantern Club: The First Evening",
    maker: "A series by Hana Pell",
    minutes: 24,
    rank: 1,
    becauseOf: ["anime", "studio-ghibli"],
    why: "An anime episode, because you asked for that shelf: one evening, a festival light, and no emergency.",
    synopsis:
      "Four friends hang paper lanterns before a town festival. The episode stays on the street, the string, and who holds the ladder.",
  },
  {
    id: "ward-episode",
    kind: "tv_show",
    title: "Ward Lights",
    maker: "A series by Hana Pell",
    minutes: 22,
    rank: 0,
    becauseOf: ["anime"],
    why: "Another anime hour. This one is set in a clinic, so it stays off the shelf when illness is held out.",
    synopsis:
      "A clinic waiting room, drawn as an anime. We leave it out when that setting is not welcome.",
  },
  {
    id: "court-lines",
    kind: "movie",
    title: "Court Lines",
    maker: "A documentary by Idris Pell",
    minutes: 84,
    rank: 1,
    becauseOf: ["fitness", "soccer", "nba"],
    why: "A sports documentary, because training and the court are on your list.",
    synopsis:
      "A neighborhood court through one season. Players stretch, argue about the line, and stay for the last game of the night.",
  },
  {
    id: "signal-hour",
    kind: "podcast",
    title: "Signal Hour",
    maker: "Hosted by Ruth Adeyemi",
    minutes: 32,
    rank: 1,
    becauseOf: ["tech", "programming", "science"],
    why: "A tech podcast, because you picked how things are built.",
    synopsis:
      "One hour on a small radio kit: what the parts are called, and why a wire matters. There is no product to buy.",
  },
  {
    id: "field-notes-item",
    kind: "book",
    title: "Field Notes on Circuits",
    maker: "An essay by Ruth Adeyemi",
    minutes: 22,
    rank: 1,
    becauseOf: ["tech"],
    why: "A short technical essay for the minutes still open.",
    synopsis:
      "Adeyemi opens a radio and names each piece. The chapter ends when the dial finds a station.",
  },
  {
    id: "courtyard-hour",
    kind: "tv_show",
    title: "The Courtyard: Thursday",
    maker: "A series by Nana Ibarra",
    minutes: 44,
    rank: 1,
    becauseOf: ["telenovela"],
    why: "A telenovela hour, because that is the evening shape you asked for.",
    synopsis:
      "Thursday in a shared courtyard. Someone returns a chair, someone starts a story, and the plot can wait until next week.",
  },
  {
    id: "one-pan-item",
    kind: "podcast",
    title: "One Pan",
    maker: "Hosted by Otto Pell",
    minutes: 28,
    rank: 1,
    becauseOf: ["cooking", "baking"],
    why: "A cooking hour, because you wanted a recipe more than a plot.",
    synopsis:
      "Otto Pell cooks one skillet meal from a market bag. The episode is the sound of the pan.",
  },
  {
    id: "patio-session-item",
    kind: "artist",
    title: "Patio Session",
    maker: "A live recording",
    minutes: 26,
    rank: 1,
    becauseOf: ["bad-bunny", "reggaeton", "latin-pop"],
    why: "A courtyard set in the lane of the music you picked.",
    synopsis:
      "Six songs and the sound of a neighbor's fan. The singer stays close to the microphone.",
  },
  {
    id: "small-hall-item",
    kind: "artist",
    title: "Small Hall Quartet",
    maker: "A live recording",
    minutes: 30,
    rank: 1,
    becauseOf: ["classical", "jazz"],
    why: "A small-hall recording, because you asked for that kind of listening.",
    synopsis:
      "A quartet plays four movements and then packs the stands. The room is wooden and close.",
  },
  {
    id: "south-road-item",
    kind: "book",
    title: "The Long Road South",
    maker: "A history by Ellis Maren",
    minutes: 26,
    rank: 1,
    becauseOf: ["history", "travel"],
    why: "A history you can read in one sitting, tied to the road you picked.",
    synopsis: "Maren follows one highway through three towns and writes down who built each bend.",
  },
  {
    id: "overland-item",
    kind: "movie",
    title: "The Overland",
    maker: "A film by Ellis Maren",
    minutes: 92,
    rank: 1,
    becauseOf: ["travel", "rail-history"],
    why: "A travel film, because the route is the story you asked for.",
    synopsis:
      "A passenger train from the window seat. Stations arrive, and nobody is late on purpose.",
  },
  {
    id: "names-map-item",
    kind: "podcast",
    title: "Names on the Map",
    maker: "Hosted by Idris Pell",
    minutes: 30,
    rank: 1,
    becauseOf: ["history", "travel"],
    why: "A history podcast for the open minutes, walked instead of lectured.",
    synopsis: "Pell reads a map aloud and stops at three names. Each one gets a short story.",
  },
];

export const tasteShelf: readonly CatalogItem[] = recorded.map(stamp);
