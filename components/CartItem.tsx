import FoodImage from "@/components/FoodImage";
import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CartItem = ({ item }: { item: CartItemType }) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();

  const itemTotalPrice =
    item.price +
    (item.customizations?.reduce((sum, c) => sum + c.price, 0) ?? 0);

  return (
    <View className="cart-item mb-4">
      <View className="flex flex-row items-center gap-x-3">
        <View className="cart-item__image">
          <FoodImage
            uri={item.image_url}
            className="size-4/5 rounded-lg"
            contentFit="contain"
          />
        </View>

        <View className="flex-1">
          <Text className="base-bold text-content" numberOfLines={1}>
            {item.name}
          </Text>

          {item.customizations && item.customizations.length > 0 && (
            <Text className="mt-1 text-xs text-muted" numberOfLines={2}>
              {item.customizations.map((c) => c.name).join(", ")}
            </Text>
          )}

          <Text className="paragraph-bold mt-1 text-primary">
            ${itemTotalPrice.toFixed(2)}
          </Text>

          <View className="mt-2 flex flex-row items-center gap-x-4">
            <TouchableOpacity
              onPress={() => decreaseQty(item.cartItemId)}
              className="cart-item__actions"
            >
              <Image
                source={images.minus}
                className="size-1/2"
                resizeMode="contain"
                tintColor={"#FE8C00"}
              />
            </TouchableOpacity>

            <Text className="base-bold text-content">{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => increaseQty(item.cartItemId)}
              className="cart-item__actions"
            >
              <Image
                source={images.plus}
                className="size-1/2"
                resizeMode="contain"
                tintColor={"#FE8C00"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => removeItem(item.cartItemId)}
        className="flex-center"
      >
        <Image
          source={images.trash}
          className="size-5"
          resizeMode="contain"
          tintColor="#F14141"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;
