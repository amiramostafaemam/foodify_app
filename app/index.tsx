// app/index.tsx
import { hasSeenOnboarding } from "@/lib/onboarding";
import useAuthStore from "@/store/auth.store";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, isLoading } = useAuthStore();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    const seen = await hasSeenOnboarding();
    setOnboardingComplete(seen);
  };
  if (isLoading || onboardingComplete === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)" />;
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/(tabs)" />;
}
