import { companionTopics, guideById, guideHeader, nearbyPlaces } from "@long-chair/core";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CharacterMark } from "../../src/components/art/CharacterMark";
import { GlassChip } from "../../src/components/chrome/GlassChip";
import { Aside } from "../../src/components/chrome/HandNote";
import { IconWell } from "../../src/components/chrome/IconWell";
import { SampleBanner } from "../../src/components/chrome/SampleBanner";
import { GlassSurface } from "../../src/components/glass/GlassSurface";
import { companionEmpty, nearbyTitle, placesNote, talkTitle } from "../../src/copy/phrases";
import { placeHue, placeIcon, placeLabel, tasteCharacter } from "../../src/presentation";
import { useSession } from "../../src/state/session";
import { usePlan } from "../../src/state/use-plan";
import {
  AVATAR,
  FONT_BODY,
  FONT_SECONDARY,
  hueFill,
  palette,
  RADIUS_CARD,
  SPACE_16,
  SPACE_24,
  SPACE_8,
  TARGET,
} from "../../src/theme/palette";

const tabClearance = 120;

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
        <CharacterMark variant={guide.variant} size={AVATAR} animate />
        <GlassSurface style={styles.bubble} tint={hueFill[guide.variant.hue]}>
          <Text accessibilityRole="header" style={styles.headerText}>
            {guideHeader(guide.personality, guide.quote)}
          </Text>
        </GlassSurface>
      </View>
      <Aside text={guide.quote} />
      <Text style={styles.section}>{nearbyTitle}</Text>
      <Text style={styles.body}>{placesNote}</Text>
      {places.map((place) => (
        <GlassSurface key={place.id} style={styles.card} tint={hueFill[placeHue[place.kind]]}>
          <View style={styles.meta}>
            <IconWell hue={placeHue[place.kind]} name={placeIcon[place.kind]} size={TARGET} />
            <Text style={styles.kind}>{placeLabel[place.kind]}</Text>
          </View>
          <Text style={styles.cardTitle}>{place.name}</Text>
          <Text style={styles.body}>{place.offer}</Text>
          <GlassChip label={place.priceLabel} tint={hueFill[placeHue[place.kind]]} />
        </GlassSurface>
      ))}
      <Text style={styles.section}>{talkTitle}</Text>
      {topics.length === 0 ? <Text style={styles.body}>{companionEmpty}</Text> : null}
      {topics.map((topic) => (
        <GlassSurface key={topic.id} style={styles.card} tint={palette.honey}>
          <CharacterMark variant={tasteCharacter(topic.seedId)} size={AVATAR} />
          <Text style={styles.cardTitle}>{topic.title}</Text>
          <Text style={styles.body}>{topic.prompt}</Text>
        </GlassSurface>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: SPACE_24, gap: SPACE_16, paddingBottom: tabClearance },
  header: { flexDirection: "row", gap: SPACE_16, alignItems: "center" },
  bubble: { flex: 1, borderRadius: RADIUS_CARD, padding: SPACE_16 },
  headerText: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  section: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  card: { borderRadius: RADIUS_CARD, padding: SPACE_16, gap: SPACE_8 },
  meta: { flexDirection: "row", alignItems: "center", gap: SPACE_8 },
  kind: { fontFamily: "Nunito_700Bold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  cardTitle: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  body: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.ink },
});
