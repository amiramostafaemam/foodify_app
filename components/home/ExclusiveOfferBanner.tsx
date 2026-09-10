import { OFFERS_DATA } from "@/constants/offers.constants";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ExclusiveOfferBanner = () => {
  const best = [...OFFERS_DATA].sort((a, b) => b.discount - a.discount)[0];
  if (!best) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/offer-details/[id]",
          params: { id: best.id },
        })
      }
      className="flex-row items-center overflow-hidden rounded-3xl bg-cream-200 p-5"
    >
      <View className="flex-1 pr-2">
        <Text className="font-quicksand-bold text-[11px] uppercase tracking-wide text-primary">
          Exclusive Offer
        </Text>
        <Text className="h2-bold mt-1 text-dark-100">
          Up to {best.discount}% OFF
        </Text>
        <Text className="body-regular mt-0.5 text-gray-100">
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

      <View className="items-center">
        <Image source={best.image} resizeMode="contain" className="h-24 w-24" />
      </View>

      <View className="ml-2 h-16 w-16 items-center justify-center rounded-full bg-white">
        <Text className="font-quicksand-bold text-base leading-4 text-primary">
          {best.discount}%
        </Text>
        <Text className="font-quicksand-bold text-[10px] text-primary">
          OFF
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExclusiveOfferBanner;
