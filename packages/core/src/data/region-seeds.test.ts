import { describe, expect, it } from "vitest";

import { tasteById } from "./taste-catalog.ts";
import {
  groupsForRegion,
  outsideCountInRange,
  outsideSeedCount,
  regionSeedList,
} from "./region-seeds.ts";
import { regionCodes, regionFromLocale } from "./regions.ts";

describe("region seeds", () => {
  it("falls back when the locale has no supported country", () => {
    expect(regionFromLocale(undefined)).toBe("GLOBAL");
    expect(regionFromLocale("en")).toBe("GLOBAL");
    expect(regionFromLocale("fr-FR")).toBe("GLOBAL");
    expect(regionFromLocale("es-MX")).toBe("MX");
    expect(regionFromLocale("en_US")).toBe("US");
    expect(regionFromLocale("pt-BR")).toBe("BR");
    expect(regionFromLocale("es-ES")).toBe("ES");
    expect(regionFromLocale("en-GB")).toBe("GB");
    expect(regionFromLocale("hi-IN")).toBe("IN");
  });

  it("keeps one or two outside chips in every region", () => {
    for (const region of regionCodes) {
      const seeds = regionSeedList(region);
      expect(outsideCountInRange(outsideSeedCount(seeds))).toBe(true);
      for (const seed of seeds) {
        expect(tasteById(seed.tasteId)?.id).toBe(seed.tasteId);
      }
      expect(groupsForRegion(region).map((group) => group.id)).toEqual([
        "watch",
        "listen",
        "play",
        "make",
      ]);
    }
  });

  it("names the chips Oscar asked for in Mexico, the US, and the global mix", () => {
    const mexico = regionSeedList("MX").map((seed) => seed.tasteId);
    const states = regionSeedList("US").map((seed) => seed.tasteId);
    const global = regionSeedList("GLOBAL").map((seed) => seed.tasteId);
    expect(mexico).toEqual(expect.arrayContaining(["liga-mx", "telenovela", "bad-bunny"]));
    expect(states).toEqual(expect.arrayContaining(["nfl", "mlb", "country", "sitcoms"]));
    expect(global).toEqual(expect.arrayContaining(["anime", "soccer", "kpop", "jazz"]));
  });
});
