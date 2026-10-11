import { avoidThemes } from "../data/avoid-themes.ts";
import { tasteSeeds } from "../data/taste-seeds.ts";
import type { AgentStep, SessionDraft } from "../data/types.ts";
import { formatHoursMinutes } from "./format-duration.ts";

export function buildAgentSteps(draft: SessionDraft): AgentStep[] {
  const names = tasteSeeds
    .filter((seed) => draft.seedIds.includes(seed.id))
    .map((seed) => seed.name);
  const themes = avoidThemes
    .filter((theme) => draft.avoidIds.includes(theme.id))
    .map((theme) => theme.label);

  return [
    {
      id: "resolve",
      title: "Resolve the names you gave",
      detail: names.length > 0 ? names.join(", ") : "Nothing named yet",
    },
    {
      id: "match",
      title: "Match taste across the shelf",
      detail: "Films, episodes, podcasts, books, and music",
    },
    {
      id: "exclude",
      title: "Leave the marked themes out",
      detail: themes.length > 0 ? themes.join(", ") : "No themes marked",
    },
    {
      id: "check",
      title: "Check every pick a second time",
      detail: "Titles and descriptions, against the same list",
    },
    {
      id: "pack",
      title: "Fit what remains to the chair",
      detail: formatHoursMinutes(draft.durationMinutes),
    },
  ];
}
