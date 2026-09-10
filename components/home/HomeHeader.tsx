import { useColors } from "@/hooks/useColors";
import { useCartStore } from "@/store/cart.store";
import {
  selectFavoriteCount,
  useFavoritesStore,
} from "@/store/favorites.store";
import {
  selectUnreadCount,
  useNotificationsStore,
} from "@/store/notifications.store";
import { router } from "expo-router";
import { Bell, Heart, ShoppingBag } from "lucide-react-native";
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
  const unreadCount = useNotificationsStore(selectUnreadCount);
  const favCount = useFavoritesStore(selectFavoriteCount);
  const c = useColors();
  const first = name?.trim().split(" ")[0];

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <Text className="body-medium text-muted">{greeting()} 👋</Text>
        <Text className="h3-bold mt-0.5 text-content" numberOfLines={1}>
          {first ? `What's up, ${first}?` : "What are you craving?"}
        </Text>
      </View>

      <View className="flex-row gap-1.5">
        <TouchableOpacity
          className="icon-btn"
          activeOpacity={0.8}
          onPress={() => router.push("/favorites")}
        >
          <Heart size={19} color={c.content} />
          <Badge count={favCount} />
        </TouchableOpacity>
        <TouchableOpacity
          className="icon-btn"
          activeOpacity={0.8}
          onPress={() => router.push("/notifications")}
        >
          <Bell size={19} color={c.content} />
          <Badge count={unreadCount} />
        </TouchableOpacity>
        <TouchableOpacity
          className="icon-btn"
          activeOpacity={0.8}
          onPress={() => router.push("/cart")}
        >
          <ShoppingBag size={19} color={c.content} />
          <Badge count={cartCount} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
