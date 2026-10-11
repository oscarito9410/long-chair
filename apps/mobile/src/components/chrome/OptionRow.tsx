import type { CharacterVariant } from "@long-chair/core";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CharacterMark } from "../art/CharacterMark";
import { GlassSurface } from "../glass/GlassSurface";
import { selectionHaptic } from "../../haptics";
import {
  AVATAR,
  FONT_BODY,
  FONT_SECONDARY,
  palette,
  RADIUS_CARD,
  SPACE_16,
  SPACE_8,
} from "../../theme/palette";

export function OptionRow({
  title,
  detail,
  selected,
  selectedLabel,
  character,
  onPress,
}: {
  title: string;
  detail: string;
  selected: boolean;
  selectedLabel: string;
  character: CharacterVariant;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        selectionHaptic();
        onPress();
      }}
    >
      <GlassSurface style={[styles.card, selected && styles.selected]} interactive={selected}>
        <View style={styles.row}>
          <CharacterMark variant={character} size={AVATAR} animate={selected} />
          <View style={styles.copy}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.detail}>{detail}</Text>
            {selected ? <Text style={styles.selectedLabel}>{selectedLabel}</Text> : null}
          </View>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS_CARD, overflow: "hidden" },
  selected: { borderWidth: 2, borderColor: palette.ink },
  row: { flexDirection: "row", gap: SPACE_16, padding: SPACE_16, alignItems: "center" },
  copy: { flex: 1, gap: SPACE_8 },
  title: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  detail: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  selectedLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.seaglassDeep,
  },
});
