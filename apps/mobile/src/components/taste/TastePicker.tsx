import { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  createTasteSearch,
  foldTasteText,
  quickStartTastes,
  sampleShelfNote,
  TASTE_MAX,
  tasteById,
  tastePickLabel,
  tasteSearchPlaceholder,
} from "@long-chair/core";
import type { Hue, TasteEntity } from "@long-chair/core";

import { AppIcon } from "../chrome/AppIcon";
import { WashCard } from "../chrome/WashCard";
import { PressableScale } from "../../motion/PressableScale";
import { SpringCheck } from "../../motion/SpringCheck";
import {
  FONT_BODY,
  FONT_SECONDARY,
  hueFill,
  palette,
  RADIUS_PILL,
  SPACE_16,
  SPACE_8,
  TARGET,
} from "../../theme/palette";
import { useTasteQuery } from "./use-taste-query";

const CHIP_HUES = ["honey", "apricot", "seaglass", "wisteria"] as const;
const ICON = 18;

type Toggle = (id: string) => void;

type EnvHost = { process?: { env?: Record<string, string | undefined> } };

function readApiUrl(): string | undefined {
  const host = globalThis as EnvHost;
  const value = host.process?.env?.EXPO_PUBLIC_API_URL;
  return typeof value === "string" ? value : undefined;
}

function hueAt(index: number): Hue {
  return CHIP_HUES[index % CHIP_HUES.length] ?? "honey";
}

function tasteName(id: string): string {
  return tasteById(id)?.name ?? id;
}

function TasteChip({
  taste,
  tint,
  selected,
  disabled,
  onPress,
}: {
  taste: TasteEntity;
  tint: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={taste.name}
      accessibilityState={{ selected }}
      style={styles.chipPress}
    >
      <WashCard tint={tint} selected={selected} style={styles.chip}>
        <AppIcon name={taste.icon} color={palette.ink} size={ICON} />
        <Text style={styles.chipLabel}>{taste.name}</Text>
        {selected ? (
          <SpringCheck>
            <AppIcon name="check" color={palette.ink} size={ICON} />
          </SpringCheck>
        ) : null}
      </WashCard>
    </PressableScale>
  );
}

function TasteResults({
  results,
  selectedIds,
  full,
  onToggle,
}: {
  results: readonly TasteEntity[];
  selectedIds: readonly string[];
  full: boolean;
  onToggle: Toggle;
}) {
  if (results.length === 0) {
    return <Text style={styles.body}>Nothing matches that yet.</Text>;
  }
  return (
    <View style={styles.stack}>
      {results.map((taste) => {
        const selected = selectedIds.includes(taste.id);
        return (
          <TasteChip
            key={taste.id}
            taste={taste}
            tint={hueFill.seaglass}
            selected={selected}
            disabled={!selected && full}
            onPress={() => {
              onToggle(taste.id);
            }}
          />
        );
      })}
    </View>
  );
}

function QuickStarts({
  selectedIds,
  full,
  onToggle,
}: {
  selectedIds: readonly string[];
  full: boolean;
  onToggle: Toggle;
}) {
  return (
    <View style={styles.wrap} accessibilityRole="none">
      {quickStartTastes.map((taste, index) => {
        const selected = selectedIds.includes(taste.id);
        const hue = hueAt(index);
        return (
          <TasteChip
            key={taste.id}
            taste={taste}
            tint={hueFill[hue]}
            selected={selected}
            disabled={!selected && full}
            onPress={() => {
              onToggle(taste.id);
            }}
          />
        );
      })}
    </View>
  );
}

function SelectedPills({ selectedIds, onToggle }: { selectedIds: readonly string[]; onToggle: Toggle }) {
  if (selectedIds.length === 0) {
    return null;
  }
  return (
    <View style={styles.wrap}>
      {selectedIds.map((id) => (
        <PressableScale
          key={id}
          onPress={() => {
            onToggle(id);
          }}
          accessibilityLabel={`Remove ${tasteName(id)}`}
          style={styles.chipPress}
        >
          <WashCard tint={palette.honey} selected style={styles.chip}>
            <Text style={styles.chipLabel}>{tasteName(id)}</Text>
            <AppIcon name="x" color={palette.ink} size={ICON} />
          </WashCard>
        </PressableScale>
      ))}
    </View>
  );
}

export function TastePicker({
  selectedIds,
  onToggle,
}: {
  selectedIds: readonly string[];
  onToggle: Toggle;
}) {
  const port = useMemo(() => createTasteSearch(readApiUrl()), []);
  const { query, setQuery, results, source, error } = useTasteQuery(port);
  const full = selectedIds.length >= TASTE_MAX;
  const searching = foldTasteText(query).length >= 2;

  return (
    <View style={styles.stack}>
      {source === "live" ? null : <Text style={styles.sample}>{sampleShelfNote}</Text>}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={tasteSearchPlaceholder}
        placeholderTextColor={palette.inkSoft}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search tastes"
        style={styles.field}
      />
      {error ? <Text style={styles.body}>{error}</Text> : null}
      {searching && !error ? (
        <TasteResults results={results} selectedIds={selectedIds} full={full} onToggle={onToggle} />
      ) : null}
      <Text style={styles.kicker}>Or start here</Text>
      <QuickStarts selectedIds={selectedIds} full={full} onToggle={onToggle} />
      <SelectedPills selectedIds={selectedIds} onToggle={onToggle} />
      <Text accessibilityLiveRegion="polite" style={styles.kicker}>
        {tastePickLabel(selectedIds.length)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: SPACE_16 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: SPACE_8 },
  chipPress: { alignSelf: "flex-start" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE_8,
    borderRadius: RADIUS_PILL,
    paddingHorizontal: SPACE_16,
    paddingVertical: SPACE_8,
  },
  chipLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.ink,
  },
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
  sample: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.inkSoft,
  },
  kicker: {
    fontFamily: "Nunito_700Bold",
    fontSize: FONT_SECONDARY,
    color: palette.ink,
  },
  body: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: FONT_BODY,
    color: palette.ink,
  },
});
