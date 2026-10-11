import type { ContentKind, Hue } from "@long-chair/core";
import Svg, { Circle, Ellipse, G, Polygon, Rect } from "react-native-svg";

import { hueDeep, hueFill, palette } from "../../theme/palette";
import { coverSalt } from "./cover-salt";

const posterWidth = 240;
const posterHeight = 320;

export function CoverArt({
  seed,
  hue,
  kind,
  width = posterWidth,
  height = posterHeight,
}: {
  seed: string;
  hue: Hue;
  kind: ContentKind;
  width?: number;
  height?: number;
}) {
  const [a, b, c] = coverSalt(seed);
  const fill = hueFill[hue];
  const deep = hueDeep[hue];
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${posterWidth} ${posterHeight}`}>
      <Scene kind={kind} fill={fill} deep={deep} a={a} b={b} c={c} />
    </Svg>
  );
}

function Scene({
  kind,
  fill,
  deep,
  a,
  b,
  c,
}: {
  kind: ContentKind;
  fill: string;
  deep: string;
  a: number;
  b: number;
  c: number;
}) {
  if (kind === "tv_show") {
    return <Screens fill={fill} deep={deep} a={a} />;
  }
  if (kind === "podcast") {
    return <Waves fill={fill} deep={deep} a={a} b={b} c={c} />;
  }
  if (kind === "book") {
    return <Spine fill={fill} deep={deep} />;
  }
  if (kind === "artist") {
    return <Stage fill={fill} deep={deep} a={a} />;
  }
  return <Film fill={fill} deep={deep} a={a} b={b} />;
}

function Film({ fill, deep, a, b }: { fill: string; deep: string; a: number; b: number }) {
  return (
    <>
      <Rect width={posterWidth} height={posterHeight} fill={deep} />
      <Circle cx={170} cy={40 + a} r={70 + (b % 40)} fill={fill} />
      <G transform="translate(18, 18)">
        <Rect width={28} height={4} fill={palette.card} />
        <Rect width={4} height={28} fill={palette.card} />
      </G>
    </>
  );
}

function Screens({ fill, deep, a }: { fill: string; deep: string; a: number }) {
  return (
    <>
      <Rect width={posterWidth} height={posterHeight} fill={deep} />
      <G transform="translate(20, 28)">
        <Rect width={100} height={130} rx={18} fill={fill} />
      </G>
      <G transform={`translate(96, ${48 + (a % 24)})`}>
        <Rect width={100} height={110} rx={18} fill={palette.card} />
      </G>
    </>
  );
}

function Waves({
  fill,
  deep,
  a,
  b,
  c,
}: {
  fill: string;
  deep: string;
  a: number;
  b: number;
  c: number;
}) {
  const bars = [a, b, c, 40, 55, 28];
  return (
    <>
      <Rect width={posterWidth} height={posterHeight} fill={deep} />
      <Circle cx={120} cy={120} r={64} fill="none" stroke={fill} strokeWidth={14} />
      <Circle cx={120} cy={120} r={36} fill={fill} />
      {bars.map((height, index) => (
        <G key={height + index} transform={`translate(${24 + index * 34}, ${240 - height})`}>
          <Rect width={16} height={28 + height} rx={8} fill={palette.card} />
        </G>
      ))}
    </>
  );
}

function Spine({ fill, deep }: { fill: string; deep: string }) {
  return (
    <>
      <Rect width={posterWidth} height={posterHeight} fill={fill} />
      <Rect width={52} height={posterHeight} fill={deep} />
      <G transform="translate(72, 36)">
        <Rect width={130} height={8} fill={deep} />
      </G>
      <G transform="translate(72, 56)">
        <Rect width={96} height={8} fill={palette.card} />
      </G>
    </>
  );
}

function Stage({ fill, deep, a }: { fill: string; deep: string; a: number }) {
  return (
    <>
      <Rect width={posterWidth} height={posterHeight} fill={deep} />
      <Polygon points="48,0 192,0 150,220 90,220" fill={fill} />
      <Ellipse cx={120} cy={250} rx={86} ry={28 + (a % 16)} fill={fill} />
      <Circle cx={52} cy={36} r={8} fill={palette.card} />
      <Circle cx={188} cy={48} r={6} fill={palette.card} />
    </>
  );
}
