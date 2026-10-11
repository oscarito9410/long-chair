const { withAppDelegate, withInfoPlist } = require("@expo/config-plugins");

const SCENE_SOURCE = `class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else { return }
    let window = UIWindow(windowScene: windowScene)
    window.backgroundColor = UIColor(red: 243.0 / 255.0, green: 238.0 / 255.0, blue: 230.0 / 255.0, alpha: 1)
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    appDelegate.window = window
    guard let factory = appDelegate.reactNativeFactory else { return }
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: nil
    )
  }
}
`;

function sceneManifest() {
  return {
    UIApplicationSupportsMultipleScenes: false,
    UISceneConfigurations: {
      UIWindowSceneSessionRoleApplication: [
        {
          UISceneConfigurationName: "Default Configuration",
          UISceneDelegateClassName: "$(PRODUCT_MODULE_NAME).SceneDelegate",
        },
      ],
    },
  };
}

function stripWindowLaunch(source) {
  const withoutBlock = source.replace(
    /#if os\(iOS\) \|\| os\(tvOS\)[\s\S]*?UIWindow\(frame:[\s\S]*?#endif\n?/g,
    "",
  );
  return withoutBlock
    .replace(/^[ \t]*(?:self\.)?window = UIWindow\(frame:[^\n]*\n/gm, "")
    .replace(
      /^[ \t]*(?:factory|self\.reactNativeFactory|reactNativeFactory)\.startReactNative\(\s*withModuleName:\s*"main",[\s\S]*?\)\n/gm,
      "",
    );
}

function transformAppDelegate(contents) {
  if (contents.includes("UIWindowSceneDelegate")) {
    return contents;
  }
  return `${stripWindowLaunch(contents).trimEnd()}\n\n${SCENE_SOURCE}`;
}

function withSceneLifecycle(config) {
  const withDelegate = withAppDelegate(config, (cfg) => {
    cfg.modResults.contents = transformAppDelegate(cfg.modResults.contents);
    return cfg;
  });
  return withInfoPlist(withDelegate, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = sceneManifest();
    return cfg;
  });
}

module.exports = withSceneLifecycle;
module.exports.transformAppDelegate = transformAppDelegate;
module.exports.sceneManifest = sceneManifest;
module.exports.stripWindowLaunch = stripWindowLaunch;
