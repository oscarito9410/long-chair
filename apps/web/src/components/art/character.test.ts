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
    expect(html).not.toContain("stroke");
    expect(html).not.toContain("<ellipse");
    expect(html).not.toContain("M78 18");
  });

  it("draws a diamond and a happy arc without a mouth", () => {
    const html = renderToStaticMarkup(
      createElement(Character, {
        variant: { shape: "diamond", hue: "wisteria", mood: "grin", accessory: "star" },
      }),
    );

    expect(html).toContain("M60 12");
    expect(html).toContain("Q");
    expect(html.match(/<rect/g)).toBeNull();
  });

  it("adds the settle motion classes only when asked", () => {
    const html = renderToStaticMarkup(
      createElement(Character, {
        variant: { shape: "arch", hue: "apricot", mood: "curious" },
        animate: true,
        settle: true,
      }),
    );

    expect(html).toContain("character-settle");
    expect(html).toContain("character-glance");
    expect(html).toContain("character-eyes");
  });
});
