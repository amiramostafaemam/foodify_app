import { darkVars, lightVars } from "@/constants/theme";
import { StripeProvider } from "@/lib/stripe";
import useAuthStore from "@/store/auth.store";
import { selectScheme, useThemeStore } from "@/store/theme.store";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();
  const scheme = useThemeStore(selectScheme);

  const [fontsLoaded, fontError] = useFonts({
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
  });

  useEffect(() => {
    fetchAuthenticatedUser();
  }, [fetchAuthenticatedUser]);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (fontError) throw fontError;

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[
          { flex: 1 },
          scheme === "dark" ? darkVars : lightVars,
        ]}
        className="flex-1 bg-canvas"
      >
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        <KeyboardProvider>
          <StripeProvider
            publishableKey={
              process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
            }
            merchantIdentifier="merchant.com.foodify.app"
          >
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(onboarding)/index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="notifications"
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="favorites"
                options={{ animation: "slide_from_right" }}
              />
            </Stack>
          </StripeProvider>
        </KeyboardProvider>
      </View>
    </GestureHandlerRootView>
  );
}
