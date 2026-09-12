import { Image } from "@/components/CachedImage";
import { images } from "@/constants";
import { useColors } from "@/hooks/useColors";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const HERO_H = 300;

const AuthScaffold = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
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
          <Text className="font-quicksand-bold text-xl text-content">
            Foodify
          </Text>
        </View>

        <Image
          source={images.pizzaOne}
          style={{
            position: "absolute",
            width: width * 0.66,
            height: width * 0.66,
            alignSelf: "center",
            bottom: -width * 0.1,
          }}
          contentFit="contain"
          transition={200}
        />
      </View>

      <View className="-mt-6 flex-1 rounded-t-[32px] bg-card px-6 pt-8">
        <Text className="font-quicksand-bold text-[28px] text-content">
          {title}
        </Text>
        <Text className="mt-1.5 font-quicksand-medium text-base text-muted">
          {subtitle}
        </Text>

        <View className="mt-7">{children}</View>
      </View>
    </View>
  );
};

export default AuthScaffold;
