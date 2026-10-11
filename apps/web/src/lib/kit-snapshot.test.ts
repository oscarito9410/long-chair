import { describe, expect, it } from "vitest";

import { demoDraft } from "@long-chair/core";
import { kitSnapshot } from "./kit-snapshot.ts";
import { packSession } from "@long-chair/core";

describe("kitSnapshot", () => {
  it("stores the packed kit as json", () => {
    const packed = packSession(demoDraft);
    const snapshot = JSON.parse(kitSnapshot(packed)) as {
      slots: unknown[];
      durationMinutes: number;
    };

    expect(snapshot.durationMinutes).toBe(packed.durationMinutes);
    expect(snapshot.slots).toHaveLength(packed.slots.length);
  });
});
