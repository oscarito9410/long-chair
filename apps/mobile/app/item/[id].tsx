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
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
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
  palette,
  RADIUS_PANEL,
  SPACE_16,
  SPACE_24,
  SPACE_8,
  TARGET,
} from "../../src/theme/palette";

const POSTER = 180;

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
  const { draft } = useSession();
  const item = itemById(itemId);
  const because = item ? matchingSeedNames(item, draft)[0] : undefined;
  const [open, setOpen] = useState(false);

  if (!item) {
    return (
      <View style={[styles.body, { paddingBottom: insets.bottom + SPACE_16 }]}>
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
    <View style={[styles.body, { paddingBottom: insets.bottom + SPACE_16 }]}>
      <PillButton
        label={closeLabel}
        quiet
        tint={palette.apricot}
        icon="x"
        onPress={() => {
          closeSheet();
        }}
      />
      <CoverArt
        seed={item.id}
        hue={kindHue[item.kind]}
        kind={item.kind}
        width={POSTER}
        height={POSTER}
      />
      <View style={styles.meta}>
        <IconWell hue={kindHue[item.kind]} name={kindIcon[item.kind]} size={TARGET} />
        <Text style={styles.kind}>{kindLabel[item.kind]}</Text>
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {item.title}
      </Text>
      <Text style={styles.copy}>{item.maker}</Text>
      <Text style={styles.copy}>{formatHoursMinutes(item.minutes)}</Text>
      {item.durationNote ? <Text style={styles.copy}>{item.durationNote}</Text> : null}
      {because ? <Text style={styles.copy}>{`Because you love ${because}.`}</Text> : null}
      {item.links?.map((link) => (
        <Pressable
          key={link.href}
          accessibilityRole="button"
          onPress={() => {
            void Linking.openURL(link.href);
          }}
        >
          <Text style={styles.copy}>{link.label}</Text>
        </Pressable>
      ))}
      {item.watchProviders && item.watchProviders.length > 0 ? (
        <View>
          <Text style={styles.copy}>{sampleWatchNote}</Text>
          {item.watchProviders.map((name) => (
            <Text key={name} style={styles.copy}>
              {name}
            </Text>
          ))}
          <Text style={styles.copy}>{justWatchCredit}</Text>
        </View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setOpen(true);
        }}
      >
        <Text style={styles.copy}>{whyItPassed}</Text>
      </Pressable>
      {open ? (
        <View>
          <Text style={styles.copy}>{evidenceSampleNote}</Text>
          {evidenceCopy(item, draft).map((line) => (
            <Text key={line} style={styles.copy}>
              {line}
            </Text>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setOpen(false);
            }}
          >
            <Text style={styles.copy}>Close</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: "flex-end" },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: palette.scrim },
  sheet: {
    borderTopLeftRadius: RADIUS_PANEL,
    borderTopRightRadius: RADIUS_PANEL,
    maxHeight: "88%",
  },
  handle: {
    alignSelf: "center",
    width: TARGET,
    height: 4,
    borderRadius: 4,
    backgroundColor: palette.line,
    marginTop: SPACE_8,
  },
  body: { padding: SPACE_24, gap: SPACE_8 },
  meta: { flexDirection: "row", alignItems: "center", gap: SPACE_8 },
  kind: { fontFamily: "Nunito_700Bold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  title: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_TITLE, color: palette.ink },
  copy: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.ink },
});
