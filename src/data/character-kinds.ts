import type { Hue } from "../tokens/tokens.ts";

export const characterShapes = ["pebble", "bean", "drop", "bun", "arch", "sprout"] as const;

export type CharacterShape = (typeof characterShapes)[number];

export type CharacterVariant = {
  shape: CharacterShape;
  hue: Hue;
};
