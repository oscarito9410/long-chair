import type { FetchLike } from "./kit-service.ts";
import type { CustomTheme, Evidence, ItemSignals, NamedTag, ThemeVerdict } from "../data/theme-signals.ts";
import { judgeSignals, sampleSignals } from "../data/theme-signals.ts";
import type { CatalogItem } from "../data/types.ts";

export type TagSource = {
  tagsFor(itemId: string): Promise<readonly NamedTag[] | null>;
};

export type KeywordSource = {
  keywordsFor(itemId: string): Promise<readonly string[] | null>;
};

export type WarningSource = {
  warningsFor(itemId: string): Promise<readonly string[] | null>;
};

export type ThemeVerifier = {
  verify(
    itemId: string,
    synopsis: string,
    themeIds: readonly string[],
    custom?: readonly CustomTheme[],
  ): Promise<readonly ThemeVerdict[]>;
};

export type PackAdmission = "clear" | "caution" | "block";

type KeyedFetch = {
  apiKey: string | undefined;
  fetchImpl?: FetchLike;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function namedTag(row: unknown): NamedTag | null {
  if (!isRecord(row) || typeof row.name !== "string") {
    return null;
  }
  const id = typeof row.id === "string" ? row.id : typeof row.tag_id === "string" ? row.tag_id : "";
  if (!id) {
    return null;
  }
  return { id, name: row.name };
}

function tagsOf(value: unknown): NamedTag[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((row) => {
    const tag = namedTag(row);
    return tag ? [tag] : [];
  });
}

export function tagsFromQlooBody(body: unknown): readonly NamedTag[] | null {
  if (!isRecord(body)) {
    return null;
  }
  const results = isRecord(body.results) ? body.results : null;
  const entities = results && Array.isArray(results.entities) ? results.entities : [];
  const fromEntities = entities.flatMap((entity) => (isRecord(entity) ? tagsOf(entity.tags) : []));
  if (fromEntities.length > 0) {
    return fromEntities;
  }
  const fromTagSearch = results ? tagsOf(results.tags) : [];
  if (fromTagSearch.length > 0) {
    return fromTagSearch;
  }
  const direct = tagsOf(body.tags);
  return direct.length > 0 ? direct : [];
}

export function createFixtureTagSource(table: Readonly<Record<string, readonly NamedTag[] | null>>): TagSource {
  return {
    tagsFor(itemId) {
      const found = table[itemId];
      return Promise.resolve(found === undefined ? null : found);
    },
  };
}

export function createFixtureKeywordSource(
  table: Readonly<Record<string, readonly string[] | null>>,
): KeywordSource {
  return {
    keywordsFor(itemId) {
      const found = table[itemId];
      return Promise.resolve(found === undefined ? null : found);
    },
  };
}

export function createFixtureWarningSource(
  table: Readonly<Record<string, readonly string[] | null>>,
): WarningSource {
  return {
    warningsFor(itemId) {
      const found = table[itemId];
      return Promise.resolve(found === undefined ? null : found);
    },
  };
}

export function createHttpQlooTagSource({ apiKey, fetchImpl = fetch }: KeyedFetch): TagSource {
  return {
    async tagsFor(itemId) {
      if (!apiKey) {
        return null;
      }
      const url = `https://hackathon.api.qloo.com/v2/tags?item=${encodeURIComponent(itemId)}`;
      const response = await fetchImpl(url, { headers: { "X-Api-Key": apiKey } });
      if (!response.ok) {
        return null;
      }
      const body: unknown = await response.json();
      return tagsFromQlooBody(body);
    },
  };
}

export function createHttpTmdbKeywordSource({ apiKey, fetchImpl = fetch }: KeyedFetch): KeywordSource {
  return {
    async keywordsFor(itemId) {
      if (!apiKey) {
        return null;
      }
      const url = `https://api.themoviedb.org/3/movie/${encodeURIComponent(itemId)}/keywords`;
      const response = await fetchImpl(url, { headers: { Authorization: `Bearer ${apiKey}` } });
      if (!response.ok) {
        return null;
      }
      const body: unknown = await response.json();
      if (!isRecord(body) || !Array.isArray(body.keywords)) {
        return null;
      }
      const names: string[] = [];
      for (const row of body.keywords) {
        if (isRecord(row) && typeof row.name === "string") {
          names.push(row.name);
        }
      }
      return names;
    },
  };
}

export function createHttpWarningSource({ apiKey, fetchImpl = fetch }: KeyedFetch): WarningSource {
  return {
    async warningsFor(itemId) {
      if (!apiKey) {
        return null;
      }
      const url = `https://www.doesthedogdie.com/media/${encodeURIComponent(itemId)}`;
      const response = await fetchImpl(url, { headers: { "X-Api-Key": apiKey } });
      if (!response.ok) {
        return null;
      }
      const body: unknown = await response.json();
      if (!isRecord(body) || !Array.isArray(body.warnings)) {
        return null;
      }
      return body.warnings.filter((warning): warning is string => typeof warning === "string");
    },
  };
}

export function createThemeVerifier(sources: {
  tags: TagSource;
  keywords: KeywordSource;
  warnings: WarningSource;
}): ThemeVerifier {
  return {
    async verify(itemId, synopsis, themeIds, custom = []) {
      const [qlooTags, tmdbKeywords, contentWarnings] = await Promise.all([
        sources.tags.tagsFor(itemId),
        sources.keywords.keywordsFor(itemId),
        sources.warnings.warningsFor(itemId),
      ]);
      const signals: ItemSignals = { synopsis, qlooTags, tmdbKeywords, contentWarnings };
      return judgeSignals(signals, themeIds, custom);
    },
  };
}

export function explainItem(
  item: Pick<CatalogItem, "id" | "synopsis">,
  themeIds: readonly string[],
  custom: readonly CustomTheme[] = [],
): readonly ThemeVerdict[] {
  return judgeSignals(sampleSignals(item), themeIds, custom);
}

export function cautionThemeIdsFor(
  item: Pick<CatalogItem, "id" | "synopsis">,
  themeIds: readonly string[],
  custom: readonly CustomTheme[] = [],
): readonly string[] {
  return explainItem(item, themeIds, custom)
    .filter(
      (verdict) => custom.some((theme) => theme.id === verdict.themeId) && verdict.verdict === "unverified",
    )
    .map((verdict) => verdict.themeId);
}

export function admissionFor(
  item: Pick<CatalogItem, "id" | "synopsis">,
  themeIds: readonly string[],
  custom: readonly CustomTheme[] = [],
): PackAdmission {
  const verdicts = explainItem(item, themeIds, custom);
  let caution = false;
  for (const verdict of verdicts) {
    const customTheme = custom.some((theme) => theme.id === verdict.themeId);
    if (!customTheme && verdict.verdict !== "clear") {
      return "block";
    }
    if (customTheme && verdict.verdict === "flagged") {
      return "block";
    }
    if (customTheme && verdict.verdict === "unverified") {
      caution = true;
    }
  }
  return caution ? "caution" : "clear";
}

export function evidenceLines(verdicts: readonly ThemeVerdict[]): readonly string[] {
  return verdicts.map((verdict) => {
    const detail = verdict.evidence.map((entry) => evidencePhrase(entry)).join(" ");
    return `${verdict.themeId}: ${verdict.verdict}. ${detail}`;
  });
}

function evidencePhrase(entry: Evidence): string {
  const note = entry.confidence === "low" ? " Lower confidence." : "";
  return `${entry.detail}${note}`;
}
