import { ONBOARDING_DOT_COUNT } from "@long-chair/core";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PillButton } from "./PillButton";
import { hueFill, palette } from "../../theme/palette";
import type { Hue } from "@long-chair/core";
import {
  FONT_BODY,
  FONT_SECONDARY,
  FONT_TITLE,
  SPACE_16,
  SPACE_24,
  SPACE_32,
  SPACE_8,
  TARGET,
} from "../../theme/palette";

export function ScreenScaffold({
  title,
  lede,
  tint,
  step,
  onBack,
  primary,
  onPrimary,
  primaryDisabled = false,
  secondary,
  onSecondary,
  footerNote,
  children,
}: {
  title: string;
  lede?: string;
  tint: Hue;
  step?: number;
  onBack?: () => void;
  primary?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  secondary?: string;
  onSecondary?: () => void;
  footerNote?: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACE_16 }]}>
      <View style={[styles.well, { backgroundColor: hueFill[tint] }]} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {onBack ? <Progress step={step} onBack={onBack} /> : null}
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {lede ? <Text style={styles.lede}>{lede}</Text> : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>
      <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, SPACE_16) }]}>
        {primary && onPrimary ? (
          <PillButton label={primary} onPress={onPrimary} disabled={primaryDisabled} />
        ) : null}
        {secondary && onSecondary ? (
          <PillButton label={secondary} onPress={onSecondary} quiet />
        ) : null}
        {footerNote ? <Text style={styles.note}>{footerNote}</Text> : null}
      </View>
    </View>
  );
}

function Progress({ step, onBack }: { step?: number; onBack: () => void }) {
  return (
    <View style={styles.progress}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        style={styles.back}
      >
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>
      {step ? (
        <View style={styles.dots} accessibilityLabel={`Step ${step} of ${ONBOARDING_DOT_COUNT}`}>
          {Array.from({ length: ONBOARDING_DOT_COUNT }, (_, index) => (
            <View key={index} style={[styles.dot, index < step ? styles.dotOn : styles.dotOff]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  well: {
    position: "absolute",
    top: SPACE_32,
    right: -SPACE_32,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.55,
  },
  scroll: { paddingHorizontal: SPACE_24, gap: SPACE_16, paddingBottom: SPACE_32 },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_TITLE,
    color: palette.ink,
    lineHeight: 38,
  },
  lede: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.inkSoft },
  body: { gap: SPACE_16 },
  dock: { paddingHorizontal: SPACE_24, gap: SPACE_8, paddingTop: SPACE_8 },
  note: {
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
  },
  progress: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { minHeight: TARGET, justifyContent: "center", paddingRight: SPACE_16 },
  backLabel: { fontFamily: "Nunito_700Bold", fontSize: FONT_BODY, color: palette.ink },
  dots: { flexDirection: "row", gap: SPACE_8 },
  dot: { width: SPACE_8, height: SPACE_8, borderRadius: SPACE_8 },
  dotOn: { backgroundColor: palette.ink },
  dotOff: { backgroundColor: palette.line },
});
