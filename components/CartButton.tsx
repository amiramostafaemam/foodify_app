import { useCartStore } from "@/store/cart.store";
import { router } from "expo-router";
import { ShoppingBag } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

const CartButton = () => {
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <TouchableOpacity className="cart-btn" onPress={() => router.push("/cart")}>
      <ShoppingBag size={18} color="#fff" />
      {totalItems > 0 && (
        <View className="cart-badge">
          <Text className="small-bold text-white">{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartButton;
