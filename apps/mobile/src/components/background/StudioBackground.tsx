import { hues, type Hue } from "@long-chair/core";
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  Rect,
  Skia,
  usePathInterpolation,
  vec,
} from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useDerivedValue, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { useReducedMotion } from "../../motion/use-reduced-motion";
import { hueFill, palette } from "../../theme/palette";

const BLOB_REST =
  "M30 90C10 40 60 8 110 24C160 8 190 50 176 96C196 150 140 186 90 172C36 168 8 130 30 90Z";
const BLOB_MORPH =
  "M48 78C22 48 70 16 118 36C168 20 188 70 164 112C184 162 120 178 78 160C28 150 12 112 48 78Z";
const MORPH_MS = 9000;
const DRIFT_MS = 7000;
const DOT_COLUMNS = 7;
const DOT_ROWS = 12;
const DOT_RADIUS = 3.4;
const DOT_ALPHA = 0.62;
const BLOB_BLUR = 28;
const SWAY = 28;

function blobPath(svg: string) {
  return Skia.Path.MakeFromSVGString(svg) ?? Skia.Path.Make();
}

export function StudioBackground() {
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const morph = useSharedValue(0);
  const sway = useSharedValue(0);
  const paths = useMemo(() => [blobPath(BLOB_REST), blobPath(BLOB_MORPH)], []);

  useEffect(() => {
    morph.value = reduced ? 0 : withRepeat(withTiming(1, { duration: MORPH_MS }), -1, true);
    sway.value = reduced ? 0 : withRepeat(withTiming(1, { duration: DRIFT_MS }), -1, true);
  }, [morph, reduced, sway]);

  const shape = usePathInterpolation(morph, [0, 1], paths);
  const dots = useMemo(() => dotGrid(width, height), [width, height]);
  const apricotX = useDerivedValue(() => width * 0.12 + sway.value * SWAY);
  const glassX = useDerivedValue(() => width * 0.78 - sway.value * SWAY);
  const honeyY = useDerivedValue(() => height * 0.82 + sway.value * SWAY);

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, height)}
          colors={[palette.page, palette.card, palette.page]}
        />
      </Rect>
      <Group>
        <Path
          path={shape}
          color={palette.apricot}
          opacity={0.5}
          transform={[{ translateX: -30 }, { translateY: -20 }]}
        >
          <BlurMask blur={BLOB_BLUR} style="normal" />
        </Path>
      </Group>
      <Circle cx={apricotX} cy={height * 0.16} r={150} color={palette.apricot} opacity={0.28}>
        <BlurMask blur={40} style="normal" />
      </Circle>
      <Circle cx={glassX} cy={height * 0.2} r={140} color={palette.seaglass} opacity={0.3}>
        <BlurMask blur={40} style="normal" />
      </Circle>
      <Circle cx={width * 0.7} cy={honeyY} r={160} color={palette.honey} opacity={0.26}>
        <BlurMask blur={42} style="normal" />
      </Circle>
      {dots.map((dot) => (
        <Circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={DOT_RADIUS}
          color={dot.color}
          opacity={DOT_ALPHA}
        />
      ))}
    </Canvas>
  );
}

function dotGrid(width: number, height: number): { x: number; y: number; color: string }[] {
  const dots: { x: number; y: number; color: string }[] = [];
  for (let row = 0; row < DOT_ROWS; row += 1) {
    for (let col = 0; col < DOT_COLUMNS; col += 1) {
      const hue: Hue = hues[(row + col) % hues.length] ?? "honey";
      dots.push({
        x: ((col + 0.5) * width) / DOT_COLUMNS,
        y: ((row + 0.5) * height) / DOT_ROWS,
        color: hueFill[hue],
      });
    }
  }
  return dots;
}
