import { describe, expect, it } from "vitest";

import type { FetchLike } from "./kit-service.ts";
import {
  createFixtureTasteSearch,
  createHttpTasteSearch,
  createTasteSearch,
} from "./taste-search.ts";

describe("taste search", () => {
  it("reads the local shelf as a sample", async () => {
    const found = await createFixtureTasteSearch().search("futbol");
    expect(found.source).toBe("fixture");
    expect(found.tastes[0]?.name).toBe("Soccer");
    const empty = await createTasteSearch(undefined).search("anime");
    expect(empty.source).toBe("fixture");
    expect(empty.tastes[0]?.kind).toBe("tag");
  });

  it("uses a known taste when the API returns its id", async () => {
    const fetchImpl: FetchLike = (url) => {
      expect(url).toBe("http://api.test/v1/tastes/search?q=futbol");
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            source: "fake",
            results: [{ id: "soccer", name: "Ignored", kind: "tag", detail: "x" }],
          }),
      });
    };
    const found = await createHttpTasteSearch("http://api.test", fetchImpl).search("futbol");
    expect(found.source).toBe("fake");
    expect(found.tastes[0]).toMatchObject({ id: "soccer", name: "Soccer", icon: "pin" });
  });

  it("keeps an unknown live hit and marks the source live", async () => {
    const fetchImpl: FetchLike = () =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            source: "live",
            results: [
              {
                id: "orbital-radio",
                name: "Orbital Radio",
                kind: "podcast",
                detail: "A night show",
              },
            ],
          }),
      });
    const found = await createHttpTasteSearch("http://api.test/", fetchImpl).search("orbital");
    expect(found.source).toBe("live");
    expect(found.tastes[0]).toMatchObject({
      id: "orbital-radio",
      name: "Orbital Radio",
      kind: "podcast",
      icon: "headphones",
    });
  });

  it("refuses a failed response", async () => {
    const fetchImpl: FetchLike = () =>
      Promise.resolve({ ok: false, status: 503, json: () => Promise.resolve({}) });
    await expect(
      createHttpTasteSearch("http://api.test", fetchImpl).search("anime"),
    ).rejects.toThrow(/unavailable/);
  });
});
