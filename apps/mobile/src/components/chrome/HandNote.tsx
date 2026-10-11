import type { Hue } from "@long-chair/core";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useDriftStyle } from "../../motion/use-drift";
import { FONT_HAND, glassWash, palette, RADIUS_TAG, SPACE_16, SPACE_8 } from "../../theme/palette";
import { hueFill } from "../../theme/palette";

const NOTE_WIDTH = 132;

export function HandNote({ text, hue, tilt }: { text: string; hue: Hue; tilt: number }) {
  const drift = useDriftStyle(tilt);
  return (
    <Animated.View
      style={[styles.note, { backgroundColor: glassWash(hueFill[hue], false) }, drift]}
    >
      <Text style={styles.hand} accessibilityElementsHidden>
        {text}
      </Text>
    </Animated.View>
  );
}

export function DoodleArrow() {
  const drift = useDriftStyle(0);
  return (
    <Animated.View style={drift} accessibilityElementsHidden>
      <Svg width={72} height={88} viewBox="0 0 72 88">
        <Path
          d="M36 6c-6 18 8 22-2 40"
          fill="none"
          stroke={palette.ink}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path
          d="M20 58c8 10 16 16 16 22 0-6 8-12 16-22"
          fill="none"
          stroke={palette.ink}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
}

export function Aside({ text, tilt = -4 }: { text: string; tilt?: number }) {
  return (
    <View style={styles.aside}>
      <DoodleArrow />
      <HandNote text={text} hue="honey" tilt={tilt} />
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    maxWidth: NOTE_WIDTH,
    paddingVertical: SPACE_8,
    paddingHorizontal: SPACE_16,
    borderRadius: RADIUS_TAG,
    borderWidth: 1,
    borderColor: palette.glassEdge,
    shadowColor: palette.ink,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  hand: {
    fontFamily: "Caveat_600SemiBold",
    fontSize: FONT_HAND,
    color: palette.ink,
    lineHeight: 30,
  },
  aside: { alignItems: "center", gap: SPACE_8 },
});
