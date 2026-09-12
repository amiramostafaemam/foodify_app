import { Image } from "@/components/CachedImage";
import { images } from "@/constants";
import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import cn from "clsx";
import { router } from "expo-router";
import { ReactNode } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const HERO_H = 300;
const WAVE_H = 56;
// assets/images/logo.png is a 708x181 horizontal lockup — this keeps its
// aspect ratio intact whatever width it's rendered at.
const LOGO_RATIO = 708 / 181;

// Two gentle humps across the full width, filled in the sheet's own
// background so the card visually "ripples" up into the photo instead of
// meeting it on a straight line.
const WAVE_PATH = `M0,${WAVE_H * 0.5} C ${width * 0.17},${WAVE_H * 0.05} ${width * 0.33},${WAVE_H * 0.95} ${width * 0.5},${WAVE_H * 0.5} C ${width * 0.67},${WAVE_H * 0.05} ${width * 0.83},${WAVE_H * 0.95} ${width},${WAVE_H * 0.5} L${width},${WAVE_H} L0,${WAVE_H} Z`;

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
            "font-serif text-xl",
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
            "font-serif text-xl",
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
        <Image
          source={images.burgerlogin}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />

        <View style={{ paddingTop: insets.top + 16, paddingLeft: 24 }}>
          {/* A white chip (same convention as the floating circular
              buttons elsewhere — bg-white + shadow-black/10) keeps the
              logo readable no matter what's behind it in the photo,
              instead of relying on a text shadow like the old placeholder
              badge did. */}
          <View className="flex-row self-start items-center rounded-full bg-white px-3 py-1.5 shadow-sm shadow-black/10">
            <Image
              source={images.logo}
              style={{ width: 132, height: 132 / LOGO_RATIO }}
              contentFit="contain"
            />
          </View>
        </View>

        <Svg
          width={width}
          height={WAVE_H}
          viewBox={`0 0 ${width} ${WAVE_H}`}
          style={{ position: "absolute", bottom: -1, left: 0 }}
        >
          <Path d={WAVE_PATH} fill={c.card} />
        </Svg>
      </View>

      <View className="flex-1 bg-card px-6 pt-6">
        <Tabs active={active} />
        <View className="mt-7">{children}</View>
      </View>
    </View>
  );
};

export default AuthScaffold;
