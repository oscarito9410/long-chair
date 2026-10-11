import type { ReactNode } from "react";
import Animated, { FadeOut, FadeOutDown, Keyframe, LinearTransition } from "react-native-reanimated";

import { useReducedMotion } from "./use-reduced-motion";

const RISE_PX = 14;
const RISE_MS = 240;
const STAGGER_MS = 35;
const STAGGER_CAP = 5;
const EXIT_MS = 180;

function riseIn(index: number) {
  const delay = Math.min(index, STAGGER_CAP - 1) * STAGGER_MS;
  return new Keyframe({
    0: { opacity: 0, transform: [{ translateY: RISE_PX }] },
    100: { opacity: 1, transform: [{ translateY: 0 }] },
  })
    .duration(RISE_MS)
    .delay(delay);
}

export function Enter({ index = 0, children }: { index?: number; children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <Animated.View
      entering={reduced ? undefined : riseIn(index)}
      layout={reduced ? undefined : LinearTransition.springify()}
    >
      {children}
    </Animated.View>
  );
}

export function exitFade(reduced: boolean) {
  return reduced ? undefined : FadeOut.duration(EXIT_MS);
}

export function exitDrop(reduced: boolean) {
  return reduced ? undefined : FadeOutDown.duration(EXIT_MS);
}
