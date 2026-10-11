import { notMedicalAdvice, sampleShelfNote } from "@long-chair/core";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PillButton } from "../src/components/chrome/PillButton";
import {
  getStarted,
  seeSample,
  settingsLabel,
  welcomeLede,
  welcomeTitle,
} from "../src/copy/phrases";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import { FONT_HAND, palette, SPACE_8 } from "../src/theme/palette";
import { screenTints } from "../src/theme/screen-tints";

const stickers = ["jazz on Sundays", "cozy mysteries", "slow bread", "window light"] as const;

export default function WelcomeScreen() {
  return (
    <ScreenScaffold
      title={welcomeTitle}
      lede={welcomeLede}
      tint={screenTints.welcome}
      footerNote={notMedicalAdvice}
      primary={getStarted}
      onPrimary={() => {
        router.push("/love");
      }}
    >
      <Text style={styles.sample}>{sampleShelfNote}</Text>
      <View style={styles.notes}>
        {stickers.map((sticker) => (
          <Text key={sticker} style={styles.sticker} accessibilityElementsHidden>
            {sticker}
          </Text>
        ))}
      </View>
      <PillButton
        label={seeSample}
        quiet
        onPress={() => {
          router.push("/(tabs)/kit");
        }}
      />
      <PillButton
        label={settingsLabel}
        quiet
        onPress={() => {
          router.push("/settings");
        }}
      />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  sample: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: palette.inkSoft,
  },
  notes: { gap: SPACE_8 },
  sticker: {
    fontFamily: "Caveat_600SemiBold",
    fontSize: FONT_HAND,
    color: palette.ink,
  },
});
