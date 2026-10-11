import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { BLUR_REGULAR, glassWash, palette, RADIUS_CARD } from "../../theme/palette";

export function GlassSurface({
  children,
  style,
  tint = palette.card,
  selected = false,
  interactive = false,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: string;
  selected?: boolean;
  interactive?: boolean;
}) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        glassEffectStyle="clear"
        tintColor={tint}
        isInteractive={interactive || selected}
        colorScheme="light"
        style={[styles.shell, selected && styles.selected, style]}
      >
        {selected ? (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: glassWash(tint, true) }]}
          />
        ) : null}
        {children}
      </GlassView>
    );
  }

  return (
    <GlassView glassEffectStyle="none" style={[styles.shell, selected && styles.selected, style]}>
      <BlurView intensity={BLUR_REGULAR} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: glassWash(tint, selected) }]} />
      <View style={styles.sheen} />
      <View style={styles.content}>{children}</View>
    </GlassView>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderRadius: RADIUS_CARD,
    borderWidth: 1,
    borderColor: palette.glassEdge,
  },
  selected: { borderColor: palette.ink },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: palette.glassSheen,
  },
  content: { position: "relative" },
});
