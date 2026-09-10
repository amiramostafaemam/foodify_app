import { Image } from "@/components/CachedImage";
import FavoriteButton from "@/components/FavoriteButton";
import { useColors } from "@/hooks/useColors";
import type { FavoriteItem } from "@/store/favorites.store";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
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
  /** "product" = warm backdrop panel (dish is floated by the screen), "photo" = full-bleed photo */
  mode?: "product" | "photo";
  badge?: string;
  height?: number;
  favorite?: FavoriteItem;
}

const DetailHero = ({
  uri,
  mode = "product",
  badge,
  height = 320,
  favorite,
}: DetailHeroProps) => {
  const insets = useSafeAreaInsets();
  const c = useColors();

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
            colors={["rgba(0,0,0,0.45)", "transparent", "rgba(0,0,0,0.35)"]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />
        </>
      ) : (
        <LinearGradient
          colors={c.hero}
          style={StyleSheet.absoluteFill}
        />
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
        {favorite ? <FavoriteButton item={favorite} size={18} /> : null}
      </View>

      {badge ? (
        <View
          className="absolute left-4 rounded-full bg-primary px-3 py-1.5"
          style={{ bottom: mode === "photo" ? 18 : 16 }}
        >
          <Text className="font-quicksand-bold text-xs text-white">
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default DetailHero;
