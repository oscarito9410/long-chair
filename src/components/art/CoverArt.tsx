import { hueVar, type Hue } from "../../tokens/tokens.ts";
import { coverLines, coverNumbers } from "./cover-seed.ts";

const frames = {
  poster: { w: 300, h: 420, max: 16, font: 28 },
  square: { w: 320, h: 320, max: 14, font: 26 },
  banner: { w: 640, h: 280, max: 22, font: 36 },
} as const;

export type CoverFrame = keyof typeof frames;

export function CoverArt({
  seed,
  title,
  hue,
  frame,
  decorative = false,
}: {
  seed: string;
  title: string;
  hue: Hue;
  frame: CoverFrame;
  decorative?: boolean;
}) {
  const box = frames[frame];
  const [a, b, c, d] = coverNumbers(seed);
  const lines = coverLines(title, box.max);
  const color = `var(${hueVar[hue]})`;
  const deep = `var(${hueVar[hue]}-deep)`;
  const filterId = `grain-${seed}`;
  const start = box.h - 36 - lines.length * (box.font + 4);

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
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width={box.w} height={box.h} fill={deep} />
      <circle cx={40 + (a % 180)} cy={30 + (b % 140)} r={50 + (c % 70)} fill={color} />
      <rect
        x={-20 + (d % 40)}
        y={box.h * 0.35}
        width={box.w + 40}
        height={28 + (a % 24)}
        fill="var(--lc-page)"
        opacity="0.22"
        transform={`rotate(${(b % 16) - 8} ${box.w / 2} ${box.h / 2})`}
      />
      <circle
        cx={box.w - 36 - (c % 40)}
        cy={box.h * 0.22}
        r={10 + (d % 16)}
        fill="var(--lc-card)"
      />
      <rect width={box.w} height={box.h} filter={`url(#${filterId})`} opacity="0.18" />
      <rect
        y={start - 16}
        width={box.w}
        height={box.h - start + 16}
        fill="var(--lc-ink)"
        opacity="0.4"
      />
      {lines.map((line, index) => (
        <text
          key={line}
          x="20"
          y={start + index * (box.font + 6)}
          fill="var(--lc-card)"
          fontFamily="Nunito, sans-serif"
          fontSize={box.font}
          fontWeight="800"
        >
          {line}
        </text>
      ))}
    </svg>
  );
}
