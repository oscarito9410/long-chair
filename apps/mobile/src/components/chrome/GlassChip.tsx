import { StyleSheet, Text } from "react-native";

import { WashCard } from "./WashCard";
import { FONT_SECONDARY, palette, RADIUS_PILL, SPACE_16, SPACE_8 } from "../../theme/palette";

export function GlassChip({
  label,
  tint,
  selected = false,
}: {
  label: string;
  tint: string;
  selected?: boolean;
}) {
  return (
    <WashCard tint={tint} selected={selected} style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
    </WashCard>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: RADIUS_PILL,
    paddingHorizontal: SPACE_16,
    paddingVertical: SPACE_8,
  },
  label: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.ink,
  },
});
