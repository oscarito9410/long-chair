import { describe, expect, it } from "vitest";

import { characterAccessories, characterMoods, characterShapes } from "./character-kinds.ts";
import {
  characterBody,
  characterEyeY,
  characterEyes,
  characterTone,
  eyeArcPath,
} from "./character-art.ts";
import { guides } from "./guides.ts";
import { hues } from "./hues.ts";
import { palette } from "../theme/tokens.ts";

describe("character art", () => {
  it("keeps a silhouette and an eye line for every shape", () => {
    expect(characterShapes).toHaveLength(7);
    expect(characterShapes).toContain("diamond");
    for (const shape of characterShapes) {
      const body = characterBody[shape];
      expect(body.startsWith("M")).toBe(true);
      expect(body.endsWith("Z")).toBe(true);
      expect(body.toLowerCase()).not.toContain("stroke");
      expect(characterEyeY[shape]).toBeGreaterThan(40);
      expect(characterEyeY[shape]).toBeLessThan(90);
    }
  });

  it("paints each hue deeper than the cream-page token", () => {
    for (const hue of hues) {
      expect(characterTone[hue].body).not.toBe(palette[hue]);
      expect(characterTone[hue].light).not.toBe(characterTone[hue].shade);
    }
  });

  it("expresses mood with two eyes and no mouth", () => {
    for (const mood of characterMoods) {
      expect(characterEyes(mood, 60)).toHaveLength(2);
    }
    const [grin] = characterEyes("grin", 60);
    expect(grin.kind).toBe("arc");
    expect(eyeArcPath(grin).startsWith("M")).toBe(true);
    const [curious] = characterEyes("curious", 60);
    const [smile] = characterEyes("smile", 60);
    expect(curious.x).toBeGreaterThan(smile.x);
  });

  it("keeps accessories on the variant even though they are not drawn", () => {
    expect(characterAccessories).toContain("bow");
    expect(guides.map((guide) => guide.variant.accessory)).toEqual([
      "scarf",
      "bow",
      "glasses",
      "leaf",
    ]);
  });
});
