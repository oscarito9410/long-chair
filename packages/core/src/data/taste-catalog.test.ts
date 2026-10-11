import { describe, expect, it } from "vitest";

import { openingDraft } from "./demo-profile.ts";
import { topicsForSeeds } from "./companion.ts";
import {
  canContinueTastes,
  quickStartTastes,
  searchTasteCatalog,
  tasteCatalog,
  tasteKinds,
  tastePickLabel,
  tasteSearchPlaceholder,
  toggleTaste,
  welcomeNotesAt,
  welcomeTasteExamples,
} from "./taste-catalog.ts";

const DOMAIN_IDS = [
  "anime",
  "manga",
  "gaming",
  "fitness",
  "soccer",
  "liga-mx",
  "nba",
  "tech",
  "science",
  "true-crime",
  "reggaeton",
  "latin-pop",
  "kpop",
  "rock",
  "metal",
  "classical",
  "jazz",
  "cooking",
  "telenovela",
  "comedy",
  "documentary",
  "fantasy",
  "sci-fi",
  "history",
  "faith",
  "travel",
  "harbor-quest",
];

describe("taste catalog", () => {
  it("covers a broad shelf with a type and an icon", () => {
    expect(tasteCatalog.length).toBeGreaterThanOrEqual(80);
    expect(new Set(tasteCatalog.map((taste) => taste.kind))).toEqual(new Set(tasteKinds));
    for (const taste of tasteCatalog) {
      expect(taste.icon.length).toBeGreaterThan(0);
    }
    const ids = new Set(tasteCatalog.map((taste) => taste.id));
    for (const id of DOMAIN_IDS) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("matches Spanish spellings and keeps the Anime tag first", () => {
    expect(searchTasteCatalog("futbol")[0]?.id).toBe("soccer");
    expect(searchTasteCatalog("fútbol")[0]?.id).toBe("soccer");
    expect(searchTasteCatalog("anime")[0]).toMatchObject({ id: "anime", kind: "tag" });
    expect(searchTasteCatalog("a")).toEqual([]);
    expect(tasteSearchPlaceholder).toBe("Anime, a band, a show, a sport…");
  });

  it("asks for three picks and stops at eight", () => {
    expect(tastePickLabel(2)).toBe("2 of 3 picked");
    expect(tastePickLabel(3)).toBe("3 of 3 picked");
    expect(tastePickLabel(5)).toBe("5 picked");
    expect(canContinueTastes(2)).toBe(false);
    expect(canContinueTastes(3)).toBe(true);
    expect(canContinueTastes(8)).toBe(true);
    const full = ["a", "b", "c", "d", "e", "f", "g", "h"];
    expect(toggleTaste(full, "i")).toEqual(full);
    expect(toggleTaste(["anime"], "fitness")).toEqual(["anime", "fitness"]);
    expect(quickStartTastes.map((taste) => taste.id)).toContain("bad-bunny");
  });

  it("rotates welcome notes across personas", () => {
    expect(welcomeNotesAt(0)).toEqual(welcomeTasteExamples.slice(0, 4));
    expect(welcomeNotesAt(1)[0]).toBe("leg day");
    expect(welcomeTasteExamples).toEqual(
      expect.arrayContaining(["anime nights", "true crime", "Bad Bunny", "Studio Ghibli", "F1 races"]),
    );
  });

  it("starts onboarding empty and still names a new pick", () => {
    expect(openingDraft.seedIds).toEqual([]);
    const topics = topicsForSeeds(["anime", "paper-kite"]);
    expect(topics.some((topic) => topic.seedId === "anime" && topic.title === "Anime")).toBe(true);
    expect(topics.some((topic) => topic.seedId === "paper-kite")).toBe(true);
  });
});
