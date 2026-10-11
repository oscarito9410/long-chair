import { useId } from "react";
import type { Hue } from "../../tokens/tokens.ts";
import { coverLines, coverNumbers } from "./cover-seed.ts";
import { accentHue, CoverScene, titleInk, type CoverKind } from "./cover-scene.tsx";

const frames = {
  poster: { w: 300, h: 420, max: 14, font: 32 },
  square: { w: 320, h: 320, max: 12, font: 30 },
  banner: { w: 640, h: 280, max: 18, font: 40 },
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
  const lines = coverLines(title, box.max);
  const accent = accentHue(hue, nums[1]);
  const filterId = `grain-${useId().replace(/:/g, "")}`;
  const ink = titleInk(kind);
  const font = box.font + (nums[2] % 6) - 2;
  const alignMiddle = kind === "podcast" || kind === "artist";
  const start = box.h - 28 - lines.length * (font + 6);

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
      {lines.map((line, index) => (
        <text
          key={`${line}-${index}`}
          x={alignMiddle ? box.w / 2 : 22}
          y={start + index * (font + 8)}
          textAnchor={alignMiddle ? "middle" : "start"}
          fill={ink ? "var(--lc-ink)" : "var(--lc-card)"}
          fontFamily="Nunito, sans-serif"
          fontSize={font}
          fontWeight="800"
          letterSpacing={kind === "book" ? 1.5 : kind === "podcast" ? 0.5 : -0.4}
        >
          {line}
        </text>
      ))}
    </svg>
  );
}
