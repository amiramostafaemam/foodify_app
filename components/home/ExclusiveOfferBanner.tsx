import { Image } from "@/components/CachedImage";
import { OFFERS_DATA } from "@/constants/offers.constants";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

const ExclusiveOfferBanner = () => {
  const best = [...OFFERS_DATA].sort((a, b) => b.discount - a.discount)[0];
  if (!best) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() =>
        router.push({
          pathname: "/offer-details/[id]",
          params: { id: best.id },
        })
      }
      className="flex-row items-center gap-3 overflow-hidden rounded-3xl bg-warm p-4"
    >
      <View className="flex-1">
        <Text className="font-quicksand-bold text-[11px] uppercase tracking-wide text-primary">
          Exclusive Offer
        </Text>
        <Text className="h2-bold mt-1 text-content">
          Up to {best.discount}% OFF
        </Text>
        <Text className="body-regular mt-0.5 text-muted">
          On selected combo meals
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

      <View className="relative h-28 w-28">
        <Image
          source={best.image}
          className="h-28 w-28"
          contentFit="contain"
          transition={250}
          cachePolicy="memory-disk"
        />
        <View className="absolute -left-3 top-1/2 h-14 w-14 -translate-y-7 items-center justify-center rounded-full border-4 border-warm bg-primary">
          <Text className="font-quicksand-bold text-sm leading-4 text-white">
            {best.discount}%
          </Text>
          <Text className="font-quicksand-bold text-[9px] text-white">OFF</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExclusiveOfferBanner;
