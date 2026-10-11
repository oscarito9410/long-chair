import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { BLUR_REGULAR, palette } from "../../theme/palette";

export function GlassSurface({
  children,
  style,
  tint,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: string;
  interactive?: boolean;
}) {
  return (
    <BlurView intensity={BLUR_REGULAR} tint="light" style={style}>
      <View style={{ backgroundColor: tint ?? palette.glassFill }}>{children}</View>
    </BlurView>
  );
}
