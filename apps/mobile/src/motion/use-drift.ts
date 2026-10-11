import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "./use-reduced-motion";

const DRIFT_MS = 2800;
const DRIFT_PX = 6;

export function useDriftStyle(rotate = 0) {
  const reduced = useReducedMotion();
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = reduced
      ? 0
      : withRepeat(
          withTiming(1, { duration: DRIFT_MS, easing: Easing.inOut(Easing.sin) }),
          -1,
          true,
        );
  }, [phase, reduced]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: phase.value * DRIFT_PX }, { rotate: `${rotate}deg` }],
  }));
}
