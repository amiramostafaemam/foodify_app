// app/offer-details/[id].tsx
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import Toast from "@/components/Toast";
import { images } from "@/constants";
import { getOfferById, Offer } from "@/constants/offers.constants";
import { useCartStore } from "@/store/cart.store";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <View className="flex-row items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Image
          key={star}
          source={images.star}
          className="w-5 h-5"
          tintColor={star <= Math.floor(rating) ? "#FF9C01" : "#D1D5DB"}
        />
      ))}
      <Text className="paragraph-semibold text-[#878787] ml-2">{rating}/5</Text>
    </View>
  );
};

const OfferDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isFirstItem, setIsFirstItem] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const insets = useSafeAreaInsets();

  const { addItem, increaseQty } = useCartStore();

  // Get offer data
  const offer: Offer | undefined = getOfferById(id!);

  // Initialize video player
  const player = useVideoPlayer(offer?.videoUrl || "", (player) => {
    player.loop = true;
    player.play();
    player.muted = isMuted;
  });

  if (!offer) {
    return (
      <SafeAreaView className="bg-white h-full flex-center ">
        <CustomHeader style="absolute top-10 left-5" />
        <Image
          source={images.notfound}
          className="w-full h-80 scale-150 "
          resizeMode="contain"
        />
      </SafeAreaView>
    );
  }

  const calculateTotalPrice = () => {
    return offer.discountedPrice * quantity;
  };

  const handleAddToCart = () => {
    if (quantity === 0) return;

    const isCartEmpty = useCartStore.getState().items.length === 0;

    const newItem = {
      cartItemId: `${offer.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      id: offer.id,
      name: offer.title,
      price: offer.discountedPrice,
      image_url: Image.resolveAssetSource(offer.image).uri,
      customizations: undefined,
    };

    addItem(newItem);

    // Add additional quantities if needed
    if (quantity > 1) {
      const cartItems = useCartStore.getState().items;
      const addedItem = cartItems[cartItems.length - 1];

      for (let i = 1; i < quantity; i++) {
        increaseQty(addedItem.cartItemId);
      }
    }

    setShowToast(true);
    setIsFirstItem(isCartEmpty);
  };

  return (
    <>
      <SafeAreaView className="bg-white h-full" edges={["top"]}>
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header with back button */}
            <View className="px-5 py-4">
              <CustomHeader style="mb-0" />
            </View>

            {/* Video Section */}
            <View className="w-full h-[300px] bg-black relative">
              <View className="absolute inset-0 flex-center bg-black/10 z-10"></View>
              <VideoView
                player={player}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                nativeControls={false}
              />

              {/* Discount Badge */}
              <View className="absolute top-4 left-4 bg-primary rounded-full px-4 py-2">
                <Text className="body-bold text-white">
                  Save {offer.discount}%
                </Text>
              </View>
            </View>

            {/* Offer Info Section */}
            <View className="px-5 py-6">
              {/* Title & Rating */}
              <Text className="h1-bold text-dark-100 mb-3">{offer.title}</Text>

              <View className="mb-4">
                <StarRating rating={offer.rating} />
              </View>

              {/* Price Section */}
              <View className="flex-row items-center gap-3 mb-4">
                <Text className="h3-bold text-gray-200 line-through">
                  ${offer.originalPrice.toFixed(2)}
                </Text>
                <Text className="h1-bold text-primary">
                  ${offer.discountedPrice.toFixed(2)}
                </Text>
                <View className="bg-success/10 rounded-full px-3 py-1">
                  <Text className="small-bold text-success">
                    You save $
                    {(offer.originalPrice - offer.discountedPrice).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Stats Section */}
              <View className="py-4 px-5 mb-5 bg-primary/5 rounded-full">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-2xl text-primary ">$</Text>
                    <Text className="paragraph-semibold text-dark-100">
                      Free Delivery
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <Image
                      source={images.clock}
                      className="w-5 h-5"
                      tintColor="#FF9C01"
                    />
                    <Text className="paragraph-semibold text-dark-100">
                      {offer.deliveryTime}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <Image
                      source={images.star}
                      className="w-5 h-5"
                      tintColor="#FF9C01"
                    />
                    <Text className="paragraph-semibold text-dark-100">
                      {offer.rating}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Description */}
              <View className="mb-6">
                <Text className="paragraph-medium text-[#6A6A6A] leading-[1.7]">
                  {offer.description}
                </Text>
              </View>

              {/* What's Included Section */}
              <View className="mb-6">
                <Text className="h3-bold text-primary mb-4">
                  What&#39;s Included?
                </Text>
                <View className="bg-white rounded-2xl shadow-md shadow-grey-300/50">
                  {offer.items.map((item, index) => (
                    <View
                      key={index}
                      className="flex-row items-center justify-between p-4"
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <Text className="paragraph-semibold text-dark-100 flex-1">
                          {item.name}
                        </Text>
                      </View>
                      <View className="bg-primary/10 rounded-full px-3 py-1">
                        <Text className="small-bold text-primary">
                          x{item.quantity}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Valid Until */}
              <View className="bg-primary/5 rounded-full  p-4 mb-4 w-[250px]">
                <View className="flex-row flex-center  gap-2">
                  <Image
                    source={images.clock}
                    className="w-5 h-5"
                    tintColor="#FF9C01"
                  />
                  <Text className="paragraph-medium text-dark-100">
                    <Text className="paragraph-bold">Ended on : </Text>{" "}
                    {offer.validUntil}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Add to Cart Button - Fixed at Bottom */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <View
              className="bg-white rounded-t-3xl w-full px-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                paddingBottom: Math.max(insets.bottom, 16),
                paddingTop: 16,
              }}
            >
              <View className="flex-row items-center justify-between">
                {/* Quantity Selector */}
                <View className="flex-row items-center gap-5 rounded-full px-5 py-3">
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-[4px] bg-primary/5 items-center justify-center"
                  >
                    <Image
                      source={images.minus}
                      className="w-5 h-1"
                      tintColor="#FF9C01"
                    />
                  </TouchableOpacity>

                  <Text className="text-xl font-quicksand-bold text-dark-100 w-[12px] text-center">
                    {quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 bg-primary/5 rounded-[4px] items-center justify-center"
                  >
                    <Image
                      source={images.plus}
                      className="w-5 h-5"
                      tintColor="#FF9C01"
                    />
                  </TouchableOpacity>
                </View>

                {/* Add to Cart Button */}
                <View className="flex-1 py-4">
                  <CustomButton
                    title={`Add to cart ($${calculateTotalPrice().toFixed(2)})`}
                    onPress={handleAddToCart}
                    style="px-6 py-4 rounded-[100px]"
                    leftIcon={
                      <Image
                        source={images.bag}
                        className="w-5 h-5 mr-3"
                        tintColor="white"
                      />
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <Toast
        visible={showToast}
        onClose={() => setShowToast(false)}
        isFirstItem={isFirstItem}
      />
    </>
  );
};

export default OfferDetails;
