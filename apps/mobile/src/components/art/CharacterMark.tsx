import type { CharacterVariant } from "@long-chair/core";
import { useEffect } from "react";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "../../motion/use-reduced-motion";
import { hueFill, palette } from "../../theme/palette";

const bodies: Record<CharacterVariant["shape"], string> = {
  pebble: "M60 22c24-2 40 14 42 36 2 24-12 46-34 50-26 4-46-12-48-36C18 46 34 24 60 22z",
  bean: "M34 46c8-22 36-28 52-12 14 14 16 36 4 50-14 16-40 18-54 6-16-14-14-28-2-44z",
  drop: "M60 12c26 20 36 36 36 56a36 36 0 1 1-72 0c0-20 10-36 36-56z",
  bun: "M58 36a26 26 0 1 1 0 52 26 26 0 0 1 0-52zm28-18a12 12 0 1 1 0 24 12 12 0 0 1 0-24z",
  arch: "M24 98V62c0-24 16-40 36-40s36 16 36 40v36H24z",
  sprout:
    "M60 48a24 24 0 1 1 0 48 24 24 0 0 1 0-48zM84 30c16 2 22 16 16 26-10-4-18 2-24 10 4-16 0-30 8-36z",
};

const pulseMs = 1600;
const restScale = 1;
const liveScale = 1.04;

export function CharacterMark({
  variant,
  size,
  animate = false,
}: {
  variant: CharacterVariant;
  size: number;
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(restScale);
  const moving = animate && !reduced;

  useEffect(() => {
    scale.value = moving
      ? withRepeat(withTiming(liveScale, { duration: pulseMs }), -1, true)
      : restScale;
  }, [moving, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const fill = hueFill[variant.hue];

  return (
    <Animated.View style={style} accessibilityElementsHidden importantForAccessibility="no">
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Path d={bodies[variant.shape]} fill={fill} />
        <Circle cx={48} cy={62} r={5} fill={palette.ink} />
        <Circle cx={74} cy={62} r={5} fill={palette.ink} />
      </Svg>
    </Animated.View>
  );
}
