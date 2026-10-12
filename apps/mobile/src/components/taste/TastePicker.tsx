import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  commitTypedTaste,
  createTasteSearch,
  emptyPickCount,
  foldTasteText,
  groupForTaste,
  groupMoreCount,
  previewGroupTastes,
  tasteDisplayName,
  tasteGroups,
  tasteSearchPlaceholder,
  TASTE_MAX,
  toggleTaste,
} from "@long-chair/core";
import type { Hue, TasteEntity, TasteGroup } from "@long-chair/core";

import { AppIcon } from "../chrome/AppIcon";
import type { IconName } from "../chrome/icon-names";
import { PressableScale } from "../../motion/PressableScale";
import { SpringCheck } from "../../motion/SpringCheck";
import { useReducedMotion } from "../../motion/use-reduced-motion";
import {
  FONT_BODY,
  FONT_SECONDARY,
  glassWash,
  hueFill,
  palette,
  RADIUS_PILL,
  RADIUS_TAG,
  SPACE_16,
  SPACE_24,
  SPACE_8,
  TARGET,
} from "../../theme/palette";
import { useTasteQuery } from "./use-taste-query";

const ICON = 18;
const CHIP_MIN = 44;
const ROW_GAP = 12;
const NOTE_FONT = 22;
const NOTE_TILT = 2;
const INK_BORDER = 2;

type Apply = (ids: readonly string[]) => void;

type EnvHost = { process?: { env?: Record<string, string | undefined> } };

function readApiUrl(): string | undefined {
  const host = globalThis as EnvHost;
  const value = host.process?.env?.EXPO_PUBLIC_API_URL;
  return typeof value === "string" ? value : undefined;
}

function chipIcon(taste: TasteEntity): IconName {
  return groupForTaste(taste.id)?.icon ?? taste.icon;
}

function TasteChip({
  label,
  icon,
  tint,
  selected,
  disabled,
  onPress,
}: {
  label: string;
  icon: IconName | null;
  tint: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={styles.chipPress}
    >
      <View
        style={[
          styles.chip,
          { backgroundColor: glassWash(tint, selected) },
          selected && styles.chipOn,
        ]}
      >
        {selected ? (
          <SpringCheck>
            <AppIcon name="check" color={palette.ink} size={ICON} />
          </SpringCheck>
        ) : icon ? (
          <AppIcon name={icon} color={palette.ink} size={ICON} />
        ) : null}
        <Text style={styles.chipLabel}>{label}</Text>
      </View>
    </PressableScale>
  );
}

function PickNotes({ ids, onRemove }: { ids: readonly string[]; onRemove: (id: string) => void }) {
  const reduced = useReducedMotion();
  const blanks = emptyPickCount(ids.length);
  return (
    <View style={styles.picks} accessibilityLabel="Your picks">
      {ids.map((id, index) => {
        const tilt = reduced ? 0 : index % 2 === 0 ? -NOTE_TILT : NOTE_TILT;
        const name = tasteDisplayName(id);
        return (
          <View key={id} style={[styles.note, { transform: [{ rotate: `${tilt}deg` }] }]}>
            <Text style={styles.noteText}>{name}</Text>
            <PressableScale
              onPress={() => {
                onRemove(id);
              }}
              accessibilityLabel={`Remove ${name}`}
              haptic="tick"
              style={styles.remove}
            >
              <AppIcon name="x" color={palette.ink} size={ICON} />
            </PressableScale>
          </View>
        );
      })}
      {Array.from({ length: blanks }, (_, index) => (
        <View key={`slot-${index}`} style={styles.slot} accessibilityElementsHidden />
      ))}
    </View>
  );
}

function GroupBlock({
  group,
  expanded,
  selectedIds,
  full,
  onToggle,
  onExpand,
}: {
  group: TasteGroup;
  expanded: boolean;
  selectedIds: readonly string[];
  full: boolean;
  onToggle: (id: string) => void;
  onExpand: () => void;
}) {
  const reduced = useReducedMotion();
  const tastes = previewGroupTastes(group, expanded);
  const more = expanded ? 0 : groupMoreCount(group);
  const tint = hueFill[group.hue];
  const tilt = reduced ? "0deg" : "-2deg";
  return (
    <View style={styles.group}>
      <View style={[styles.groupNote, { backgroundColor: glassWash(tint, false), transform: [{ rotate: tilt }] }]}>
        <Text style={styles.groupLabel}>{group.label}</Text>
      </View>
      <View style={styles.wrap}>
        {tastes.map((taste) => {
          const selected = selectedIds.includes(taste.id);
          return (
            <TasteChip
              key={taste.id}
              label={taste.name}
              icon={group.icon}
              tint={tint}
              selected={selected}
              disabled={!selected && full}
              onPress={() => {
                onToggle(taste.id);
              }}
            />
          );
        })}
        {more > 0 ? (
          <TasteChip
            label={`+${more} more`}
            icon={null}
            tint={tint}
            selected={false}
            disabled={false}
            onPress={onExpand}
          />
        ) : null}
      </View>
    </View>
  );
}

function Suggestions({
  results,
  selectedIds,
  full,
  onToggle,
}: {
  results: readonly TasteEntity[];
  selectedIds: readonly string[];
  full: boolean;
  onToggle: (id: string) => void;
}) {
  if (results.length === 0) {
    return <Text style={styles.body}>Nothing matches that yet.</Text>;
  }
  return (
    <View style={styles.wrap}>
      {results.map((taste) => {
        const selected = selectedIds.includes(taste.id);
        const group = groupForTaste(taste.id);
        const hue: Hue = group?.hue ?? "seaglass";
        return (
          <TasteChip
            key={taste.id}
            label={taste.name}
            icon={chipIcon(taste)}
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

export function TastePicker({
  selectedIds,
  footerClearance,
  onApply,
}: {
  selectedIds: readonly string[];
  footerClearance: number;
  onApply: Apply;
}) {
  const port = useMemo(() => createTasteSearch(readApiUrl()), []);
  const { query, setQuery, results, error } = useTasteQuery(port);
  const [open, setOpen] = useState<readonly string[]>([]);
  const full = selectedIds.length >= TASTE_MAX;
  const searching = foldTasteText(query).length >= 2;

  function apply(next: readonly string[]) {
    onApply(next);
  }

  function submit() {
    apply(commitTypedTaste(selectedIds, query));
    setQuery("");
  }

  return (
    <View style={styles.fill}>
      <View style={styles.pad}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={submit}
          placeholder={tasteSearchPlaceholder}
          placeholderTextColor={palette.inkSoft}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          accessibilityLabel="Search tastes"
          style={styles.field}
        />
        <PickNotes
          ids={selectedIds}
          onRemove={(id) => {
            apply(toggleTaste(selectedIds, id));
          }}
        />
      </View>
      <ScrollView
        style={styles.fill}
        contentContainerStyle={[styles.pad, { paddingBottom: footerClearance }]}
        keyboardShouldPersistTaps="handled"
      >
        {error ? <Text style={styles.body}>{error}</Text> : null}
        {searching && !error ? (
          <Suggestions results={results} selectedIds={selectedIds} full={full} onToggle={(id) => apply(toggleTaste(selectedIds, id))} />
        ) : null}
        {searching ? null : (
          <View>
            {tasteGroups.map((group) => (
              <GroupBlock
                key={group.id}
                group={group}
                expanded={open.includes(group.id)}
                selectedIds={selectedIds}
                full={full}
                onToggle={(id) => {
                  apply(toggleTaste(selectedIds, id));
                }}
                onExpand={() => {
                  setOpen((current) => (current.includes(group.id) ? current : [...current, group.id]));
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  pad: { paddingHorizontal: SPACE_24 },
  remove: {
    width: CHIP_MIN,
    height: CHIP_MIN,
    alignItems: "center",
    justifyContent: "center",
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
  picks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACE_8,
    marginTop: SPACE_8,
    marginBottom: SPACE_16,
  },
  note: {
    minHeight: CHIP_MIN,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE_8,
    paddingLeft: SPACE_16,
    borderRadius: RADIUS_TAG,
    borderWidth: 1,
    borderColor: palette.glassEdge,
    backgroundColor: glassWash(palette.honey, false),
  },
  noteText: {
    fontFamily: "Caveat_600SemiBold",
    fontSize: NOTE_FONT,
    color: palette.ink,
  },
  slot: {
    width: 72,
    minHeight: CHIP_MIN,
    borderRadius: RADIUS_TAG,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: palette.line,
  },
  group: { marginBottom: SPACE_24 },
  groupNote: {
    alignSelf: "flex-start",
    marginBottom: SPACE_8,
    paddingHorizontal: SPACE_16,
    paddingVertical: SPACE_8 / 2,
    borderRadius: RADIUS_TAG,
    borderWidth: 1,
    borderColor: palette.glassEdge,
  },
  groupLabel: {
    fontFamily: "Caveat_600SemiBold",
    fontSize: NOTE_FONT,
    color: palette.ink,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", rowGap: ROW_GAP, columnGap: SPACE_8 },
  chipPress: { alignSelf: "flex-start" },
  chip: {
    minHeight: CHIP_MIN,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE_8,
    borderRadius: RADIUS_PILL,
    paddingHorizontal: SPACE_16,
    borderWidth: 0,
  },
  chipOn: { borderWidth: INK_BORDER, borderColor: palette.ink },
  chipLabel: {
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
