import { companionTopics, guideById, guideHeader, nearbyPlaces } from "@long-chair/core";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CharacterMark } from "../../src/components/art/CharacterMark";
import { GlassSurface } from "../../src/components/glass/GlassSurface";
import { SampleBanner } from "../../src/components/chrome/SampleBanner";
import { companionEmpty, nearbyTitle, placesNote, talkTitle } from "../../src/copy/phrases";
import { placeHue, placeLabel, tasteCharacter } from "../../src/presentation";
import { useSession } from "../../src/state/session";
import { usePlan } from "../../src/state/use-plan";
import {
  AVATAR,
  FONT_BODY,
  FONT_SECONDARY,
  palette,
  RADIUS_CARD,
  SPACE_16,
  SPACE_24,
  SPACE_8,
} from "../../src/theme/palette";

export default function CompanionScreen() {
  const insets = useSafeAreaInsets();
  const { draft } = useSession();
  const { plan } = usePlan(draft);
  const guide = guideById(draft.companionId);
  const topics = companionTopics.filter((topic) => draft.seedIds.includes(topic.seedId));
  const places = plan?.places ?? nearbyPlaces;

  return (
    <ScrollView contentContainerStyle={[styles.page, { paddingTop: insets.top + SPACE_16 }]}>
      <SampleBanner live={plan?.source === "live"} />
      <View style={styles.header}>
        <CharacterMark variant={guide.variant} size={AVATAR} />
        <GlassSurface style={styles.bubble}>
          <Text accessibilityRole="header" style={styles.headerText}>
            {guideHeader(guide.personality, guide.quote)}
          </Text>
        </GlassSurface>
      </View>
      <Text style={styles.section}>{nearbyTitle}</Text>
      <Text style={styles.body}>{placesNote}</Text>
      {places.map((place) => (
        <GlassSurface key={place.id} style={styles.card}>
          <Text style={styles.kind}>{placeLabel[place.kind]}</Text>
          <Text style={styles.cardTitle}>{place.name}</Text>
          <Text style={styles.body}>{place.offer}</Text>
          <Text style={[styles.kind, { color: placeHue[place.kind] }]}>{place.priceLabel}</Text>
        </GlassSurface>
      ))}
      <Text style={styles.section}>{talkTitle}</Text>
      {topics.length === 0 ? <Text style={styles.body}>{companionEmpty}</Text> : null}
      {topics.map((topic) => (
        <GlassSurface key={topic.id} style={styles.card}>
          <CharacterMark variant={tasteCharacter(topic.seedId)} size={AVATAR} />
          <Text style={styles.cardTitle}>{topic.title}</Text>
          <Text style={styles.body}>{topic.prompt}</Text>
        </GlassSurface>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: SPACE_24, gap: SPACE_16, paddingBottom: 120 },
  header: { flexDirection: "row", gap: SPACE_16, alignItems: "center" },
  bubble: { flex: 1, borderRadius: RADIUS_CARD, padding: SPACE_16 },
  headerText: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  section: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  card: { borderRadius: RADIUS_CARD, padding: SPACE_16, gap: SPACE_8 },
  kind: { fontFamily: "Nunito_700Bold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  cardTitle: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  body: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.ink },
});
