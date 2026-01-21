import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CartItem = ({ item }: { item: CartItemType }) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();
  const [imageError, setImageError] = useState(false);

  const imageUrl = item.image_url || "";

  const handleImageError = () => {
    setImageError(true);
  };

  const itemTotalPrice =
    item.price +
    (item.customizations?.reduce((sum, c) => sum + c.price, 0) ?? 0);

  return (
    <View className="cart-item mb-4">
      <View className="flex flex-row items-center gap-x-3">
        <View className="cart-item__image">
          {imageError ? (
            <Image
              source={images.emptyState}
              className="size-4/5 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <Image
              source={{ uri: imageUrl }}
              className="size-4/5 rounded-lg"
              resizeMode="cover"
              onError={handleImageError}
            />
          )}
        </View>

        <View className="flex-1">
          <Text className="base-bold text-dark-100" numberOfLines={1}>
            {item.name}
          </Text>

          {/* عرض الـ customizations لو موجودة */}
          {item.customizations && item.customizations.length > 0 && (
            <Text className="text-xs text-gray-400 mt-1" numberOfLines={2}>
              {item.customizations.map((c) => c.name).join(", ")}
            </Text>
          )}

          <Text className="paragraph-bold text-primary mt-1">
            ${itemTotalPrice.toFixed(2)}
          </Text>

          <View className="flex flex-row items-center gap-x-4 mt-2">
            <TouchableOpacity
              onPress={() => decreaseQty(item.cartItemId)}
              className="cart-item__actions"
            >
              <Image
                source={images.minus}
                className="size-1/2"
                resizeMode="contain"
                tintColor={"#FF9C01"}
              />
            </TouchableOpacity>

            <Text className="base-bold text-dark-100">{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => increaseQty(item.cartItemId)}
              className="cart-item__actions"
            >
              <Image
                source={images.plus}
                className="size-1/2"
                resizeMode="contain"
                tintColor={"#FF9C01"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => removeItem(item.cartItemId)}
        className="flex-center"
      >
        <Image source={images.trash} className="size-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;
