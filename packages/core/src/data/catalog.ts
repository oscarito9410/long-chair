import { clearedThemes } from "./avoid-themes.ts";
import { tasteShelf } from "./catalog-tastes.ts";
import type { CatalogItem } from "./types.ts";

const avoided = clearedThemes();

/**
 * Fictional shelf. Ranks break ties inside a kind: 1 is the piece to offer
 * first when the taste matches and the minutes fit.
 */
export const catalog: readonly CatalogItem[] = [
  {
    id: "north-window",
    kind: "movie",
    title: "North Window",
    maker: "Written and directed by Ellis Maren",
    minutes: 108,
    rank: 1,
    becauseOf: ["paper-kite"],
    avoidedThemeIds: avoided,
    why: "It keeps the unhurried pace of The Paper Kite: a practical task, open air, and no emergency at the center.",
    synopsis:
      "A woman spends a summer repairing a greenhouse that was never hers. Neighbors stop by with seedlings, and the camera stays on hands, weather, and glass.",
  },
  {
    id: "orchard-map",
    kind: "movie",
    title: "The Orchard Map",
    maker: "A film by Idris Pell",
    minutes: 96,
    rank: 2,
    becauseOf: ["sunday-engines"],
    avoidedThemeIds: avoided,
    why: "Like Sunday Engines, it follows a small route with care: rows of trees, a paper map, and people who know the turns.",
    synopsis:
      "A mapmaker walks an old orchard before the season turns and writes down which lanes still lead somewhere. The film is mostly footsteps and names of apples.",
  },
  {
    id: "platform-three",
    kind: "movie",
    title: "Platform Three",
    maker: "A short film by Idris Pell",
    minutes: 22,
    rank: 3,
    becauseOf: ["sunday-engines"],
    avoidedThemeIds: avoided,
    why: "A short cousin of Sunday Engines: one platform, one afternoon, and a train that is in no hurry.",
    synopsis:
      "Two strangers share a bench and a timetable. Nothing is missed except the first train, on purpose.",
  },
  {
    id: "paper-boats",
    kind: "movie",
    title: "Paper Boats",
    maker: "A short film by Ellis Maren",
    minutes: 18,
    rank: 4,
    becauseOf: ["paper-kite"],
    avoidedThemeIds: avoided,
    why: "The same maker-spirit as The Paper Kite, scaled to a few quiet minutes on a river path.",
    synopsis:
      "A child and a grandparent fold boats and let them go under a footbridge. The afternoon is the whole story.",
  },
  {
    id: "blue-buoy",
    kind: "tv_show",
    title: "Harbor Lights: The Blue Buoy",
    maker: "Series by Nana Ibarra",
    minutes: 44,
    rank: 1,
    becauseOf: ["harbor-lights"],
    avoidedThemeIds: avoided,
    why: "You already trust Harbor Lights. This hour stays on the water and on one clue, not on anyone's body.",
    synopsis:
      "A buoy drifts into the wrong channel. The night desk follows it with radios, tea, and a chart, and the town stays kind.",
  },
  {
    id: "low-tide",
    kind: "tv_show",
    title: "Harbor Lights: Low Tide Letters",
    maker: "Series by Nana Ibarra",
    minutes: 44,
    rank: 2,
    becauseOf: ["harbor-lights"],
    avoidedThemeIds: avoided,
    why: "The next Harbor Lights hour, if the chair still has room: letters in a boathouse, and no raised voices.",
    synopsis:
      "Low tide uncovers a tin of letters under the pier. The harbor reads them aloud in the evening, one page at a time.",
  },
  {
    id: "lantern-room",
    kind: "tv_show",
    title: "Harbor Lights: The Lantern Room",
    maker: "Series by Nana Ibarra",
    minutes: 42,
    rank: 3,
    becauseOf: ["harbor-lights"],
    avoidedThemeIds: avoided,
    why: "Another hour in the same town, built from routine: lighting the lamp, making the log, watching the channel.",
    synopsis:
      "The keeper of a small light shows a visitor how the room works. Weather moves through, and the lamp stays lit.",
  },
  {
    id: "bread-tuesday",
    kind: "podcast",
    title: "Slow Kitchen Radio: Bread on a Tuesday",
    maker: "Hosted by Otto Pell",
    minutes: 36,
    rank: 1,
    becauseOf: ["slow-kitchen"],
    avoidedThemeIds: avoided,
    why: "Slow Kitchen Radio, which you named: one loaf, a long rise, and a host who does not fill the quiet.",
    synopsis:
      "Otto Pell bakes one loaf from start to finish and talks about flour the way other people talk about weather. There is no guest.",
  },
  {
    id: "citrus-hour",
    kind: "podcast",
    title: "Slow Kitchen Radio: The Citrus Hour",
    maker: "Hosted by Otto Pell",
    minutes: 32,
    rank: 2,
    becauseOf: ["slow-kitchen"],
    avoidedThemeIds: avoided,
    why: "A second Slow Kitchen hour if you want more of that voice: oranges, a knife, and a window open.",
    synopsis:
      "A bowl of citrus is prepped for a cake that may or may not happen. The pleasure is the smell and the pace.",
  },
  {
    id: "market-morning",
    kind: "book",
    title: "Market Morning",
    maker: "An essay by Ruth Adeyemi",
    minutes: 24,
    rank: 1,
    becauseOf: ["salt-windowlight"],
    avoidedThemeIds: avoided,
    why: "It sits beside Salt and Windowlight: a short essay about a counter, early light, and bread that is still warm.",
    synopsis:
      "Adeyemi walks to a market before the shutters are fully up and writes down what the street sounds like. Nothing is urgent.",
  },
  {
    id: "winter-apron",
    kind: "book",
    title: "Winter Apron",
    maker: "An essay by Ruth Adeyemi",
    minutes: 28,
    rank: 2,
    becauseOf: ["salt-windowlight"],
    avoidedThemeIds: avoided,
    why: "Another essay from the same shelf as Salt and Windowlight, about mending a pocket and waiting for rain.",
    synopsis:
      "A winter afternoon indoors. The work is a torn apron, a radio turned low, and soup that can wait.",
  },
  {
    id: "cedar-hall",
    kind: "artist",
    title: "Mira Solano at Cedar Hall",
    maker: "A live recording",
    minutes: 28,
    rank: 1,
    becauseOf: ["mira-solano"],
    avoidedThemeIds: avoided,
    why: "Mira Solano, whom you named, in a small hall. The room is close, and the songs stay warm.",
    synopsis:
      "Nine songs and the sound of chairs. She talks once, briefly, about the weather outside the hall, then sings.",
  },
  {
    id: "second-set",
    kind: "artist",
    title: "Mira Solano: Second Set",
    maker: "A live recording",
    minutes: 22,
    rank: 2,
    becauseOf: ["mira-solano"],
    avoidedThemeIds: avoided,
    why: "The shorter set from the same night, if the chair has a pocket of time left for her voice.",
    synopsis:
      "Four songs and an encore that is almost spoken. The audience is quiet in the way of people who want to stay.",
  },
  ...tasteShelf,
];

export function itemById(id: string): CatalogItem | undefined {
  return catalog.find((item) => item.id === id);
}
