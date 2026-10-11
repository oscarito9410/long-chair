import { describe, expect, it } from "vitest";

import { columnWidth, TILE_ASPECT } from "./columns";

const PADDING = 24;
const GAP = 16;
const NAME_FLOOR = 120;

describe("company tile columns", () => {
  it("keeps two tiles side by side at 390 and 440 points", () => {
    for (const screen of [390, 440]) {
      const tile = columnWidth(screen, PADDING, GAP);
      expect(tile).toBeGreaterThan(NAME_FLOOR);
      expect(tile * 2 + GAP).toBe(screen - PADDING * 2);
      expect(tile * TILE_ASPECT).toBeGreaterThan(tile);
    }
  });
});
