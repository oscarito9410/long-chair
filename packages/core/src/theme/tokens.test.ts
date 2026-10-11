import { describe, expect, it } from "vitest";

import { palette, stickerTilt } from "./tokens.ts";

describe("shared tokens", () => {
  it("keeps the warm cream page and the four hues", () => {
    expect(palette.page).toBe("#f3eee6");
    expect(palette.apricot).toBe("#e7a784");
    expect(palette.seaglass).toBe("#7aaba3");
    expect(palette.honey).toBe("#e4c06a");
    expect(palette.wisteria).toBe("#c5b0d6");
  });

  it("tilts the welcome notes the way the web stage does", () => {
    expect(stickerTilt.jazz).toBeLessThan(0);
    expect(stickerTilt.mystery).toBeGreaterThan(0);
    expect(stickerTilt.bread).not.toBe(stickerTilt.light);
  });
});
