import { describe, expect, it } from "vitest";

import { packSession } from "./pack-session.ts";

describe("packSession", () => {
  it("leaves the chair open when nothing is selected", () => {
    const packed = packSession({
      seedIds: [],
      avoidIds: [],
      durationMinutes: 120,
      companionId: "pebble",
    });

    expect(packed.slots).toEqual([]);
    expect(packed.filledMinutes).toBe(0);
    expect(packed.openMinutes).toBe(120);
    expect(packed.durationMinutes).toBe(120);
  });

  it("ignores the companion when it packs", () => {
    const draft = {
      seedIds: ["paper-kite"],
      avoidIds: [],
      durationMinutes: 240,
      companionId: "pebble",
    };
    const withPebble = packSession(draft);
    const withLumen = packSession({ ...draft, companionId: "lumen" });

    expect(withLumen.slots).toEqual(withPebble.slots);
  });
});
