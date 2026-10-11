import { itemById, kitStampLine } from "@long-chair/core";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { CoverArt } from "../src/components/art/CoverArt";
import { GlassSurface } from "../src/components/glass/GlassSurface";
import { SampleBanner } from "../src/components/chrome/SampleBanner";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import { openKit, packingSample, readyTitle } from "../src/copy/phrases";
import { kindHue, kindLabel } from "../src/presentation";
import { useSession } from "../src/state/session";
import { usePlan } from "../src/state/use-plan";
import {
  COVER,
  FONT_BODY,
  FONT_SECONDARY,
  palette,
  RADIUS_CARD,
  SPACE_16,
} from "../src/theme/palette";
import { screenTints } from "../src/theme/screen-tints";

const fanLimit = 3;

export default function ReadyScreen() {
  const { draft } = useSession();
  const { plan, loading, error } = usePlan(draft);
  const packed = plan?.packed;
  const first = packed?.slots[0];
  const item = first ? itemById(first.itemId) : undefined;
  return (
    <ScreenScaffold
      title={readyTitle}
      tint={screenTints.ready}
      primary={openKit}
      primaryDisabled={!packed}
      onPrimary={() => {
        router.push("/(tabs)/kit");
      }}
    >
      <SampleBanner live={plan?.source === "live"} />
      {loading ? <Text style={styles.note}>{packingSample}</Text> : null}
      {error ? <Text style={styles.note}>{error}</Text> : null}
      {packed ? (
        <View style={styles.stage}>
          {packed.slots.slice(1, fanLimit + 1).map((slot) => {
            const fan = itemById(slot.itemId);
            if (!fan) {
              return null;
            }
            return (
              <CoverArt
                key={fan.id}
                seed={fan.id}
                hue={kindHue[fan.kind]}
                kind={fan.kind}
                width={COVER}
                height={COVER}
              />
            );
          })}
          <GlassSurface style={styles.stamp}>
            <Text style={styles.kind}>{item ? kindLabel[item.kind] : "Film"}</Text>
            <Text style={styles.line}>
              {kitStampLine(packed.slots.length, packed.durationMinutes)}
            </Text>
          </GlassSurface>
        </View>
      ) : null}
      {item ? <Text style={styles.title}>{item.title}</Text> : null}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  stage: { gap: SPACE_16, alignItems: "center" },
  stamp: { borderRadius: RADIUS_CARD, padding: SPACE_16, alignItems: "center" },
  kind: { fontFamily: "Nunito_700Bold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  line: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_BODY,
    color: palette.ink,
    textAlign: "center",
  },
  note: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.inkSoft },
});
