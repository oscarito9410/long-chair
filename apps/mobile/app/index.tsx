import { notMedicalAdvice, sampleShelfNote, stickerTilt } from "@long-chair/core";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { DoodleArrow, HandNote } from "../src/components/chrome/HandNote";
import { PillButton } from "../src/components/chrome/PillButton";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import {
  getStarted,
  seeSample,
  settingsLabel,
  welcomeLede,
  welcomeTitle,
} from "../src/copy/phrases";
import { openSettings } from "../src/navigation/present-sheet";
import { FONT_BODY, FONT_SECONDARY, FONT_TITLE, palette, SPACE_16 } from "../src/theme/palette";
import { screenTints } from "../src/theme/screen-tints";

const notes = [
  { text: "jazz on Sundays", hue: "honey" as const, tilt: stickerTilt.jazz },
  { text: "cozy mysteries", hue: "apricot" as const, tilt: stickerTilt.mystery },
  { text: "slow bread", hue: "seaglass" as const, tilt: stickerTilt.bread },
  { text: "window light", hue: "wisteria" as const, tilt: stickerTilt.light },
];

export default function WelcomeScreen() {
  return (
    <ScreenScaffold
      title={welcomeTitle}
      tint={screenTints.welcome}
      hideHeading
      footerNote={notMedicalAdvice}
      primary={getStarted}
      primaryHaptic="firm"
      onPrimary={() => {
        router.push("/love");
      }}
    >
      <Text style={styles.sample}>{sampleShelfNote}</Text>
      <WelcomeStage />
      <PillButton
        label={seeSample}
        quiet
        tint={palette.honey}
        icon="stack"
        onPress={() => {
          router.push("/(tabs)/kit");
        }}
      />
      <PillButton
        label={settingsLabel}
        quiet
        tint={palette.seaglass}
        icon="gear"
        onPress={() => {
          openSettings();
        }}
      />
    </ScreenScaffold>
  );
}

function WelcomeStage() {
  const [jazz, mystery, bread, light] = notes;
  return (
    <View style={styles.stage}>
      <View style={styles.row}>
        {jazz ? <HandNote text={jazz.text} hue={jazz.hue} tilt={jazz.tilt} /> : null}
        {mystery ? <HandNote text={mystery.text} hue={mystery.hue} tilt={mystery.tilt} /> : null}
      </View>
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={styles.title}>
          {welcomeTitle}
        </Text>
        <Text style={styles.lede}>{welcomeLede}</Text>
      </View>
      <DoodleArrow />
      <View style={styles.row}>
        {bread ? <HandNote text={bread.text} hue={bread.hue} tilt={bread.tilt} /> : null}
        {light ? <HandNote text={light.text} hue={light.hue} tilt={light.tilt} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sample: {
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
  },
  stage: { gap: SPACE_16, alignItems: "center" },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  copy: { alignItems: "center", gap: SPACE_16, paddingHorizontal: SPACE_16 },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_TITLE,
    color: palette.ink,
    textAlign: "center",
    lineHeight: 38,
  },
  lede: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_BODY,
    color: palette.inkSoft,
    textAlign: "center",
  },
});
