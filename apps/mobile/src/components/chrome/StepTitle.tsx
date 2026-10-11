import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useReducedMotion } from "../../motion/use-reduced-motion";
import { FONT_BODY, FONT_SECONDARY, FONT_TITLE, palette, SPACE_8 } from "../../theme/palette";

const TITLE_MS = 280;

export function StepTitle({
  title,
  lede,
  note,
  mark,
}: {
  title: string;
  lede?: string;
  note?: string;
  mark?: string;
}) {
  const reduced = useReducedMotion();
  const parts = splitMark(title, mark);
  return (
    <Animated.View entering={reduced ? undefined : FadeInDown.duration(TITLE_MS)}>
      <View accessibilityRole="header" style={styles.wrap}>
        {parts ? (
          <>
            {parts.before.length > 0 ? <Text style={styles.title}>{parts.before}</Text> : null}
            <View style={styles.mark}>
              <Text style={styles.title}>{parts.word}</Text>
              <View pointerEvents="none" style={styles.under}>
                <HandUnderline />
              </View>
            </View>
            {parts.after.length > 0 ? <Text style={styles.title}>{parts.after}</Text> : null}
          </>
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </View>
      {lede ? <Text style={styles.lede}>{lede}</Text> : null}
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </Animated.View>
  );
}

function HandUnderline() {
  return (
    <Svg width="100%" height={12} viewBox="0 0 120 12" preserveAspectRatio="none">
      <Path
        d="M2 8 C 18 3, 36 11, 58 6 C 78 2, 96 10, 118 5"
        fill="none"
        stroke={palette.ink}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function splitMark(
  title: string,
  mark: string | undefined,
): { before: string; word: string; after: string } | null {
  if (!mark) {
    return null;
  }
  const start = title.toLowerCase().indexOf(mark.toLowerCase());
  if (start < 0) {
    return null;
  }
  return {
    before: title.slice(0, start),
    word: title.slice(start, start + mark.length),
    after: title.slice(start + mark.length),
  };
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end" },
  mark: { position: "relative" },
  under: { position: "absolute", left: 0, right: 0, bottom: -4, height: 12 },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_TITLE,
    color: palette.ink,
    lineHeight: 38,
  },
  lede: {
    marginTop: SPACE_8,
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_BODY,
    color: palette.inkSoft,
  },
  note: {
    marginTop: SPACE_8,
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
  },
});
