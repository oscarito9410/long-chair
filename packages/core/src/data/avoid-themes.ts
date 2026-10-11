import type { AvoidTheme } from "./types.ts";

export const avoidThemes: readonly AvoidTheme[] = [
  {
    id: "illness",
    label: "Illness",
    detail: "Stories built around being sick",
  },
  {
    id: "hospitals",
    label: "Hospitals",
    detail: "Wards, clinics, and waiting rooms",
  },
  {
    id: "cancer",
    label: "Cancer",
    detail: "Diagnosis and treatment as the plot",
  },
  {
    id: "parent-death",
    label: "Losing a parent",
    detail: "Losing a mother or a father",
  },
  {
    id: "grief",
    label: "Grief",
    detail: "Mourning as the main thread",
  },
];

const clearedThemeIds = avoidThemes.map((theme) => theme.id);

export function clearedThemes(): readonly string[] {
  return clearedThemeIds;
}
