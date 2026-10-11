import { sampleShelfNote } from "@long-chair/core";
import { StyleSheet, Text } from "react-native";

import { WashCard } from "./WashCard";
import { FONT_SECONDARY, palette, RADIUS_PILL, SPACE_16, SPACE_8 } from "../../theme/palette";

export function SampleBanner({ live }: { live: boolean }) {
  if (live) {
    return null;
  }
  return (
    <WashCard tint={palette.honey} style={styles.chip}>
      <Text style={styles.note}>{sampleShelfNote}</Text>
    </WashCard>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: RADIUS_PILL,
    paddingHorizontal: SPACE_16,
    paddingVertical: SPACE_8,
    alignSelf: "flex-start",
  },
  note: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.ink,
  },
});
