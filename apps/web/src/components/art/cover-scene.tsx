import type { ReactNode } from "react";
import type { ContentKind, PlaceKind } from "@long-chair/core";
import { hues, hueVar, type Hue } from "../../tokens/tokens.ts";

export type CoverKind = ContentKind | PlaceKind;

type Box = { w: number; h: number };

function color(hue: Hue): string {
  return `var(${hueVar[hue]})`;
}

function deep(hue: Hue): string {
  return `var(${hueVar[hue]}-deep)`;
}

export function accentHue(primary: Hue, salt: number): Hue {
  const next = hues[(hues.indexOf(primary) + 1 + (salt % 3)) % hues.length];
  return next ?? "honey";
}

type Scene = {
  box: Box;
  hue: Hue;
  accent: Hue;
  a?: number;
  b?: number;
  c?: number;
  place?: PlaceKind;
};

function Film({ box, hue, accent, a = 0, b = 0 }: Scene) {
  return (
    <>
      <rect width={box.w} height={box.h} fill={deep(hue)} />
      <circle cx={box.w * 0.72} cy={40 + (a % 80)} r={70 + (b % 40)} fill={color(accent)} />
      <rect
        x={-40}
        y={box.h * 0.28}
        width={box.w + 80}
        height={36}
        fill="var(--lc-card)"
        opacity="0.28"
        transform={`rotate(-18 ${box.w / 2} ${box.h / 2})`}
      />
      <path d="M18 18h28M18 18v28" fill="none" stroke="var(--lc-card)" strokeWidth="4" />
      <path
        d={`M${box.w - 18} 18h-28M${box.w - 18} 18v28`}
        fill="none"
        stroke="var(--lc-card)"
        strokeWidth="4"
      />
    </>
  );
}

function Screens({ box, hue, accent, a = 0 }: Scene) {
  const w = box.w * 0.42;
  return (
    <>
      <rect width={box.w} height={box.h} fill={deep(hue)} />
      <rect x={box.w * 0.08} y={28} width={w} height={box.h * 0.42} rx="18" fill={color(hue)} />
      <rect
        x={box.w * 0.4}
        y={48 + (a % 24)}
        width={w}
        height={box.h * 0.36}
        rx="18"
        fill={color(accent)}
      />
      <rect
        x={box.w * 0.22}
        y={box.h * 0.38}
        width={w}
        height={box.h * 0.28}
        rx="16"
        fill="var(--lc-card)"
      />
    </>
  );
}

function Waves({ box, hue, accent, a = 0, b = 0, c = 0 }: Scene) {
  const bars = [a, b, c, 255 - a, (a + b) % 255, (b + c) % 255, a % 180, 80 + (c % 120)];
  const gap = box.w / (bars.length + 1);
  return (
    <>
      <rect width={box.w} height={box.h} fill={deep(hue)} />
      <circle
        cx={box.w / 2}
        cy={box.h * 0.36}
        r={box.w * 0.28}
        fill="none"
        stroke={color(hue)}
        strokeWidth="14"
      />
      <circle cx={box.w / 2} cy={box.h * 0.36} r={box.w * 0.16} fill={color(accent)} />
      {bars.map((height, index) => (
        <rect
          key={index}
          x={gap * (index + 0.55)}
          y={box.h * 0.72 - (height % 90)}
          width={gap * 0.42}
          height={28 + (height % 90)}
          rx="8"
          fill="var(--lc-card)"
          opacity="0.85"
        />
      ))}
    </>
  );
}

function Spine({ box, hue, accent }: Scene) {
  return (
    <>
      <rect width={box.w} height={box.h} fill={color(hue)} />
      <rect width={box.w * 0.22} height={box.h} fill={deep(hue)} />
      <rect x={box.w * 0.28} y={36} width={box.w * 0.56} height="8" fill={color(accent)} />
      <rect
        x={box.w * 0.28}
        y={56}
        width={box.w * 0.4}
        height="8"
        fill={deep(accent)}
        opacity="0.45"
      />
      <rect
        x={box.w * 0.28}
        y={76}
        width={box.w * 0.48}
        height="8"
        fill="var(--lc-card)"
        opacity="0.7"
      />
    </>
  );
}

function Stage({ box, hue, accent, a = 0 }: Scene) {
  return (
    <>
      <rect width={box.w} height={box.h} fill={deep(hue)} />
      <polygon
        points={`${box.w * 0.2},0 ${box.w * 0.8},0 ${box.w * 0.62},${box.h * 0.72} ${box.w * 0.38},${box.h * 0.72}`}
        fill={color(hue)}
        opacity="0.9"
      />
      <ellipse
        cx={box.w / 2}
        cy={box.h * 0.78}
        rx={box.w * 0.36}
        ry={28 + (a % 16)}
        fill={color(accent)}
      />
      <circle cx={box.w * 0.22} cy={36} r="8" fill="var(--lc-card)" />
      <circle cx={box.w * 0.78} cy={48} r="6" fill="var(--lc-card)" />
      <circle cx={box.w * 0.5} cy={24} r="5" fill={color(accent)} />
    </>
  );
}

function Table({ box, hue, accent, place = "bakery" }: Scene) {
  return (
    <>
      <rect width={box.w} height={box.h} fill={color(hue)} />
      <circle cx={box.w * 0.62} cy={box.h * 0.4} r={box.w * 0.22} fill="var(--lc-card)" />
      {place === "coffee" ? (
        <rect
          x={box.w * 0.28}
          y={box.h * 0.32}
          width={box.w * 0.22}
          height={box.h * 0.28}
          rx="12"
          fill={deep(accent)}
        />
      ) : null}
      {place === "kitchen" ? (
        <path
          d={`M${box.w * 0.22} ${box.h * 0.42} Q${box.w * 0.36} ${box.h * 0.7} ${box.w * 0.5} ${box.h * 0.42}`}
          fill={deep(hue)}
        />
      ) : null}
      {place === "bakery" ? (
        <circle cx={box.w * 0.3} cy={box.h * 0.38} r={28} fill={color(accent)} />
      ) : null}
    </>
  );
}

export function CoverScene({
  box,
  hue,
  accent,
  kind,
  nums,
}: {
  box: Box;
  hue: Hue;
  accent: Hue;
  kind: CoverKind;
  nums: readonly [number, number, number, number];
}): ReactNode {
  const [a, b, c] = nums;
  if (kind === "tv_show") {
    return <Screens box={box} hue={hue} accent={accent} a={a} />;
  }
  if (kind === "podcast") {
    return <Waves box={box} hue={hue} accent={accent} a={a} b={b} c={c} />;
  }
  if (kind === "book") {
    return <Spine box={box} hue={hue} accent={accent} />;
  }
  if (kind === "artist") {
    return <Stage box={box} hue={hue} accent={accent} a={a} />;
  }
  if (kind === "bakery" || kind === "kitchen" || kind === "coffee") {
    return <Table box={box} hue={hue} accent={accent} place={kind} />;
  }
  return <Film box={box} hue={hue} accent={accent} a={a} b={b} />;
}
