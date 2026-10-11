import type { Hue } from "@long-chair/core";
import { palette as shared, radius, space, typeScale } from "@long-chair/core";

export const palette = shared;

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

export const SPACE_4 = space.s4;
export const SPACE_8 = space.s8;
export const SPACE_16 = space.s16;
export const SPACE_24 = space.s24;
export const SPACE_32 = space.s32;
export const SPACE_64 = space.s64;

export const RADIUS_CARD = radius.card;
export const RADIUS_PANEL = radius.panel;
export const RADIUS_TAG = radius.tag;
export const RADIUS_PILL = radius.pill;

export const FONT_BODY = typeScale.body;
export const FONT_SECONDARY = typeScale.secondary;
export const FONT_TITLE = typeScale.title;
export const FONT_HERO = typeScale.hero;
export const FONT_HAND = typeScale.hand;

export const TARGET = 48;
export const BLUR_REGULAR = 24;
export const WELL = 64;
export const COVER = 96;
export const AVATAR = 72;

const REST_ALPHA = 0.32;
const ON_ALPHA = 0.55;

export function glassWash(hex: string, selected: boolean): string {
  const alpha = Math.round((selected ? ON_ALPHA : REST_ALPHA) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${alpha}`;
}
