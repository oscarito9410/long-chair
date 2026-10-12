import type { CharacterVariant } from "@long-chair/core";
import { StyleSheet, Text, View } from "react-native";

import { CharacterMark } from "../art/CharacterMark";
import { WashCard } from "./WashCard";
import { AppIcon } from "./AppIcon";
import { PressableScale } from "../../motion/PressableScale";
import { SpringCheck } from "../../motion/SpringCheck";
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
      <WashCard style={styles.card} tint={hueFill[character.hue]} selected={selected}>
        <View style={styles.row}>
          <CharacterMark
            variant={character}
            size={AVATAR}
            expression={selected ? "attention" : undefined}
            animate={selected}
            settle={selected}
          />
          <View style={styles.copy}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.detail}>{detail}</Text>
            {selected ? (
              <View style={styles.picked}>
                <SpringCheck>
                  <AppIcon name="check" color={palette.seaglassDeep} size={18} />
                </SpringCheck>
                <Text style={styles.selectedLabel}>{selectedLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </WashCard>
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
  picked: { flexDirection: "row", alignItems: "center", gap: SPACE_8 },
  selectedLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.seaglassDeep,
  },
});
