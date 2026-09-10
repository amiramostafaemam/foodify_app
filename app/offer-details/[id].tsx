// app/offer-details/[id].tsx
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import Toast from "@/components/Toast";
import { images } from "@/constants";
import { getOfferById, Offer } from "@/constants/offers.constants";
import { useCartStore } from "@/store/cart.store";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
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
          className="h-5 w-5"
          tintColor={star <= Math.floor(rating) ? "#FE8C00" : "#D1D5DB"}
        />
      ))}
      <Text className="paragraph-semibold ml-2 text-[#878787]">{rating}/5</Text>
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

  const { addItem } = useCartStore();

  // Get offer data
  const offer: Offer | undefined = getOfferById(id!);

  // Initialize video player
  const player = useVideoPlayer(offer?.videoUrl || "", (player) => {
    player.loop = true;
    player.play();
    player.muted = isMuted;
  });

  useEffect(() => {
    // expo-video exposes the player as a mutable object by design.
    // eslint-disable-next-line react-hooks/immutability
    player.muted = isMuted;
  }, [player, isMuted]);

  if (!offer) {
    return (
      <SafeAreaView className="flex-center h-full bg-white ">
        <CustomHeader style="absolute top-10 left-5" />
        <Image
          source={images.notfound}
          className="h-80 w-full scale-150 "
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

    addItem(
      {
        id: offer.id,
        name: offer.title,
        price: offer.discountedPrice,
        image_url: Image.resolveAssetSource(offer.image).uri,
      },
      quantity,
    );

    setShowToast(true);
    setIsFirstItem(isCartEmpty);
  };

  return (
    <>
      <SafeAreaView className="h-full bg-white" edges={["top"]}>
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
            <View className="relative h-[300px] w-full bg-black">
              <View className="flex-center absolute inset-0 z-10 bg-black/10"></View>
              <VideoView
                player={player}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                nativeControls={false}
              />

              {/* Discount Badge */}
              <View className="absolute left-4 top-4 rounded-full bg-primary px-4 py-2">
                <Text className="body-bold text-white">
                  Save {offer.discount}%
                </Text>
              </View>

              {/* Mute toggle */}
              <TouchableOpacity
                onPress={() => setIsMuted((prev) => !prev)}
                className="absolute bottom-4 right-4 z-20 h-10 w-10 items-center justify-center rounded-full bg-black/60"
                activeOpacity={0.8}
              >
                <Text className="text-lg">{isMuted ? "🔇" : "🔊"}</Text>
              </TouchableOpacity>
            </View>

            {/* Offer Info Section */}
            <View className="px-5 py-6">
              {/* Title & Rating */}
              <Text className="h1-bold mb-3 text-dark-100">{offer.title}</Text>

              <View className="mb-4">
                <StarRating rating={offer.rating} />
              </View>

              {/* Price Section */}
              <View className="mb-4 flex-row items-center gap-3">
                <Text className="h3-bold text-gray-200 line-through">
                  ${offer.originalPrice.toFixed(2)}
                </Text>
                <Text className="h1-bold text-primary">
                  ${offer.discountedPrice.toFixed(2)}
                </Text>
                <View className="rounded-full bg-success/10 px-3 py-1">
                  <Text className="small-bold text-success">
                    You save $
                    {(offer.originalPrice - offer.discountedPrice).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Stats Section */}
              <View className="mb-5 rounded-full bg-primary/5 px-5 py-4">
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
                      className="h-5 w-5"
                      tintColor="#FE8C00"
                    />
                    <Text className="paragraph-semibold text-dark-100">
                      {offer.deliveryTime}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <Image
                      source={images.star}
                      className="h-5 w-5"
                      tintColor="#FE8C00"
                    />
                    <Text className="paragraph-semibold text-dark-100">
                      {offer.rating}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Description */}
              <View className="mb-6">
                <Text className="paragraph-medium leading-[1.7] text-[#6A6A6A]">
                  {offer.description}
                </Text>
              </View>

              {/* What's Included Section */}
              <View className="mb-6">
                <Text className="h3-bold mb-4 text-primary">
                  What&#39;s Included?
                </Text>
                <View className="shadow-grey-300/50 rounded-2xl bg-white shadow-md">
                  {offer.items.map((item, index) => (
                    <View
                      key={index}
                      className="flex-row items-center justify-between p-4"
                    >
                      <View className="flex-1 flex-row items-center gap-3">
                        <Text className="paragraph-semibold flex-1 text-dark-100">
                          {item.name}
                        </Text>
                      </View>
                      <View className="rounded-full bg-primary/10 px-3 py-1">
                        <Text className="small-bold text-primary">
                          x{item.quantity}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Valid Until */}
              <View className="mb-4 w-[250px]  rounded-full bg-primary/5 p-4">
                <View className="flex-center flex-row  gap-2">
                  <Image
                    source={images.clock}
                    className="h-5 w-5"
                    tintColor="#FE8C00"
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
              className="w-full rounded-t-3xl bg-white px-4"
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
                    className="h-9 w-9 items-center justify-center rounded-[4px] bg-primary/5"
                  >
                    <Image
                      source={images.minus}
                      className="h-1 w-5"
                      tintColor="#FE8C00"
                    />
                  </TouchableOpacity>

                  <Text className="w-[12px] text-center font-quicksand-bold text-xl text-dark-100">
                    {quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setQuantity(quantity + 1)}
                    className="h-9 w-9 items-center justify-center rounded-[4px] bg-primary/5"
                  >
                    <Image
                      source={images.plus}
                      className="h-5 w-5"
                      tintColor="#FE8C00"
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
                        className="mr-3 h-5 w-5"
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
