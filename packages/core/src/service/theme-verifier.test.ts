import { describe, expect, it } from "vitest";

import { itemById } from "../data/catalog.ts";
import { openingDraft } from "../data/demo-profile.ts";
import { addCustomTheme, customThemeFromLabel } from "../data/theme-signals.ts";
import { admissionFor, createHttpQlooTagSource, createHttpTmdbKeywordSource, createHttpWarningSource, createThemeVerifier, createFixtureKeywordSource, createFixtureTagSource, createFixtureWarningSource, explainItem } from "./theme-verifier.ts";

describe("ThemeVerifier", () => {
  it("clears a sample greenhouse film and flags the clinic episode for illness", () => {
    const film = itemById("north-window");
    const ward = itemById("ward-episode");
    expect(film).toBeDefined();
    expect(ward).toBeDefined();
    if (!film || !ward) {
      return;
    }
    const filmVerdicts = explainItem(film, openingDraft.avoidIds);
    expect(filmVerdicts.every((verdict) => verdict.verdict === "clear")).toBe(true);
    const wardVerdicts = explainItem(ward, ["illness", "hospitals"]);
    expect(wardVerdicts.find((verdict) => verdict.themeId === "illness")?.verdict).toBe("flagged");
    expect(wardVerdicts.find((verdict) => verdict.themeId === "hospitals")?.verdict).toBe("flagged");
    expect(admissionFor(ward, ["illness"])).toBe("block");
    expect(admissionFor(film, openingDraft.avoidIds)).toBe("clear");
  });

  it("keeps a silent source unverified and never calls the network without a key", async () => {
    const calls: string[] = [];
    const fetchImpl = () => {
      calls.push("hit");
      return Promise.resolve(new Response("{}", { status: 200 }));
    };
    expect(await createHttpQlooTagSource({ apiKey: undefined, fetchImpl }).tagsFor("x")).toBeNull();
    expect(await createHttpTmdbKeywordSource({ apiKey: undefined, fetchImpl }).keywordsFor("x")).toBeNull();
    expect(await createHttpWarningSource({ apiKey: undefined, fetchImpl }).warningsFor("x")).toBeNull();
    expect(calls).toEqual([]);

    const verifier = createThemeVerifier({
      tags: createFixtureTagSource({ "sample-1": null }),
      keywords: createFixtureKeywordSource({ "sample-1": [] }),
      warnings: createFixtureWarningSource({ "sample-1": [] }),
    });
    const verdicts = await verifier.verify("sample-1", "A garden and a long afternoon.", ["illness"]);
    expect(verdicts[0]?.verdict).toBe("unverified");
    expect(verdicts[0]?.verdict).not.toBe("clear");
  });

  it("flags a custom theme only from the synopsis and marks the miss as lower confidence", () => {
    const theme = customThemeFromLabel("train whistles");
    expect(theme).toBeDefined();
    if (!theme) {
      return;
    }
    const themes = addCustomTheme([], "train whistles");
    const film = itemById("north-window");
    expect(film).toBeDefined();
    if (!film) {
      return;
    }
    expect(admissionFor({ ...film, synopsis: "Train whistles at dusk." }, [], themes)).toBe("block");
    expect(admissionFor(film, [], themes)).toBe("caution");
    const miss = explainItem(film, [], themes)[0];
    expect(miss?.verdict).toBe("unverified");
    expect(miss?.evidence[0]?.confidence).toBe("low");
  });

  it("reads theme tags from the entity root of a realistic response", async () => {
    const fetchImpl = () =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            success: true,
            duration: 8,
            results: {
              entities: [
                {
                  name: "Ward Clock",
                  tags: [
                    {
                      id: "urn:tag:keyword:media:fictional_illness",
                      name: "Illness",
                      type: "urn:tag:keyword:media",
                    },
                  ],
                  properties: {
                    description: "A night shift.",
                    tags: [{ id: "urn:tag:keyword:media:buried", name: "Buried" }],
                  },
                },
              ],
            },
          }),
          { status: 200 },
        ),
      );
    const tags = await createHttpQlooTagSource({ apiKey: "example-key", fetchImpl }).tagsFor("ward-clock");
    expect(tags?.map((tag) => tag.name)).toEqual(["Illness"]);
  });

  it("maps a fixture tag payload when the Qloo key is present", async () => {
    const source = createHttpQlooTagSource({
      apiKey: "example-key",
      fetchImpl: () =>
        Promise.resolve(
          new Response(JSON.stringify({ tags: [{ id: "urn:tag:sample:illness", name: "illness" }] }), {
            status: 200,
          }),
        ),
    });
    const tags = await source.tagsFor("ward-episode");
    expect(tags?.[0]?.name).toBe("illness");
  });
});
