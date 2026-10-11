/**
 * Motion, hue names, and CSS variable names.
 * Paint values (hex, radii, type sizes) live only in src/index.css.
 */

export const hues = ["apricot", "seaglass", "honey", "wisteria"] as const;

export type Hue = (typeof hues)[number];

export const hueVar = {
  apricot: "--lc-apricot",
  seaglass: "--lc-seaglass",
  honey: "--lc-honey",
  wisteria: "--lc-wisteria",
} as const satisfies Record<Hue, string>;

export const motion = {
  dotSpacing: 32,
  dotRadius: 2.15,
  dotInfluence: 150,
  dotDisplace: 12,
  dotScaleBoost: 1.15,
  dotAlphaRest: 0.34,
  dotAlphaBoost: 0.5,
  dotEase: 0.12,
  settleEpsilon: 0.2,
  gatherPull: 0.2,
  gatherFocal: 0.34,
  gatherPulseSpeed: 2.2,
  gatherScale: 0.7,
  gatherAlpha: 0.28,
  stepIntervalMs: 700,
  maxDevicePixelRatio: 2,
  maxFrameSeconds: 0.05,
} as const;

export type DotMode = "ambient" | "gather";
