import { tasteSeeds } from "@long-chair/core";
import { notMedicalAdvice } from "@long-chair/core";
import { router } from "expo-router";
import { Text } from "react-native";

import { OptionRow } from "../src/components/chrome/OptionRow";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import {
  chooseOne,
  continueLabel,
  inTheRoom,
  loveLede,
  loveTitle,
  selectedInRoom,
  skipLabel,
} from "../src/copy/phrases";
import { tasteCharacter } from "../src/presentation";
import { useSession } from "../src/state/session";
import { FONT_SECONDARY, palette } from "../src/theme/palette";
import { screenTints } from "../src/theme/screen-tints";

export default function LoveScreen() {
  const { draft, toggleSeed } = useSession();
  const canContinue = draft.seedIds.length > 0;
  return (
    <ScreenScaffold
      title={loveTitle}
      lede={loveLede}
      tint={screenTints.love}
      footerNote={notMedicalAdvice}
      primary={continueLabel}
      primaryDisabled={!canContinue}
      onPrimary={() => {
        router.push("/chair");
      }}
      secondary={skipLabel}
      onSecondary={() => {
        router.push("/chair");
      }}
    >
      {tasteSeeds.map((seed) => (
        <OptionRow
          key={seed.id}
          title={seed.name}
          detail={seed.detail}
          selected={draft.seedIds.includes(seed.id)}
          selectedLabel={selectedInRoom}
          character={tasteCharacter(seed.id)}
          onPress={() => {
            toggleSeed(seed.id);
          }}
        />
      ))}
      <Text
        accessibilityLiveRegion="polite"
        style={{
          fontFamily: "Nunito_600SemiBold",
          fontSize: FONT_SECONDARY,
          color: palette.inkSoft,
        }}
      >
        {canContinue ? inTheRoom : chooseOne}
      </Text>
    </ScreenScaffold>
  );
}
