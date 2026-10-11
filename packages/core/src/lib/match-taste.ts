import { avoidThemes } from "../data/avoid-themes.ts";
import { plainModelExample } from "../data/comparison.ts";
import { tasteSeeds } from "../data/taste-seeds.ts";
import type { CatalogItem, SessionDraft } from "../data/types.ts";

export function matchingSeedNames(item: CatalogItem, draft: SessionDraft): string[] {
  const names: string[] = [];
  for (const id of item.becauseOf) {
    if (!draft.seedIds.includes(id)) {
      continue;
    }
    const seed = tasteSeeds.find((entry) => entry.id === id);
    if (seed) {
      names.push(seed.name);
    }
  }
  return names;
}

export function avoidedLabels(item: CatalogItem, draft: SessionDraft): string[] {
  const labels: string[] = [];
  for (const id of item.avoidedThemeIds) {
    if (!draft.avoidIds.includes(id)) {
      continue;
    }
    const theme = avoidThemes.find((entry) => entry.id === id);
    if (theme) {
      labels.push(theme.label);
    }
  }
  return labels;
}

export function exceptionLabels(item: CatalogItem, draft: SessionDraft): string[] {
  const labels: string[] = [];
  for (const id of draft.avoidIds) {
    if (item.avoidedThemeIds.includes(id)) {
      continue;
    }
    const theme = avoidThemes.find((entry) => entry.id === id);
    if (theme) {
      labels.push(theme.label);
    }
  }
  return labels;
}

export function plainThemeLabels(draft: SessionDraft): string[] {
  const labels: string[] = [];
  for (const id of plainModelExample.themeIds) {
    if (!draft.avoidIds.includes(id)) {
      continue;
    }
    const theme = avoidThemes.find((entry) => entry.id === id);
    if (theme) {
      labels.push(theme.label);
    }
  }
  return labels;
}
