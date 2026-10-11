import { describe, expect, it } from "vitest";

import { buildingLiveText, stepState } from "./step-state.ts";

const titles = ["Finding your favorites", "Matching across shelves", "Double-checking"];

describe("stepState", () => {
  it("marks earlier steps done, the current step active, and the rest empty", () => {
    expect(stepState(0, 1, 3)).toBe("done");
    expect(stepState(1, 1, 3)).toBe("active");
    expect(stepState(2, 1, 3)).toBe("pending");
  });

  it("has no active step once every step is done", () => {
    expect(stepState(0, 3, 3)).toBe("done");
    expect(stepState(2, 3, 3)).toBe("done");
  });
});

describe("buildingLiveText", () => {
  it("announces the current step", () => {
    expect(buildingLiveText(titles, 0)).toBe("Now. Finding your favorites.");
    expect(buildingLiveText(titles, 1)).toBe("Now. Matching across shelves.");
  });

  it("announces every finished step when the kit is ready", () => {
    expect(buildingLiveText(titles, 3)).toBe(
      "Finding your favorites. Matching across shelves. Double-checking. The kit is ready.",
    );
  });
});
