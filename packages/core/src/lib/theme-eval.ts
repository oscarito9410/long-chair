import { goldenTitles } from "../data/theme-golden.ts";
import type { GoldenTitle } from "../data/theme-golden.ts";
import { builtInThemeIds } from "../data/theme-rules.ts";
import type { BuiltInThemeId } from "../data/theme-rules.ts";
import { judgeSignals } from "../data/theme-signals.ts";
import type { ItemSignals, Verdict } from "../data/theme-signals.ts";

export type ThemeScore = {
  precision: number;
  recall: number;
};

export type ThemeScorecard = {
  perTheme: Record<BuiltInThemeId, ThemeScore>;
  meanPrecision: number;
  meanRecall: number;
  titleCount: number;
};

const SCORE_DIGITS = 2;

function signalsOf(row: GoldenTitle): ItemSignals {
  return {
    synopsis: row.synopsis,
    qlooTags: row.qlooTags,
    tmdbKeywords: row.tmdbKeywords,
    contentWarnings: row.contentWarnings,
  };
}

function ratio(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 1;
  }
  return numerator / denominator;
}

function scoreTheme(rows: readonly GoldenTitle[], themeId: BuiltInThemeId): ThemeScore {
  let truePositive = 0;
  let falsePositive = 0;
  let falseNegative = 0;
  for (const row of rows) {
    const verdicts = judgeSignals(signalsOf(row), [themeId]);
    const predicted: Verdict = verdicts[0]?.verdict ?? "unverified";
    const expected = row.expected[themeId];
    const flagged = predicted === "flagged";
    if (expected === "flagged" && flagged) {
      truePositive += 1;
    } else if (expected === "clear" && flagged) {
      falsePositive += 1;
    } else if (expected === "flagged" && !flagged) {
      falseNegative += 1;
    }
  }
  return {
    precision: ratio(truePositive, truePositive + falsePositive),
    recall: ratio(truePositive, truePositive + falseNegative),
  };
}

export function evaluateGolden(rows: readonly GoldenTitle[] = goldenTitles): ThemeScorecard {
  const perTheme = {
    illness: scoreTheme(rows, "illness"),
    hospitals: scoreTheme(rows, "hospitals"),
    cancer: scoreTheme(rows, "cancer"),
    "parent-death": scoreTheme(rows, "parent-death"),
    grief: scoreTheme(rows, "grief"),
  } satisfies Record<BuiltInThemeId, ThemeScore>;
  const scores = builtInThemeIds.map((id) => perTheme[id]);
  const meanPrecision = scores.reduce((sum, score) => sum + score.precision, 0) / scores.length;
  const meanRecall = scores.reduce((sum, score) => sum + score.recall, 0) / scores.length;
  return { perTheme, meanPrecision, meanRecall, titleCount: rows.length };
}

function fixed(value: number): string {
  return value.toFixed(SCORE_DIGITS);
}

export function sampleThemeScoreLine(card: ThemeScorecard = evaluateGolden()): string {
  return `Sample theme check. Mean precision ${fixed(card.meanPrecision)}, mean recall ${fixed(card.meanRecall)}. Not a live score.`;
}
