import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import { useCartStore } from "@/store/cart.store";
import {
  selectUnreadCount,
  useNotificationsStore,
} from "@/store/notifications.store";
import { router } from "expo-router";
import { Bell, Heart, ShoppingBag } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

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
  const c = useColors();
  const tr = useT();
  const first = name?.trim().split(" ")[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? tr("home.morning") : hour < 18 ? tr("home.afternoon") : tr("home.evening");

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <Text className="body-medium text-muted">{greeting} 👋</Text>
        <Text className="h3-bold mt-0.5 text-content" numberOfLines={1}>
          {first ? tr("home.whatsUp", { name: first }) : tr("home.craving")}
        </Text>
      </View>

      <View className="flex-row gap-1.5">
        <TouchableOpacity
          className="icon-btn"
          activeOpacity={0.8}
          onPress={() => router.push("/favorites")}
        >
          <Heart size={19} color={c.content} />
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
