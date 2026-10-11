import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CoverArt } from "./CoverArt.tsx";

describe("CoverArt", () => {
  it("paints no text over the illustration", () => {
    const html = renderToStaticMarkup(
      createElement(CoverArt, {
        seed: "north-window",
        title: "North Window",
        hue: "apricot",
        frame: "poster",
        kind: "movie",
      }),
    );

    expect(html).not.toContain("<text");
    expect(html).toContain('aria-label="North Window"');
    expect(html).toContain("<svg");
  });

  it("keeps a decorative cover unlabeled", () => {
    const html = renderToStaticMarkup(
      createElement(CoverArt, {
        seed: "linen-rye",
        title: "Linen and Rye",
        hue: "honey",
        frame: "banner",
        kind: "bakery",
        decorative: true,
      }),
    );

    expect(html).not.toContain("<text");
    expect(html).toContain('aria-hidden="true"');
  });
});
