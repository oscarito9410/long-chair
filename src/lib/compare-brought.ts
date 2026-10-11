import { avoidThemes } from "../data/avoid-themes.ts";

const broughtIds = ["cancer", "hospitals", "illness"] as const;

export function compareBroughtLabels(): readonly string[] {
  return broughtIds.map((id) => {
    const theme = avoidThemes.find((entry) => entry.id === id);
    return theme?.label ?? id;
  });
}
