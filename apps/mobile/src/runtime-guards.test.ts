import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = join(import.meta.dirname, "..");

function source(path: string): string {
  return readFileSync(join(appRoot, path), "utf8");
}

describe("building screen", () => {
  const building = source("app/(onboarding)/building.tsx");

  it("announces progress instead of rendering the live paragraph", () => {
    expect(building).toContain("announceMessage(buildingLiveText");
    expect(building).not.toContain("styles.live");
    expect(building).not.toMatch(/<Text[^>]*accessibilityLiveRegion/);
  });

  it("pairs the session length with its caption", () => {
    expect(building).toContain("formatHoursMinutes(minutes)");
    expect(building).toContain("buildingCaption");
    expect(building).not.toContain("lede={formatHoursMinutes");
  });
});

describe("recovery boundary", () => {
  it("exports an error boundary from the root and the tabs layout", () => {
    expect(source("app/_layout.tsx")).toContain(
      'export { ErrorBoundary } from "../src/components/chrome/RecoveryScreen"',
    );
    expect(source("app/(tabs)/_layout.tsx")).toContain(
      'export { ErrorBoundary } from "../../src/components/chrome/RecoveryScreen"',
    );
    const recovery = source("src/components/chrome/RecoveryScreen.tsx");
    expect(recovery).toContain("tryAgainLabel");
    expect(recovery).toContain('router.replace("/")');
  });
});

describe("studio background", () => {
  it("clears the navigator gray that covers the canvas", () => {
    const theme = source("src/theme/studio-theme.ts");
    const layout = source("app/_layout.tsx");
    expect(theme).toContain('background: "transparent"');
    expect(layout).toContain("<ThemeProvider value={studioTheme}>");
    expect(layout).toContain("<StudioBackground />");
  });
});

describe("runtime guards", () => {
  it("keeps haptics off the web and inside a catch", () => {
    const haptics = source("src/motion/haptics.ts");
    const webGate = haptics.indexOf('Platform.OS === "web"');
    const impact = haptics.indexOf("impactAsync");
    expect(webGate).toBeGreaterThan(-1);
    expect(impact).toBeGreaterThan(webGate);
    expect(haptics).toContain("try {");
  });

  it("falls back when liquid glass is missing from the binary", () => {
    const glass = source("src/components/glass/GlassSurface.ios.tsx");
    expect(glass).toContain("isLiquidGlassAvailable()");
    expect(glass).toContain("catch");
  });

  it("closes sheets without assuming a back stack", () => {
    const sheets = source("src/navigation/present-sheet.ts");
    expect(sheets).toContain("router.canDismiss()");
    expect(sheets).toContain("router.canGoBack()");
    expect(sheets).toContain('router.replace("/(tabs)/kit")');
    expect(source("app/item/[id].tsx")).toContain("itemIdFromParams");
    expect(source("app/item/[id].tsx")).not.toContain("router.back");
  });
});
