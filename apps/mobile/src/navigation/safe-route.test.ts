import { describe, expect, it } from "vitest";

import { itemIdFromParams, itemPath } from "./safe-route";

describe("item route params", () => {
  it("drops missing, blank, and sentinel ids", () => {
    expect(itemIdFromParams(undefined)).toBe("");
    expect(itemIdFromParams("")).toBe("");
    expect(itemIdFromParams("   ")).toBe("");
    expect(itemIdFromParams("undefined")).toBe("");
    expect(itemIdFromParams("null")).toBe("");
    expect(itemIdFromParams([])).toBe("");
  });

  it("reads the first id when the param arrives as an array", () => {
    expect(itemIdFromParams(["second-set", "extra"])).toBe("second-set");
    expect(itemIdFromParams(["  pebble  "])).toBe("pebble");
  });

  it("refuses path segments that would leave the item sheet", () => {
    expect(itemIdFromParams("../settings")).toBe("");
    expect(itemIdFromParams("a/b")).toBe("");
    expect(itemPath("")).toBeNull();
    expect(itemPath("undefined")).toBeNull();
    expect(itemPath("second-set")).toBe("/item/second-set");
  });
});
