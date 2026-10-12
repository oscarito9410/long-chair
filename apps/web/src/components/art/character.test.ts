import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Character } from "./Character.tsx";

describe("Character", () => {
  it("paints one filled silhouette, two eyes, and no accessory", () => {
    const html = renderToStaticMarkup(
      createElement(Character, {
        variant: { shape: "pebble", hue: "seaglass", mood: "smile", accessory: "bow" },
        size: "md",
      }),
    );

    expect(html).toContain("<svg");
    expect(html).toContain("radialGradient");
    expect(html).toContain("<rect");
    expect(html).toContain("#ffffff");
    expect(html).toContain('data-expression="calm"');
    expect(html).not.toContain("stroke");
    expect(html).not.toContain("<ellipse");
    expect(html).not.toContain("M78 18");
  });

  it("draws a greeting diamond with a small smile", () => {
    const html = renderToStaticMarkup(
      createElement(Character, {
        variant: { shape: "diamond", hue: "wisteria", mood: "grin", accessory: "star" },
      }),
    );

    expect(html).toContain("M60 12");
    expect(html).toContain("Q");
    expect(html).toContain('data-expression="greeting"');
    expect(html).not.toContain("M78 18");
  });

  it("adds the settle motion classes only when asked", () => {
    const html = renderToStaticMarkup(
      createElement(Character, {
        variant: { shape: "arch", hue: "apricot", mood: "curious" },
        animate: true,
        settle: true,
      }),
    );

    expect(html).toContain("character-intro");
    expect(html).toContain("character-pose");
    expect(html).toContain("character-idle");
    expect(html).toContain("character-eyes");
    expect(html).toContain('data-expression="thinking"');
  });
});
