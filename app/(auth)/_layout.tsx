import { images } from "@/constants";
import { Slot, usePathname } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

export default function Layout() {
  const pathname = usePathname();
  const Logo = images.Logo;

  const backgroundImage = pathname.includes("sign-up")
    ? images.signupGraphic
    : images.loginGraphic;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="bg-white h-full"
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="w-full relative"
          style={{ height: Dimensions.get("screen").height / 2.25 }}
        >
          {/* Background Image */}
          <ImageBackground
            source={backgroundImage}
            className="size-full rounded-b-lg"
            resizeMode="stretch"
          />

          {/* SVG LOGO */}
          <Logo
            width={192}
            height={192}
            style={{
              position: "absolute",
              bottom: -20,
              alignSelf: "center",
              zIndex: 10,
            }}
          />
        </View>

        {/* Page Content (sign-in / sign-up) */}
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
