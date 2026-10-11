import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { scheduleOnRN } from "react-native-worklets";

export const hapticWeights = ["tick", "tap", "press", "firm", "heavy"] as const;

export type HapticWeight = (typeof hapticWeights)[number];

const impact: Record<Exclude<HapticWeight, "tick">, Haptics.ImpactFeedbackStyle> = {
  tap: Haptics.ImpactFeedbackStyle.Light,
  press: Haptics.ImpactFeedbackStyle.Medium,
  firm: Haptics.ImpactFeedbackStyle.Rigid,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

export function playHaptic(weight: HapticWeight): void {
  if (Platform.OS === "web") {
    return;
  }
  try {
    if (weight === "tick") {
      void Haptics.selectionAsync();
      return;
    }
    void Haptics.impactAsync(impact[weight]);
  } catch {
    // A simulator without a haptics engine rejects the call. Keep the gesture.
  }
}

export function fireHaptic(weight: HapticWeight): void {
  "worklet";
  scheduleOnRN(playHaptic, weight);
}

export function selectionHaptic(): void {
  playHaptic("tick");
}
