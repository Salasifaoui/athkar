const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Ensure .mjs files (like react-router) are transformed
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'mjs'],
};
const assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
const sourceExts = [...config.resolver.sourceExts, 'svg', 'mjs'];

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = assetExts;
config.resolver.sourceExts = sourceExts;

module.exports = withNativeWind(config, { input: './global.css' });
