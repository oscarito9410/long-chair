import type { Hue } from "./hues.ts";
import type { CharacterMood, CharacterShape } from "./character-kinds.ts";

/**
 * Original mascot silhouettes. One filled shape, no belly, no outline.
 * Hues are deeper than the cream-page tokens so the mark still reads.
 */
export type CharacterTone = {
  readonly body: string;
  readonly light: string;
  readonly shade: string;
};

export const characterTone: Record<Hue, CharacterTone> = {
  apricot: { body: "#e07a3d", light: "#f0a56c", shade: "#c4622c" },
  seaglass: { body: "#2f9d90", light: "#63c4b6", shade: "#21786d" },
  honey: { body: "#e2a322", light: "#f0c25c", shade: "#c48812" },
  wisteria: { body: "#8d63c4", light: "#b492dc", shade: "#714eaa" },
};

export const characterBody: Record<CharacterShape, string> = {
  pebble: "M58 18C80 12 104 24 110 46C116 70 104 98 80 108C54 118 22 104 14 76C6 48 32 24 58 18Z",
  bean: "M46 32C34 16 70 10 90 24C112 38 116 66 102 86C88 106 60 114 40 100C20 86 14 60 28 46C34 40 40 42 46 32Z",
  drop: "M60 14C74 24 94 46 104 68C114 90 100 110 76 112C52 114 28 108 18 90C8 72 16 48 32 32C44 20 50 16 60 14Z",
  bun: "M26 78C14 74 14 56 28 48C22 32 38 16 52 28C58 14 76 12 84 26C98 16 110 30 106 46C114 54 112 72 98 76C104 92 82 104 62 96C44 106 18 98 26 84C14 88 14 82 26 78Z",
  arch: "M38 24L66 16C84 12 94 18 98 38L106 66C110 84 102 96 82 100L54 106C34 110 24 102 20 82L14 54C10 36 18 26 38 24Z",
  sprout:
    "M60 16C72 16 78 30 72 42C90 32 108 40 104 56C108 74 88 82 72 74C80 92 72 108 60 104C48 108 40 92 48 74C32 82 12 74 16 56C12 40 30 32 48 42C42 30 48 16 60 16Z",
  diamond:
    "M60 12C74 26 90 38 104 56C116 72 106 94 86 106C68 116 50 110 36 98C18 84 10 66 20 50C30 32 44 20 60 12Z",
};

export const characterEyeY: Record<CharacterShape, number> = {
  pebble: 58,
  bean: 62,
  drop: 70,
  bun: 58,
  arch: 60,
  sprout: 60,
  diamond: 62,
};

export type EyeMark = {
  readonly kind: "pill" | "arc";
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export const eyeHighlight = {
  insetX: 2,
  insetY: 2.5,
  width: 3,
  height: 5,
  radius: 1.5,
  minEye: 12,
} as const;

const PILL = 8;
const LOOK_LEFT = 33;
const PAIR = 10;
const ARC_W = 16;
const ARC_H = 8;

function pill(x: number, y: number, height: number, width = PILL): EyeMark {
  return { kind: "pill", x, y, width, height };
}

function arc(x: number, y: number): EyeMark {
  return { kind: "arc", x, y, width: ARC_W, height: ARC_H };
}

export function characterEyes(mood: CharacterMood, eyeY: number): readonly [EyeMark, EyeMark] {
  switch (mood) {
    case "grin":
      return [arc(LOOK_LEFT, eyeY - 2), arc(LOOK_LEFT + 18, eyeY - 1)];
    case "wink":
      return [arc(LOOK_LEFT, eyeY), pill(LOOK_LEFT + 18, eyeY - 8, 16)];
    case "content":
      return [pill(LOOK_LEFT, eyeY - 3, 7), pill(LOOK_LEFT + PAIR, eyeY - 3, 7)];
    case "curious":
      return [pill(62, eyeY - 11, 22, 9), pill(78, eyeY - 10, 20, 9)];
    case "smile":
      return [pill(LOOK_LEFT, eyeY - 9, 18), pill(LOOK_LEFT + PAIR, eyeY - 8, 16)];
  }
}

const ARC_THICK = 3.2;

export function eyeArcPath(mark: EyeMark): string {
  const mid = mark.x + mark.width / 2;
  const end = mark.x + mark.width;
  const base = mark.y + mark.height;
  const crest = mark.y + ARC_THICK;
  return `M${mark.x} ${base}Q${mid} ${mark.y} ${end} ${base}Q${mid} ${crest} ${mark.x} ${base}Z`;
}
