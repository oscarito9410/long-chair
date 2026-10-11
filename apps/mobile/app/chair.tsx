import {
  durationChoices,
  notMedicalAdvice,
  onboardingStepIndex,
  TYPICAL_CHAIR_MINUTES,
} from "@long-chair/core";
import { router } from "expo-router";

import { OptionRow } from "../src/components/chrome/OptionRow";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import {
  chairLede,
  chairTitle,
  changeAnytime,
  continueLabel,
  longAfternoon,
} from "../src/copy/phrases";
import { useSession } from "../src/state/session";
import { screenTints } from "../src/theme/screen-tints";

const lengthCharacter = {
  shape: "pebble" as const,
  hue: "seaglass" as const,
  mood: "content" as const,
  accessory: "none" as const,
};

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
      secondary={changeAnytime}
      onSecondary={() => {
        router.push("/themes");
      }}
    >
      {durationChoices.map((choice) => (
        <OptionRow
          key={choice.minutes}
          title={choice.label}
          detail={choice.minutes === TYPICAL_CHAIR_MINUTES ? longAfternoon : choice.detail}
          selected={draft.durationMinutes === choice.minutes}
          selectedLabel={choice.label}
          character={lengthCharacter}
          onPress={() => {
            setDuration(choice.minutes);
          }}
        />
      ))}
    </ScreenScaffold>
  );
}
