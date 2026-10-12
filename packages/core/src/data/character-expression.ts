import type { CharacterMood } from "./character-kinds.ts";
import { eyeArcPath, type EyeMark } from "./character-art.ts";

/**
 * Decorative acting for the mascot. A pose describes the drawing,
 * never an inferred feeling of the person using the chair.
 */
export const expressions = [
  "calm",
  "attention",
  "thinking",
  "support",
  "greeting",
  "celebration",
  "determined",
  "sleepy",
  "tickled",
] as const;

export type Expression = (typeof expressions)[number];

export const characterMoments = [
  "welcome",
  "company",
  "companyPicked",
  "building",
  "buildingReady",
  "kitReady",
  "companion",
  "empty",
  "retry",
] as const;

export type CharacterMoment = (typeof characterMoments)[number];

export const POSE_INTRO_MS = 2000;
export const TICKLE_WINDOW_MS = 1200;
export const TICKLE_TAP_COUNT = 3;
export const TICKLE_GIGGLE_MS = 2400;

export const blushFill = "#e7a0b0";

export type ExpressionPose = {
  readonly tilt: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly lift: number;
};

export const expressionPose: Record<Expression, ExpressionPose> = {
  calm: { tilt: 0, scaleX: 1, scaleY: 1, lift: 0 },
  attention: { tilt: -8, scaleX: 1.02, scaleY: 1.04, lift: -2 },
  thinking: { tilt: 7, scaleX: 0.98, scaleY: 1.02, lift: 0 },
  support: { tilt: 4, scaleX: 1.03, scaleY: 0.98, lift: 0 },
  greeting: { tilt: -4, scaleX: 1, scaleY: 1, lift: -4 },
  celebration: { tilt: 0, scaleX: 1.06, scaleY: 0.94, lift: -2 },
  determined: { tilt: -3, scaleX: 1.05, scaleY: 0.94, lift: 4 },
  sleepy: { tilt: 8, scaleX: 1.06, scaleY: 0.9, lift: 6 },
  tickled: { tilt: 0, scaleX: 1.04, scaleY: 0.94, lift: 0 },
};

export type FacePiece = {
  readonly role: "eye" | "brow" | "mouth" | "blush";
  readonly kind: "pill" | "arc" | "oval";
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export function expressionForMoment(moment: CharacterMoment): Expression {
  switch (moment) {
    case "welcome":
      return "greeting";
    case "company":
      return "attention";
    case "companyPicked":
    case "buildingReady":
    case "kitReady":
      return "celebration";
    case "building":
      return "thinking";
    case "companion":
      return "support";
    case "empty":
      return "sleepy";
    case "retry":
      return "determined";
  }
}

export function expressionForMood(mood: CharacterMood): Expression {
  switch (mood) {
    case "smile":
      return "calm";
    case "grin":
      return "greeting";
    case "wink":
      return "attention";
    case "content":
      return "support";
    case "curious":
      return "thinking";
  }
}

export function expressionIntroduces(expression: Expression): boolean {
  return expression === "greeting" || expression === "celebration" || expression === "determined";
}

const PILL = 8;
const LOOK = 33;

function pill(x: number, y: number, height: number, width = PILL): FacePiece {
  return { role: "eye", kind: "pill", x, y, width, height };
}

function closed(x: number, y: number): FacePiece {
  return { role: "eye", kind: "arc", x, y, width: 16, height: 8 };
}

function brow(x: number, y: number, height = 6): FacePiece {
  return { role: "brow", kind: "arc", x, y, width: 14, height };
}

function smile(x: number, y: number, width = 16): FacePiece {
  return { role: "mouth", kind: "arc", x, y, width, height: 7 };
}

function openMouth(x: number, y: number): FacePiece {
  return { role: "mouth", kind: "oval", x, y, width: 14, height: 10 };
}

function blush(x: number, y: number): FacePiece {
  return { role: "blush", kind: "oval", x, y, width: 12, height: 6 };
}

export function expressionFace(expression: Expression, eyeY: number): readonly FacePiece[] {
  switch (expression) {
    case "calm":
      return [
        pill(LOOK, eyeY - 9, 18),
        pill(LOOK + 10, eyeY - 8, 16),
        brow(LOOK - 2, eyeY - 20),
        brow(LOOK + 10, eyeY - 20),
      ];
    case "attention":
      return [
        pill(LOOK - 2, eyeY - 13, 24, 10),
        pill(LOOK + 12, eyeY - 13, 24, 10),
        brow(LOOK - 4, eyeY - 26, 8),
        brow(LOOK + 12, eyeY - 26, 8),
      ];
    case "thinking":
      return [
        pill(40, eyeY - 16, 11),
        pill(54, eyeY - 22, 18),
        brow(38, eyeY - 26, 4),
        brow(52, eyeY - 36, 8),
        { role: "mouth", kind: "oval", x: 58, y: eyeY + 8, width: 8, height: 8 },
      ];
    case "support":
      return [
        closed(LOOK, eyeY - 2),
        closed(LOOK + 18, eyeY - 1),
        brow(LOOK, eyeY - 16, 5),
        brow(LOOK + 18, eyeY - 16, 5),
        smile(LOOK + 4, eyeY + 12, 18),
        blush(LOOK - 8, eyeY + 8),
        blush(LOOK + 28, eyeY + 8),
      ];
    case "greeting":
      return [
        pill(LOOK, eyeY - 12, 22, 9),
        pill(LOOK + 12, eyeY - 12, 22, 9),
        brow(LOOK - 2, eyeY - 24, 8),
        brow(LOOK + 12, eyeY - 24, 8),
        smile(LOOK + 2, eyeY + 14, 20),
      ];
    case "celebration":
    case "tickled":
      return [
        closed(LOOK, eyeY - 2),
        closed(LOOK + 18, eyeY),
        openMouth(LOOK + 6, eyeY + 14),
        blush(LOOK - 8, eyeY + 6),
        blush(LOOK + 28, eyeY + 6),
      ];
    case "determined":
      return [
        pill(LOOK + 2, eyeY - 6, 14, 7),
        pill(LOOK + 12, eyeY - 6, 14, 7),
        brow(LOOK, eyeY - 16, 4),
        brow(LOOK + 12, eyeY - 18, 4),
        smile(LOOK + 4, eyeY + 12, 14),
      ];
    case "sleepy":
      return [
        pill(LOOK, eyeY - 2, 7),
        pill(LOOK + 10, eyeY - 1, 7),
        smile(LOOK + 2, eyeY + 10, 12),
      ];
  }
}

export function faceArcPath(piece: FacePiece): string {
  const mark: EyeMark = {
    kind: "arc",
    x: piece.x,
    y: piece.y,
    width: piece.width,
    height: piece.height,
  };
  return eyeArcPath(mark);
}

export type TickleClock = {
  readonly taps: readonly number[];
  readonly giggleUntil: number | null;
};

export function idleTickle(): TickleClock {
  return { taps: [], giggleUntil: null };
}

export function noteTickleTap(clock: TickleClock, now: number): TickleClock {
  if (clock.giggleUntil !== null && now < clock.giggleUntil) {
    return clock;
  }
  const taps = clock.taps.filter((tap) => now - tap <= TICKLE_WINDOW_MS);
  const next = [...taps, now];
  if (next.length >= TICKLE_TAP_COUNT) {
    return { taps: [], giggleUntil: now + TICKLE_GIGGLE_MS };
  }
  return { taps: next, giggleUntil: null };
}

export function isTickling(clock: TickleClock, now: number): boolean {
  return clock.giggleUntil !== null && now < clock.giggleUntil;
}
