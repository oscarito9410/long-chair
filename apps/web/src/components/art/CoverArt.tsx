import { useId } from "react";
import type { Hue } from "../../tokens/tokens.ts";
import { coverNumbers } from "./cover-seed.ts";
import { accentHue, CoverScene, type CoverKind } from "./cover-scene.tsx";

const frames = {
  poster: { w: 300, h: 420 },
  square: { w: 320, h: 320 },
  banner: { w: 640, h: 280 },
} as const;

export type CoverFrame = keyof typeof frames;

export function CoverArt({
  seed,
  title,
  hue,
  frame,
  kind = "movie",
  decorative = false,
}: {
  seed: string;
  title: string;
  hue: Hue;
  frame: CoverFrame;
  kind?: CoverKind;
  decorative?: boolean;
}) {
  const box = frames[frame];
  const nums = coverNumbers(`${seed}:${kind}`);
  const accent = accentHue(hue, nums[1]);
  const filterId = `grain-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox={`0 0 ${box.w} ${box.h}`}
      className="cover-art"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
    >
      <defs>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <CoverScene box={box} hue={hue} accent={accent} kind={kind} nums={nums} />
      <rect width={box.w} height={box.h} filter={`url(#${filterId})`} opacity="0.16" />
    </svg>
  );
}
