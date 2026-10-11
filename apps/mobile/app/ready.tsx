import { itemById, kitStampLine, stickerTilt } from "@long-chair/core";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Keyframe } from "react-native-reanimated";

import { CoverArt } from "../src/components/art/CoverArt";
import { GlassSurface } from "../src/components/glass/GlassSurface";
import { SampleBanner } from "../src/components/chrome/SampleBanner";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import { Shimmer } from "../src/motion/Shimmer";
import { openKit, packingSample, readyTitle } from "../src/copy/phrases";
import { useReducedMotion } from "../src/motion/use-reduced-motion";
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
const POP_MS = 700;

const readyPop = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.86 }, { rotate: "-6deg" }] },
  70: { opacity: 1, transform: [{ scale: 1.04 }, { rotate: "3deg" }] },
  100: { opacity: 1, transform: [{ scale: 1 }, { rotate: "0deg" }] },
}).duration(POP_MS);

export default function ReadyScreen() {
  const reduced = useReducedMotion();
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
      primaryHaptic="firm"
      primaryDisabled={!packed}
      onPrimary={() => {
        router.push("/(tabs)/kit");
      }}
    >
      <SampleBanner live={plan?.source === "live"} />
      {loading ? <Shimmer label={packingSample} /> : null}
      {error ? <Text style={styles.note}>{error}</Text> : null}
      {packed ? (
        <Animated.View entering={reduced ? undefined : readyPop} style={styles.stage}>
          <View style={styles.fan}>
            {packed.slots.slice(0, fanLimit).map((slot, index) => (
              <FanCover key={slot.itemId} itemId={slot.itemId} index={index} />
            ))}
          </View>
          <GlassSurface style={styles.stamp} tint={palette.honey}>
            <Text style={styles.kind}>{item ? kindLabel[item.kind] : "Film"}</Text>
            <Text style={styles.line}>
              {kitStampLine(packed.slots.length, packed.durationMinutes)}
            </Text>
          </GlassSurface>
        </Animated.View>
      ) : null}
      {item ? <Text style={styles.title}>{item.title}</Text> : null}
    </ScreenScaffold>
  );
}

function FanCover({ itemId, index }: { itemId: string; index: number }) {
  const fan = itemById(itemId);
  const tilts = [stickerTilt.jazz, 0, stickerTilt.mystery] as const;
  const tilt = tilts[index] ?? 0;
  if (!fan) {
    return null;
  }
  return (
    <View style={{ transform: [{ rotate: `${tilt}deg` }] }}>
      <CoverArt
        seed={fan.id}
        hue={kindHue[fan.kind]}
        kind={fan.kind}
        width={COVER}
        height={COVER}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { gap: SPACE_16, alignItems: "center" },
  fan: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center" },
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
