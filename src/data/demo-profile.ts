import { avoidThemes } from "./avoid-themes.ts";
import { TYPICAL_CHAIR_MINUTES } from "./durations.ts";
import { tasteSeeds } from "./taste-seeds.ts";
import type { SessionDraft } from "./types.ts";

export const demoDraft: SessionDraft = {
  seedIds: tasteSeeds.map((seed) => seed.id),
  avoidIds: avoidThemes.map((theme) => theme.id),
  durationMinutes: TYPICAL_CHAIR_MINUTES,
};
