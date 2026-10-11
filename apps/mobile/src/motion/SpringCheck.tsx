import type { ReactNode } from "react";
import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useReducedMotion } from "./use-reduced-motion";

const CHECK_FROM = 0.35;
const CHECK_TURN = -40;

export function SpringCheck({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    progress.value = reduced ? 1 : withSpring(1, { damping: 12, stiffness: 180 });
  }, [progress, reduced]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: CHECK_FROM + progress.value * (1 - CHECK_FROM) },
      { rotate: `${CHECK_TURN + progress.value * -CHECK_TURN}deg` },
    ],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
