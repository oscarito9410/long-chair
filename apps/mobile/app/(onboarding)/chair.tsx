import { notMedicalAdvice } from "@long-chair/core";
import { router } from "expo-router";
import Animated, { Keyframe } from "react-native-reanimated";

import { ChairDial } from "../../src/components/dial/ChairDial";
import { continueLabel } from "../../src/copy/phrases";
import { useOnboardingChrome } from "../../src/motion/onboarding-chrome";
import { useReducedMotion } from "../../src/motion/use-reduced-motion";
import { useSession } from "../../src/state/session";

const HERO_MS = 900;

const heroIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 14 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }] },
}).duration(HERO_MS);

export default function ChairScreen() {
  const reduced = useReducedMotion();
  const { draft, setDuration } = useSession();
  useOnboardingChrome({
    primary: continueLabel,
    onPrimary: () => {
      router.push("/themes");
    },
    footerNote: notMedicalAdvice,
  });

  return (
    <Animated.View entering={reduced ? undefined : heroIn}>
      <ChairDial minutes={draft.durationMinutes} onChange={setDuration} />
    </Animated.View>
  );
}
