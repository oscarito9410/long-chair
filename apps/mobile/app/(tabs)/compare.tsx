import {
  compareBroughtLabels,
  FALLBACK_COMPARE_ID,
  itemById,
  matchingSeedNames,
  plainModelExample,
  plainThemeLabels,
} from "@long-chair/core";
import type { CatalogItem, PackedSession } from "@long-chair/core";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CoverArt } from "../../src/components/art/CoverArt";
import { GlassChip } from "../../src/components/chrome/GlassChip";
import { IconWell } from "../../src/components/chrome/IconWell";
import { SampleBanner } from "../../src/components/chrome/SampleBanner";
import { GlassSurface } from "../../src/components/glass/GlassSurface";
import {
  addFilm,
  becauseYouLove,
  compareCaption,
  compareTitle,
  keptForTaste,
  nothingKept,
  plainStory,
  wouldBring,
} from "../../src/copy/phrases";
import { kindHue, kindIcon, kindLabel } from "../../src/presentation";
import { useSession } from "../../src/state/session";
import { usePlan } from "../../src/state/use-plan";
import {
  COVER,
  FONT_BODY,
  FONT_HERO,
  FONT_SECONDARY,
  FONT_TITLE,
  hueFill,
  palette,
  RADIUS_CARD,
  SPACE_16,
  SPACE_24,
  SPACE_8,
  TARGET,
} from "../../src/theme/palette";

function keptItem(packed: PackedSession | undefined): CatalogItem | undefined {
  if (!packed) {
    return undefined;
  }
  for (const slot of packed.slots) {
    const item = itemById(slot.itemId);
    if (item?.kind === "movie") {
      return item;
    }
  }
  return itemById(FALLBACK_COMPARE_ID);
}

export default function CompareScreen() {
  const insets = useSafeAreaInsets();
  const { draft } = useSession();
  const { plan } = usePlan(draft);
  const themes = plainThemeLabels(draft);
  const kept = keptItem(plan?.packed);
  const because = kept ? matchingSeedNames(kept, draft)[0] : undefined;
  const brought = compareBroughtLabels();

  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.page, { paddingTop: insets.top + SPACE_16 }]}
    >
      <SampleBanner live={plan?.source === "live"} />
      <Text style={styles.hero}>{String(themes.length)}</Text>
      <Text style={styles.caption}>{compareCaption}</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {compareTitle}
      </Text>
      <GlassSurface style={styles.card} tint={palette.wisteria}>
        <View style={styles.meta}>
          <IconWell hue="wisteria" name="split" size={TARGET} />
          <Text style={styles.cardTitle}>{plainModelExample.title}</Text>
        </View>
        <Text style={styles.body}>{plainStory}</Text>
        <Text style={styles.body}>{wouldBring}</Text>
        <View style={styles.chips}>
          {brought.map((label) => (
            <GlassChip key={label} label={label} tint={palette.honey} />
          ))}
        </View>
      </GlassSurface>
      <KeptCard item={kept} because={because} />
    </ScrollView>
  );
}

function KeptCard({
  item,
  because,
}: {
  item: CatalogItem | undefined;
  because: string | undefined;
}) {
  if (!item) {
    return (
      <GlassSurface style={styles.card} tint={palette.seaglass}>
        <Text style={styles.cardTitle}>{nothingKept}</Text>
        <Text style={styles.body}>{addFilm}</Text>
      </GlassSurface>
    );
  }
  return (
    <GlassSurface style={styles.card} tint={hueFill[kindHue[item.kind]]}>
      <CoverArt
        seed={item.id}
        hue={kindHue[item.kind]}
        kind={item.kind}
        width={COVER}
        height={COVER}
      />
      <View style={styles.meta}>
        <IconWell hue={kindHue[item.kind]} name={kindIcon[item.kind]} size={TARGET} />
        <Text style={styles.kind}>{kindLabel[item.kind]}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.body}>{because ? becauseYouLove(because) : keptForTaste}</Text>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "transparent" },
  page: { paddingHorizontal: SPACE_24, gap: SPACE_16, paddingBottom: SPACE_24 },
  hero: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_HERO, color: palette.ink },
  caption: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  title: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_TITLE, color: palette.ink },
  card: { borderRadius: RADIUS_CARD, padding: SPACE_16, gap: SPACE_8 },
  meta: { flexDirection: "row", alignItems: "center", gap: SPACE_8 },
  kind: { fontFamily: "Nunito_700Bold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  cardTitle: {
    flex: 1,
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_BODY,
    color: palette.ink,
  },
  body: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.ink },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: SPACE_8 },
});
