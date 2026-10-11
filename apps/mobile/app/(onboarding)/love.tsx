import { notMedicalAdvice, tasteSeeds } from "@long-chair/core";
import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { OptionRow } from "../../src/components/chrome/OptionRow";
import {
  chooseOne,
  continueLabel,
  inTheRoom,
  selectedInRoom,
  skipLabel,
} from "../../src/copy/phrases";
import { Enter } from "../../src/motion/Enter";
import { useOnboardingChrome } from "../../src/motion/onboarding-chrome";
import { tasteCharacter } from "../../src/presentation";
import { useSession } from "../../src/state/session";
import { FONT_SECONDARY, palette } from "../../src/theme/palette";

export default function LoveScreen() {
  const { draft, toggleSeed } = useSession();
  const canContinue = draft.seedIds.length > 0;
  useOnboardingChrome({
    primary: continueLabel,
    primaryDisabled: !canContinue,
    onPrimary: () => {
      router.push("/chair");
    },
    linkLabel: skipLabel,
    onLink: () => {
      router.push("/chair");
    },
    footerNote: notMedicalAdvice,
  });

  return (
    <>
      {tasteSeeds.map((seed, index) => (
        <Enter key={seed.id} index={index}>
          <OptionRow
            title={seed.name}
            detail={seed.detail}
            selected={draft.seedIds.includes(seed.id)}
            selectedLabel={selectedInRoom}
            character={tasteCharacter(seed.id)}
            onPress={() => {
              toggleSeed(seed.id);
            }}
          />
        </Enter>
      ))}
      <Text accessibilityLiveRegion="polite" style={styles.status}>
        {canContinue ? inTheRoom : chooseOne}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  status: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
  },
});
