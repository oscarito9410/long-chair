import { StyleSheet, View } from "react-native";
import Svg, { G, Rect } from "react-native-svg";

import { CharacterMark } from "../art/CharacterMark";
import { palette } from "../../theme/palette";

const MARK = 56;
const DOOR = 28;

export function RoomGuardian() {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no" style={styles.row}>
      <CharacterMark
        variant={{ shape: "arch", hue: "apricot" }}
        expression="determined"
        size={MARK}
        animate
        settle
      />
      <ClosingDoor />
    </View>
  );
}

function ClosingDoor() {
  return (
    <Svg width={DOOR} height={40} viewBox="0 0 28 40">
      <G transform="translate(2 4)">
        <Rect width={8} height={32} fill={palette.card} stroke={palette.ink} strokeWidth={1.8} />
      </G>
      <G transform="translate(14 2)">
        <Rect width={12} height={36} rx={1} fill={palette.ink} />
      </G>
      <G transform="translate(16.5 18)">
        <Rect width={2} height={2} rx={1} fill={palette.card} />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", width: 84 },
});
