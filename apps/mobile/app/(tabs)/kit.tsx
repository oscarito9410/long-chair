import {
  avoidThemes,
  formatHoursMinutes,
  formatRange,
  itemById,
  matchingSeedNames,
  PAUSE_NOTICE_MINUTES,
} from "@long-chair/core";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CoverArt } from "../../src/components/art/CoverArt";
import { GlassSurface } from "../../src/components/glass/GlassSurface";
import { PillButton } from "../../src/components/chrome/PillButton";
import { SampleBanner } from "../../src/components/chrome/SampleBanner";
import {
  editTastes,
  emptyKitAction,
  emptyKitTitle,
  filledCaption,
  kitTitle,
  leftOutLabel,
  openMinutesLine,
  packingSample,
  planFailed,
  settingsLabel,
  trySampleAgain,
} from "../../src/copy/phrases";
import { kindHue, kindLabel } from "../../src/presentation";
import { useSession } from "../../src/state/session";
import { usePlan } from "../../src/state/use-plan";
import {
  COVER,
  FONT_BODY,
  FONT_HERO,
  FONT_SECONDARY,
  FONT_TITLE,
  palette,
  RADIUS_CARD,
  RADIUS_TAG,
  SPACE_16,
  SPACE_24,
  SPACE_8,
} from "../../src/theme/palette";
import { ScrollView } from "react-native";
import type { CatalogItem, PackedSession, SessionDraft } from "@long-chair/core";

const tabClearance = 120;

export default function KitScreen() {
  const insets = useSafeAreaInsets();
  const { draft, reset } = useSession();
  const { plan, loading, error } = usePlan(draft);
  const themes = avoidThemes.filter((theme) => draft.avoidIds.includes(theme.id));
  const packed = plan?.packed;

  return (
    <ScrollView contentContainerStyle={[styles.page, { paddingTop: insets.top + SPACE_16 }]}>
      <SampleBanner live={plan?.source === "live"} />
      <Text style={styles.hero}>{packed ? formatHoursMinutes(packed.filledMinutes) : ""}</Text>
      <Text style={styles.caption}>{filledCaption}</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {kitTitle}
      </Text>
      <ThemeChips labels={themes.map((theme) => theme.label)} />
      {loading ? <Text style={styles.body}>{packingSample}</Text> : null}
      {error ? (
        <View style={styles.stack}>
          <Text style={styles.body}>{error || planFailed}</Text>
          <PillButton label={trySampleAgain} onPress={reset} />
        </View>
      ) : null}
      {packed && packed.slots.length === 0 ? (
        <View style={styles.stack}>
          <Text style={styles.body}>{emptyKitTitle}</Text>
          <PillButton
            label={emptyKitAction}
            onPress={() => {
              router.push("/love");
            }}
          />
        </View>
      ) : null}
      {packed ? <KitRows packed={packed} draft={draft} /> : null}
      {packed && packed.openMinutes >= PAUSE_NOTICE_MINUTES ? (
        <Text style={styles.body}>{openMinutesLine(formatHoursMinutes(packed.openMinutes))}</Text>
      ) : null}
      <PillButton
        label={editTastes}
        quiet
        onPress={() => {
          router.push("/love");
        }}
      />
      <PillButton
        label={settingsLabel}
        quiet
        onPress={() => {
          router.push("/settings");
        }}
      />
    </ScrollView>
  );
}

function ThemeChips({ labels }: { labels: readonly string[] }) {
  if (labels.length === 0) {
    return null;
  }
  return (
    <View accessibilityLabel={leftOutLabel} style={styles.chips}>
      {labels.map((label) => (
        <Text key={label} style={styles.chip}>
          {label}
        </Text>
      ))}
    </View>
  );
}

function KitRows({ packed, draft }: { packed: PackedSession; draft: SessionDraft }) {
  return (
    <>
      {packed.slots.map((slot) => {
        const item = itemById(slot.itemId);
        if (!item) {
          return null;
        }
        return (
          <KitCard
            key={item.id}
            item={item}
            draft={draft}
            start={slot.startMinute}
            end={slot.endMinute}
          />
        );
      })}
    </>
  );
}

function KitCard({
  item,
  draft,
  start,
  end,
}: {
  item: CatalogItem;
  draft: SessionDraft;
  start: number;
  end: number;
}) {
  const because = matchingSeedNames(item, draft)[0];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        router.push(`/item/${item.id}`);
      }}
    >
      <GlassSurface style={styles.card}>
        <CoverArt
          seed={item.id}
          hue={kindHue[item.kind]}
          kind={item.kind}
          width={COVER}
          height={COVER}
        />
        <Text style={styles.kind}>{kindLabel[item.kind]}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.body}>{formatRange(start, end)}</Text>
        {because ? <Text style={styles.body}>{`Because you love ${because}.`}</Text> : null}
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: SPACE_24, gap: SPACE_16, paddingBottom: tabClearance },
  hero: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_HERO, color: palette.ink },
  caption: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  title: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_TITLE, color: palette.ink },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: SPACE_8 },
  chip: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.ink,
    backgroundColor: palette.card,
    paddingHorizontal: SPACE_8,
    paddingVertical: SPACE_8,
    borderRadius: RADIUS_TAG,
  },
  stack: { gap: SPACE_8 },
  card: { borderRadius: RADIUS_CARD, overflow: "hidden", padding: SPACE_16, gap: SPACE_8 },
  kind: { fontFamily: "Nunito_700Bold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  cardTitle: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  body: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.ink },
});
