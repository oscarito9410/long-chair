import type { Hue } from "@long-chair/core";

export const palette = {
  page: "#F3EEE6",
  card: "#FFFCF8",
  ink: "#1C1916",
  inkSoft: "#4A433C",
  line: "#D9D0C6",
  white: "#FFFFFF",
  scrim: "rgba(28, 25, 22, 0.35)",
  glassFill: "rgba(255, 252, 248, 0.72)",
  glassTint: "#FFFCF8",
  apricot: "#E7A784",
  apricotDeep: "#8F4E34",
  seaglass: "#7AABA3",
  seaglassDeep: "#245E56",
  honey: "#E4C06A",
  honeyDeep: "#7A5E16",
  wisteria: "#C5B0D6",
  wisteriaDeep: "#564472",
} as const;

export const hueFill: Record<Hue, string> = {
  apricot: palette.apricot,
  seaglass: palette.seaglass,
  honey: palette.honey,
  wisteria: palette.wisteria,
};

export const hueDeep: Record<Hue, string> = {
  apricot: palette.apricotDeep,
  seaglass: palette.seaglassDeep,
  honey: palette.honeyDeep,
  wisteria: palette.wisteriaDeep,
};

export const SPACE_4 = 4;
export const SPACE_8 = 8;
export const SPACE_16 = 16;
export const SPACE_24 = 24;
export const SPACE_32 = 32;
export const SPACE_64 = 64;

export const RADIUS_CARD = 28;
export const RADIUS_PANEL = 32;
export const RADIUS_TAG = 8;
export const RADIUS_PILL = 999;

export const FONT_BODY = 18;
export const FONT_SECONDARY = 16;
export const FONT_TITLE = 32;
export const FONT_HERO = 40;
export const FONT_HAND = 28;

export const TARGET = 48;
export const BLUR_REGULAR = 24;
export const WELL = 64;
export const COVER = 96;
export const AVATAR = 72;
