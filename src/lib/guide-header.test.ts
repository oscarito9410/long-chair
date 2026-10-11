import { describe, expect, it } from "vitest";

import { guideHeader, guideLead } from "./guide-header.ts";

describe("guideHeader", () => {
  it("joins the personality and the first sentence", () => {
    expect(guideLead("I'll sit with you. We can be quiet.")).toBe("I'll sit with you");
    expect(guideHeader("Steady", "I'll sit with you. We can be quiet.")).toBe(
      "Steady \u00b7 I'll sit with you",
    );
  });
});
