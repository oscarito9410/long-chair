import { itemById } from "../data/catalog.ts";
import { companionTopics, nearbyPlaces } from "../data/companion.ts";
import type {
  CatalogItem,
  CompanionTopic,
  NearbyPlace,
  PackedSession,
  SessionDraft,
} from "../data/types.ts";
import { packSession } from "../lib/pack-session.ts";

export type PlanSource = "fixture" | "fake" | "live" | "replay";

export type SessionPlan = {
  packed: PackedSession;
  items: readonly CatalogItem[];
  topics: readonly CompanionTopic[];
  places: readonly NearbyPlace[];
  source: PlanSource;
};

export type KitService = {
  plan(draft: SessionDraft): Promise<SessionPlan>;
};

export function createFixtureKitService(): KitService {
  return {
    plan(draft) {
      const packed = packSession(draft);
      const items: CatalogItem[] = [];
      for (const slot of packed.slots) {
        const item = itemById(slot.itemId);
        if (item) {
          items.push(item);
        }
      }
      return Promise.resolve({
        packed,
        items,
        topics: companionTopics.filter((topic) => draft.seedIds.includes(topic.seedId)),
        places: nearbyPlaces,
        source: "fixture",
      });
    },
  };
}

type FetchResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

export type FetchLike = (
  url: string,
  init?: { method?: string; headers?: Record<string, string>; body?: string },
) => Promise<FetchResponse>;

const planSources = new Set<PlanSource>(["fixture", "fake", "live", "replay"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`The session kit is missing ${key}.`);
  }
  return value;
}

function readNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number") {
    throw new Error(`The session kit is missing ${key}.`);
  }
  return value;
}

function readStringList(record: Record<string, unknown>, key: string): string[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new Error(`The session kit is missing ${key}.`);
  }
  const list: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") {
      throw new Error(`The session kit is missing ${key}.`);
    }
    list.push(entry);
  }
  return list;
}

async function postJson(fetchImpl: FetchLike, url: string, body: unknown): Promise<unknown> {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload: unknown = await response.json();
  if (!response.ok) {
    const message =
      isRecord(payload) && isRecord(payload.error) && typeof payload.error.message === "string"
        ? payload.error.message
        : "The session kit could not be planned.";
    throw new Error(message);
  }
  return payload;
}

function mapItem(value: unknown): CatalogItem {
  if (!isRecord(value)) {
    throw new Error("A kit piece was not an object.");
  }
  const kind = readString(value, "kind");
  if (
    kind !== "movie" &&
    kind !== "tv_show" &&
    kind !== "podcast" &&
    kind !== "book" &&
    kind !== "artist"
  ) {
    throw new Error("A kit piece has an unknown kind.");
  }
  return {
    id: readString(value, "id"),
    kind,
    title: readString(value, "title"),
    maker: readString(value, "maker"),
    minutes: readNumber(value, "minutes"),
    rank: readNumber(value, "rank"),
    synopsis: readString(value, "synopsis"),
    why: readString(value, "why"),
    becauseOf: readStringList(value, "becauseOf"),
    avoidedThemeIds: readStringList(value, "avoidedThemeIds"),
  };
}

function mapPlan(payload: unknown): SessionPlan {
  if (!isRecord(payload) || !isRecord(payload.packed)) {
    throw new Error("The session kit response was empty.");
  }
  const packedRecord = payload.packed;
  const slotValues = packedRecord.slots;
  if (!Array.isArray(slotValues)) {
    throw new Error("The session kit has no schedule.");
  }
  const slots = slotValues.map((slot) => {
    if (!isRecord(slot)) {
      throw new Error("A schedule row was not an object.");
    }
    return {
      itemId: readString(slot, "itemId"),
      startMinute: readNumber(slot, "startMinute"),
      endMinute: readNumber(slot, "endMinute"),
    };
  });
  const sourceValue = readString(payload, "source");
  if (!planSources.has(sourceValue as PlanSource)) {
    throw new Error("The session kit source is unknown.");
  }
  const itemsValue = payload.items;
  const topicsValue = payload.topics;
  const placesValue = payload.places;
  if (!Array.isArray(itemsValue) || !Array.isArray(topicsValue) || !Array.isArray(placesValue)) {
    throw new Error("The session kit is missing its lists.");
  }
  return {
    packed: {
      slots,
      filledMinutes: readNumber(packedRecord, "filledMinutes"),
      durationMinutes: readNumber(packedRecord, "durationMinutes"),
      openMinutes: readNumber(packedRecord, "openMinutes"),
    },
    items: itemsValue.map(mapItem),
    topics: topicsValue.map((topic) => {
      if (!isRecord(topic)) {
        throw new Error("A topic was not an object.");
      }
      return {
        id: readString(topic, "id"),
        seedId: readString(topic, "seedId"),
        title: readString(topic, "title"),
        prompt: readString(topic, "prompt"),
      };
    }),
    places: placesValue.map((place) => {
      if (!isRecord(place)) {
        throw new Error("A place was not an object.");
      }
      const kind = readString(place, "kind");
      if (kind !== "bakery" && kind !== "kitchen" && kind !== "coffee") {
        throw new Error("A place has an unknown kind.");
      }
      return {
        id: readString(place, "id"),
        kind,
        name: readString(place, "name"),
        offer: readString(place, "offer"),
        walkMinutes: readNumber(place, "walkMinutes"),
        openUntil: readString(place, "openUntil"),
        priceLabel: readString(place, "priceLabel"),
      };
    }),
    source: sourceValue as PlanSource,
  };
}

export function createHttpKitService(apiUrl: string, fetchImpl: FetchLike = fetch): KitService {
  const base = apiUrl.replace(/\/$/, "");
  return {
    async plan(draft) {
      const created = await postJson(fetchImpl, `${base}/v1/sessions`, {
        draft: {
          seedIds: [...draft.seedIds],
          avoidIds: [...draft.avoidIds],
          durationMinutes: draft.durationMinutes,
          companionId: draft.companionId,
        },
      });
      if (!isRecord(created)) {
        throw new Error("The session was not created.");
      }
      const sessionId = readString(created, "sessionId");
      const kit = await postJson(
        fetchImpl,
        `${base}/v1/sessions/${encodeURIComponent(sessionId)}/plan`,
        {},
      );
      return mapPlan(kit);
    },
  };
}

export function createKitService(apiUrl: string | undefined): KitService {
  if (apiUrl && apiUrl.trim().length > 0) {
    return createHttpKitService(apiUrl.trim());
  }
  return createFixtureKitService();
}
