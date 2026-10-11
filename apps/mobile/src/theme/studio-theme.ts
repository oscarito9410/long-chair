import { DefaultTheme } from "expo-router";

import { palette } from "./palette";

// Expo's default theme paints rgb(242, 242, 242) on the iOS navigation
// container, which covers the Skia canvas mounted behind the stack.
export const studioTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
    card: palette.card,
    text: palette.ink,
    border: palette.line,
    primary: palette.ink,
    notification: palette.apricot,
  },
};
