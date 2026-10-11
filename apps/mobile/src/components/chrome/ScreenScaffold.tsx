import { ONBOARDING_DOT_COUNT, type Hue } from "@long-chair/core";
import { Children, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Enter } from "../../motion/Enter";
import type { HapticWeight } from "../../motion/haptics";
import { PressableScale } from "../../motion/PressableScale";
import {
  FONT_BODY,
  FONT_SECONDARY,
  FONT_TITLE,
  hueFill,
  palette,
  SPACE_16,
  SPACE_24,
  SPACE_8,
  TARGET,
} from "../../theme/palette";
import { AppIcon } from "./AppIcon";
import type { IconName } from "./icon-names";
import { PillButton } from "./PillButton";

export function ScreenScaffold({
  title,
  lede,
  tint,
  step,
  onBack,
  primary,
  onPrimary,
  primaryDisabled = false,
  primaryHaptic = "press",
  secondary,
  onSecondary,
  linkLabel,
  onLink,
  linkIcon,
  footerNote,
  hideHeading = false,
  align = "left",
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
  primaryHaptic?: HapticWeight;
  secondary?: string;
  onSecondary?: () => void;
  linkLabel?: string;
  onLink?: () => void;
  linkIcon?: IconName;
  footerNote?: string;
  hideHeading?: boolean;
  align?: "left" | "center";
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const items = Children.toArray(children);
  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACE_16 }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {onBack ? <Progress step={step} onBack={onBack} /> : null}
        {hideHeading ? null : (
          <Enter index={0}>
            <Heading title={title} lede={lede} align={align} />
          </Enter>
        )}
        {items.map((child, index) => (
          <Enter key={index} index={index + 1}>
            {child}
          </Enter>
        ))}
      </ScrollView>
      <Dock
        tint={hueFill[tint]}
        primary={primary}
        onPrimary={onPrimary}
        primaryDisabled={primaryDisabled}
        primaryHaptic={primaryHaptic}
        secondary={secondary}
        onSecondary={onSecondary}
        linkLabel={linkLabel}
        onLink={onLink}
        linkIcon={linkIcon}
        footerNote={footerNote}
        bottom={Math.max(insets.bottom, SPACE_16)}
      />
    </View>
  );
}

function Heading({
  title,
  lede,
  align,
}: {
  title: string;
  lede?: string;
  align: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <View style={centered ? styles.center : undefined}>
      <Text accessibilityRole="header" style={[styles.title, centered && styles.centerText]}>
        {title}
      </Text>
      {lede ? <Text style={[styles.lede, centered && styles.centerText]}>{lede}</Text> : null}
    </View>
  );
}

function Dock({
  tint,
  primary,
  onPrimary,
  primaryDisabled,
  primaryHaptic,
  secondary,
  onSecondary,
  linkLabel,
  onLink,
  linkIcon,
  footerNote,
  bottom,
}: {
  tint: string;
  primary?: string;
  onPrimary?: () => void;
  primaryDisabled: boolean;
  primaryHaptic: HapticWeight;
  secondary?: string;
  onSecondary?: () => void;
  linkLabel?: string;
  onLink?: () => void;
  linkIcon?: IconName;
  footerNote?: string;
  bottom: number;
}) {
  return (
    <View style={[styles.dock, { paddingBottom: bottom }]}>
      {primary && onPrimary ? (
        <PillButton
          label={primary}
          onPress={onPrimary}
          disabled={primaryDisabled}
          haptic={primaryHaptic}
        />
      ) : null}
      {secondary && onSecondary ? (
        <PillButton label={secondary} onPress={onSecondary} quiet tint={tint} />
      ) : null}
      {linkLabel && onLink ? (
        <PressableScale accessibilityRole="button" haptic="tick" onPress={onLink}>
          <View style={styles.linkRow}>
            {linkIcon ? <AppIcon name={linkIcon} color={palette.inkSoft} size={18} /> : null}
            <Text style={styles.link}>{linkLabel}</Text>
          </View>
        </PressableScale>
      ) : null}
      {footerNote ? <Text style={styles.note}>{footerNote}</Text> : null}
    </View>
  );
}

function Progress({ step, onBack }: { step?: number; onBack: () => void }) {
  return (
    <View style={styles.progress}>
      <PressableScale accessibilityLabel="Back" haptic="tick" onPress={onBack}>
        <View style={styles.back}>
          <AppIcon name="arrow" color={palette.ink} />
          <Text style={styles.backLabel}>Back</Text>
        </View>
      </PressableScale>
      {step ? (
        <View accessibilityLabel={`Step ${step} of ${ONBOARDING_DOT_COUNT}`} style={styles.dots}>
          {Array.from({ length: ONBOARDING_DOT_COUNT }, (_, index) => (
            <View key={index} style={[styles.dot, index < step ? styles.dotOn : styles.dotOff]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  scroll: { paddingHorizontal: SPACE_24, gap: SPACE_16, paddingBottom: SPACE_24 },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_TITLE,
    color: palette.ink,
    lineHeight: 38,
  },
  lede: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.inkSoft },
  center: { alignItems: "center", gap: SPACE_8 },
  centerText: { textAlign: "center" },
  dock: { paddingHorizontal: SPACE_24, gap: SPACE_8, paddingTop: SPACE_8 },
  note: {
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
  },
  linkRow: {
    minHeight: TARGET,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACE_8,
  },
  link: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_BODY,
    color: palette.inkSoft,
  },
  progress: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { minHeight: TARGET, flexDirection: "row", alignItems: "center", gap: SPACE_8 },
  backLabel: { fontFamily: "Nunito_700Bold", fontSize: FONT_BODY, color: palette.ink },
  dots: { flexDirection: "row", gap: SPACE_8 },
  dot: { width: SPACE_8, height: SPACE_8, borderRadius: SPACE_8 },
  dotOn: { backgroundColor: palette.ink },
  dotOff: { backgroundColor: palette.line },
});
