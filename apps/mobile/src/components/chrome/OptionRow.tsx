import type { CharacterVariant } from "@long-chair/core";
import { StyleSheet, Text, View } from "react-native";

import { CharacterMark } from "../art/CharacterMark";
import { GlassSurface } from "../glass/GlassSurface";
import { PressableScale } from "../../motion/PressableScale";
import {
  AVATAR,
  FONT_BODY,
  FONT_SECONDARY,
  hueFill,
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
    <PressableScale
      haptic="tick"
      onPress={onPress}
      accessibilityState={{ selected }}
      style={styles.stretch}
    >
      <GlassSurface
        style={styles.card}
        tint={hueFill[character.hue]}
        selected={selected}
        interactive={selected}
      >
        <View style={styles.row}>
          <CharacterMark variant={character} size={AVATAR} animate={selected} />
          <View style={styles.copy}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.detail}>{detail}</Text>
            {selected ? <Text style={styles.selectedLabel}>{selectedLabel}</Text> : null}
          </View>
        </View>
      </GlassSurface>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  stretch: { alignSelf: "stretch" },
  card: { borderRadius: RADIUS_CARD },
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
