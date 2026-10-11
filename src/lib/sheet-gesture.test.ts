import { describe, expect, it } from "vitest";

import { sheetShouldDismiss } from "./sheet-gesture.ts";

describe("sheetShouldDismiss", () => {
  it("closes after a downward swipe and ignores a short drag", () => {
    expect(sheetShouldDismiss(64)).toBe(true);
    expect(sheetShouldDismiss(120)).toBe(true);
    expect(sheetShouldDismiss(63)).toBe(false);
    expect(sheetShouldDismiss(-40)).toBe(false);
  });
});
