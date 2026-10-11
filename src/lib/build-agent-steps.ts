import type { AgentStep, SessionDraft } from "../data/types.ts";

export function buildAgentSteps(draft: SessionDraft): AgentStep[] {
  const themes = draft.avoidIds.length;
  const hours = Math.max(1, Math.round(draft.durationMinutes / 60));
  const themeTitle = themes === 1 ? "Leaving out 1 theme" : `Leaving out ${themes} themes`;
  const hourTitle = hours === 1 ? "Fitting 1 hour" : `Fitting ${hours} hours`;

  return [
    { id: "resolve", title: "Finding your favorites" },
    { id: "match", title: "Matching across shelves" },
    { id: "exclude", title: themeTitle },
    { id: "pack", title: hourTitle },
    { id: "check", title: "Double-checking" },
  ];
}
