import { describe, expect, it } from "vitest";

import { demoDraft } from "../data/demo-profile.ts";
import type { FetchLike } from "./kit-service.ts";
import { createFixtureKitService, createHttpKitService } from "./kit-service.ts";

describe("createFixtureKitService", () => {
  it("packs the sample chair without a network", async () => {
    const plan = await createFixtureKitService().plan(demoDraft);

    expect(plan.source).toBe("fixture");
    expect(plan.packed.slots).toHaveLength(5);
    expect(plan.items).toHaveLength(5);
    expect(plan.packed.openMinutes).toBe(0);
    expect(plan.places.length).toBeGreaterThan(0);
  });
});

describe("createHttpKitService", () => {
  it("plans through the session API and does not send a catalog key", async () => {
    const calls: { url: string; headers: Record<string, string> | undefined }[] = [];
    const fetchImpl: FetchLike = (url, init) => {
      calls.push({ url, headers: init?.headers });
      if (url.endsWith("/v1/sessions")) {
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () => Promise.resolve({ sessionId: "sess-1" }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            source: "fake",
            packed: {
              slots: [{ itemId: "north-window", startMinute: 0, endMinute: 108 }],
              filledMinutes: 108,
              durationMinutes: 240,
              openMinutes: 132,
            },
            items: [
              {
                id: "north-window",
                kind: "movie",
                title: "North Window",
                maker: "Sample",
                minutes: 108,
                rank: 1,
                synopsis: "A quiet film.",
                why: "Because you love The Paper Kite.",
                becauseOf: ["paper-kite"],
                avoidedThemeIds: [],
              },
            ],
            topics: [],
            places: [],
          }),
      });
    };

    const plan = await createHttpKitService("http://127.0.0.1:8099/", fetchImpl).plan(demoDraft);

    expect(plan.source).toBe("fake");
    expect(plan.items[0]?.title).toBe("North Window");
    expect(calls.map((call) => call.url)).toEqual([
      "http://127.0.0.1:8099/v1/sessions",
      "http://127.0.0.1:8099/v1/sessions/sess-1/plan",
    ]);
    for (const call of calls) {
      expect(call.headers).toEqual({ "Content-Type": "application/json" });
      expect(JSON.stringify(call.headers)).not.toContain("QLOO");
    }
  });

  it("surfaces the API error message", async () => {
    const fetchImpl: FetchLike = () =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({ error: { code: "invalid_body", message: "The draft is not valid." } }),
      });

    await expect(
      createHttpKitService("http://127.0.0.1:8099", fetchImpl).plan(demoDraft),
    ).rejects.toThrow("The draft is not valid.");
  });
});
