import { describe, expect, it } from "vitest";

import { outsideSeedCount, regionSeedList } from "../data/region-seeds.ts";
import {
  createFakePopularitySeedProvider,
  createHttpQlooTasteSeedProvider,
  createStaticTasteSeedProvider,
  rankSeeds,
} from "./taste-seed-provider.ts";

describe("TasteSeedProvider", () => {
  it("returns the static list when no key is present", async () => {
    const provider = createStaticTasteSeedProvider();
    const seeds = await provider.seedsFor("MX");
    expect(seeds.map((seed) => seed.tasteId)).toEqual(
      regionSeedList("MX").map((seed) => seed.tasteId),
    );
  });

  it("ranks fixture popularity without dropping the outside chips", async () => {
    const hits = [
      { tasteId: "bad-bunny", score: 0.2 },
      { tasteId: "liga-mx", score: 0.9 },
    ];
    const provider = createFakePopularitySeedProvider(hits);
    const seeds = await provider.seedsFor("MX");
    expect(seeds[0]?.tasteId).toBe("liga-mx");
    expect(outsideSeedCount(seeds)).toBe(outsideSeedCount(regionSeedList("MX")));
    expect(rankSeeds(regionSeedList("US"), []).map((seed) => seed.tasteId)).toEqual(
      regionSeedList("US").map((seed) => seed.tasteId),
    );
  });

  it("does not call Qloo without a key and maps a fixture payload when the key is set", async () => {
    const calls: string[] = [];
    const quiet = createHttpQlooTasteSeedProvider({
      apiKey: undefined,
      fetchImpl: () => {
        calls.push("quiet");
        return Promise.resolve(new Response("{}", { status: 200 }));
      },
    });
    expect((await quiet.seedsFor("US")).length).toBeGreaterThan(0);
    expect(calls).toEqual([]);

    const live = createHttpQlooTasteSeedProvider({
      apiKey: "example-key",
      fetchImpl: () =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              results: [
                { tasteId: "nfl", score: 0.4 },
                { tasteId: "mlb", score: 0.95 },
              ],
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          ),
        ),
    });
    const ranked = await live.seedsFor("US");
    expect(ranked[0]?.tasteId).toBe("mlb");
    expect(ranked.map((seed) => seed.tasteId)).toEqual(
      expect.arrayContaining(["nfl", "anime", "kpop"]),
    );
  });
});
