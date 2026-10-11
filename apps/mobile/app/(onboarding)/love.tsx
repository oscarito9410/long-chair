import { canContinueTastes, notMedicalAdvice } from "@long-chair/core";
import { router } from "expo-router";

import { TastePicker } from "../../src/components/taste/TastePicker";
import { continueLabel, skipLabel } from "../../src/copy/phrases";
import { useOnboardingChrome } from "../../src/motion/onboarding-chrome";
import { useSession } from "../../src/state/session";

export default function LoveScreen() {
  const { draft, toggleSeed } = useSession();
  const ready = canContinueTastes(draft.seedIds.length);
  useOnboardingChrome({
    primary: continueLabel,
    primaryDisabled: !ready,
    onPrimary: () => {
      router.push("/chair");
    },
    linkLabel: skipLabel,
    onLink: () => {
      router.push("/chair");
    },
    footerNote: notMedicalAdvice,
  });

  return <TastePicker selectedIds={draft.seedIds} onToggle={toggleSeed} />;
}
