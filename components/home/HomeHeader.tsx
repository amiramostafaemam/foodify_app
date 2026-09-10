import { useCartStore } from "@/store/cart.store";
import { router } from "expo-router";
import { Bell, ShoppingBag } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const Badge = ({ count }: { count: number }) =>
  count > 0 ? (
    <View className="absolute -right-1.5 -top-1.5 h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1">
      <Text className="font-quicksand-bold text-[10px] text-white">
        {count > 9 ? "9+" : count}
      </Text>
    </View>
  ) : null;

const HomeHeader = ({ name }: { name?: string }) => {
  const cartCount = useCartStore((s) => s.getTotalItems());
  const first = name?.trim().split(" ")[0];

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <Text className="body-medium text-gray-100">{greeting()} 👋</Text>
        <Text className="h3-bold mt-0.5 text-dark-100" numberOfLines={1}>
          {first ? `What's up, ${first}?` : "What are you craving?"}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity className="icon-btn" activeOpacity={0.8}>
          <Bell size={20} color="#181C2E" />
          <Badge count={0} />
        </TouchableOpacity>
        <TouchableOpacity
          className="icon-btn"
          activeOpacity={0.8}
          onPress={() => router.push("/cart")}
        >
          <ShoppingBag size={20} color="#181C2E" />
          <Badge count={cartCount} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
