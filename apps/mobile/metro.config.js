const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// CSS is discovered via the import in `_layout.tsx`. Compiler options are not
// passed here: react-native-css 3.0.7 stores them on `transformer.reactNativeCSS`
// but its transformer reads them off the per-file transform options, so they
// never arrive. Anything rem-related is settled in `src/global.css` instead.
module.exports = withNativeWind(config);