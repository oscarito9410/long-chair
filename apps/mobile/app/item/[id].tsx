import { useState } from "react";
import {
  avoidThemes,
  customThemesOf,
  evidenceSampleNote,
  explainItem,
  formatHoursMinutes,
  itemById,
  justWatchCredit,
  matchingSeedNames,
  sampleWatchNote,
  whyItPassed,
} from "@long-chair/core";
import type { CatalogItem, CustomTheme, SessionDraft, ThemeVerdict } from "@long-chair/core";
import { useLocalSearchParams } from "expo-router";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CoverArt } from "../../src/components/art/CoverArt";
import { IconWell } from "../../src/components/chrome/IconWell";
import { PillButton } from "../../src/components/chrome/PillButton";
import { GlassSurface } from "../../src/components/glass/GlassSurface";
import { backToKit, closeLabel, missingPiece } from "../../src/copy/phrases";
import { closeSheet } from "../../src/navigation/present-sheet";
import { itemIdFromParams } from "../../src/navigation/safe-route";
import { kindHue, kindIcon, kindLabel } from "../../src/presentation";
import { useSession } from "../../src/state/session";
import {
  FONT_BODY,
  FONT_SECONDARY,
  FONT_TITLE,
  hueFill,
  palette,
  RADIUS_CARD,
  RADIUS_PANEL,
  RADIUS_PILL,
  SPACE_16,
  SPACE_24,
  SPACE_8,
  TARGET,
} from "../../src/theme/palette";

const POSTER_W = 220;
const POSTER_H = 280;
const SHEET_LIMIT = 0.82;

export default function ItemRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const itemId = itemIdFromParams(params.id);
  if (Platform.OS === "ios") {
    return <ItemBody itemId={itemId} />;
  }
  return (
    <View style={styles.fill}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={closeLabel}
        style={styles.scrim}
        onPress={() => {
          closeSheet();
        }}
      />
      <GlassSurface style={styles.sheet} tint={palette.card}>
        <View style={styles.handle} />
        <ItemBody itemId={itemId} />
      </GlassSurface>
    </View>
  );
}

function verdictName(verdict: ThemeVerdict, custom: readonly CustomTheme[]): string {
  const known = avoidThemes.find((theme) => theme.id === verdict.themeId);
  const added = custom.find((theme) => theme.id === verdict.themeId);
  return known?.label ?? added?.label ?? verdict.themeId;
}

function evidenceCopy(item: CatalogItem, draft: SessionDraft): string[] {
  const custom = customThemesOf(draft.customThemes);
  return explainItem(item, draft.avoidIds, custom).map((verdict) => {
    const detail = verdict.evidence.map((entry) => entry.detail).join(" ");
    return `${verdictName(verdict, custom)}: ${verdict.verdict}. ${detail}`;
  });
}

function ItemBody({ itemId }: { itemId: string }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { draft } = useSession();
  const item = itemById(itemId);
  const pad = { paddingBottom: insets.bottom + SPACE_24 };
  const scrollLimit = Platform.OS === "ios" ? undefined : height * SHEET_LIMIT;

  if (!item) {
    return (
      <View style={[styles.body, pad]}>
        <Text accessibilityRole="header" style={styles.title}>
          {missingPiece}
        </Text>
        <PillButton
          label={backToKit}
          onPress={() => {
            closeSheet();
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, scrollLimit ? { maxHeight: scrollLimit } : null]}
      contentContainerStyle={[styles.body, pad]}
    >
      <ItemSheet item={item} draft={draft} />
    </ScrollView>
  );
}

function ItemSheet({ item, draft }: { item: CatalogItem; draft: SessionDraft }) {
  const because = matchingSeedNames(item, draft)[0];
  const [open, setOpen] = useState(false);
  const hue = hueFill[kindHue[item.kind]];
  const links = item.links ?? [];
  const primary = links[0];
  const more = links.slice(1);

  return (
    <>
      <View style={styles.hero}>
        <CoverArt
          seed={item.id}
          hue={kindHue[item.kind]}
          kind={item.kind}
          width={POSTER_W}
          height={POSTER_H}
        />
      </View>
      <TypeChip item={item} />
      <Text accessibilityRole="header" style={styles.title}>
        {item.title}
      </Text>
      <Text style={styles.copy}>{item.maker}</Text>
      <Text style={styles.copy}>{formatHoursMinutes(item.minutes)}</Text>
      {item.durationNote ? <Text style={styles.note}>{item.durationNote}</Text> : null}
      {because ? <Text style={styles.copy}>{`Because you love ${because}.`}</Text> : null}
      {primary ? <OpenLink label={primary.label} href={primary.href} tint={hue} /> : null}
      {more.map((link) => (
        <OpenLink key={link.href} label={link.label} href={link.href} tint={palette.card} />
      ))}
      <WatchNote item={item} />
      <PillButton
        label={whyItPassed}
        quiet
        tint={palette.card}
        onPress={() => {
          setOpen((current) => !current);
        }}
      />
      {open ? <EvidencePanel lines={evidenceCopy(item, draft)} /> : null}
    </>
  );
}

function TypeChip({ item }: { item: CatalogItem }) {
  return (
    <GlassSurface tint={hueFill[kindHue[item.kind]]} style={styles.chip}>
      <View style={styles.chipRow}>
        <IconWell hue={kindHue[item.kind]} name={kindIcon[item.kind]} size={TARGET} />
        <Text style={styles.kind}>{kindLabel[item.kind]}</Text>
      </View>
    </GlassSurface>
  );
}

function OpenLink({ label, href, tint }: { label: string; href: string; tint: string }) {
  return (
    <PillButton
      label={label}
      quiet
      tint={tint}
      onPress={() => {
        void Linking.openURL(href);
      }}
    />
  );
}

function WatchNote({ item }: { item: CatalogItem }) {
  if (!item.watchProviders || item.watchProviders.length === 0) {
    return null;
  }
  return (
    <View style={styles.noteBlock}>
      <Text style={styles.note}>{sampleWatchNote}</Text>
      {item.watchProviders.map((name) => (
        <Text key={name} style={styles.note}>
          {name}
        </Text>
      ))}
      <Text style={styles.note}>{justWatchCredit}</Text>
    </View>
  );
}

function EvidencePanel({ lines }: { lines: readonly string[] }) {
  return (
    <GlassSurface tint={palette.card} style={styles.evidence}>
      <Text style={styles.note}>{evidenceSampleNote}</Text>
      {lines.map((line) => (
        <Text key={line} style={styles.evidenceLine}>
          {line}
        </Text>
      ))}
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: "flex-end" },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: palette.scrim },
  sheet: {
    borderTopLeftRadius: RADIUS_PANEL,
    borderTopRightRadius: RADIUS_PANEL,
    maxHeight: "88%",
    backgroundColor: palette.page,
  },
  handle: {
    alignSelf: "center",
    width: TARGET,
    height: 4,
    borderRadius: 4,
    backgroundColor: palette.line,
    marginTop: SPACE_8,
  },
  scroll: { flex: 1, backgroundColor: palette.page },
  body: {
    flexGrow: 1,
    backgroundColor: palette.page,
    paddingHorizontal: SPACE_24,
    paddingTop: SPACE_16,
    gap: SPACE_16,
  },
  hero: {
    alignSelf: "center",
    borderRadius: RADIUS_CARD,
    overflow: "hidden",
  },
  chip: { alignSelf: "center", borderRadius: RADIUS_PILL },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE_8,
    paddingLeft: SPACE_8,
    paddingRight: SPACE_16,
    paddingVertical: SPACE_8,
  },
  kind: { fontFamily: "Nunito_700Bold", fontSize: FONT_SECONDARY, color: palette.ink },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_TITLE,
    color: palette.ink,
    textAlign: "center",
  },
  copy: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_BODY,
    color: palette.ink,
    textAlign: "center",
  },
  note: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
    textAlign: "center",
  },
  noteBlock: { gap: SPACE_8 },
  evidence: { padding: SPACE_16, gap: SPACE_8 },
  evidenceLine: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_BODY,
    color: palette.ink,
  },
});
