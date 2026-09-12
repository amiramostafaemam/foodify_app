import { Image } from "@/components/CachedImage";
import { OFFERS_DATA } from "@/constants/offers.constants";
import { useT } from "@/lib/i18n";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";

// Gutter === gap so each card is centred with white on both sides and the next
// card lands exactly off-screen (matches PopularMealsCarousel).
const GAP = 20;
const SIDE = 20;
const CARD_W = Dimensions.get("window").width - SIDE * 2;
const SNAP = CARD_W + GAP;

const PromoCarousel = () => {
  const [index, setIndex] = useState(0);
  const tr = useT();

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
            style={{ width: CARD_W, backgroundColor: item.color }}
            onPress={() =>
              router.push({
                pathname: "/offer-details/[id]",
                params: { id: item.id },
              })
            }
            className="h-44 flex-row overflow-hidden rounded-[28px]"
          >
            <View className="flex-1 justify-center py-4 pl-5">
              <View className="mb-1.5 self-start rounded-full bg-white/20 px-2.5 py-1">
                <Text className="font-quicksand-bold text-[10px] text-white">
                  {tr("home.saveN", { n: item.discount })}
                </Text>
              </View>
              <Text
                className="font-quicksand-bold text-2xl text-white"
                numberOfLines={1}
              >
                {tr(`offerData.${item.id}.title` as Parameters<typeof tr>[0])}
              </Text>
              <Text className="body-medium mt-0.5 text-white/85">
                {tr("home.fromPrice", {
                  price: item.discountedPrice.toFixed(2),
                })}
              </Text>

              <View className="mt-3 flex-row items-center gap-1.5 self-start rounded-full bg-white py-1.5 pl-3.5 pr-1.5">
                <Text
                  className="font-quicksand-bold text-xs"
                  style={{ color: item.color }}
                >
                  {tr("common.orderNow")}
                </Text>
                <View
                  className="h-5 w-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: item.color }}
                >
                  <ArrowRight size={12} color="#fff" />
                </View>
              </View>
            </View>

            <View className="w-[42%] items-center justify-center">
              <Image
                source={item.image}
                style={{ width: 150, height: 150 }}
                contentFit="contain"
                transition={200}
                cachePolicy="memory-disk"
              />
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
                : "h-1.5 w-1.5 rounded-full bg-line/20"
            }
          />
        ))}
      </View>
    </View>
  );
};

export default PromoCarousel;
