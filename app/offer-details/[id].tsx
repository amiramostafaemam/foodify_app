import DetailHero from "@/components/DetailHero";
import FloatingDish, {
  CONTENT_PT,
  PANEL_H,
  SHEET_PULL,
} from "@/components/FloatingDish";
import Toast from "@/components/Toast";
import { images } from "@/constants";
import {
  OFFER_ITEM_KEYS,
  getOfferById,
  getOfferValidity,
} from "@/constants/offers.constants";
import { useT } from "@/lib/i18n";
import { useCartStore } from "@/store/cart.store";
import { router, useLocalSearchParams } from "expo-router";
import { Clock, Minus, Plus, ShoppingBag, Star } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const StatTile = ({ value, label }: { value: string; label: string }) => (
  <View className="flex-1 items-center rounded-2xl bg-primary/5 py-3.5">
    <Text className="font-quicksand-bold text-sm text-content">{value}</Text>
    <Text className="font-quicksand-medium text-[11px] text-muted">
      {label}
    </Text>
  </View>
);

const OfferDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isFirstItem, setIsFirstItem] = useState(false);
  const tr = useT();

  const addItem = useCartStore((s) => s.addItem);
  const validity = getOfferValidity();
  const offer = getOfferById(id!);

  if (!offer) {
    return (
      <SafeAreaView className="flex-center h-full bg-canvas">
        <Image
          source={images.notfound}
          className="h-72 w-72"
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="paragraph-bold text-primary">
            {tr("common.goBack")}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const total = offer.discountedPrice * quantity;
  const totalItems = offer.items.reduce((n, i) => n + i.quantity, 0);
  const title = tr(`offerData.${offer.id}.title` as Parameters<typeof tr>[0]);
  const description = tr(
    `offerData.${offer.id}.desc` as Parameters<typeof tr>[0],
  );

  const handleAddToCart = () => {
    const isCartEmpty = useCartStore.getState().items.length === 0;
    addItem(
      {
        id: offer.id,
        name: title,
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
      <View className="flex-1 bg-canvas">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
        >
          <DetailHero
            mode="product"
            height={PANEL_H}
            favorite={{
              id: offer.id,
              kind: "offer",
              name: title,
              image: offer.image,
              price: offer.discountedPrice,
            }}
          />

          <View
            className="rounded-t-[30px] bg-card px-5"
            style={{ marginTop: -SHEET_PULL, paddingTop: CONTENT_PT }}
          >
            <View className="flex-row items-start justify-between">
              <Text className="h1-bold flex-1 pr-3 text-content">
                {title}
              </Text>
              <View className="items-end">
                <Text className="body-regular text-muted line-through">
                  ${offer.originalPrice.toFixed(2)}
                </Text>
                <Text className="h2-bold text-primary">
                  ${offer.discountedPrice.toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="mt-2 flex-row items-center gap-2">
              <View className="flex-row items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1">
                <Star size={13} color="#FFC738" fill="#FFC738" />
                <Text className="font-quicksand-bold text-xs text-content">
                  {offer.rating}
                </Text>
              </View>
              <View className="rounded-full bg-primary/10 px-2.5 py-1">
                <Text className="small-bold text-primary">
                  {tr("offer.saveN", { n: offer.discount })}
                </Text>
              </View>
            </View>

            {/* Validity */}
            <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-primary/5 p-3.5">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Clock size={18} color="#FE8C00" />
              </View>
              <View className="flex-1">
                <Text className="paragraph-bold text-content">
                  {tr("offer.endsIn", {
                    n: validity.daysLeft,
                    unit: tr(validity.daysLeft === 1 ? "offer.day" : "offer.days"),
                  })}
                </Text>
                <Text className="body-regular text-muted">
                  {tr("offer.validUntil", { date: validity.date })}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row gap-2.5">
              <StatTile value={tr("common.free")} label={tr("common.delivery")} />
              <StatTile
                value={offer.deliveryTime.split(" ")[0]}
                label={tr("common.minutes")}
              />
              <StatTile value={`${totalItems}`} label={tr("common.items")} />
            </View>

            <Text className="h3-bold mt-7 text-content">
              {tr("offer.aboutDeal")}
            </Text>
            <Text className="paragraph-medium mt-2 leading-[1.7] text-muted">
              {description}
            </Text>

            <Text className="h3-bold mt-7 text-content">
              {tr("offer.included")}
            </Text>
            <View className="mt-3 gap-2">
              {offer.items.map((it, i) => (
                <View
                  key={i}
                  className="flex-row items-center justify-between rounded-2xl bg-surface px-4 py-3.5"
                >
                  <Text className="paragraph-semibold text-content">
                    {tr(
                      (OFFER_ITEM_KEYS[it.name] ??
                        it.name) as Parameters<typeof tr>[0],
                    )}
                  </Text>
                  <View className="rounded-full bg-card px-2.5 py-1">
                    <Text className="small-bold text-primary">
                      x{it.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <FloatingDish uri={offer.image} />
        </ScrollView>

        <View
          className="absolute inset-x-0 bottom-0 bg-elevated px-5 pt-3"
          style={{
            paddingBottom: Math.max(insets.bottom, 14) + 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.07,
            shadowRadius: 12,
            elevation: 16,
          }}
        >
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-3 rounded-full bg-primary/5 px-3 py-2.5">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                hitSlop={6}
              >
                <Minus size={16} color="#FE8C00" strokeWidth={2.5} />
              </TouchableOpacity>
              <Text className="w-4 text-center font-quicksand-bold text-base text-content">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                hitSlop={6}
              >
                <Plus size={16} color="#FE8C00" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              activeOpacity={0.9}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
            >
              <ShoppingBag size={17} color="#fff" />
              <Text className="font-quicksand-bold text-base text-white">
                {tr("details.addToCartTotal", { amount: total.toFixed(2) })}
              </Text>
            </TouchableOpacity>
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
