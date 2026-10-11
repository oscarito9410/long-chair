import { notMedicalAdvice, sampleShelfNote } from "@long-chair/core";
import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { GlassSurface } from "../src/components/glass/GlassSurface";
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
import { FONT_BODY, palette, RADIUS_CARD, SPACE_16 } from "../src/theme/palette";
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
      primaryHaptic="press"
      onPrimary={() => {
        reset();
        router.push("/(tabs)/kit");
      }}
    >
      <Note text={sampleShelfNote} tint={palette.honey} />
      <Note text={sampleUntilLive} tint={palette.seaglass} />
      <Note text={onDeviceNote} tint={palette.apricot} />
      <Note text={noAccountNote} tint={palette.wisteria} />
    </ScreenScaffold>
  );
}

function Note({ text, tint }: { text: string; tint: string }) {
  return (
    <GlassSurface tint={tint} style={styles.card}>
      <Text style={styles.body}>{text}</Text>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS_CARD, padding: SPACE_16 },
  body: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.ink },
});
