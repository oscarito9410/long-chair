export type StepState = "pending" | "active" | "done";

export function stepState(index: number, shown: number, total: number): StepState {
  if (index < shown) {
    return "done";
  }
  if (shown < total && index === shown) {
    return "active";
  }
  return "pending";
}

export function buildingLiveText(titles: readonly string[], shown: number): string {
  if (shown >= titles.length) {
    const finished = titles.filter((title) => title.length > 0).join(". ");
    return finished.length > 0 ? `${finished}. The kit is ready.` : "The kit is ready.";
  }
  const current = titles[shown] ?? "Starting";
  return `Now. ${current}.`;
}
