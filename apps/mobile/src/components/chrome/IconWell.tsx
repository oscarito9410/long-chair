import { StyleSheet, View } from "react-native";

import type { Hue } from "@long-chair/core";

import { AppIcon } from "./AppIcon";
import type { IconName } from "./icon-names";
import { hueDeep, palette, WELL } from "../../theme/palette";

const ICON = 24;

export function IconWell({ hue, name, size = WELL }: { hue: Hue; name: IconName; size?: number }) {
  return (
    <View
      style={[
        styles.well,
        { width: size, height: size, borderRadius: size, backgroundColor: hueDeep[hue] },
      ]}
    >
      <AppIcon name={name} color={palette.card} size={ICON} />
    </View>
  );
}

const styles = StyleSheet.create({
  well: { alignItems: "center", justifyContent: "center" },
});
