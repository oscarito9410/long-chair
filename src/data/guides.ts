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
    variant: { shape: "pebble", hue: "seaglass", mood: "content", accessory: "scarf" },
  },
  {
    id: "lumen",
    name: "Lumen",
    personality: "Warm",
    quote: "I'll keep the afternoon easy.",
    variant: { shape: "bun", hue: "honey", mood: "grin", accessory: "bow" },
  },
  {
    id: "nook",
    name: "Nook",
    personality: "Close",
    quote: "I'll stay close. We don't have to talk.",
    variant: { shape: "arch", hue: "apricot", mood: "smile", accessory: "glasses" },
  },
  {
    id: "brim",
    name: "Brim",
    personality: "Curious",
    quote: "If you want to talk, I'm here.",
    variant: { shape: "sprout", hue: "wisteria", mood: "curious", accessory: "leaf" },
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
