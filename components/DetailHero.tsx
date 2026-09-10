import { Image } from "@/components/CachedImage";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PANEL_H = 300;
const IMG = 240;
const OVERFLOW = IMG * 0.42;

interface DetailHeroProps {
  imageUri?: string;
  badge?: string;
  right?: ReactNode;
}

/**
 * Coloured hero panel with a rounded bottom and the food image overflowing onto
 * the content below. Shared by the menu-item and offer detail screens.
 */
const DetailHero = ({ imageUri, badge, right }: DetailHeroProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ height: PANEL_H + OVERFLOW }}>
      <View
        className="rounded-b-[40px] bg-primary"
        style={{ height: PANEL_H, paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-between px-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            activeOpacity={0.85}
          >
            <ChevronLeft size={22} color="#181C2E" />
          </TouchableOpacity>
          {right}
        </View>

        {badge && (
          <View className="absolute left-5 top-[70px] rounded-full bg-accent px-3 py-1">
            <Text className="font-quicksand-bold text-[11px] text-dark-100">
              {badge}
            </Text>
          </View>
        )}
      </View>

      <Image
        source={imageUri ? { uri: imageUri } : undefined}
        contentFit="contain"
        transition={200}
        cachePolicy="memory-disk"
        style={{
          position: "absolute",
          alignSelf: "center",
          width: IMG,
          height: IMG,
          top: PANEL_H - IMG + OVERFLOW,
        }}
      />
    </View>
  );
};

export default DetailHero;
