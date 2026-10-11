import type { Hue } from "./tokens.ts";

export const hueWashClass = {
  apricot: "wash-apricot",
  seaglass: "wash-seaglass",
  honey: "wash-honey",
  wisteria: "wash-wisteria",
} as const satisfies Record<Hue, string>;

export const hueDeepBgClass = {
  apricot: "bg-apricot-deep",
  seaglass: "bg-seaglass-deep",
  honey: "bg-honey-deep",
  wisteria: "bg-wisteria-deep",
} as const satisfies Record<Hue, string>;
