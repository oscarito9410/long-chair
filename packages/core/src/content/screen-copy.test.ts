import { describe, expect, it } from "vitest";

import {
  buildingReadyLabel,
  buildingSkipLabel,
  evidenceSampleNote,
  itemThemeCheck,
  loveLede,
  keptOutSummary,
  themesContinue,
  themesLede,
  themesNote,
  themeSwitchLabel,
  whyItPassed,
} from "./screen-copy.ts";

describe("screen copy", () => {
  it("uses the shorter themes line", () => {
    expect(themesLede).toBe("We'll keep these out of your kit. Switch off any you're okay with.");
    expect(themesNote).toBe("You can change this anytime.");
    expect(themesContinue).toBe("Keep these and continue");
    expect(keptOutSummary(4, 5)).toBe("4 of 5 kept out");
    expect(themeSwitchLabel("Hospitals", false)).toBe("Hospitals, allowed");
    expect(themeSwitchLabel("Hospitals", true)).toBe("Hospitals, kept out");
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
