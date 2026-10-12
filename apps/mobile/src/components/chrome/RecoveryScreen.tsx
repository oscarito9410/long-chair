import type { ErrorBoundaryProps } from "expo-router";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CharacterMark } from "../art/CharacterMark";
import { backToWelcome, recoveryBody, recoveryTitle, tryAgainLabel } from "../../copy/phrases";
import {
  FONT_BODY,
  FONT_SECONDARY,
  FONT_TITLE,
  palette,
  RADIUS_PILL,
  SPACE_16,
  SPACE_24,
  TARGET,
} from "../../theme/palette";

const RECOVERY_MARK = 96;

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <RecoveryScreen
      detail={error.message}
      onRetry={() => {
        void retry();
      }}
    />
  );
}

export function RecoveryScreen({ detail, onRetry }: { detail?: string; onRetry: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + SPACE_24, paddingBottom: insets.bottom + SPACE_24 },
      ]}
    >
      <View style={styles.mark}>
        <CharacterMark
          variant={{ shape: "pebble", hue: "seaglass" }}
          expression="determined"
          size={RECOVERY_MARK}
          animate
          settle
        />
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {recoveryTitle}
      </Text>
      <Text style={styles.body}>{recoveryBody}</Text>
      {detail ? (
        <Text style={styles.detail} numberOfLines={4}>
          {detail}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={tryAgainLabel}
        onPress={onRetry}
        style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
      >
        <Text style={styles.primaryLabel}>{tryAgainLabel}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={backToWelcome}
        onPress={() => {
          router.replace("/");
        }}
        style={styles.quiet}
      >
        <Text style={styles.quietLabel}>{backToWelcome}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.page,
    paddingHorizontal: SPACE_24,
    justifyContent: "center",
    gap: SPACE_16,
  },
  mark: { alignItems: "center" },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_TITLE,
    color: palette.ink,
    lineHeight: 38,
  },
  body: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_BODY,
    color: palette.ink,
  },
  detail: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
  },
  primary: {
    minHeight: TARGET,
    borderRadius: RADIUS_PILL,
    backgroundColor: palette.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACE_16,
  },
  pressed: { opacity: 0.84 },
  primaryLabel: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_BODY,
    color: palette.page,
  },
  quiet: { minHeight: TARGET, alignItems: "center", justifyContent: "center" },
  quietLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_BODY,
    color: palette.inkSoft,
  },
});
