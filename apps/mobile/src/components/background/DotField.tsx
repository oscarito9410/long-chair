import { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "../../motion/use-reduced-motion";
import { hues } from "@long-chair/core";
import { hueFill, SPACE_16 } from "../../theme/palette";

const columns = 6;
const rows = 10;
const driftMs = 6400;
const drift = 8;

export function DotField() {
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const shift = useSharedValue(0);

  useEffect(() => {
    shift.value = reduced ? 0 : withRepeat(withTiming(1, { duration: driftMs }), -1, true);
  }, [reduced, shift]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: shift.value * drift }],
  }));

  const dots = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const hue = hues[(row + col) % hues.length] ?? "honey";
      dots.push(
        <View
          key={`${row}-${col}`}
          style={{
            position: "absolute",
            left: (col + 0.5) * (width / columns) - SPACE_16,
            top: (row + 0.5) * (height / rows),
            width: SPACE_16,
            height: SPACE_16,
            borderRadius: SPACE_16,
            backgroundColor: hueFill[hue],
            opacity: 0.45,
          }}
        />,
      );
    }
  }

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      {dots}
    </Animated.View>
  );
}
