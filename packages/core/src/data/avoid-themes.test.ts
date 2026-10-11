import { describe, expect, it } from "vitest";

import { plainThemeLabels } from "../lib/match-taste.ts";
import { avoidThemes } from "./avoid-themes.ts";
import { demoDraft } from "./demo-profile.ts";

describe("parent theme", () => {
  it("starts unchecked and is named Losing a parent", () => {
    const theme = avoidThemes.find((entry) => entry.id === "parent-death");
    expect(theme?.label).toBe("Losing a parent");
    expect(demoDraft.avoidIds.includes("parent-death")).toBe(false);
  });

  it("uses that name on comparison chips", () => {
    const labels = plainThemeLabels({
      ...demoDraft,
      avoidIds: [...demoDraft.avoidIds, "parent-death"],
    });
    expect(labels).toContain("Losing a parent");
    expect(labels.includes("Death of a parent")).toBe(false);
  });
});
