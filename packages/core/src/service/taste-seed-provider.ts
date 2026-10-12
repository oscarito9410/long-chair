import { groupsFromSeeds, regionSeedList } from "../data/region-seeds.ts";
import type { RegionSeed } from "../data/region-seeds.ts";
import type { TasteGroup } from "../data/taste-groups.ts";
import type { RegionCode } from "../data/regions.ts";
import type { FetchLike } from "./kit-service.ts";

/**
 * Ranks the quick-start chips for a region.
 * The static adapter is the authored list. A Qloo adapter can reorder it
 * once a key exists. Typed search stays on TasteSearchPort.
 */
export type TasteSeedProvider = {
  seedsFor(region: RegionCode): Promise<readonly RegionSeed[]>;
};

export type PopularityHit = {
  tasteId: string;
  score: number;
};

const QLOO_SEED_URL = "https://hackathon.api.qloo.com/v2/insights";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function createStaticTasteSeedProvider(): TasteSeedProvider {
  return {
    seedsFor(region) {
      return Promise.resolve(regionSeedList(region));
    },
  };
}

export function rankSeeds(
  seeds: readonly RegionSeed[],
  hits: readonly PopularityHit[],
): RegionSeed[] {
  const score = new Map(hits.map((hit) => [hit.tasteId, hit.score]));
  return [...seeds].sort(
    (left, right) => (score.get(right.tasteId) ?? 0) - (score.get(left.tasteId) ?? 0),
  );
}

export function createFakePopularitySeedProvider(
  hits: readonly PopularityHit[],
): TasteSeedProvider {
  return {
    seedsFor(region) {
      return Promise.resolve(rankSeeds(regionSeedList(region), hits));
    },
  };
}

export function createHttpQlooTasteSeedProvider(options: {
  apiKey: string | undefined;
  fetchImpl?: FetchLike;
}): TasteSeedProvider {
  const fetchImpl = options.fetchImpl ?? fetch;
  return {
    async seedsFor(region) {
      const base = regionSeedList(region);
      if (!options.apiKey) {
        return base;
      }
      const url = `${QLOO_SEED_URL}?region=${encodeURIComponent(region)}&feature=popularity`;
      const response = await fetchImpl(url, { headers: { "X-Api-Key": options.apiKey } });
      if (!response.ok) {
        return base;
      }
      const body: unknown = await response.json();
      if (!isRecord(body) || !Array.isArray(body.results)) {
        return base;
      }
      const hits: PopularityHit[] = [];
      for (const row of body.results) {
        if (isRecord(row) && typeof row.tasteId === "string" && typeof row.score === "number") {
          hits.push({ tasteId: row.tasteId, score: row.score });
        }
      }
      return rankSeeds(base, hits);
    },
  };
}

export function createTasteSeedProvider(apiKey: string | undefined): TasteSeedProvider {
  if (apiKey && apiKey.trim().length > 0) {
    return createHttpQlooTasteSeedProvider({ apiKey: apiKey.trim() });
  }
  return createStaticTasteSeedProvider();
}

export function groupsFromProviderSeeds(seeds: readonly RegionSeed[]): TasteGroup[] {
  return groupsFromSeeds(seeds);
}
