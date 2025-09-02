// @ts-check
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Allow importing files from the monorepo root `shared/` folder
config.watchFolders = [
  path.resolve(__dirname, '..', 'shared'),
];

// Ensure JSON/TS are resolvable and add workspace aliases without reassigning the resolver
if (!config.resolver) {
  // This should never happen with getDefaultConfig, but the check narrows the type for TS
  throw new Error('Expo metro default config missing resolver');
}
/** @type {NonNullable<import('metro-config').MetroConfig['resolver']>} */
const resolver = config.resolver;
resolver.sourceExts = Array.from(
  new Set([...(resolver.sourceExts ?? []), 'json', 'ts', 'tsx'])
);
// No monorepo package aliases; RN app is self-contained.

module.exports = config;
