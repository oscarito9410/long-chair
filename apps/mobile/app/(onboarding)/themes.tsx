import { avoidThemes, notMedicalAdvice } from "@long-chair/core";
import { router } from "expo-router";

import { OptionRow } from "../../src/components/chrome/OptionRow";
import { continueLabel, selectedLeftOut, skipLabel } from "../../src/copy/phrases";
import { Enter } from "../../src/motion/Enter";
import { useOnboardingChrome } from "../../src/motion/onboarding-chrome";
import { themeCharacter } from "../../src/presentation";
import { useSession } from "../../src/state/session";

export default function ThemesScreen() {
  const { draft, toggleAvoid } = useSession();
  useOnboardingChrome({
    primary: continueLabel,
    onPrimary: () => {
      router.push("/company");
    },
    linkLabel: skipLabel,
    onLink: () => {
      router.push("/company");
    },
    footerNote: notMedicalAdvice,
  });

  return (
    <>
      {avoidThemes.map((theme, index) => (
        <Enter key={theme.id} index={index}>
          <OptionRow
            title={theme.label}
            detail={theme.detail}
            selected={draft.avoidIds.includes(theme.id)}
            selectedLabel={selectedLeftOut}
            character={themeCharacter(theme.id)}
            onPress={() => {
              toggleAvoid(theme.id);
            }}
          />
        </Enter>
      ))}
    </>
  );
}
