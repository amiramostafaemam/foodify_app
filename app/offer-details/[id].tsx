import CustomButton from "@/components/CustomButton";
import DetailHero from "@/components/DetailHero";
import Toast from "@/components/Toast";
import { images } from "@/constants";
import { getOfferById, getOfferValidity } from "@/constants/offers.constants";
import { useCartStore } from "@/store/cart.store";
import { router, useLocalSearchParams } from "expo-router";
import { Clock, Minus, Plus, Star } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const OfferDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isFirstItem, setIsFirstItem] = useState(false);

  const { addItem } = useCartStore();
  const validity = getOfferValidity();
  const offer = getOfferById(id!);

  if (!offer) {
    return (
      <SafeAreaView className="flex-center h-full bg-white">
        <Image
          source={images.notfound}
          className="h-72 w-72"
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="paragraph-bold text-primary">Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const total = offer.discountedPrice * quantity;
  const saved = offer.originalPrice - offer.discountedPrice;

  const handleAddToCart = () => {
    const isCartEmpty = useCartStore.getState().items.length === 0;
    addItem(
      {
        id: offer.id,
        name: offer.title,
        price: offer.discountedPrice,
        image_url: offer.image,
      },
      quantity,
    );
    setIsFirstItem(isCartEmpty);
    setShowToast(true);
  };

  return (
    <>
      <View className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
        >
          <DetailHero
            imageUri={offer.image}
            badge={`Save ${offer.discount}%`}
          />

          <View className="px-5 pt-4">
            <View className="flex-row items-start justify-between">
              <Text className="h1-bold flex-1 pr-3 text-dark-100">
                {offer.title}
              </Text>
              <View className="items-end">
                <Text className="body-regular text-gray-100 line-through">
                  ${offer.originalPrice.toFixed(2)}
                </Text>
                <Text className="h2-bold text-primary">
                  ${offer.discountedPrice.toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="mt-2 flex-row items-center gap-2">
              <View className="flex-row items-center gap-1">
                <Star size={15} color="#FFC738" fill="#FFC738" />
                <Text className="body-medium text-gray-100">
                  {offer.rating}
                </Text>
              </View>
              <Text className="text-gray-300">·</Text>
              <View className="rounded-full bg-success/10 px-2.5 py-0.5">
                <Text className="small-bold text-success">
                  You save ${saved.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-primary/5 px-5 py-3.5">
              <View className="items-center">
                <Text className="paragraph-bold text-dark-100">Free</Text>
                <Text className="body-regular text-gray-100">Delivery</Text>
              </View>
              <View className="items-center">
                <Text className="paragraph-bold text-dark-100">
                  {offer.deliveryTime.split(" ")[0]}
                </Text>
                <Text className="body-regular text-gray-100">Minutes</Text>
              </View>
              <View className="items-center">
                <Text className="paragraph-bold text-dark-100">
                  {offer.items.reduce((n, i) => n + i.quantity, 0)}
                </Text>
                <Text className="body-regular text-gray-100">Items</Text>
              </View>
            </View>

            {/* Description */}
            <Text className="paragraph-medium mt-5 leading-[1.7] text-[#6A6A6A]">
              {offer.description}
            </Text>

            {/* What's included */}
            <Text className="h3-bold mt-6 text-dark-100">
              What&#39;s included
            </Text>
            <View className="mt-3 gap-2">
              {offer.items.map((item, i) => (
                <View
                  key={i}
                  className="flex-row items-center justify-between rounded-2xl border border-gray-200/70 px-4 py-3"
                >
                  <Text className="paragraph-semibold text-dark-100">
                    {item.name}
                  </Text>
                  <View className="rounded-full bg-primary/10 px-2.5 py-1">
                    <Text className="small-bold text-primary">
                      x{item.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Validity */}
            <View className="mt-5 flex-row items-center gap-3 self-start rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
              <Clock size={18} color="#FE8C00" />
              <View>
                <Text className="paragraph-bold text-dark-100">
                  Ends in {validity.daysLeft}{" "}
                  {validity.daysLeft === 1 ? "day" : "days"}
                </Text>
                <Text className="body-regular text-gray-100">
                  Valid until {validity.date}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom bar */}
        <View
          className="absolute inset-x-0 bottom-0 flex-row items-center gap-4 rounded-t-3xl bg-white px-5 pt-4"
          style={{
            paddingBottom: Math.max(insets.bottom, 16),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 12,
          }}
        >
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-9 w-9 items-center justify-center rounded-full bg-primary/10"
            >
              <Minus size={16} color="#FE8C00" />
            </TouchableOpacity>
            <Text className="w-4 text-center font-quicksand-bold text-lg text-dark-100">
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity((q) => q + 1)}
              className="h-9 w-9 items-center justify-center rounded-full bg-primary/10"
            >
              <Plus size={16} color="#FE8C00" />
            </TouchableOpacity>
          </View>

          <View className="flex-1">
            <CustomButton
              title={`Add to Cart · $${total.toFixed(2)}`}
              onPress={handleAddToCart}
            />
          </View>
        </View>
      </View>

      <Toast
        visible={showToast}
        onClose={() => setShowToast(false)}
        isFirstItem={isFirstItem}
      />
    </>
  );
};

export default OfferDetails;
