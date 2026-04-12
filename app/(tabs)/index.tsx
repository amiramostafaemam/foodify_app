// app/(tabs)/index.tsx
import CartButton from "@/components/CartButton";
import OfferCard from "@/components/OfferCard";
import { images } from "@/constants";
import { OFFERS_DATA } from "@/constants/offers.constants";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={OFFERS_DATA}
        renderItem={({ item, index }) => (
          <OfferCard offer={item} index={index} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          <View>
            {/* Header */}
            <View className="flex-between flex-row w-full my-5">
              <View className="flex-start">
                <Text className="small-bold text-primary uppercase">
                  Deliver to
                </Text>
                <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-bold text-dark-100">Cairo</Text>
                  <Image
                    source={images.arrowDown}
                    className="size-3"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <CartButton />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
