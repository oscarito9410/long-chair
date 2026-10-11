import { guideById, guides, notMedicalAdvice, onboardingStepIndex } from "@long-chair/core";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CharacterMark } from "../src/components/art/CharacterMark";
import { Aside } from "../src/components/chrome/HandNote";
import { GlassSurface } from "../src/components/glass/GlassSurface";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import { chooseGuide, companyTitle, skipLabel } from "../src/copy/phrases";
import { PressableScale } from "../src/motion/PressableScale";
import { useSession } from "../src/state/session";
import {
  AVATAR,
  FONT_BODY,
  hueFill,
  palette,
  RADIUS_CARD,
  SPACE_16,
  SPACE_8,
} from "../src/theme/palette";
import { screenTints } from "../src/theme/screen-tints";

export default function CompanyScreen() {
  const { draft, setCompanion } = useSession();
  const [companionId, setCompanionId] = useState(draft.companionId);
  const guide = guideById(companionId);

  return (
    <ScreenScaffold
      title={companyTitle}
      tint={screenTints.company}
      step={onboardingStepIndex.company}
      onBack={() => {
        router.push("/themes");
      }}
      footerNote={notMedicalAdvice}
      primary={chooseGuide(guide.name)}
      primaryHaptic="firm"
      onPrimary={() => {
        setCompanion(guide.id);
        router.push("/building");
      }}
      secondary={skipLabel}
      onSecondary={() => {
        router.push("/building");
      }}
    >
      <View style={styles.grid}>
        {guides.map((choice) => {
          const selected = choice.id === guide.id;
          return (
            <PressableScale
              key={choice.id}
              haptic="tick"
              onPress={() => {
                setCompanionId(choice.id);
              }}
              accessibilityState={{ selected }}
              style={styles.cell}
            >
              <GlassSurface
                style={styles.card}
                tint={hueFill[choice.variant.hue]}
                selected={selected}
                interactive={selected}
              >
                <CharacterMark variant={choice.variant} size={AVATAR} animate={selected} />
                <Text style={styles.name}>{choice.name}</Text>
              </GlassSurface>
            </PressableScale>
          );
        })}
      </View>
      <Aside text={guide.quote} />
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACE_16 },
  cell: { width: "47%" },
  card: {
    borderRadius: RADIUS_CARD,
    alignItems: "center",
    padding: SPACE_16,
    gap: SPACE_8,
  },
  name: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
});
