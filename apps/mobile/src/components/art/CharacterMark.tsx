import {
  characterBody,
  characterEyes,
  characterEyeY,
  characterTone,
  eyeArcPath,
  eyeHighlight,
  type CharacterMood,
  type CharacterVariant,
  type EyeMark,
} from "@long-chair/core";
import { useEffect, useId } from "react";
import Svg, { Defs, G, Path, RadialGradient, Rect, Stop } from "react-native-svg";
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
import { palette } from "../../theme/palette";

const AnimatedG = Animated.createAnimatedComponent(G);

const BOB_MS = 1400;
const BOB = 3;
const WIDE = 1.03;
const NARROW = 0.97;
const TALL = 1.03;
const SHORT = 0.97;
const SQUASH_X = 1.08;
const SQUASH_Y = 0.84;
const POP_MS = 90;
const POP_DAMP = 8;
const POP_STIFF = 180;
const BLINK_GAP = 2600;
const BLINK_SHUT = 70;
const BLINK_OPEN = 90;
const BLINK_CLOSED = 0.08;
const GLANCE = 5;
const GLANCE_MS = 320;
const FACE_X = 60;

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
  const moving = animate && !reduced;
  const motion = useCharacterMotion(moving, settle && !reduced);
  const eyeY = characterEyeY[variant.shape];
  const mood = variant.mood ?? "smile";
  const tone = characterTone[variant.hue];
  const gradientId = `lc-mark-${useId().replace(/:/g, "")}`;
  const eyeProps = useAnimatedProps(() => {
    const shift = motion.glance.value;
    const open = motion.blink.value;
    return {
      transform: `translate(${shift} 0) translate(${FACE_X} ${eyeY}) scale(1 ${open}) translate(${-FACE_X} ${-eyeY})`,
    };
  });

  return (
    <Animated.View
      style={[motion.style, { width: size, height: size }]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <RadialGradient id={gradientId} cx="34%" cy="28%" r="72%" fx="30%" fy="22%">
            <Stop offset="0" stopColor={tone.light} />
            <Stop offset="0.55" stopColor={tone.body} />
            <Stop offset="1" stopColor={tone.shade} />
          </RadialGradient>
        </Defs>
        <Path d={characterBody[variant.shape]} fill={`url(#${gradientId})`} />
        <AnimatedG animatedProps={eyeProps}>
          <Eyes mood={mood} eyeY={eyeY} />
        </AnimatedG>
      </Svg>
    </Animated.View>
  );
}

function useCharacterMotion(moving: boolean, settle: boolean) {
  const bob = useSharedValue(0);
  const widen = useSharedValue(1);
  const squash = useSharedValue(1);
  const blink = useSharedValue(1);
  const glance = useSharedValue(0);

  useEffect(() => {
    if (!moving) {
      bob.value = 0;
      widen.value = 1;
      squash.value = 1;
      blink.value = 1;
      glance.value = 0;
      return;
    }
    blink.value = withRepeat(
      withSequence(
        withTiming(1, { duration: BLINK_GAP }),
        withTiming(BLINK_CLOSED, { duration: BLINK_SHUT }),
        withTiming(1, { duration: BLINK_OPEN }),
      ),
      -1,
      false,
    );
    glance.value = withTiming(settle ? GLANCE : 0, { duration: GLANCE_MS });
    const idleBob = withRepeat(
      withSequence(withTiming(-BOB, { duration: BOB_MS }), withTiming(0, { duration: BOB_MS })),
      -1,
      true,
    );
    const idleWiden = withRepeat(
      withSequence(
        withTiming(WIDE, { duration: BOB_MS }),
        withTiming(NARROW, { duration: BOB_MS }),
      ),
      -1,
      true,
    );
    const idleSquash = withRepeat(
      withSequence(withTiming(SHORT, { duration: BOB_MS }), withTiming(TALL, { duration: BOB_MS })),
      -1,
      true,
    );
    if (settle) {
      widen.value = withSequence(
        withTiming(SQUASH_X, { duration: POP_MS }),
        withSpring(1, { damping: POP_DAMP, stiffness: POP_STIFF }),
        idleWiden,
      );
      squash.value = withSequence(
        withTiming(SQUASH_Y, { duration: POP_MS }),
        withSpring(1, { damping: POP_DAMP, stiffness: POP_STIFF }),
        idleSquash,
      );
      bob.value = withSequence(withTiming(0, { duration: POP_MS }), idleBob);
      return;
    }
    widen.value = idleWiden;
    squash.value = idleSquash;
    bob.value = idleBob;
  }, [blink, bob, glance, moving, settle, squash, widen]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }, { scaleX: widen.value }, { scaleY: squash.value }],
  }));

  return { style, blink, glance };
}

function Eyes({ mood, eyeY }: { mood: CharacterMood; eyeY: number }) {
  return (
    <>
      {characterEyes(mood, eyeY).map((mark) => (
        <Eye key={`${mark.kind}-${mark.x}`} mark={mark} />
      ))}
    </>
  );
}

function Eye({ mark }: { mark: EyeMark }) {
  if (mark.kind === "arc") {
    return <Path d={eyeArcPath(mark)} fill={palette.ink} />;
  }
  const showShine = mark.height >= eyeHighlight.minEye;
  return (
    <G transform={`translate(${mark.x} ${mark.y})`}>
      <Rect width={mark.width} height={mark.height} rx={mark.width / 2} fill={palette.ink} />
      {showShine ? (
        <G transform={`translate(${eyeHighlight.insetX} ${eyeHighlight.insetY})`}>
          <Rect
            width={eyeHighlight.width}
            height={eyeHighlight.height}
            rx={eyeHighlight.radius}
            fill={palette.white}
          />
        </G>
      ) : null}
    </G>
  );
}
