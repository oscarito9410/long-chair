import { describe, expect, it } from "vitest";

import { parseRoute } from "./parse-route.ts";

describe("parseRoute", () => {
  it("hides the expression gallery unless the build is a dev build", () => {
    expect(parseRoute("#/expressions").name).toBe("unknown");
    expect(parseRoute("#/expressions", false).name).toBe("unknown");
    expect(parseRoute("#/expressions", true).name).toBe("expressions");
  });
});
