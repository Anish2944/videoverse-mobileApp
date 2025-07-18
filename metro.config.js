const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
// This configuration file is used to set up Metro bundler for the VideoVerse mobile application.
config.resolver.sourceExts = config.resolver.sourceExts.filter((ext) => ext !== "mjs");
module.exports = config;