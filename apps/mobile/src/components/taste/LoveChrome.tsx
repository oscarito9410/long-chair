import { loveFooterMeta, loveLede, sampleKitInstead } from "@long-chair/core";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "../chrome/AppIcon";
import { StepTitle } from "../chrome/StepTitle";
import { loveTitle } from "../../copy/phrases";
import { PressableScale } from "../../motion/PressableScale";
import {
  FONT_BODY,
  palette,
  RADIUS_PILL,
  SPACE_16,
  SPACE_24,
  SPACE_8,
} from "../../theme/palette";

const BACK_HIT = 44;
const DOT = 8;
const DOT_COUNT = 4;
const CONTINUE_HIT = 56;
const META_SIZE = 13;
const FADE = 24;
const LOVE_STEP = "1 of 4";

export function LoveHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.nav}>
        <PressableScale
          accessibilityLabel="Back"
          haptic="tick"
          onPress={() => {
            router.push("/");
          }}
        >
          <View style={styles.back}>
            <AppIcon name="arrow" color={palette.ink} />
          </View>
        </PressableScale>
        <View style={styles.dots} accessibilityLabel={LOVE_STEP}>
          {Array.from({ length: DOT_COUNT }, (_, index) => (
            <View key={index} style={[styles.dot, index === 0 && styles.dotOn]} />
          ))}
        </View>
        <View style={styles.back} />
      </View>
      <StepTitle title={loveTitle} lede={loveLede} mark="love" />
    </View>
  );
}

export function LoveFooter({
  label,
  ready,
  onContinue,
  onSample,
  onHeight,
}: {
  label: string;
  ready: boolean;
  onContinue: () => void;
  onSample: () => void;
  onHeight: (height: number) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={styles.footer}
      onLayout={(event) => {
        onHeight(event.nativeEvent.layout.height);
      }}
    >
      <View style={styles.fade} pointerEvents="none">
        <View style={styles.fadeTop} />
        <View style={styles.fadeMid} />
        <View style={styles.fadeLow} />
      </View>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, SPACE_16) }]}>
        <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.wash} />
        <PressableScale onPress={onContinue} haptic={ready ? "press" : "tick"} accessibilityLabel={label}>
          <View style={[styles.continue, ready ? styles.continueOn : styles.continueWait]}>
            <Text style={[styles.continueText, ready ? styles.continueInk : styles.continueMute]}>
              {label}
            </Text>
          </View>
        </PressableScale>
        <PressableScale onPress={onSample} haptic="tick" accessibilityRole="button">
          <Text style={styles.sample}>{sampleKitInstead}</Text>
        </PressableScale>
        <Text style={styles.meta}>{loveFooterMeta}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACE_24, gap: SPACE_8, paddingBottom: SPACE_8 },
  nav: { flexDirection: "row", alignItems: "center" },
  back: { width: BACK_HIT, height: BACK_HIT, alignItems: "center", justifyContent: "center" },
  dots: { flex: 1, flexDirection: "row", justifyContent: "center", gap: SPACE_8 },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT,
    borderWidth: 2,
    borderColor: palette.ink,
  },
  dotOn: { backgroundColor: palette.ink },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0 },
  fade: { height: FADE },
  fadeTop: { flex: 1, backgroundColor: "rgba(243, 238, 230, 0)" },
  fadeMid: { flex: 1, backgroundColor: "rgba(243, 238, 230, 0.28)" },
  fadeLow: { flex: 1, backgroundColor: "rgba(243, 238, 230, 0.55)" },
  bar: { paddingHorizontal: SPACE_24, paddingTop: SPACE_8, gap: SPACE_8, overflow: "hidden" },
  wash: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(243, 238, 230, 0.55)",
  },
  continue: {
    minHeight: CONTINUE_HIT,
    borderRadius: RADIUS_PILL,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACE_16,
  },
  continueOn: { backgroundColor: palette.ink },
  continueWait: { backgroundColor: palette.line },
  continueText: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY },
  continueInk: { color: palette.page },
  continueMute: { color: palette.ink },
  sample: {
    minHeight: BACK_HIT,
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_BODY,
    color: palette.inkSoft,
    paddingTop: SPACE_8,
  },
  meta: {
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: META_SIZE,
    color: palette.inkSoft,
  },
});
