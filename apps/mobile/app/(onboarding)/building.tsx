import {
  buildAgentSteps,
  buildingLiveText,
  buildingReadyLabel,
  buildingSkipLabel,
  formatHoursMinutes,
  guideById,
  motion,
  notMedicalAdvice,
  stepState,
} from "@long-chair/core";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { announceMessage } from "../../src/a11y/announce";
import { CharacterMark } from "../../src/components/art/CharacterMark";
import { IconWell } from "../../src/components/chrome/IconWell";
import { buildingCaption, buildingTitle, nowLabel } from "../../src/copy/phrases";
import { Enter } from "../../src/motion/Enter";
import { SpringCheck } from "../../src/motion/SpringCheck";
import { useOnboardingChrome } from "../../src/motion/onboarding-chrome";
import { useReducedMotion } from "../../src/motion/use-reduced-motion";
import { useSession } from "../../src/state/session";
import {
  AVATAR,
  FONT_BODY,
  FONT_HERO,
  FONT_SECONDARY,
  FONT_TITLE,
  palette,
  SPACE_16,
  SPACE_8,
  WELL,
} from "../../src/theme/palette";

export default function BuildingScreen() {
  const { draft } = useSession();
  const reduced = useReducedMotion();
  const steps = useMemo(() => buildAgentSteps(draft), [draft]);
  const [shown, setShown] = useState(0);
  const visible = reduced ? steps.length : shown;
  const complete = visible >= steps.length;
  const titles = useMemo(() => steps.map((step) => step.title), [steps]);

  useEffect(() => {
    if (reduced) {
      return;
    }
    const timer = setInterval(() => {
      setShown((current) => (current >= steps.length ? current : current + 1));
    }, motion.stepIntervalMs);
    return () => {
      clearInterval(timer);
    };
  }, [reduced, steps.length]);

  useEffect(() => {
    announceMessage(buildingLiveText(titles, visible));
  }, [titles, visible]);

  useOnboardingChrome({
    primary: complete ? buildingReadyLabel : buildingSkipLabel,
    primaryHaptic: complete ? "firm" : "press",
    onPrimary: () => {
      router.push("/ready");
    },
    footerNote: notMedicalAdvice,
  });

  return (
    <>
      <SessionHeader minutes={draft.durationMinutes} />
      <View style={styles.center}>
        <CharacterMark
          key={complete ? "ready" : "building"}
          variant={guideById(draft.companionId).variant}
          size={AVATAR}
          expression={complete ? "celebration" : "thinking"}
          animate
          settle
        />
      </View>
      {steps.map((step, index) => (
        <StepLine
          key={step.id}
          title={step.title}
          state={stepState(index, visible, steps.length)}
        />
      ))}
    </>
  );
}

function SessionHeader({ minutes }: { minutes: number }) {
  return (
    <View style={styles.header}>
      <Text style={styles.figure}>{formatHoursMinutes(minutes)}</Text>
      <Text style={styles.caption}>{buildingCaption}</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {buildingTitle}
      </Text>
    </View>
  );
}

function StepLine({ title, state }: { title: string; state: "pending" | "active" | "done" }) {
  return (
    <View accessible accessibilityLabel={stepAccessLabel(title, state)} style={styles.step}>
      <Enter key={state} index={0}>
        {state === "pending" ? <View style={styles.empty} /> : null}
        {state === "done" ? (
          <SpringCheck>
            <IconWell hue="seaglass" name="check" />
          </SpringCheck>
        ) : null}
        {state === "active" ? (
          <View style={styles.now}>
            <Text style={styles.nowLabel}>{nowLabel}</Text>
          </View>
        ) : null}
      </Enter>
      <Text style={styles.stepTitle}>{title}</Text>
    </View>
  );
}

function stepAccessLabel(title: string, state: "pending" | "active" | "done"): string {
  if (state === "done") {
    return `${title}. Done.`;
  }
  if (state === "active") {
    return `Now. ${title}.`;
  }
  return `${title}. Waiting.`;
}

const styles = StyleSheet.create({
  header: { gap: SPACE_8 },
  figure: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_HERO,
    lineHeight: 40,
    letterSpacing: -1.6,
    color: palette.ink,
  },
  caption: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_BODY,
    color: palette.inkSoft,
  },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_TITLE,
    lineHeight: 38,
    color: palette.ink,
    marginTop: SPACE_8,
  },
  center: { alignItems: "center" },
  step: { flexDirection: "row", alignItems: "center", gap: SPACE_16 },
  empty: {
    width: WELL,
    height: WELL,
    borderRadius: WELL,
    borderWidth: 2,
    borderColor: palette.line,
  },
  now: {
    width: WELL,
    height: WELL,
    borderRadius: WELL,
    backgroundColor: palette.seaglass,
    alignItems: "center",
    justifyContent: "center",
  },
  nowLabel: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_SECONDARY, color: palette.ink },
  stepTitle: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: FONT_BODY, color: palette.ink },
});
