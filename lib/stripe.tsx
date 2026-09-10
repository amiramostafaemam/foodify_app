/**
 * Single import point for Stripe. Metro resolves "@stripe/stripe-react-native"
 * to the real native SDK when EXPO_PUBLIC_ENABLE_STRIPE=true, and to
 * `lib/stripe-stub.tsx` otherwise (Expo Go, web). See metro.config.js.
 */
export { StripeProvider, useStripe } from "@stripe/stripe-react-native";
