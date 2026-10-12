import {
  addThemePlaceholder,
  allowedState,
  avoidThemes,
  customThemesOf,
  keptOutState,
  keptOutSummary,
  notMedicalAdvice,
  somethingElseLabel,
  themesContinue,
  themesNote,
  themeSwitchLabel,
} from "@long-chair/core";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { ThemeGlyph, type ThemeGlyphName } from "../../src/components/chrome/ThemeGlyph";
import { GlassSurface } from "../../src/components/glass/GlassSurface";
import { useOnboardingChrome } from "../../src/motion/onboarding-chrome";
import { useSession } from "../../src/state/session";
import {
  BLUR_REGULAR,
  FONT_BODY,
  FONT_SECONDARY,
  palette,
  RADIUS_CARD,
  SPACE_8,
  SPACE_16,
} from "../../src/theme/palette";

const ROW_HEIGHT = 76;
const ICON_WELL = 40;
const DOOR_GLYPH = 18;
const MIN_THEME = 2;

const glyphs: Record<string, ThemeGlyphName> = {
  illness: "thermometer",
  hospitals: "hospital",
  cancer: "ribbon",
  "parent-death": "flower",
  grief: "wreath",
};

export default function ThemesScreen() {
  const { draft, toggleAvoid, addTheme, removeTheme } = useSession();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const custom = customThemesOf(draft.customThemes);
  const kept = avoidThemes.filter((theme) => draft.avoidIds.includes(theme.id)).length;

  useOnboardingChrome({
    primary: themesContinue,
    onPrimary: () => {
      router.push("/company");
    },
    status: keptOutSummary(kept, avoidThemes.length),
    footerNote: `${themesNote} ${notMedicalAdvice}`,
  });

  return (
    <>
      {avoidThemes.map((theme) => (
        <AvoidRow
          key={theme.id}
          title={theme.label}
          detail={theme.detail}
          glyph={glyphs[theme.id] ?? "slip"}
          kept={draft.avoidIds.includes(theme.id)}
          onToggle={() => {
            toggleAvoid(theme.id);
          }}
        />
      ))}
      {custom.map((theme) => (
        <AvoidRow
          key={theme.id}
          title={theme.label}
          detail="Keyword only, lower confidence"
          glyph="slip"
          kept
          onToggle={() => {
            removeTheme(theme.id);
          }}
        />
      ))}
      <SomethingElse
        adding={adding}
        label={label}
        onChange={setLabel}
        onOpen={() => {
          setAdding(true);
        }}
        onCommit={() => {
          if (label.trim().length < MIN_THEME) {
            return;
          }
          addTheme(label);
          setLabel("");
          setAdding(false);
        }}
      />
    </>
  );
}

function SomethingElse({
  adding,
  label,
  onChange,
  onOpen,
  onCommit,
}: {
  adding: boolean;
  label: string;
  onChange: (value: string) => void;
  onOpen: () => void;
  onCommit: () => void;
}) {
  if (adding) {
    return (
      <TextInput
        value={label}
        onChangeText={onChange}
        placeholder={addThemePlaceholder}
        placeholderTextColor={palette.inkSoft}
        accessibilityLabel={somethingElseLabel}
        autoFocus
        style={styles.field}
        onSubmitEditing={onCommit}
      />
    );
  }
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Something else" onPress={onOpen}>
      <View style={styles.dashed}>
        <BlurView intensity={BLUR_REGULAR} tint="light" style={StyleSheet.absoluteFill} />
        <Text style={styles.dashedLabel}>{somethingElseLabel}</Text>
      </View>
    </Pressable>
  );
}

function AvoidRow({
  title,
  detail,
  glyph,
  kept,
  onToggle,
}: {
  title: string;
  detail: string;
  glyph: ThemeGlyphName;
  kept: boolean;
  onToggle: () => void;
}) {
  return (
    <GlassSurface
      tint={kept ? palette.honey : palette.page}
      selected={kept}
      style={[styles.row, kept ? styles.rowOn : styles.rowOff]}
    >
      <View style={styles.inner}>
        <View style={styles.well}>
          <ThemeGlyph name={glyph} />
        </View>
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.detail}>
            {detail}
          </Text>
        </View>
        {kept ? <ThemeGlyph name="door" size={DOOR_GLYPH} /> : <View style={styles.doorGap} />}
        <Text style={styles.state}>{kept ? keptOutState : allowedState}</Text>
        <Switch
          accessibilityRole="switch"
          accessibilityLabel={themeSwitchLabel(title, kept)}
          value={kept}
          onValueChange={onToggle}
          trackColor={{ false: palette.line, true: palette.ink }}
          thumbColor={palette.white}
          ios_backgroundColor={palette.line}
        />
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  row: { height: ROW_HEIGHT, justifyContent: "center" },
  rowOn: { borderWidth: 2, borderColor: palette.ink },
  rowOff: { borderWidth: 1, borderColor: palette.glassEdge },
  inner: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE_8,
    paddingHorizontal: SPACE_8,
  },
  well: {
    width: ICON_WELL,
    height: ICON_WELL,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.card,
  },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  detail: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  state: { fontFamily: "Nunito_700Bold", fontSize: FONT_SECONDARY, color: palette.ink },
  doorGap: { width: DOOR_GLYPH },
  dashed: {
    height: ROW_HEIGHT,
    borderRadius: RADIUS_CARD,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: palette.ink,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.card,
  },
  dashedLabel: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  field: {
    height: ROW_HEIGHT,
    borderRadius: RADIUS_CARD,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: palette.ink,
    backgroundColor: palette.card,
    paddingHorizontal: SPACE_16,
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_BODY,
    color: palette.ink,
  },
});
