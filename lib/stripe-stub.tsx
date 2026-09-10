import type { ReactNode } from "react";

/**
 * Drop-in stub for `@stripe/stripe-react-native`. Metro swaps the real package
 * for this file (see metro.config.js) unless EXPO_PUBLIC_ENABLE_STRIPE=true,
 * so the app bundles and runs in Expo Go / on web, where Stripe's native module
 * does not exist. Card payments then report as unavailable; cash on delivery
 * still works. Enable the real SDK only in a development / production build.
 */

const UNAVAILABLE = {
  message: "Card payments require a development build (not Expo Go).",
} as const;

export const StripeProvider = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

export const useStripe = () => ({
  initPaymentSheet: async () => ({ error: UNAVAILABLE }),
  presentPaymentSheet: async () => ({ error: UNAVAILABLE }),
});
