import { guideById, guides, notMedicalAdvice, onboardingStepIndex } from "@long-chair/core";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CharacterMark } from "../src/components/art/CharacterMark";
import { GlassSurface } from "../src/components/glass/GlassSurface";
import { ScreenScaffold } from "../src/components/chrome/ScreenScaffold";
import { chooseGuide, companyTitle, skipLabel } from "../src/copy/phrases";
import { selectionHaptic } from "../src/haptics";
import { useSession } from "../src/state/session";
import { AVATAR, FONT_BODY, palette, RADIUS_CARD, SPACE_16, SPACE_8 } from "../src/theme/palette";
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
            <Pressable
              key={choice.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                selectionHaptic();
                setCompanionId(choice.id);
              }}
              style={styles.cell}
            >
              <GlassSurface style={styles.card} interactive={selected}>
                <CharacterMark variant={choice.variant} size={AVATAR} animate={selected} />
                <Text style={styles.name}>{choice.name}</Text>
              </GlassSurface>
            </Pressable>
          );
        })}
      </View>
      <Text accessibilityLiveRegion="polite" style={styles.quote}>
        {guide.quote}
      </Text>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACE_16 },
  cell: { width: "47%" },
  card: {
    borderRadius: RADIUS_CARD,
    overflow: "hidden",
    alignItems: "center",
    padding: SPACE_16,
    gap: SPACE_8,
  },
  name: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  quote: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_BODY,
    color: palette.ink,
    textAlign: "center",
  },
});
