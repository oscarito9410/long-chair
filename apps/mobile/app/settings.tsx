import { notMedicalAdvice, sampleShelfNote } from "@long-chair/core";
import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import {
  noAccountNote,
  onDeviceNote,
  sampleUntilLive,
  seeSample,
  settingsLede,
  settingsTitle,
} from "../src/copy/phrases";
import { useSession } from "../src/state/session";
import { FONT_BODY, palette, SPACE_8 } from "../src/theme/palette";
import { screenTints } from "../src/theme/screen-tints";

export default function SettingsScreen() {
  const { reset } = useSession();
  return (
    <ScreenScaffold
      title={settingsTitle}
      lede={settingsLede}
      tint={screenTints.settings}
      onBack={() => {
        router.back();
      }}
      footerNote={notMedicalAdvice}
      primary={seeSample}
      onPrimary={() => {
        reset();
        router.push("/(tabs)/kit");
      }}
    >
      <Text style={styles.body}>{sampleShelfNote}</Text>
      <Text style={styles.body}>{sampleUntilLive}</Text>
      <Text style={styles.body}>{onDeviceNote}</Text>
      <Text style={styles.body}>{noAccountNote}</Text>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_BODY,
    color: palette.ink,
    marginBottom: SPACE_8,
  },
});
