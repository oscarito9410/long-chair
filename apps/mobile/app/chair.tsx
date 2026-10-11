import { notMedicalAdvice, onboardingStepIndex } from "@long-chair/core";
import { router } from "expo-router";

import { ChairDial } from "../src/components/dial/ChairDial";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import { chairLede, chairTitle, continueLabel } from "../src/copy/phrases";
import { useSession } from "../src/state/session";
import { screenTints } from "../src/theme/screen-tints";

export default function ChairScreen() {
  const { draft, setDuration } = useSession();
  return (
    <ScreenScaffold
      title={chairTitle}
      lede={chairLede}
      tint={screenTints.chair}
      step={onboardingStepIndex.chair}
      onBack={() => {
        router.push("/love");
      }}
      footerNote={notMedicalAdvice}
      primary={continueLabel}
      onPrimary={() => {
        router.push("/themes");
      }}
    >
      <ChairDial minutes={draft.durationMinutes} onChange={setDuration} />
    </ScreenScaffold>
  );
}
