import { describe, expect, it } from "vitest";

import { itemById } from "./catalog.ts";
import { nearbyPlaces } from "./companion.ts";

describe("duration facts", () => {
  it("keeps movie minutes and labels a book as estimated", () => {
    const film = itemById("north-window");
    const book = itemById("market-morning");
    expect(film?.minutes).toBe(108);
    expect(film?.durationSource).toBe("confirmed");
    expect(film?.links?.[0]?.label).toBe("Open in Apple TV");
    expect(book?.durationSource).toBe("estimated");
    expect(book?.durationNote).toContain("Estimated from page count");
    expect(book?.links?.[0]?.label).toBe("Open in Open Library");
    expect(nearbyPlaces.every((place) => place.openUntil === "")).toBe(true);
    expect(nearbyPlaces[0]?.mapUrl).toContain("maps.apple.com");
  });
});
