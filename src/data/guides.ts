import type { CharacterVariant } from "./character-kinds.ts";

export type Guide = {
  id: string;
  name: string;
  personality: string;
  quote: string;
  variant: CharacterVariant;
};

export const guides: readonly Guide[] = [
  {
    id: "pebble",
    name: "Pebble",
    personality: "Steady",
    quote: "I'll sit with you. We can be quiet.",
    variant: { shape: "pebble", hue: "seaglass" },
  },
  {
    id: "lumen",
    name: "Lumen",
    personality: "Warm",
    quote: "We'll keep the afternoon soft.",
    variant: { shape: "bun", hue: "honey" },
  },
  {
    id: "nook",
    name: "Nook",
    personality: "Close",
    quote: "A small corner is a good place to land.",
    variant: { shape: "arch", hue: "apricot" },
  },
  {
    id: "brim",
    name: "Brim",
    personality: "Curious",
    quote: "Tell me one small thing you noticed.",
    variant: { shape: "sprout", hue: "wisteria" },
  },
];

export function guideById(id: string): Guide {
  const found = guides.find((guide) => guide.id === id);
  const fallback = guides[0];
  if (found) {
    return found;
  }
  if (!fallback) {
    throw new Error("Long Chair has no companion guides.");
  }
  return fallback;
}
