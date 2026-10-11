import { ONBOARDING_DOT_COUNT, themesLede } from "@long-chair/core";
import { router, Slot, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "../../src/components/chrome/AppIcon";
import { PillButton } from "../../src/components/chrome/PillButton";
import { StepTitle } from "../../src/components/chrome/StepTitle";
import {
  buildingTitle,
  chairLede,
  chairTitle,
  companyTitle,
  loveLede,
  loveTitle,
} from "../../src/copy/phrases";
import { PressableScale } from "../../src/motion/PressableScale";
import {
  OnboardingChromeProvider,
  useOnboardingStore,
} from "../../src/motion/onboarding-chrome";
import { useReducedMotion } from "../../src/motion/use-reduced-motion";
import {
  FONT_BODY,
  FONT_SECONDARY,
  palette,
  SPACE_16,
  SPACE_24,
  SPACE_8,
  TARGET,
} from "../../src/theme/palette";

const SLIDE_PX = 24;
const SLIDE_MS = 280;
const THEMES_TITLE = "What should stay out of the room?";
const THEMES_MARK = "out of the room";

const frames = [
  { path: "/love", title: loveTitle, lede: loveLede, mark: "love", step: 0, back: "/" },
  { path: "/chair", title: chairTitle, lede: chairLede, mark: "chair", step: 1, back: "/love" },
  {
    path: "/themes",
    title: THEMES_TITLE,
    lede: themesLede,
    mark: THEMES_MARK,
    step: 2,
    back: "/chair",
  },
  { path: "/company", title: companyTitle, mark: "company", step: 3, back: "/themes" },
  { path: "/building", title: buildingTitle, hideTitle: true, step: 4, back: "/company" },
] as const;

type FrameMeta = (typeof frames)[number];

function frameFor(path: string): FrameMeta {
  const found = frames.find((frame) => frame.path === path);
  if (found) {
    return found;
  }
  return frames[0];
}

function slideIn(direction: 1 | -1) {
  return new Keyframe({
    0: { opacity: 0, transform: [{ translateX: SLIDE_PX * direction }] },
    100: { opacity: 1, transform: [{ translateX: 0 }] },
  }).duration(SLIDE_MS);
}

export default function OnboardingLayout() {
  return (
    <OnboardingChromeProvider>
      <OnboardingFrame />
    </OnboardingChromeProvider>
  );
}

function OnboardingFrame() {
  const pathname = usePathname();
  const meta = frameFor(pathname);
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
  const [seen, setSeen] = useState(meta.step);
  const [direction, setDirection] = useState<1 | -1>(1);
  if (seen !== meta.step) {
    setSeen(meta.step);
    setDirection(meta.step >= seen ? 1 : -1);
  }

  const lede = "lede" in meta ? meta.lede : undefined;
  const mark = "mark" in meta ? meta.mark : undefined;
  const hideTitle = "hideTitle" in meta && meta.hideTitle;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACE_8 }]}>
      <Progress step={meta.step} back={meta.back} />
      <Animated.View
        key={pathname}
        entering={reduced ? undefined : slideIn(direction)}
        style={styles.body}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {hideTitle ? null : <StepTitle title={meta.title} lede={lede} mark={mark} />}
          <Slot />
        </ScrollView>
      </Animated.View>
      <OnboardingDock bottom={Math.max(insets.bottom, SPACE_16)} />
    </View>
  );
}

function Progress({ step, back }: { step: number; back: FrameMeta["back"] }) {
  const reduced = useReducedMotion();
  const track = useSharedValue(0);
  const amount = useSharedValue(step);

  useEffect(() => {
    amount.value = reduced ? step : withSpring(step, { damping: 16, stiffness: 140 });
  }, [amount, reduced, step]);

  const fill = useAnimatedStyle(() => ({
    width: track.value * (amount.value / ONBOARDING_DOT_COUNT),
  }));

  return (
    <View style={styles.progress}>
      <PressableScale
        accessibilityLabel="Back"
        haptic="tick"
        onPress={() => {
          router.push(back);
        }}
      >
        <View style={styles.back}>
          <AppIcon name="arrow" color={palette.ink} />
          <Text style={styles.backLabel}>Back</Text>
        </View>
      </PressableScale>
      <View
        accessibilityLabel={step === 0 ? "Start" : `Step ${step} of ${ONBOARDING_DOT_COUNT}`}
        style={styles.track}
        onLayout={(event) => {
          track.value = event.nativeEvent.layout.width;
        }}
      >
        <Animated.View style={[styles.fill, fill]} />
      </View>
    </View>
  );
}

function OnboardingDock({ bottom }: { bottom: number }) {
  const { store, handlersRef } = useOnboardingStore();
  if (store.primary.length === 0) {
    return <View style={{ paddingBottom: bottom }} />;
  }
  return (
    <View style={[styles.dock, { paddingBottom: bottom }]}>
      <PillButton
        label={store.primary}
        disabled={store.primaryDisabled}
        haptic={store.primaryHaptic}
        onPress={() => {
          handlersRef.current.onPrimary();
        }}
      />
      {store.linkLabel ? (
        <PressableScale
          accessibilityRole="button"
          haptic="tick"
          onPress={() => {
            handlersRef.current.onLink?.();
          }}
        >
          <Text style={styles.link}>{store.linkLabel}</Text>
        </PressableScale>
      ) : null}
      {store.footerNote ? <Text style={styles.note}>{store.footerNote}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  body: { flex: 1 },
  scroll: { paddingHorizontal: SPACE_24, gap: SPACE_16, paddingBottom: SPACE_24 },
  progress: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE_16,
    paddingHorizontal: SPACE_24,
  },
  back: { minHeight: TARGET, flexDirection: "row", alignItems: "center", gap: SPACE_8 },
  backLabel: { fontFamily: "Nunito_700Bold", fontSize: FONT_BODY, color: palette.ink },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 8,
    backgroundColor: palette.line,
    overflow: "hidden",
  },
  fill: { height: 8, borderRadius: 8, backgroundColor: palette.ink },
  dock: { paddingHorizontal: SPACE_24, gap: SPACE_8, paddingTop: SPACE_8 },
  link: {
    minHeight: TARGET,
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_BODY,
    color: palette.inkSoft,
    paddingTop: SPACE_8,
  },
  note: {
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
  },
});
