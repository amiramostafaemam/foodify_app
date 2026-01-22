import { StripeProvider } from "@stripe/stripe-react-native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

import useAuthStore from "@/store/auth.store";
import { useEffect } from "react";
import "./global.css";

export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    //it means since fonts are loaded and error is null hide the splash screen
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  if (!fontsLoaded || isLoading) {
    return null;
  }
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.com.amira.foodify" // iOS only
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </StripeProvider>
  );

  // return <Stack screenOptions={{ headerShown: false }} />;
}
