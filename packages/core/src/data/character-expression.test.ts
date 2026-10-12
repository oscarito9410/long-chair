import { describe, expect, it } from "vitest";

import { characterMoods, characterShapes } from "./character-kinds.ts";
import { characterEyeY } from "./character-art.ts";
import {
  characterMoments,
  expressionFace,
  expressionForMoment,
  expressionForMood,
  expressionPose,
  expressions,
  idleTickle,
  isTickling,
  noteTickleTap,
  TICKLE_GIGGLE_MS,
  TICKLE_WINDOW_MS,
} from "./character-expression.ts";

describe("expression mapping", () => {
  it("sends each app moment to one decorative pose", () => {
    expect(expressionForMoment("welcome")).toBe("greeting");
    expect(expressionForMoment("company")).toBe("attention");
    expect(expressionForMoment("companyPicked")).toBe("celebration");
    expect(expressionForMoment("building")).toBe("thinking");
    expect(expressionForMoment("buildingReady")).toBe("celebration");
    expect(expressionForMoment("kitReady")).toBe("celebration");
    expect(expressionForMoment("companion")).toBe("support");
    expect(expressionForMoment("empty")).toBe("sleepy");
    expect(expressionForMoment("retry")).toBe("determined");
    expect(characterMoments).toHaveLength(9);
  });

  it("gives every expression a settled pose and two eyes", () => {
    for (const expression of expressions) {
      const pose = expressionPose[expression];
      expect(Number.isFinite(pose.tilt)).toBe(true);
      for (const shape of characterShapes) {
        const eyes = expressionFace(expression, characterEyeY[shape]).filter(
          (piece) => piece.role === "eye",
        );
        expect(eyes).toHaveLength(2);
      }
    }
  });

  it("keeps the older mood names as face aliases", () => {
    expect(characterMoods.map((mood) => expressionForMood(mood))).toEqual([
      "calm",
      "greeting",
      "attention",
      "support",
      "thinking",
    ]);
  });
});

describe("tickle timing", () => {
  const start = 10_000;

  it("giggles on the third tap inside the window and ignores taps during it", () => {
    const first = noteTickleTap(idleTickle(), start);
    const second = noteTickleTap(first, start + 400);
    expect(isTickling(second, start + 400)).toBe(false);
    const third = noteTickleTap(second, start + 800);
    expect(third.giggleUntil).toBe(start + 800 + TICKLE_GIGGLE_MS);
    expect(isTickling(third, start + 800)).toBe(true);
    expect(noteTickleTap(third, start + 900)).toBe(third);
    expect(isTickling(third, start + 800 + TICKLE_GIGGLE_MS)).toBe(false);
  });

  it("drops taps that fall outside the window", () => {
    const first = noteTickleTap(idleTickle(), start);
    const late = noteTickleTap(first, start + TICKLE_WINDOW_MS + 1);
    expect(late.taps).toEqual([start + TICKLE_WINDOW_MS + 1]);
    expect(late.giggleUntil).toBeNull();
  });

  it("can giggle again after the laugh ends", () => {
    let clock = idleTickle();
    clock = noteTickleTap(clock, start);
    clock = noteTickleTap(clock, start + 100);
    clock = noteTickleTap(clock, start + 200);
    const after = clock.giggleUntil ?? start;
    const again = noteTickleTap(noteTickleTap(noteTickleTap(clock, after), after + 10), after + 20);
    expect(again.giggleUntil).toBe(after + 20 + TICKLE_GIGGLE_MS);
  });
});
