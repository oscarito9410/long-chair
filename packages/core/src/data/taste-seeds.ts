import type { TasteSeed } from "./types.ts";

/** Fictional works the sample patient already loves. Not a live catalog. */
export const tasteSeeds: readonly TasteSeed[] = [
  {
    id: "mira-solano",
    kind: "artist",
    name: "Mira Solano",
    detail: "Warm vocal jazz in small rooms",
  },
  {
    id: "harbor-lights",
    kind: "tv_show",
    name: "Harbor Lights",
    detail: "A coastal mystery, told quietly",
  },
  {
    id: "paper-kite",
    kind: "movie",
    name: "The Paper Kite",
    detail: "A slow road film about a repair",
  },
  {
    id: "salt-windowlight",
    kind: "book",
    name: "Salt and Windowlight",
    detail: "Essays on kitchens and weather",
  },
  {
    id: "slow-kitchen",
    kind: "podcast",
    name: "Slow Kitchen Radio",
    detail: "One recipe, and no rush",
  },
  {
    id: "sunday-engines",
    kind: "movie",
    name: "Sunday Engines",
    detail: "A gentle film about small trains",
  },
];
