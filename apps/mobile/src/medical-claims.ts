const claimPhrases = [
  "helps treatment",
  "help with treatment",
  "reduces anxiety",
  "reduce anxiety",
  "reduces stress",
  "anxiety relief",
  "therapeutic",
  "clinically proven",
  "cures your",
  "heals your",
  "treats your",
  "treatment plan",
  "improves your health",
  "health outcome",
  "healthkit",
  "health & fitness",
  "health and fitness",
] as const;

export function findClaimPhrases(text: string): string[] {
  const folded = text.toLowerCase();
  return claimPhrases.filter((phrase) => folded.includes(phrase));
}
