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
  type Hue,
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
  hueFill,
  palette,
  RADIUS_CARD,
  SPACE_4,
  SPACE_8,
  SPACE_16,
} from "../../src/theme/palette";

const ROW_MIN = 88;
const ADD_HEIGHT = 56;
const ICON_WELL = 40;
const DOOR_GLYPH = 18;
const SWITCH_W = 51;
const SWITCH_H = 31;
const MIN_THEME = 2;
const DETAIL_LINE = 22;
const ROW_PAD = 12;

const glyphs: Record<string, ThemeGlyphName> = {
  illness: "thermometer",
  hospitals: "hospital",
  cancer: "ribbon",
  "parent-death": "flower",
  grief: "wreath",
};

const hues: Record<string, Hue> = {
  illness: "apricot",
  hospitals: "seaglass",
  cancer: "wisteria",
  "parent-death": "honey",
  grief: "wisteria",
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
          hue={hues[theme.id] ?? "seaglass"}
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
          hue="seaglass"
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
  hue,
  kept,
  onToggle,
}: {
  title: string;
  detail: string;
  glyph: ThemeGlyphName;
  hue: Hue;
  kept: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.card}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <GlassSurface
          tint={kept ? hueFill[hue] : palette.card}
          selected={kept}
          style={[StyleSheet.absoluteFill, kept ? styles.rowOn : styles.rowOff]}
        />
      </View>
      <View style={styles.inner}>
        <View style={styles.copy}>
          <View style={styles.heading}>
            <View style={styles.well}>
              <ThemeGlyph name={glyph} />
            </View>
            <View style={styles.titles}>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.status}>
                {kept ? <ThemeGlyph name="door" size={DOOR_GLYPH} /> : null}
                <Text style={styles.state}>{kept ? keptOutState : allowedState}</Text>
              </View>
            </View>
          </View>
          <Text numberOfLines={2} style={styles.detail}>
            {detail}
          </Text>
        </View>
        <View style={styles.switchHold}>
          <Switch
            accessibilityRole="switch"
            accessibilityLabel={themeSwitchLabel(title, kept)}
            value={kept}
            onValueChange={onToggle}
            trackColor={{ false: palette.line, true: palette.ink }}
            thumbColor={palette.white}
            ios_backgroundColor={palette.line}
            style={styles.switch}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: ROW_MIN, borderRadius: RADIUS_CARD },
  rowOn: { borderWidth: 2, borderColor: palette.ink },
  rowOff: { borderWidth: 1, borderColor: palette.glassEdge },
  inner: {
    minHeight: ROW_MIN,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE_8,
    paddingLeft: SPACE_16,
    paddingRight: SPACE_16,
    paddingVertical: ROW_PAD,
  },
  copy: { flex: 1, gap: SPACE_4 },
  heading: { flexDirection: "row", alignItems: "center", gap: SPACE_8 },
  titles: { flex: 1, gap: 2 },
  well: {
    width: ICON_WELL,
    height: ICON_WELL,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.card,
  },
  title: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  status: { flexDirection: "row", alignItems: "center", gap: SPACE_4 },
  state: { fontFamily: "Nunito_700Bold", fontSize: FONT_SECONDARY, color: palette.ink },
  detail: {
    marginLeft: ICON_WELL + SPACE_8,
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_SECONDARY,
    lineHeight: DETAIL_LINE,
    color: palette.inkSoft,
  },
  switchHold: {
    width: SWITCH_W,
    height: SWITCH_H,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  switch: { width: SWITCH_W, height: SWITCH_H },
  dashed: {
    height: ADD_HEIGHT,
    borderRadius: RADIUS_CARD,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.page,
  },
  dashedLabel: { fontFamily: "Nunito_700Bold", fontSize: FONT_BODY, color: palette.inkSoft },
  field: {
    height: ADD_HEIGHT,
    borderRadius: RADIUS_CARD,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: palette.line,
    backgroundColor: palette.page,
    paddingHorizontal: SPACE_16,
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_BODY,
    color: palette.ink,
  },
});
