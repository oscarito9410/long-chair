import type { Hue } from "../tokens/tokens.ts";

export const characterShapes = ["pebble", "bean", "drop", "bun", "arch", "sprout"] as const;

export type CharacterShape = (typeof characterShapes)[number];

export const characterMoods = ["smile", "grin", "wink", "content", "curious"] as const;

export type CharacterMood = (typeof characterMoods)[number];

export const characterAccessories = ["none", "bow", "glasses", "leaf", "scarf", "star"] as const;

export type CharacterAccessory = (typeof characterAccessories)[number];

export type CharacterVariant = {
  shape: CharacterShape;
  hue: Hue;
  mood?: CharacterMood;
  accessory?: CharacterAccessory;
};
