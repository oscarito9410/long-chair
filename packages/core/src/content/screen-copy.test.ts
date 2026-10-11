import { describe, expect, it } from "vitest";

import {
  buildingReadyLabel,
  buildingSkipLabel,
  itemThemeCheck,
  themesLede,
} from "./screen-copy.ts";

describe("screen copy", () => {
  it("uses the shorter themes line", () => {
    expect(themesLede).toBe("We left out three. Change any.");
  });

  it("states the themes a piece does not carry", () => {
    expect(itemThemeCheck).toBe("No illness, hospital, or cancer themes.");
  });

  it("names the building escape as the kit", () => {
    expect(buildingSkipLabel).toBe("Show my kit now");
    expect(buildingReadyLabel).toBe("Your kit is ready");
  });
});
