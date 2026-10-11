import { notMedicalAdvice, sampleShelfNote, stickerTilt, welcomeNotesAt } from "@long-chair/core";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Keyframe } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GearButton } from "../src/components/chrome/GearButton";
import { DoodleArrow, HandNote } from "../src/components/chrome/HandNote";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import { getStarted, seeSample, welcomeLede, welcomeTitle } from "../src/copy/phrases";
import { useReducedMotion } from "../src/motion/use-reduced-motion";
import { openSettings } from "../src/navigation/present-sheet";
import { useSession } from "../src/state/session";
import {
  FONT_BODY,
  FONT_SECONDARY,
  FONT_TITLE,
  palette,
  SPACE_16,
  SPACE_32,
  SPACE_8,
} from "../src/theme/palette";
import { screenTints } from "../src/theme/screen-tints";

const HERO_MS = 900;

const heroIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 14 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }] },
}).duration(HERO_MS);

const NOTE_HUES = ["honey", "apricot", "seaglass", "wisteria"] as const;
const NOTE_TILTS = [stickerTilt.jazz, stickerTilt.mystery, stickerTilt.bread, stickerTilt.light] as const;
const WELCOME_NOTE_MS = 3200;

function useWelcomeNotes(): readonly string[] {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) {
      return;
    }
    const id = setInterval(() => {
      setStep((current) => current + 1);
    }, WELCOME_NOTE_MS);
    return () => {
      clearInterval(id);
    };
  }, [reduced]);

  return welcomeNotesAt(reduced ? 0 : step);
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const notes = useWelcomeNotes();
  const { beginOnboarding, reset } = useSession();
  return (
    <View style={styles.screen}>
      <ScreenScaffold
        title={welcomeTitle}
        tint={screenTints.welcome}
        hideHeading
        footerNote={notMedicalAdvice}
        primary={getStarted}
        primaryHaptic="firm"
        onPrimary={() => {
          beginOnboarding();
          setTimeout(() => {
            router.push("/love");
          }, 0);
        }}
        linkLabel={seeSample}
        linkIcon="stack"
        onLink={() => {
          reset();
          setTimeout(() => {
            router.push("/(tabs)/kit");
          }, 0);
        }}
      >
        <Text style={styles.sample}>{sampleShelfNote}</Text>
        <Animated.View entering={reduced ? undefined : heroIn}>
          <WelcomeStage notes={notes} />
        </Animated.View>
      </ScreenScaffold>
      <View style={[styles.gear, { top: insets.top + SPACE_8 }]}>
        <GearButton
          onPress={() => {
            openSettings();
          }}
        />
      </View>
    </View>
  );
}

function WelcomeStage({ notes }: { notes: readonly string[] }) {
  const [first, second, third, fourth] = notes;
  return (
    <View style={styles.stage}>
      <View style={styles.row}>
        <Sticky text={first} index={0} />
        <Sticky text={second} index={1} />
      </View>
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={styles.title}>
          {welcomeTitle}
        </Text>
        <Text style={styles.lede}>{welcomeLede}</Text>
      </View>
      <DoodleArrow />
      <View style={styles.row}>
        <Sticky text={third} index={2} />
        <Sticky text={fourth} index={3} />
      </View>
    </View>
  );
}

function Sticky({ text, index }: { text: string | undefined; index: number }) {
  const hue = NOTE_HUES[index] ?? "honey";
  const tilt = NOTE_TILTS[index] ?? 0;
  if (!text) {
    return null;
  }
  return <HandNote text={text} hue={hue} tilt={tilt} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  gear: { position: "absolute", right: SPACE_16 },
  sample: {
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
  },
  stage: { gap: SPACE_16, alignItems: "center", marginBottom: SPACE_32 },
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
