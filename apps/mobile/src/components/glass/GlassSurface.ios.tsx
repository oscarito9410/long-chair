import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { ReactNode } from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { BLUR_REGULAR, palette } from "../../theme/palette";

export function GlassSurface({
  children,
  style,
  tint,
  interactive = false,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: string;
  interactive?: boolean;
}) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        glassEffectStyle="regular"
        tintColor={tint ?? palette.glassTint}
        isInteractive={interactive}
        colorScheme="light"
        style={style}
      >
        {children}
      </GlassView>
    );
  }
  return (
    <BlurView intensity={BLUR_REGULAR} tint="light" style={style}>
      <View style={{ backgroundColor: tint ?? palette.glassFill }}>{children}</View>
    </BlurView>
  );
}
