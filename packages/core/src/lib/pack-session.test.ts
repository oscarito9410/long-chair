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
    expect(withPebble.slots.map((slot) => slot.itemId)).toContain("north-window");
  });

  it("packs a different shelf for contrasting tastes", () => {
    const anime = slotIds(["anime", "fitness", "tech"]);
    const latin = slotIds(["bad-bunny", "telenovela", "cooking"]);
    const travel = slotIds(["classical", "history", "travel"]);

    expect(anime).toEqual(["court-lines", "lantern-episode", "signal-hour", "field-notes-item"]);
    expect(latin).toEqual(["courtyard-hour", "one-pan-item", "patio-session-item"]);
    expect(travel).toEqual(["overland-item", "names-map-item", "small-hall-item", "south-road-item"]);
    expect(new Set([anime.join(), latin.join(), travel.join()]).size).toBe(3);
  });

  it("drops a clinic episode when illness is held out and keeps the chair short", () => {
    const open = slotIds(["anime", "fitness", "tech"], 240, []);
    const held = slotIds(["anime", "fitness", "tech"]);
    const short = slotIds(["anime", "fitness", "tech"], 90);

    expect(open).toContain("ward-episode");
    expect(held).not.toContain("ward-episode");
    expect(held).toContain("lantern-episode");
    expect(short).toEqual(["signal-hour", "field-notes-item", "lantern-episode"]);
    expect(short).not.toContain("court-lines");
  });
});

function slotIds(seedIds: readonly string[], minutes = 240, avoidIds: readonly string[] = ["illness"]) {
  return packSession({
    seedIds,
    avoidIds,
    durationMinutes: minutes,
    companionId: "pebble",
  }).slots.map((slot) => slot.itemId);
}
