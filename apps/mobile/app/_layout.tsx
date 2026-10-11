import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { Caveat_600SemiBold } from "@expo-google-fonts/caveat";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DotField } from "../src/components/background/DotField";
import { SessionProvider } from "../src/state/session";
import { palette } from "../src/theme/palette";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Caveat_600SemiBold,
  });

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SessionProvider>
          <View style={styles.root}>
            <DotField />
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
                name="item/[id]"
                options={{
                  presentation: Platform.OS === "ios" ? "formSheet" : "transparentModal",
                  animation: "slide_from_bottom",
                  sheetGrabberVisible: true,
                  sheetAllowedDetents: [0.62, 0.92],
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
