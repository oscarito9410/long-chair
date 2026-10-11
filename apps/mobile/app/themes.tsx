import { avoidThemes, notMedicalAdvice, onboardingStepIndex, themesLede } from "@long-chair/core";
import { router } from "expo-router";

import { OptionRow } from "../src/components/chrome/OptionRow";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import { continueLabel, selectedLeftOut, skipLabel } from "../src/copy/phrases";
import { themeCharacter } from "../src/presentation";
import { useSession } from "../src/state/session";
import { screenTints } from "../src/theme/screen-tints";

export default function ThemesScreen() {
  const { draft, toggleAvoid } = useSession();
  return (
    <ScreenScaffold
      title="What should stay out of the room?"
      lede={themesLede}
      tint={screenTints.themes}
      step={onboardingStepIndex.themes}
      onBack={() => {
        router.push("/chair");
      }}
      footerNote={notMedicalAdvice}
      primary={continueLabel}
      onPrimary={() => {
        router.push("/company");
      }}
      secondary={skipLabel}
      onSecondary={() => {
        router.push("/company");
      }}
    >
      {avoidThemes.map((theme) => (
        <OptionRow
          key={theme.id}
          title={theme.label}
          detail={theme.detail}
          selected={draft.avoidIds.includes(theme.id)}
          selectedLabel={selectedLeftOut}
          character={themeCharacter(theme.id)}
          onPress={() => {
            toggleAvoid(theme.id);
          }}
        />
      ))}
    </ScreenScaffold>
  );
}
