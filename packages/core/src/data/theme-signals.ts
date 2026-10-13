import { foldTasteText } from "./taste-catalog.ts";
import { builtInThemeIds, themeRuleById, themeRuleForTag } from "./theme-rules.ts";
import type { ThemeRule } from "./theme-rules.ts";

export const verdicts = ["clear", "flagged", "unverified"] as const;

export type Verdict = (typeof verdicts)[number];

export const evidenceSources = ["qloo", "tmdb", "does-the-dog-die", "keyword"] as const;

export type EvidenceSource = (typeof evidenceSources)[number];

export type EvidenceConfidence = "standard" | "low";

export type NamedTag = {
  id: string;
  name: string;
};

export type Evidence = {
  source: EvidenceSource;
  detail: string;
  confidence: EvidenceConfidence;
};

export type ThemeVerdict = {
  themeId: string;
  verdict: Verdict;
  evidence: readonly Evidence[];
};

/**
 * Null means that source did not answer. An empty list means it answered and found nothing.
 */
export type ItemSignals = {
  synopsis: string;
  qlooTags: readonly NamedTag[] | null;
  tmdbKeywords: readonly string[] | null;
  contentWarnings: readonly string[] | null;
};

export type CustomTheme = {
  id: string;
  label: string;
};

const CUSTOM_PREFIX = "custom-theme:";
const MIN_CUSTOM_FOLDED = 2;

const spokenClear = "Checked, no match.";

export function customThemeFromLabel(label: string): CustomTheme | undefined {
  const trimmed = label.trim();
  if (foldTasteText(trimmed).length < MIN_CUSTOM_FOLDED) {
    return undefined;
  }
  return { id: `${CUSTOM_PREFIX}${encodeURIComponent(trimmed)}`, label: trimmed };
}

export function addCustomTheme(
  themes: readonly CustomTheme[],
  label: string,
): readonly CustomTheme[] {
  const next = customThemeFromLabel(label);
  if (!next || themes.some((theme) => theme.id === next.id)) {
    return themes;
  }
  return [...themes, next];
}

export function customThemesOf(themes: readonly CustomTheme[] | undefined): readonly CustomTheme[] {
  return themes ?? [];
}

function containsFolded(haystack: string, needle: string): boolean {
  const foldedNeedle = foldTasteText(needle);
  if (foldedNeedle.length === 0) {
    return false;
  }
  return foldTasteText(haystack).includes(foldedNeedle);
}

function tagHit(rule: ThemeRule, tags: readonly NamedTag[]): string | undefined {
  for (const tag of tags) {
    if (themeRuleForTag(tag.id)?.id === rule.id) {
      return tag.name || tag.id;
    }
    if (rule.tagNames.some((name) => containsFolded(tag.name, name))) {
      return tag.name;
    }
  }
  return undefined;
}

function keywordHit(rule: ThemeRule, values: readonly string[]): string | undefined {
  for (const value of values) {
    if (rule.keywords.some((keyword) => containsFolded(value, keyword))) {
      return value;
    }
  }
  return undefined;
}

function synopsisHit(rule: ThemeRule, synopsis: string): string | undefined {
  return rule.keywords.find((keyword) => containsFolded(synopsis, keyword));
}

export function judgeRule(rule: ThemeRule, signals: ItemSignals): ThemeVerdict {
  const evidence: Evidence[] = [];
  const tag = signals.qlooTags ? tagHit(rule, signals.qlooTags) : undefined;
  if (tag) {
    evidence.push({ source: "qloo", detail: `Qloo tag "${tag}"`, confidence: "standard" });
  }
  const keyword = signals.tmdbKeywords ? keywordHit(rule, signals.tmdbKeywords) : undefined;
  if (keyword) {
    evidence.push({ source: "tmdb", detail: `TMDB keyword "${keyword}"`, confidence: "standard" });
  }
  const warning = signals.contentWarnings ? keywordHit(rule, signals.contentWarnings) : undefined;
  if (warning) {
    evidence.push({
      source: "does-the-dog-die",
      detail: `Content warning "${warning}"`,
      confidence: "standard",
    });
  }
  const synopsis = synopsisHit(rule, signals.synopsis);
  if (synopsis) {
    evidence.push({
      source: "keyword",
      detail: `Synopsis keyword "${synopsis}"`,
      confidence: "standard",
    });
  }
  if (evidence.length > 0) {
    return { themeId: rule.id, verdict: "flagged", evidence };
  }
  const tagsSpoke = signals.qlooTags !== null;
  const secondSpoke = signals.tmdbKeywords !== null || signals.contentWarnings !== null;
  if (tagsSpoke && secondSpoke) {
    return {
      themeId: rule.id,
      verdict: "clear",
      evidence: [
        { source: "qloo", detail: spokenClear, confidence: "standard" },
        {
          source: signals.tmdbKeywords !== null ? "tmdb" : "does-the-dog-die",
          detail: spokenClear,
          confidence: "standard",
        },
      ],
    };
  }
  return {
    themeId: rule.id,
    verdict: "unverified",
    evidence: [
      {
        source: "qloo",
        detail: "A source did not answer, so this is not clear.",
        confidence: "standard",
      },
    ],
  };
}

export function judgeCustom(theme: CustomTheme, synopsis: string): ThemeVerdict {
  if (containsFolded(synopsis, theme.label)) {
    return {
      themeId: theme.id,
      verdict: "flagged",
      evidence: [
        { source: "keyword", detail: `Synopsis contains "${theme.label}"`, confidence: "low" },
      ],
    };
  }
  return {
    themeId: theme.id,
    verdict: "unverified",
    evidence: [
      {
        source: "keyword",
        detail: `No synopsis keyword for "${theme.label}". Keyword-only, lower confidence.`,
        confidence: "low",
      },
    ],
  };
}

export function judgeSignals(
  signals: ItemSignals,
  themeIds: readonly string[],
  custom: readonly CustomTheme[] = [],
): readonly ThemeVerdict[] {
  const builtIn: ThemeVerdict[] = [];
  for (const id of themeIds) {
    const rule = themeRuleById(id);
    if (rule) {
      builtIn.push(judgeRule(rule, signals));
    }
  }
  return [...builtIn, ...custom.map((theme) => judgeCustom(theme, signals.synopsis))];
}

const wardTags: readonly NamedTag[] = [{ id: "urn:tag:sample:illness", name: "illness" }];

export function sampleSignals(item: { id: string; synopsis: string }): ItemSignals {
  if (item.id === "ward-episode") {
    return {
      synopsis: item.synopsis,
      qlooTags: wardTags,
      tmdbKeywords: ["clinic"],
      contentWarnings: [],
    };
  }
  return {
    synopsis: item.synopsis,
    qlooTags: [],
    tmdbKeywords: [],
    contentWarnings: [],
  };
}

export function clearedThemeIdsFor(item: { id: string; synopsis: string }): readonly string[] {
  const signals = sampleSignals(item);
  return builtInThemeIds.filter((id) => {
    const rule = themeRuleById(id);
    return rule ? judgeRule(rule, signals).verdict === "clear" : false;
  });
}
