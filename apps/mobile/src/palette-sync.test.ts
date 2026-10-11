import { readFileSync } from "node:fs";
import { join } from "node:path";
import { palette } from "@long-chair/core";
import { describe, expect, it } from "vitest";

const repoRoot = join(import.meta.dirname, "../../..");

describe("shared paint", () => {
  it("matches the hex values in the web stylesheet", () => {
    const css = readFileSync(join(repoRoot, "apps/web/src/index.css"), "utf8").toLowerCase();
    const hexes = Object.values(palette).filter((value) => /^#[0-9a-f]{6}$/i.test(value));
    const missing = hexes.filter((hex) => !css.includes(hex.toLowerCase()));
    expect(missing).toEqual([]);
  });
});
