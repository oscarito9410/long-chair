const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const { resolve } = require("metro-resolver");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const relative = moduleName.startsWith(".");
  const nextName = relative ? moduleName.replace(/\.tsx?$/, "") : moduleName;
  return resolve(context, nextName, platform);
};

module.exports = config;
