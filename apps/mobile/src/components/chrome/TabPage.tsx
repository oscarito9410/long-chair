import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePauseWhileScrolling } from "../../motion/scroll-activity";
import { openSettings } from "../../navigation/present-sheet";
import { SPACE_16, SPACE_24, SPACE_8 } from "../../theme/palette";
import { GearButton } from "./GearButton";

export function TabPage({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const onScroll = usePauseWhileScrolling();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + SPACE_8 }]}>
      <View style={styles.gear}>
        <GearButton
          onPress={() => {
            openSettings();
          }}
        />
      </View>
      <Animated.ScrollView
        style={styles.scroll}
        onScroll={onScroll}
        scrollEventThrottle={16}
        removeClippedSubviews
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.page}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  gear: { alignItems: "flex-end", paddingRight: SPACE_16 },
  scroll: { flex: 1, backgroundColor: "transparent" },
  page: { paddingHorizontal: SPACE_24, gap: SPACE_16, paddingTop: SPACE_8, paddingBottom: SPACE_24 },
});
