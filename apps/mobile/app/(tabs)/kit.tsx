import {
  avoidThemes,
  formatHoursMinutes,
  formatRange,
  itemById,
  matchingSeedNames,
  PAUSE_NOTICE_MINUTES,
} from "@long-chair/core";
import type { CatalogItem, PackedSession, SessionDraft } from "@long-chair/core";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CoverArt } from "../../src/components/art/CoverArt";
import { GlassChip } from "../../src/components/chrome/GlassChip";
import { IconWell } from "../../src/components/chrome/IconWell";
import { PillButton } from "../../src/components/chrome/PillButton";
import { SampleBanner } from "../../src/components/chrome/SampleBanner";
import { GlassSurface } from "../../src/components/glass/GlassSurface";
import { PressableScale } from "../../src/motion/PressableScale";
import { Shimmer } from "../../src/motion/Shimmer";
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

export default function KitScreen() {
  const insets = useSafeAreaInsets();
  const { draft, reset } = useSession();
  const { plan, loading, error } = usePlan(draft);
  const themes = avoidThemes.filter((theme) => draft.avoidIds.includes(theme.id));
  const packed = plan?.packed;

  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.page, { paddingTop: insets.top + SPACE_16 }]}
    >
      <SampleBanner live={plan?.source === "live"} />
      <Text style={styles.hero}>{packed ? formatHoursMinutes(packed.filledMinutes) : ""}</Text>
      <Text style={styles.caption}>{filledCaption}</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {kitTitle}
      </Text>
      <ThemeChips labels={themes.map((theme) => theme.label)} />
      {loading ? <Shimmer label={packingSample} /> : null}
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
        tint={palette.honey}
        icon="arrow"
        onPress={() => {
          router.push("/love");
        }}
      />
      <PillButton
        label={settingsLabel}
        quiet
        tint={palette.seaglass}
        icon="gear"
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
        <GlassChip key={label} label={label} tint={palette.wisteria} />
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
    <PressableScale
      haptic="tick"
      onPress={() => {
        router.push(`/item/${item.id}`);
      }}
      style={styles.stretch}
    >
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
        <Text style={styles.body}>{formatRange(start, end)}</Text>
        {because ? <Text style={styles.body}>{`Because you love ${because}.`}</Text> : null}
      </GlassSurface>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "transparent" },
  page: { paddingHorizontal: SPACE_24, gap: SPACE_16, paddingBottom: SPACE_24 },
  hero: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_HERO, color: palette.ink },
  caption: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  title: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_TITLE, color: palette.ink },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: SPACE_8 },
  stack: { gap: SPACE_8 },
  stretch: { alignSelf: "stretch" },
  card: { borderRadius: RADIUS_CARD, padding: SPACE_16, gap: SPACE_8 },
  meta: { flexDirection: "row", alignItems: "center", gap: SPACE_8 },
  kind: { fontFamily: "Nunito_700Bold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  cardTitle: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  body: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.ink },
});
