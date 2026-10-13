import { describe, expect, it } from "vitest";
import { builtInThemeIds, themeRules } from "./theme-rules.ts";
import cases from "../../fixtures/qloo-theme-shape.json";
import { judgeSignals } from "./theme-signals.ts";
import { tagsFromQlooBody } from "../service/theme-verifier.ts";

describe("catalog tag shapes", () => {
  it.each(cases)("flags $tag as $theme with no label clue", ({ tag, theme }) => {
    const result = judgeSignals(
      {
        synopsis: "",
        qlooTags: tagsFromQlooBody({
          results: { entities: [{ tags: [{ id: tag, name: null }] }] },
        }),
        tmdbKeywords: [],
        contentWarnings: [],
      },
      builtInThemeIds,
    );
    expect(
      result.filter((entry) => entry.verdict === "flagged").map((entry) => entry.themeId),
    ).toEqual([theme]);
  });
  it.each([
    "urn:tag:brand:media:hospital_visit",
    "urn:tag:keyword:media:hospitality",
    "urn:tag:keyword:media:death_offstage",
    "urn:tag:keyword:media:hospital_",
  ])("does not overmatch %s", (id) => {
    const result = judgeSignals(
      { synopsis: "", qlooTags: [{ id, name: "" }], tmdbKeywords: [], contentWarnings: [] },
      ["hospitals", "parent-death"],
    );
    expect(result.every((entry) => entry.verdict === "clear")).toBe(true);
  });
});

it("covers every production identifier and family in the shared parity corpus", () => {
  const tags = new Set(cases.map((entry) => entry.tag));
  for (const rule of themeRules) {
    for (const tag of rule.tagIds.filter((id) => !id.startsWith("urn:tag:sample:"))) {
      expect(tags.has(tag), tag).toBe(true);
    }
    for (const prefix of rule.tagPrefixes) {
      expect(tags.has(`${prefix}synthetic`), prefix).toBe(true);
    }
  }
});
