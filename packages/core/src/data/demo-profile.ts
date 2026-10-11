import { avoidThemes } from "./avoid-themes.ts";
import { TYPICAL_CHAIR_MINUTES } from "./durations.ts";
import { tasteSeeds } from "./taste-seeds.ts";
import type { SessionDraft } from "./types.ts";

/**
 * A mixed sample: most of the shelf is in the room, one film is not,
 * and two themes are left available. The four-hour kit still fills.
 */
const heldAsideSeedIds = new Set(["sunday-engines"]);
const availableThemeIds = new Set(["grief", "parent-death"]);

export const demoDraft: SessionDraft = {
  seedIds: tasteSeeds.map((seed) => seed.id).filter((id) => !heldAsideSeedIds.has(id)),
  avoidIds: avoidThemes.map((theme) => theme.id).filter((id) => !availableThemeIds.has(id)),
  durationMinutes: TYPICAL_CHAIR_MINUTES,
  companionId: "pebble",
};
