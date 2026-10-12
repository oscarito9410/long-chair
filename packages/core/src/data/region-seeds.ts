import { tasteGroups } from "./taste-groups.ts";
import type { TasteGroup } from "./taste-groups.ts";
import type { RegionCode } from "./regions.ts";

export const tasteGroupIds = ["watch", "listen", "play", "make"] as const;

export type TasteGroupId = (typeof tasteGroupIds)[number];

export type RegionSeed = {
  tasteId: string;
  groupId: TasteGroupId;
  outside: boolean;
};

const OUTSIDE_MIN = 1;
const OUTSIDE_MAX = 2;

type SeedRow = readonly [TasteGroupId, string, boolean];

const lists: Record<RegionCode, readonly SeedRow[]> = {
  MX: [
    ["watch", "telenovela", false],
    ["watch", "comedy", false],
    ["watch", "documentary", false],
    ["watch", "anime", true],
    ["listen", "bad-bunny", false],
    ["listen", "rock", false],
    ["listen", "jazz", true],
    ["play", "liga-mx", false],
    ["play", "soccer", false],
    ["play", "f1", false],
    ["make", "cooking", false],
    ["make", "history", false],
  ],
  US: [
    ["watch", "sitcoms", false],
    ["watch", "comedy", false],
    ["watch", "true-crime", false],
    ["watch", "anime", true],
    ["listen", "country", false],
    ["listen", "rock", false],
    ["listen", "kpop", true],
    ["play", "nfl", false],
    ["play", "mlb", false],
    ["play", "nba", false],
    ["make", "tech", false],
    ["make", "cooking", false],
  ],
  BR: [
    ["watch", "telenovela", false],
    ["watch", "comedy", false],
    ["watch", "anime", true],
    ["listen", "samba", false],
    ["listen", "bad-bunny", false],
    ["listen", "jazz", true],
    ["play", "soccer", false],
    ["play", "f1", false],
    ["make", "cooking", false],
    ["make", "history", false],
  ],
  ES: [
    ["watch", "telenovela", false],
    ["watch", "comedy", false],
    ["watch", "documentary", false],
    ["listen", "flamenco", false],
    ["listen", "classical", false],
    ["listen", "kpop", true],
    ["play", "soccer", false],
    ["play", "f1", false],
    ["make", "cooking", false],
    ["make", "history", false],
    ["watch", "anime", true],
  ],
  GB: [
    ["watch", "documentary", false],
    ["watch", "comedy", false],
    ["watch", "true-crime", false],
    ["watch", "anime", true],
    ["listen", "rock", false],
    ["listen", "classical", false],
    ["play", "soccer", false],
    ["play", "cricket", false],
    ["play", "f1", false],
    ["make", "history", false],
    ["make", "tech", false],
    ["listen", "kpop", true],
  ],
  IN: [
    ["watch", "bollywood", false],
    ["watch", "comedy", false],
    ["watch", "anime", true],
    ["listen", "classical", false],
    ["listen", "jazz", false],
    ["listen", "kpop", true],
    ["play", "cricket", false],
    ["play", "soccer", false],
    ["make", "cooking", false],
    ["make", "history", false],
  ],
  GLOBAL: [
    ["watch", "anime", false],
    ["watch", "studio-ghibli", false],
    ["watch", "comedy", false],
    ["listen", "kpop", false],
    ["listen", "jazz", false],
    ["listen", "rock", false],
    ["play", "soccer", false],
    ["play", "f1", false],
    ["play", "nba", false],
    ["make", "cooking", false],
    ["make", "tech", false],
    ["play", "liga-mx", true],
    ["listen", "country", true],
  ],
};

export function regionSeedList(region: RegionCode): readonly RegionSeed[] {
  return lists[region].map(([groupId, tasteId, outside]) => ({ tasteId, groupId, outside }));
}

export function outsideSeedCount(seeds: readonly RegionSeed[]): number {
  return seeds.filter((seed) => seed.outside).length;
}

export function outsideCountInRange(count: number): boolean {
  return count >= OUTSIDE_MIN && count <= OUTSIDE_MAX;
}

export function groupsFromSeeds(seeds: readonly RegionSeed[]): TasteGroup[] {
  return tasteGroups.map((group) => ({
    ...group,
    tasteIds: seeds.filter((seed) => seed.groupId === group.id).map((seed) => seed.tasteId),
  }));
}

export function groupsForRegion(region: RegionCode): TasteGroup[] {
  return groupsFromSeeds(regionSeedList(region));
}
