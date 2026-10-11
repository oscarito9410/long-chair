import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const plugin = require("../plugins/with-scene-lifecycle.js") as {
  transformAppDelegate: (source: string) => string;
  sceneManifest: () => {
    UIApplicationSupportsMultipleScenes: boolean;
    UISceneConfigurations: {
      UIWindowSceneSessionRoleApplication: { UISceneDelegateClassName: string }[];
    };
  };
};

const generated = `import Expo
import React

class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?
  var reactNativeFactory: RCTReactNativeFactory?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let factory = ExpoReactNativeFactory(delegate: delegate)
    reactNativeFactory = factory

#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
`;

describe("scene lifecycle plugin", () => {
  it("moves window creation out of didFinishLaunching and adds SceneDelegate", () => {
    const next = plugin.transformAppDelegate(generated);
    const launch = next.slice(0, next.indexOf("class SceneDelegate"));
    expect(launch).not.toContain("UIWindow(frame:");
    expect(launch).not.toContain("startReactNative");
    expect(next).toContain("class SceneDelegate: UIResponder, UIWindowSceneDelegate");
    expect(next).toContain("UIWindow(windowScene: windowScene)");
    expect(next).toContain("appDelegate.window = window");
    expect(next).toContain("guard let factory = appDelegate.reactNativeFactory");
    expect(next).toContain('withModuleName: "main"');
    expect(next).toContain("launchOptions: nil");
    expect(next).toContain("reactNativeFactory = factory");
  });

  it("leaves an already patched delegate untouched", () => {
    const once = plugin.transformAppDelegate(generated);
    expect(plugin.transformAppDelegate(once)).toBe(once);
  });

  it("writes a single-scene manifest aimed at SceneDelegate", () => {
    const manifest = plugin.sceneManifest();
    expect(manifest.UIApplicationSupportsMultipleScenes).toBe(false);
    const row = manifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication[0];
    expect(row?.UISceneDelegateClassName).toBe("$(PRODUCT_MODULE_NAME).SceneDelegate");
  });
});
