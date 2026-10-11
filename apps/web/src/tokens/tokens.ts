import type { Hue } from "@long-chair/core";

/**
 * CSS variable names for the web app.
 * Hue names, paint hex, and motion numbers live in @long-chair/core.
 * apps/web/src/index.css repeats the hex so the browser can paint them.
 */

export { hues, motion, palette } from "@long-chair/core";
export type { Hue };

export const hueVar = {
  apricot: "--lc-apricot",
  seaglass: "--lc-seaglass",
  honey: "--lc-honey",
  wisteria: "--lc-wisteria",
} as const satisfies Record<Hue, string>;

export type DotMode = "ambient" | "gather";
