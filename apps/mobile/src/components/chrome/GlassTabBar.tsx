import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tabs } from "../../copy/phrases";
import { selectionHaptic } from "../../haptics";
import { GlassSurface } from "../glass/GlassSurface";
import { FONT_SECONDARY, palette, RADIUS_PILL, SPACE_16, TARGET } from "../../theme/palette";

type TabRoute = { key: string; name: string };

export type GlassTabProps = {
  state: { index: number; routes: readonly TabRoute[] };
  navigation: { navigate: (name: string) => void };
};

const labels: Record<string, string> = {
  kit: tabs.kit,
  companion: tabs.companion,
  compare: tabs.compare,
};

export function GlassTabBar({ state, navigation }: GlassTabProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, SPACE_16) }]}>
      <GlassSurface style={styles.bar} interactive>
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const active = state.index === index;
            const label = labels[route.name] ?? route.name;
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  selectionHaptic();
                  navigation.navigate(route.name);
                }}
                style={styles.tab}
              >
                <Text style={[styles.label, active && styles.active]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: SPACE_16 },
  bar: { borderRadius: RADIUS_PILL, overflow: "hidden" },
  row: { flexDirection: "row" },
  tab: { flex: 1, minHeight: TARGET, alignItems: "center", justifyContent: "center" },
  label: { fontFamily: "Nunito_600SemiBold", fontSize: FONT_SECONDARY, color: palette.inkSoft },
  active: { fontFamily: "Nunito_800ExtraBold", color: palette.ink },
});
