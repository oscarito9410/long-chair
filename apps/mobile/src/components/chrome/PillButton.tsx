import { Pressable, StyleSheet, Text } from "react-native";

import { selectionHaptic } from "../../haptics";
import { FONT_BODY, palette, RADIUS_PILL, SPACE_16, SPACE_8, TARGET } from "../../theme/palette";

export function PillButton({
  label,
  onPress,
  disabled = false,
  quiet = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  quiet?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        selectionHaptic();
        onPress();
      }}
      style={({ pressed }) => [
        styles.pill,
        quiet ? styles.quiet : styles.solid,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, quiet ? styles.quietLabel : styles.solidLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    minHeight: TARGET,
    borderRadius: RADIUS_PILL,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACE_16,
    paddingVertical: SPACE_8,
  },
  solid: { backgroundColor: palette.ink },
  quiet: { backgroundColor: "transparent" },
  disabled: { backgroundColor: palette.line },
  pressed: { transform: [{ scale: 0.98 }] },
  label: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY },
  solidLabel: { color: palette.page },
  quietLabel: { color: palette.ink },
});
