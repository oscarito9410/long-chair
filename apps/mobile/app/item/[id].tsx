import { formatHoursMinutes, itemById, itemThemeCheck, matchingSeedNames } from "@long-chair/core";
import { router, useLocalSearchParams } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CoverArt } from "../../src/components/art/CoverArt";
import { IconWell } from "../../src/components/chrome/IconWell";
import { PillButton } from "../../src/components/chrome/PillButton";
import { GlassSurface } from "../../src/components/glass/GlassSurface";
import { backToKit, closeLabel, missingPiece } from "../../src/copy/phrases";
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
  const params = useLocalSearchParams<{ id: string }>();
  const itemId = typeof params.id === "string" ? params.id : "";
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
          router.back();
        }}
      />
      <GlassSurface style={styles.sheet} tint={palette.card}>
        <View style={styles.handle} />
        <ItemBody itemId={itemId} />
      </GlassSurface>
    </View>
  );
}

function ItemBody({ itemId }: { itemId: string }) {
  const insets = useSafeAreaInsets();
  const { draft } = useSession();
  const item = itemById(itemId);
  const because = item ? matchingSeedNames(item, draft)[0] : undefined;

  if (!item) {
    return (
      <View style={[styles.body, { paddingBottom: insets.bottom + SPACE_16 }]}>
        <Text accessibilityRole="header" style={styles.title}>
          {missingPiece}
        </Text>
        <PillButton
          label={backToKit}
          onPress={() => {
            router.back();
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
          router.back();
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
      {because ? <Text style={styles.copy}>{`Because you love ${because}.`}</Text> : null}
      <Text style={styles.copy}>{itemThemeCheck}</Text>
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
