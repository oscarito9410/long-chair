import type { CharacterMood, CharacterVariant, Hue } from "@long-chair/core";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "../../motion/use-reduced-motion";
import { hueFill, palette } from "../../theme/palette";

const AnimatedG = Animated.createAnimatedComponent(G);

const bodies: Record<CharacterVariant["shape"], string> = {
  pebble: "M60 22c24-2 40 14 42 36 2 24-12 46-34 50-26 4-46-12-48-36C18 46 34 24 60 22z",
  bean: "M34 46c8-22 36-28 52-12 14 14 16 36 4 50-14 16-40 18-54 6-16-14-14-28-2-44z",
  drop: "M60 12c26 20 36 36 36 56a36 36 0 1 1-72 0c0-20 10-36 36-56z",
  bun: "M58 36a26 26 0 1 1 0 52 26 26 0 0 1 0-52zm28-18a12 12 0 1 1 0 24 12 12 0 0 1 0-24z",
  arch: "M24 98V62c0-24 16-40 36-40s36 16 36 40v36H24z",
  sprout:
    "M60 48a24 24 0 1 1 0 48 24 24 0 0 1 0-48zM84 30c16 2 22 16 16 26-10-4-18 2-24 10 4-16 0-30 8-36z",
};

const eyeY: Record<CharacterVariant["shape"], number> = {
  pebble: 58,
  bean: 62,
  drop: 68,
  bun: 64,
  arch: 62,
  sprout: 74,
};

const bellyHue: Record<Hue, Hue> = {
  apricot: "honey",
  seaglass: "apricot",
  honey: "apricot",
  wisteria: "seaglass",
};

const PULSE_MS = 1600;
const LIVE_SCALE = 1.04;
const BLINK_GAP = 2400;
const SETTLE_MS = 520;

export function CharacterMark({
  variant,
  size,
  animate = false,
  settle = false,
}: {
  variant: CharacterVariant;
  size: number;
  animate?: boolean;
  settle?: boolean;
}) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const turn = useSharedValue(0);
  const blink = useSharedValue(1);
  const veil = useSharedValue(0);
  const moving = animate && !reduced;

  useEffect(() => {
    if (!moving) {
      scale.value = 1;
      turn.value = 0;
      blink.value = 1;
      veil.value = 0;
      return;
    }
    blink.value = withRepeat(
      withSequence(
        withTiming(1, { duration: BLINK_GAP }),
        withTiming(0.05, { duration: 70 }),
        withTiming(1, { duration: 90 }),
      ),
      -1,
      false,
    );
    if (settle) {
      veil.value = 1;
      veil.value = withTiming(0, { duration: SETTLE_MS });
      scale.value = withSequence(
        withTiming(0.82, { duration: 1 }),
        withSpring(1, { damping: 14, stiffness: 160 }),
        withRepeat(withTiming(LIVE_SCALE, { duration: PULSE_MS }), -1, true),
      );
      turn.value = withSequence(
        withTiming(-12, { duration: 1 }),
        withSpring(0, { damping: 14, stiffness: 160 }),
      );
      return;
    }
    scale.value = withRepeat(withTiming(LIVE_SCALE, { duration: PULSE_MS }), -1, true);
    turn.value = withRepeat(withTiming(1.5, { duration: PULSE_MS * 2 }), -1, true);
  }, [blink, moving, scale, settle, turn, veil]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${turn.value}deg` }],
  }));
  const veilStyle = useAnimatedStyle(() => ({ opacity: veil.value }));
  const eyeProps = useAnimatedProps(() => ({ opacity: blink.value }));
  const y = eyeY[variant.shape];
  const mood = variant.mood ?? "smile";
  const fill = hueFill[variant.hue];
  const belly = hueFill[bellyHue[variant.hue]];

  return (
    <Animated.View
      style={[style, { width: size, height: size }]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Path d={bodies[variant.shape]} fill={fill} />
        <Ellipse cx={62} cy={y + 18} rx={16} ry={12} fill={belly} opacity={0.9} />
        <Ellipse cx={46} cy={y + 16} rx={7} ry={5} fill={palette.card} opacity={0.8} />
        <Ellipse cx={48} cy={y - 14} rx={10} ry={6} fill={palette.card} opacity={0.35} />
        <AnimatedG animatedProps={eyeProps}>
          <Eyes mood={mood} y={y} />
        </AnimatedG>
        <Mouth mood={mood} y={y} />
        <Accessory name={variant.accessory ?? "none"} accent={belly} y={y} />
      </Svg>
      {settle && !reduced ? (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, veilStyle]}>
          <BlurView intensity={18} tint="light" style={StyleSheet.absoluteFill} />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

function Eyes({ mood, y }: { mood: CharacterMood; y: number }) {
  if (mood === "content") {
    return (
      <G>
        <Path
          d={`M40 ${y + 2} q8 -9 16 0`}
          fill="none"
          stroke={palette.ink}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path
          d={`M66 ${y + 2} q8 -9 16 0`}
          fill="none"
          stroke={palette.ink}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </G>
    );
  }
  if (mood === "wink") {
    return (
      <G>
        <Path
          d={`M40 ${y} q8 7 16 0`}
          fill="none"
          stroke={palette.ink}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Circle cx={76} cy={y} r={4.6} fill={palette.ink} />
      </G>
    );
  }
  if (mood === "curious") {
    return (
      <G>
        <Circle cx={48} cy={y} r={6} fill={palette.card} />
        <Circle cx={76} cy={y - 1} r={6} fill={palette.card} />
        <Circle cx={49} cy={y - 2.5} r={2.4} fill={palette.ink} />
        <Circle cx={78} cy={y - 3.5} r={2.4} fill={palette.ink} />
      </G>
    );
  }
  return (
    <G>
      <Circle cx={48} cy={y} r={4.6} fill={palette.ink} />
      <Circle cx={76} cy={y} r={4.6} fill={palette.ink} />
    </G>
  );
}

function Mouth({ mood, y }: { mood: CharacterMood; y: number }) {
  if (mood === "grin") {
    return <Path d={`M44 ${y + 14} Q62 ${y + 32} 80 ${y + 14}`} fill={palette.ink} />;
  }
  if (mood === "curious") {
    return <Ellipse cx={62} cy={y + 16} rx={5} ry={6} fill={palette.ink} />;
  }
  if (mood === "content") {
    return (
      <Path
        d={`M50 ${y + 14} Q62 ${y + 22} 74 ${y + 14}`}
        fill="none"
        stroke={palette.ink}
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
  }
  return (
    <Path
      d={`M46 ${y + 14} Q62 ${y + 28} 78 ${y + 14}`}
      fill="none"
      stroke={palette.ink}
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function Accessory({
  name,
  accent,
  y,
}: {
  name: CharacterVariant["accessory"];
  accent: string;
  y: number;
}) {
  if (name === "bow") {
    return (
      <G>
        <Path d="M78 18c8-10 20-8 22 2-8 2-14 8-16 12-2-4-8-10-6-14z" fill={accent} />
        <Path d="M70 20c-10-8-20-2-18 8 6 0 12 4 14 8 2-6 6-12 4-16z" fill={accent} />
        <Circle cx={78} cy={28} r={3.5} fill={palette.ink} />
      </G>
    );
  }
  if (name === "glasses") {
    return (
      <G fill="none" stroke={palette.ink} strokeWidth={2.5}>
        <Circle cx={48} cy={y} r={10} />
        <Circle cx={76} cy={y} r={10} />
        <Path d={`M58 ${y}h8`} />
      </G>
    );
  }
  if (name === "leaf") {
    return <Path d="M86 24c14 2 18 16 8 22-8-6-16-6-22-2 2-10 6-18 14-20z" fill={accent} />;
  }
  if (name === "scarf") {
    return <Path d="M34 78c10 8 42 10 54-2 2 10-8 16-20 16H48c-10 0-16-6-14-14z" fill={accent} />;
  }
  if (name === "star") {
    return <Path d="M90 28l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill={accent} />;
  }
  return null;
}
