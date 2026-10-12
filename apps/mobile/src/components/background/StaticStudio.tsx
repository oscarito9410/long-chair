import { StyleSheet, View } from "react-native";

import { palette } from "../../theme/palette";

const BLOB = 280;

/**
 * Cream field used when CanvasKit cannot boot. No wasm, no redbox.
 */
export function StaticStudio() {
  return (
    <View pointerEvents="none" style={styles.fill}>
      <View style={[styles.blob, styles.apricot]} />
      <View style={[styles.blob, styles.seaglass]} />
      <View style={[styles.blob, styles.honey]} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFill, backgroundColor: palette.page },
  blob: {
    position: "absolute",
    width: BLOB,
    height: BLOB,
    borderRadius: BLOB,
    opacity: 0.45,
  },
  apricot: { top: -80, left: -60, backgroundColor: palette.apricot },
  seaglass: { top: -40, right: -80, backgroundColor: palette.seaglass },
  honey: { bottom: -100, left: 40, backgroundColor: palette.honey },
});
