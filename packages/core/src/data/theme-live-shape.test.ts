import { describe, expect, it } from "vitest";
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
      [theme],
    );
    expect(result[0]?.verdict).toBe("flagged");
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
