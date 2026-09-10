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

const GAP = 14;
const SIDE = 20;
const CARD_W = Dimensions.get("window").width - SIDE * 2 - GAP; // small peek of next
const SNAP = CARD_W + GAP;

const PromoCarousel = () => {
  const [index, setIndex] = useState(0);

  return (
    <View>
      <FlatList
        data={OFFERS_DATA}
        keyExtractor={(o) => o.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP}
        decelerationRate="fast"
        snapToAlignment="start"
        contentContainerStyle={{ paddingHorizontal: SIDE }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / SNAP))
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.92}
            style={{ width: CARD_W }}
            onPress={() =>
              router.push({
                pathname: "/offer-details/[id]",
                params: { id: item.id },
              })
            }
            className="h-40 overflow-hidden rounded-3xl"
          >
            <Image
              source={{ uri: item.image }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={250}
              cachePolicy="memory-disk"
            />
            <LinearGradient
              colors={["rgba(0,0,0,0.82)", "rgba(0,0,0,0.1)"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />

            <View className="flex-1 justify-center px-4">
              <View className="mb-1.5 self-start rounded-full bg-accent px-2 py-0.5">
                <Text className="font-quicksand-bold text-[9px] text-dark-100">
                  LIMITED TIME
                </Text>
              </View>
              <Text
                className="font-quicksand-bold text-xl text-white"
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text className="body-regular mt-0.5 text-white/80">
                Save {item.discount}% · from ${item.discountedPrice.toFixed(2)}
              </Text>

              <View className="mt-2.5 flex-row items-center gap-1.5 self-start rounded-full bg-primary py-1.5 pl-3.5 pr-1.5">
                <Text className="font-quicksand-bold text-xs text-white">
                  Order Now
                </Text>
                <View className="h-5 w-5 items-center justify-center rounded-full bg-white">
                  <ArrowRight size={12} color="#FE8C00" />
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
