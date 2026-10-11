import { describe, expect, it } from "vitest";

import { DIAL_MAX, DIAL_MIN, minutesFromPoint, snapMinutes } from "./dial-math";

const CENTER = 140;

describe("chair dial", () => {
  it("snaps to fifteen minute ticks inside the chair range", () => {
    expect(snapMinutes(67)).toBe(DIAL_MIN);
    expect(snapMinutes(73)).toBe(75);
    expect(snapMinutes(400)).toBe(DIAL_MAX);
  });

  it("keeps the dial math on the UI thread", () => {
    expect(snapMinutes.toString()).toContain("worklet");
    expect(minutesFromPoint.toString()).toContain("worklet");
  });

  it("reads the right-hand side of the dial as a short session", () => {
    const minutes = minutesFromPoint(CENTER + 80, CENTER, CENTER, CENTER);
    expect(minutes).toBeGreaterThanOrEqual(DIAL_MIN);
    expect(minutes).toBeLessThanOrEqual(DIAL_MAX);
    expect(minutes % 15).toBe(0);
  });
});
