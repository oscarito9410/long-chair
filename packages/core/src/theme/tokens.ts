/**
 * Paint and measure tokens shared by the web demo and the native app.
 * Hex strings here are the source of truth. apps/web/src/index.css must match them.
 */

export const palette = {
  page: "#f3eee6",
  card: "#fffcf8",
  ink: "#1c1916",
  inkSoft: "#4a433c",
  line: "#d9d0c6",
  white: "#ffffff",
  apricot: "#e7a784",
  apricotDeep: "#8f4e34",
  seaglass: "#7aaba3",
  seaglassDeep: "#245e56",
  honey: "#e4c06a",
  honeyDeep: "#7a5e16",
  wisteria: "#c5b0d6",
  wisteriaDeep: "#564472",
  scrim: "rgba(28, 25, 22, 0.35)",
  glassSheen: "rgba(255, 255, 255, 0.28)",
  glassEdge: "rgba(255, 255, 255, 0.72)",
  glassShadow: "rgba(28, 25, 22, 0.08)",
} as const;

export const space = {
  s4: 4,
  s8: 8,
  s16: 16,
  s24: 24,
  s32: 32,
  s64: 64,
} as const;

export const radius = {
  card: 28,
  panel: 32,
  tag: 8,
  pill: 999,
} as const;

export const typeScale = {
  body: 18,
  secondary: 16,
  title: 32,
  hero: 40,
  hand: 28,
} as const;

export const motion = {
  dotSpacing: 32,
  dotRadius: 2.15,
  dotInfluence: 150,
  dotDisplace: 12,
  dotScaleBoost: 1.15,
  dotAlphaRest: 0.14,
  dotAlphaBoost: 0.28,
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

export const stickerTilt = {
  jazz: -8,
  mystery: 7,
  bread: 4,
  light: -6,
} as const;
