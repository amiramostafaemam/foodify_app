import { Image } from "@/components/CachedImage";
import { OFFERS_DATA } from "@/constants/offers.constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CARD_WIDTH = Dimensions.get("window").width - 40;

const PromoCarousel = () => {
  const [index, setIndex] = useState(0);

  return (
    <View>
      <FlatList
        data={OFFERS_DATA}
        keyExtractor={(o) => o.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH))
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.92}
            style={{ width: CARD_WIDTH }}
            onPress={() =>
              router.push({
                pathname: "/offer-details/[id]",
                params: { id: item.id },
              })
            }
            className="h-52 overflow-hidden rounded-3xl"
          >
            <Image
              source={{ uri: item.image }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={250}
              cachePolicy="memory-disk"
            />
            <LinearGradient
              colors={["rgba(0,0,0,0.78)", "rgba(0,0,0,0.15)"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />

            <View className="flex-1 justify-center px-5">
              <View className="w-3/4">
                <View className="mb-2 self-start rounded-full bg-accent px-2.5 py-1">
                  <Text className="font-quicksand-bold text-[10px] text-dark-100">
                    LIMITED TIME
                  </Text>
                </View>
                <Text className="h2-bold text-white" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text
                  className="body-medium mt-1 text-white/85"
                  numberOfLines={2}
                >
                  Save {item.discount}% · from $
                  {item.discountedPrice.toFixed(2)}
                </Text>

                <View className="mt-3 flex-row items-center gap-2 self-start rounded-full bg-primary py-2 pl-4 pr-2">
                  <Text className="font-quicksand-bold text-sm text-white">
                    Order Now
                  </Text>
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-white">
                    <ArrowRight size={14} color="#FE8C00" />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <View className="mt-3 flex-row justify-center gap-1.5">
        {OFFERS_DATA.map((o, i) => (
          <View
            key={o.id}
            className={
              i === index
                ? "h-1.5 w-5 rounded-full bg-primary"
                : "h-1.5 w-1.5 rounded-full bg-gray-300"
            }
          />
        ))}
      </View>
    </View>
  );
};

export default PromoCarousel;
