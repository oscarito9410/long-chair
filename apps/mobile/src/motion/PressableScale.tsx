import type { ReactNode } from "react";
import { Pressable } from "react-native";
import type { AccessibilityRole, AccessibilityState, StyleProp, ViewStyle } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { playHaptic, type HapticWeight } from "./haptics";
import { useReducedMotion } from "./use-reduced-motion";

const PRESS_SCALE = 0.97;
const PRESS_MS = 100;

export function PressableScale({
  children,
  onPress,
  haptic = "tick",
  tilt = 0,
  disabled = false,
  style,
  accessibilityRole = "button",
  accessibilityLabel,
  accessibilityState,
}: {
  children: ReactNode;
  onPress: () => void;
  haptic?: HapticWeight | null;
  tilt?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
}) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ ...accessibilityState, disabled }}
      disabled={disabled}
      onPressIn={() => {
        if (reduced || disabled) {
          return;
        }
        scale.value = withTiming(PRESS_SCALE, { duration: PRESS_MS });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: PRESS_MS });
      }}
      onPress={() => {
        if (haptic) {
          playHaptic(haptic);
        }
        onPress();
      }}
    >
      <Scaled tilt={tilt} scale={scale} style={style}>
        {children}
      </Scaled>
    </Pressable>
  );
}

function Scaled({
  scale,
  tilt,
  style,
  children,
}: {
  scale: SharedValue<number>;
  tilt: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const motion = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${tilt}deg` }],
  }));
  return <Animated.View style={[motion, style]}>{children}</Animated.View>;
}
