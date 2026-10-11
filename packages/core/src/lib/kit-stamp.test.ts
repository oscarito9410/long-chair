import { describe, expect, it } from "vitest";

import { kitStampLine } from "./kit-stamp.ts";

describe("kitStampLine", () => {
  it("reads the piece count and the chair length", () => {
    expect(kitStampLine(5, 240)).toBe("5 pieces \u00b7 4h 00m");
    expect(kitStampLine(1, 90)).toBe("1 piece \u00b7 1h 30m");
  });
});
