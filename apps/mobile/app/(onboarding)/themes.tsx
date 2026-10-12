import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  addThemeLabel,
  addThemePlaceholder,
  avoidThemes,
  customThemesOf,
  notMedicalAdvice,
} from "@long-chair/core";
import { router } from "expo-router";

import { OptionRow } from "../../src/components/chrome/OptionRow";
import { continueLabel, selectedLeftOut, skipLabel } from "../../src/copy/phrases";
import { Enter } from "../../src/motion/Enter";
import { useOnboardingChrome } from "../../src/motion/onboarding-chrome";
import { themeCharacter } from "../../src/presentation";
import { useSession } from "../../src/state/session";
import {
  FONT_BODY,
  FONT_SECONDARY,
  palette,
  RADIUS_PILL,
  SPACE_8,
  SPACE_16,
  TARGET,
} from "../../src/theme/palette";

export default function ThemesScreen() {
  const { draft, toggleAvoid, addTheme, removeTheme } = useSession();
  const [label, setLabel] = useState("");
  const custom = customThemesOf(draft.customThemes);
  useOnboardingChrome({
    primary: continueLabel,
    onPrimary: () => {
      router.push("/company");
    },
    linkLabel: skipLabel,
    onLink: () => {
      router.push("/company");
    },
    footerNote: notMedicalAdvice,
  });

  return (
    <>
      {avoidThemes.map((theme, index) => (
        <Enter key={theme.id} index={index}>
          <OptionRow
            title={theme.label}
            detail={theme.detail}
            selected={draft.avoidIds.includes(theme.id)}
            selectedLabel={selectedLeftOut}
            character={themeCharacter(theme.id)}
            onPress={() => {
              toggleAvoid(theme.id);
            }}
          />
        </Enter>
      ))}
      <TextInput
        value={label}
        onChangeText={setLabel}
        placeholder={addThemePlaceholder}
        placeholderTextColor={palette.inkSoft}
        accessibilityLabel={addThemeLabel}
        style={styles.field}
        onSubmitEditing={() => {
          addTheme(label);
          setLabel("");
        }}
      />
      <Pressable
        accessibilityRole="button"
        style={styles.add}
        onPress={() => {
          addTheme(label);
          setLabel("");
        }}
      >
        <Text style={styles.addText}>{addThemeLabel}</Text>
      </Pressable>
      {custom.map((theme) => (
        <Pressable
          key={theme.id}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${theme.label}`}
          onPress={() => {
            removeTheme(theme.id);
          }}
        >
          <View style={styles.custom}>
            <Text style={styles.customTitle}>{theme.label}</Text>
            <Text style={styles.customDetail}>Keyword only, lower confidence</Text>
          </View>
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: TARGET,
    borderRadius: RADIUS_PILL,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.card,
    paddingHorizontal: SPACE_16,
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_BODY,
    color: palette.ink,
  },
  add: { minHeight: TARGET, justifyContent: "center" },
  addText: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  custom: { minHeight: TARGET, justifyContent: "center", gap: SPACE_8 },
  customTitle: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  customDetail: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
  },
});
