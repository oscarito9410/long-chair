import { characterShapes, expressions, hues, type Expression } from "@long-chair/core";
import { Redirect } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { CharacterMark } from "../src/components/art/CharacterMark";
import { FONT_BODY, FONT_TITLE, palette, SPACE_16, SPACE_8, SPACE_32 } from "../src/theme/palette";

const MARK = 72;

const labels: Record<Expression, string> = {
  calm: "Calm",
  attention: "Attention",
  thinking: "Thinking",
  support: "Support",
  greeting: "Greeting",
  celebration: "Celebration",
  determined: "Determined",
  sleepy: "Sleepy",
  tickled: "Tickled",
};

export default function ExpressionsRoute() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text accessibilityRole="header" style={styles.title}>
        Expressions
      </Text>
      <Text style={styles.note}>Every shape in every pose.</Text>
      {expressions.map((expression) => (
        <ExpressionRow key={expression} expression={expression} />
      ))}
    </ScrollView>
  );
}

function ExpressionRow({ expression }: { expression: Expression }) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{labels[expression]}</Text>
      <View style={styles.row}>
        {characterShapes.map((shape, index) => (
          <CharacterMark
            key={shape}
            variant={{ shape, hue: hues[index % hues.length] ?? "apricot" }}
            expression={expression}
            size={MARK}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: SPACE_16, gap: SPACE_16, paddingBottom: SPACE_32 },
  title: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_TITLE, color: palette.ink },
  note: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_BODY, color: palette.inkSoft },
  block: { gap: SPACE_8 },
  label: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  row: { flexDirection: "row", flexWrap: "wrap", gap: SPACE_8 },
});
