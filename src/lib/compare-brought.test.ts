import { describe, expect, it } from "vitest";

import { compareBroughtLabels } from "./compare-brought.ts";

describe("compareBroughtLabels", () => {
  it("names cancer, hospitals, and illness in that order", () => {
    expect(compareBroughtLabels()).toEqual(["Cancer", "Hospitals", "Illness"]);
  });
});
