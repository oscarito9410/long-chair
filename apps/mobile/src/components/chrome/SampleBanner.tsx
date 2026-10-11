import { sampleShelfNote } from "@long-chair/core";
import { StyleSheet, Text } from "react-native";

import { FONT_SECONDARY, palette, SPACE_8 } from "../../theme/palette";

export function SampleBanner({ live }: { live: boolean }) {
  if (live) {
    return null;
  }
  return <Text style={styles.note}>{sampleShelfNote}</Text>;
}

const styles = StyleSheet.create({
  note: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
    paddingVertical: SPACE_8,
  },
});
