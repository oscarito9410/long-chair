import type { ReactNode } from "react";
import Animated, {
  FadeInDown,
  FadeOut,
  FadeOutDown,
  LinearTransition,
} from "react-native-reanimated";

import { useReducedMotion } from "./use-reduced-motion";

const STAGGER_MS = 48;
const EXIT_MS = 180;

export function Enter({ index = 0, children }: { index?: number; children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <Animated.View
      entering={reduced ? undefined : FadeInDown.springify().delay(index * STAGGER_MS)}
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
