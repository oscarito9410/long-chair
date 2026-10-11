import {
  buildAgentSteps,
  buildingLiveText,
  buildingReadyLabel,
  buildingSkipLabel,
  formatHoursMinutes,
  guideById,
  notMedicalAdvice,
  onboardingStepIndex,
  stepState,
} from "@long-chair/core";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CharacterMark } from "../src/components/art/CharacterMark";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import { buildingCaption, buildingTitle, nowLabel } from "../src/copy/phrases";
import { useReducedMotion } from "../src/motion/use-reduced-motion";
import { useSession } from "../src/state/session";
import { AVATAR, FONT_BODY, FONT_HERO, palette, SPACE_16, WELL } from "../src/theme/palette";
import { screenTints } from "../src/theme/screen-tints";

const stepMs = 700;

export default function BuildingScreen() {
  const { draft } = useSession();
  const reduced = useReducedMotion();
  const steps = useMemo(() => buildAgentSteps(draft), [draft]);
  const [shown, setShown] = useState(0);
  const visible = reduced ? steps.length : shown;
  const complete = visible >= steps.length;

  useEffect(() => {
    if (reduced) {
      return;
    }
    const timer = setInterval(() => {
      setShown((current) => (current >= steps.length ? current : current + 1));
    }, stepMs);
    return () => {
      clearInterval(timer);
    };
  }, [reduced, steps.length]);

  return (
    <ScreenScaffold
      title={buildingTitle}
      lede={formatHoursMinutes(draft.durationMinutes)}
      tint={screenTints.building}
      step={onboardingStepIndex.building}
      onBack={() => {
        router.push("/company");
      }}
      footerNote={notMedicalAdvice}
      primary={complete ? buildingReadyLabel : buildingSkipLabel}
      onPrimary={() => {
        router.push("/ready");
      }}
    >
      <Text style={styles.caption}>{buildingCaption}</Text>
      <Text accessibilityLiveRegion="polite" style={styles.live}>
        {buildingLiveText(
          steps.map((step) => step.title),
          visible,
        )}
      </Text>
      <View style={styles.center}>
        <CharacterMark
          variant={guideById(draft.companionId).variant}
          size={AVATAR}
          animate={!complete}
        />
      </View>
      {steps.map((step, index) => (
        <StepLine
          key={step.id}
          title={step.title}
          state={stepState(index, visible, steps.length)}
        />
      ))}
    </ScreenScaffold>
  );
}

function StepLine({ title, state }: { title: string; state: "pending" | "active" | "done" }) {
  const mark = state === "done" ? "OK" : state === "active" ? nowLabel : "";
  return (
    <View style={styles.step}>
      <View
        style={[
          styles.well,
          state === "done" && styles.done,
          state === "pending" && styles.pending,
        ]}
      >
        <Text style={styles.mark}>{mark}</Text>
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.inkSoft },
  live: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_HERO, color: palette.ink },
  center: { alignItems: "center" },
  step: { flexDirection: "row", alignItems: "center", gap: SPACE_16 },
  well: {
    width: WELL,
    height: WELL,
    borderRadius: WELL,
    backgroundColor: palette.seaglass,
    alignItems: "center",
    justifyContent: "center",
  },
  done: { backgroundColor: palette.seaglass },
  pending: { backgroundColor: "transparent", borderWidth: 2, borderColor: palette.line },
  mark: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  stepTitle: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: FONT_BODY, color: palette.ink },
});
