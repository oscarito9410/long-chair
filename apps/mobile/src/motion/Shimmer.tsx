import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "./use-reduced-motion";
import { FONT_BODY, palette, RADIUS_PILL, SPACE_8 } from "../theme/palette";

const TRAVEL = 160;
const SHIMMER_MS = 1200;

export function Shimmer({ label }: { label: string }) {
  const reduced = useReducedMotion();
  const slide = useSharedValue(0);

  useEffect(() => {
    slide.value = reduced ? 0 : withRepeat(withTiming(1, { duration: SHIMMER_MS }), -1, false);
  }, [reduced, slide]);

  const gleam = useAnimatedStyle(() => ({
    transform: [{ translateX: -TRAVEL + slide.value * TRAVEL * 2 }],
  }));

  return (
    <View style={styles.track} accessibilityRole="text">
      <Animated.View style={[styles.gleam, gleam]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: "hidden",
    borderRadius: RADIUS_PILL,
    backgroundColor: palette.card,
    paddingVertical: SPACE_8,
    paddingHorizontal: SPACE_8,
  },
  gleam: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 48,
    backgroundColor: palette.glassSheen,
  },
  label: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_BODY,
    color: palette.inkSoft,
  },
});
