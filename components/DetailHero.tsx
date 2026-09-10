import { Image } from "@/components/CachedImage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft, Heart } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface DetailHeroProps {
  uri?: string;
  /** "product" = transparent PNG on a soft backdrop, "photo" = full-bleed photo */
  mode?: "product" | "photo";
  badge?: string;
  height?: number;
}

const DetailHero = ({
  uri,
  mode = "product",
  badge,
  height = 320,
}: DetailHeroProps) => {
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);

  return (
    <View style={{ height }}>
      {mode === "photo" ? (
        <>
          <Image
            source={uri ? { uri } : undefined}
            style={{ width, height }}
            contentFit="cover"
            transition={250}
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.18)"]}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />
        </>
      ) : (
        <>
          <LinearGradient
            colors={["#FFF1DF", "#FFF9F1", "#FFFFFF"]}
            style={StyleSheet.absoluteFill}
          />
          {/* soft ground shadow */}
          <View
            className="absolute self-center rounded-full bg-black/10"
            style={{ width: width * 0.5, height: 22, bottom: 24 }}
          />
          <Image
            source={uri ? { uri } : undefined}
            contentFit="contain"
            transition={250}
            cachePolicy="memory-disk"
            style={{
              width: width * 0.74,
              height: height - insets.top - 64,
              alignSelf: "center",
              marginTop: insets.top + 44,
            }}
          />
        </>
      )}

      <View
        className="absolute left-4 right-4 flex-row items-center justify-between"
        style={{ top: insets.top + 4 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.85}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm shadow-black/10"
        >
          <ChevronLeft size={22} color="#181C2E" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLiked((v) => !v)}
          activeOpacity={0.85}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm shadow-black/10"
        >
          <Heart
            size={19}
            color={liked ? "#F14141" : "#181C2E"}
            fill={liked ? "#F14141" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {badge && (
        <View
          className="absolute left-4 rounded-full bg-primary px-3 py-1.5"
          style={{ bottom: mode === "photo" ? 20 : 18 }}
        >
          <Text className="font-quicksand-bold text-xs text-white">
            {badge}
          </Text>
        </View>
      )}
    </View>
  );
};

export default DetailHero;
