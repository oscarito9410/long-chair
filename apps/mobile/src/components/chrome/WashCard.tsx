import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { glassWash, palette, RADIUS_CARD } from "../../theme/palette";

export function WashCard({
  children,
  style,
  tint = palette.card,
  selected = false,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: string;
  selected?: boolean;
}) {
  return (
    <View
      style={[
        styles.shell,
        selected && styles.selected,
        { backgroundColor: glassWash(tint, selected) },
        style,
      ]}
    >
      {children}
    </View>
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
});
