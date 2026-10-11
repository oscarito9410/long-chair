import type { Hue } from "@long-chair/core";

export const screenTints = {
  welcome: "apricot",
  love: "honey",
  chair: "seaglass",
  themes: "wisteria",
  company: "apricot",
  building: "seaglass",
  ready: "honey",
  kit: "seaglass",
  companion: "honey",
  compare: "wisteria",
  settings: "seaglass",
  item: "apricot",
} as const satisfies Record<string, Hue>;

export type ScreenTint = keyof typeof screenTints;
