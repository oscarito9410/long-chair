import {
  blushFill,
  characterBody,
  characterEyeY,
  characterTone,
  expressionFace,
  expressionForMood,
  expressionIntroduces,
  expressionPose,
  eyeHighlight,
  faceArcPath,
  POSE_INTRO_MS,
  type CharacterVariant,
  type Expression,
  type ExpressionPose,
  type FacePiece,
} from "@long-chair/core";
import { useEffect, useId, useState } from "react";
import { AppState } from "react-native";
import Svg, { Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "../../motion/use-reduced-motion";
import { palette } from "../../theme/palette";

const AnimatedG = Animated.createAnimatedComponent(G);

const BOB_MS = 1400;
const BOB_PX = 3;
const NOD_PX = 2;
const REST_LIFT = 8;
const REST_SX = 0.94;
const REST_SY = 1.06;
const BLINK_GAP = 2600;
const BLINK_SHUT = 70;
const BLINK_OPEN = 90;
const BLINK_CLOSED = 0.08;
const GIGGLE_MS = 140;
const WOBBLE_DEG = 6;
const FACE_X = 60;
const ARRIVE = { duration: POSE_INTRO_MS, easing: Easing.bezier(0.22, 0.8, 0.24, 1) };

export function CharacterMark({
  variant,
  size,
  animate = false,
  settle = false,
  expression,
  tickled = false,
}: {
  variant: CharacterVariant;
  size: number;
  animate?: boolean;
  settle?: boolean;
  expression?: Expression;
  tickled?: boolean;
}) {
  const reduced = useReducedMotion();
  const foreground = useForeground();
  const face = tickled ? "tickled" : (expression ?? expressionForMood(variant.mood ?? "smile"));
  const pose = expressionPose[face];
  const eyeY = characterEyeY[variant.shape];
  const tone = characterTone[variant.hue];
  const gradientId = `lc-mark-${useId().replace(/:/g, "")}`;
  const live = foreground && !reduced;
  const motion = usePoseMotion({
    pose,
    intro: live && !tickled && (settle || (animate && expressionIntroduces(face))),
    idle: live && animate && !tickled,
    thinking: face === "thinking",
    wobble: live && tickled,
    blink: live && animate && !tickled && eyesBlink(face),
    eyeY,
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
        <AnimatedG animatedProps={motion.eyeProps}>
          {expressionFace(face, eyeY).map((piece, index) => (
            <Face key={`${piece.role}-${index}`} piece={piece} />
          ))}
        </AnimatedG>
      </Svg>
    </Animated.View>
  );
}

function eyesBlink(expression: Expression): boolean {
  return expression !== "support" && expression !== "celebration" && expression !== "tickled";
}

function useForeground(): boolean {
  const [foreground, setForeground] = useState(AppState.currentState === "active");
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      setForeground(next === "active");
    });
    return () => {
      sub.remove();
    };
  }, []);
  return foreground;
}

function usePoseMotion({
  pose,
  intro,
  idle,
  thinking,
  wobble,
  blink,
  eyeY,
}: {
  pose: ExpressionPose;
  intro: boolean;
  idle: boolean;
  thinking: boolean;
  wobble: boolean;
  blink: boolean;
  eyeY: number;
}) {
  const tilt = useSharedValue(pose.tilt);
  const scaleX = useSharedValue(pose.scaleX);
  const scaleY = useSharedValue(pose.scaleY);
  const lift = useSharedValue(pose.lift);
  const bob = useSharedValue(0);
  const nod = useSharedValue(0);
  const sway = useSharedValue(0);
  const lids = useSharedValue(1);

  useEffect(() => {
    const stop = () => {
      cancelAnimation(tilt);
      cancelAnimation(scaleX);
      cancelAnimation(scaleY);
      cancelAnimation(lift);
      cancelAnimation(bob);
      cancelAnimation(nod);
      cancelAnimation(sway);
      cancelAnimation(lids);
    };
    stop();
    tilt.value = pose.tilt;
    scaleX.value = pose.scaleX;
    scaleY.value = pose.scaleY;
    lift.value = pose.lift;
    bob.value = 0;
    nod.value = 0;
    sway.value = 0;
    lids.value = 1;
    if (wobble) {
      sway.value = withRepeat(
        withSequence(
          withTiming(-1, { duration: GIGGLE_MS }),
          withTiming(1, { duration: GIGGLE_MS }),
        ),
        -1,
        true,
      );
      return stop;
    }
    if (intro) {
      tilt.value = 0;
      lift.value = REST_LIFT;
      scaleX.value = REST_SX;
      scaleY.value = REST_SY;
      tilt.value = withTiming(pose.tilt, ARRIVE);
      lift.value = withTiming(pose.lift, ARRIVE);
      scaleX.value = withTiming(pose.scaleX, ARRIVE);
      scaleY.value = withTiming(pose.scaleY, ARRIVE);
    }
    if (idle) {
      bob.value = withRepeat(
        withSequence(
          withTiming(thinking ? -NOD_PX : -BOB_PX, { duration: BOB_MS }),
          withTiming(0, { duration: BOB_MS }),
        ),
        -1,
        true,
      );
    }
    if (idle && thinking) {
      nod.value = withRepeat(
        withSequence(withTiming(4, { duration: BOB_MS }), withTiming(-3, { duration: BOB_MS })),
        -1,
        true,
      );
    }
    if (blink) {
      lids.value = withRepeat(
        withSequence(
          withTiming(1, { duration: BLINK_GAP }),
          withTiming(BLINK_CLOSED, { duration: BLINK_SHUT }),
          withTiming(1, { duration: BLINK_OPEN }),
        ),
        -1,
        false,
      );
    }
    return stop;
  }, [
    blink,
    bob,
    idle,
    intro,
    lids,
    lift,
    nod,
    pose.lift,
    pose.scaleX,
    pose.scaleY,
    pose.tilt,
    scaleX,
    scaleY,
    sway,
    thinking,
    tilt,
    wobble,
  ]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: lift.value + bob.value - sway.value * NOD_PX },
      { rotate: `${tilt.value + nod.value + sway.value * WOBBLE_DEG}deg` },
      { scaleX: scaleX.value * (1 + Math.abs(sway.value) * 0.04) },
      { scaleY: scaleY.value * (1 - Math.abs(sway.value) * 0.06) },
    ],
  }));

  const eyeProps = useAnimatedProps(() => ({
    transform: `translate(${FACE_X} ${eyeY}) scale(1 ${lids.value}) translate(${-FACE_X} ${-eyeY})`,
  }));

  return { style, eyeProps };
}

function Face({ piece }: { piece: FacePiece }) {
  const fill = piece.role === "blush" ? blushFill : palette.ink;
  if (piece.kind === "arc") {
    return <Path d={faceArcPath(piece)} fill={fill} />;
  }
  if (piece.kind === "oval") {
    return (
      <G transform={`translate(${piece.x} ${piece.y})`}>
        <Ellipse
          cx={piece.width / 2}
          cy={piece.height / 2}
          rx={piece.width / 2}
          ry={piece.height / 2}
          fill={fill}
        />
      </G>
    );
  }
  const shine = piece.role === "eye" && piece.height >= eyeHighlight.minEye;
  return (
    <G transform={`translate(${piece.x} ${piece.y})`}>
      <Rect width={piece.width} height={piece.height} rx={piece.width / 2} fill={fill} />
      {shine ? (
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
