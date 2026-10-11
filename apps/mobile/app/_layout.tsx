import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { Caveat_600SemiBold } from "@expo-google-fonts/caveat";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { bootSkia } from "../src/components/background/skia-boot";
import { QuietBoundary } from "../src/components/background/QuietBoundary";
import { StudioBackground } from "../src/components/background/StudioBackground";
import { SessionProvider } from "../src/state/session";
import { palette } from "../src/theme/palette";

export { ErrorBoundary } from "../src/components/chrome/RecoveryScreen";

void SplashScreen.preventAutoHideAsync();

const SHEET_HALF = 0.5;

export default function RootLayout() {
  const [ready] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Caveat_600SemiBold,
  });
  const [skiaReady, setSkiaReady] = useState(false);

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  useEffect(() => {
    let live = true;
    void bootSkia().finally(() => {
      if (live) {
        setSkiaReady(true);
      }
    });
    return () => {
      live = false;
    };
  }, []);

  if (!ready || !skiaReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SessionProvider>
          <View style={styles.root}>
            <QuietBoundary>
              <StudioBackground />
            </QuietBoundary>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="settings"
                options={{
                  presentation: Platform.OS === "ios" ? "formSheet" : "modal",
                  sheetGrabberVisible: true,
                  // fitToContents against a flex:1 scaffold never settles and throws.
                  sheetAllowedDetents: [0.68, 1],
                  contentStyle: { backgroundColor: palette.page },
                }}
              />
              <Stack.Screen
                name="item/[id]"
                options={{
                  presentation: Platform.OS === "ios" ? "formSheet" : "transparentModal",
                  // iOS rejects a custom slide animation on a form sheet.
                  animation: Platform.OS === "ios" ? "default" : "slide_from_bottom",
                  sheetGrabberVisible: true,
                  sheetAllowedDetents: [SHEET_HALF, 1],
                  contentStyle: { backgroundColor: palette.page },
                }}
              />
            </Stack>
          </View>
        </SessionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.page },
});
