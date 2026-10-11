import { StyleSheet, View } from "react-native";

import { settingsLabel } from "../../copy/phrases";
import { PressableScale } from "../../motion/PressableScale";
import { palette } from "../../theme/palette";
import { GlassSurface } from "../glass/GlassSurface";
import { AppIcon } from "./AppIcon";

const HIT = 48;
const ICON = 22;

export function GearButton({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale accessibilityLabel={settingsLabel} haptic="tick" onPress={onPress}>
      <GlassSurface tint={palette.card} style={styles.hit}>
        <View style={styles.icon}>
          <AppIcon name="gear" color={palette.ink} size={ICON} />
        </View>
      </GlassSurface>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: HIT,
    height: HIT,
    borderRadius: HIT,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { alignItems: "center", justifyContent: "center" },
});
