import { describe, expect, it } from "vitest";

import {
  buildingReadyLabel,
  buildingSkipLabel,
  evidenceSampleNote,
  itemThemeCheck,
  loveLede,
  themesLede,
  themesNote,
  whyItPassed,
} from "./screen-copy.ts";

describe("screen copy", () => {
  it("uses the shorter themes line", () => {
    expect(themesLede).toBe("All five start on. Turn any off, or add your own.");
    expect(themesNote).toBe("Only if it helps. You can change this anytime.");
    expect(loveLede).toBe("Pick three or more, or search for anything.");
    expect(whyItPassed).toBe("Why it passed");
    expect(evidenceSampleNote).toContain("Sample evidence");
  });

  it("states the themes a piece does not carry", () => {
    expect(itemThemeCheck).toBe("No illness, hospital, or cancer themes.");
  });

  it("names the building escape as the kit", () => {
    expect(buildingSkipLabel).toBe("Show my kit now");
    expect(buildingReadyLabel).toBe("Your kit is ready");
  });
});
