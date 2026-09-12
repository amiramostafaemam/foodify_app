import { Image } from "@/components/CachedImage";
import { images } from "@/constants";
import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import cn from "clsx";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ReactNode } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const HERO_H = 280;

const Tabs = ({ active }: { active: "signin" | "signup" }) => {
  const tr = useT();
  const go = (tab: "signin" | "signup") => {
    if (tab === active) return;
    router.replace(tab === "signin" ? "/sign-in" : "/sign-up");
  };

  return (
    <View className="flex-row items-end gap-7">
      <TouchableOpacity onPress={() => go("signin")} activeOpacity={0.7}>
        <Text
          className={cn(
            "font-serif text-[26px]",
            active === "signin" ? "text-content" : "text-muted",
          )}
        >
          {tr("auth.signIn")}
        </Text>
        {active === "signin" ? (
          <View className="mt-1.5 h-[3px] w-7 rounded-full bg-primary" />
        ) : null}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => go("signup")} activeOpacity={0.7}>
        <Text
          className={cn(
            "font-serif text-[26px]",
            active === "signup" ? "text-content" : "text-muted",
          )}
        >
          {tr("auth.signUp")}
        </Text>
        {active === "signup" ? (
          <View className="mt-1.5 h-[3px] w-7 rounded-full bg-primary" />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const AuthScaffold = ({
  active,
  children,
}: {
  active: "signin" | "signup";
  children: ReactNode;
}) => {
  const insets = useSafeAreaInsets();
  const c = useColors();

  return (
    <View className="flex-1 bg-canvas">
      <View style={{ height: HERO_H }}>
        <LinearGradient colors={c.hero} style={StyleSheet.absoluteFill} />

        <View
          className="flex-row items-center gap-2"
          style={{ paddingTop: insets.top + 16, paddingLeft: 24 }}
        >
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Text className="font-quicksand-bold text-base text-white">F</Text>
          </View>
          <Text className="font-serif text-xl text-content">Foodify</Text>
        </View>

        <Image
          source={images.pizzaOne}
          style={{
            position: "absolute",
            width: width * 0.62,
            height: width * 0.62,
            alignSelf: "center",
            bottom: -width * 0.08,
          }}
          contentFit="contain"
          transition={200}
        />
      </View>

      {/* Asymmetric seam: rounded only on the top-left, so the hero peeks
          through a curved notch there while staying flush (square) on the
          right — an intentional break from the plain rounded-top sheet used
          elsewhere in the app. */}
      <View className="-mt-10 flex-1 rounded-tl-[40px] bg-card px-6 pt-8">
        <Tabs active={active} />
        <View className="mt-7">{children}</View>
      </View>
    </View>
  );
};

export default AuthScaffold;
