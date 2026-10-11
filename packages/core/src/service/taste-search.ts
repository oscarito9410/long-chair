import { searchTasteCatalog, tasteById, tasteKindIcons, tasteKinds } from "../data/taste-catalog.ts";
import type { TasteEntity, TasteKind } from "../data/taste-catalog.ts";
import type { FetchLike, PlanSource } from "./kit-service.ts";

export type TasteSearchResult = {
  tastes: readonly TasteEntity[];
  source: PlanSource;
};

export type TasteSearchPort = {
  search(query: string): Promise<TasteSearchResult>;
};

const tasteKindSet = new Set<string>(tasteKinds);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readKind(value: unknown): TasteKind {
  if (typeof value === "string" && tasteKindSet.has(value)) {
    return value as TasteKind;
  }
  return "tag";
}

export function createFixtureTasteSearch(): TasteSearchPort {
  return {
    search(query) {
      return Promise.resolve({ tastes: searchTasteCatalog(query), source: "fixture" });
    },
  };
}

export function createHttpTasteSearch(apiUrl: string, fetchImpl: FetchLike = fetch): TasteSearchPort {
  const base = apiUrl.replace(/\/$/, "");
  return {
    async search(query) {
      const url = `${base}/v1/tastes/search?q=${encodeURIComponent(query)}`;
      const response = await fetchImpl(url);
      if (!response.ok) {
        throw new Error("Taste search is unavailable.");
      }
      const body: unknown = await response.json();
      if (!isRecord(body) || !Array.isArray(body.results)) {
        throw new Error("Taste search returned an unexpected list.");
      }
      const source = body.source === "live" ? "live" : "fake";
      const tastes: TasteEntity[] = [];
      for (const row of body.results) {
        if (!isRecord(row) || typeof row.id !== "string" || typeof row.name !== "string") {
          continue;
        }
        const known = tasteById(row.id);
        if (known) {
          tastes.push(known);
          continue;
        }
        const kind = readKind(row.kind);
        tastes.push({
          id: row.id,
          kind,
          name: row.name,
          detail: typeof row.detail === "string" ? row.detail : "",
          aliases: [],
          icon: tasteKindIcons[kind],
          quickStart: false,
        });
      }
      return { tastes, source };
    },
  };
}

export function createTasteSearch(apiUrl: string | undefined): TasteSearchPort {
  if (apiUrl && apiUrl.trim().length > 0) {
    return createHttpTasteSearch(apiUrl.trim());
  }
  return createFixtureTasteSearch();
}
