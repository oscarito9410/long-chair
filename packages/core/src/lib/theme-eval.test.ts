import { describe, expect, it } from "vitest";

import fixture from "../../fixtures/theme-golden.json" with { type: "json" };
import { goldenTitles } from "../data/theme-golden.ts";
import type { GoldenTitle } from "../data/theme-golden.ts";
import { evaluateGolden, sampleThemeScoreLine } from "./theme-eval.ts";

describe("theme evaluation", () => {
  it("scores about fifty sample titles and shows an imperfect grief check", () => {
    const rows = fixture.titles as GoldenTitle[];
    expect(fixture.note.toLowerCase()).toContain("sample");
    expect(rows).toHaveLength(50);
    expect(rows.map((row) => row.id)).toEqual(goldenTitles.map((row) => row.id));
    expect(rows.every((row) => row.sample)).toBe(true);
    const card = evaluateGolden(rows);
    expect(card.titleCount).toBe(50);
    expect(card.perTheme.illness.precision).toBe(1);
    expect(card.perTheme.illness.recall).toBe(1);
    expect(card.perTheme.grief.precision).toBeLessThan(1);
    expect(card.perTheme.grief.recall).toBeLessThan(1);
    expect(card.meanPrecision).toBeGreaterThan(0.8);
    expect(card.meanRecall).toBeGreaterThan(0.8);
    expect(sampleThemeScoreLine(card)).toContain("Sample theme check");
    expect(sampleThemeScoreLine(card)).toContain("Not a live score");
  });
});
