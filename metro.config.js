const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// --- SVG support (import .svg files as React components) ---
config.transformer.babelTransformerPath =
  require.resolve("react-native-svg-transformer");
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg",
);
config.resolver.sourceExts.push("svg");

// --- Stripe: only bundle the real native SDK when explicitly enabled ---
// Stripe's native module is missing in Expo Go and on web. Unless
// EXPO_PUBLIC_ENABLE_STRIPE=true (set it for dev/production builds), redirect
// every "@stripe/stripe-react-native" import to a local stub.
if (process.env.EXPO_PUBLIC_ENABLE_STRIPE !== "true") {
  const stripeStub = path.resolve(__dirname, "lib/stripe-stub.tsx");
  const defaultResolveRequest = config.resolver.resolveRequest;

  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (
      moduleName === "@stripe/stripe-react-native" ||
      moduleName.startsWith("@stripe/stripe-react-native/")
    ) {
      return { type: "sourceFile", filePath: stripeStub };
    }
    return (defaultResolveRequest ?? context.resolveRequest)(
      context,
      moduleName,
      platform,
    );
  };
}

module.exports = withNativeWind(config, { input: "./app/global.css" });
