import { StyleSheet, Text, View } from "react-native";

import { GlassSurface } from "../glass/GlassSurface";
import { AppIcon } from "./AppIcon";
import type { IconName } from "./icon-names";
import type { HapticWeight } from "../../motion/haptics";
import { PressableScale } from "../../motion/PressableScale";
import { FONT_BODY, palette, RADIUS_PILL, SPACE_16, SPACE_8, TARGET } from "../../theme/palette";

const ICON = 20;

export function PillButton({
  label,
  onPress,
  disabled = false,
  quiet = false,
  tint = palette.honey,
  haptic,
  icon,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  quiet?: boolean;
  tint?: string;
  haptic?: HapticWeight;
  icon?: IconName;
}) {
  const weight = haptic ?? (quiet ? "tick" : "press");
  const ink = !quiet;
  const labelColor = ink ? palette.page : palette.ink;
  const body = (
    <View style={[styles.row, ink && styles.ink, disabled && styles.disabled]}>
      {icon ? <AppIcon name={icon} color={labelColor} size={ICON} /> : null}
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </View>
  );

  return (
    <PressableScale
      haptic={disabled ? null : weight}
      disabled={disabled}
      onPress={onPress}
      accessibilityState={{ disabled }}
      style={styles.stretch}
    >
      {quiet ? (
        <GlassSurface tint={tint} style={styles.glass}>
          {body}
        </GlassSurface>
      ) : (
        body
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  stretch: { alignSelf: "stretch" },
  glass: { borderRadius: RADIUS_PILL },
  row: {
    minHeight: TARGET,
    borderRadius: RADIUS_PILL,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: SPACE_8,
    paddingHorizontal: SPACE_16,
    overflow: "hidden",
  },
  ink: { backgroundColor: palette.ink },
  disabled: { backgroundColor: palette.line },
  label: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY },
});
