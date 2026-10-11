import { AccessibilityInfo, Platform } from "react-native";

export function announceMessage(message: string): void {
  if (message.length === 0 || Platform.OS === "web") {
    return;
  }
  try {
    AccessibilityInfo.announceForAccessibility(message);
  } catch {
    // VoiceOver can be missing in the simulator. The checklist still shows the step.
  }
}
