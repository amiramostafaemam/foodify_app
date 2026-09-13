// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    // appwrite/functions/** runs as a separate Node.js Appwrite Function,
    // not part of the Expo app — different runtime/globals, not meant to
    // be linted against React Native rules.
    ignores: ["dist/*", ".expo/*", "node_modules/*", "appwrite/functions/**"],
  },
]);
