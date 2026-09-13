import FoodImage from "@/components/FoodImage";
import { images } from "@/constants";
import { useColors } from "@/hooks/useColors";
import { getUserOrders } from "@/lib/appwrite";
import { useT } from "@/lib/i18n";
import useAuthStore from "@/store/auth.store";
import { CartItemType, Order } from "@/type";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Status = Order["orderStatus"];

const STATUS_STYLE: Record<Status, { bg: string; text: string }> = {
  pending: { bg: "bg-surface", text: "text-muted" },
  confirmed: { bg: "bg-primary/10", text: "text-primary" },
  preparing: { bg: "bg-primary/10", text: "text-primary" },
  on_the_way: { bg: "bg-primary/10", text: "text-primary" },
  delivered: { bg: "bg-success/10", text: "text-success" },
  cancelled: { bg: "bg-error/10", text: "text-error" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/** `order.items` is a JSON snapshot taken at checkout — rendered as-is,
 * like a receipt, rather than re-fetched/re-localized live like the cart
 * and favorites are: this is a record of what was actually ordered. */
const parseItems = (raw: string): CartItemType[] => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const OrderCard = ({ order }: { order: Order }) => {
  const tr = useT();
  const items = parseItems(order.items);
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const statusStyle = STATUS_STYLE[order.orderStatus] ?? STATUS_STYLE.pending;

  return (
    <View className="gap-3 rounded-2xl bg-surface p-4">
      <View className="flex-row items-center justify-between">
        <Text className="paragraph-medium text-muted">
          {formatDate(order.$createdAt)}
        </Text>
        <View className={`rounded-full px-3 py-1 ${statusStyle.bg}`}>
          <Text className={`font-quicksand-bold text-xs ${statusStyle.text}`}>
            {tr(`orders.status.${order.orderStatus}` as Parameters<typeof tr>[0])}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {items.slice(0, 3).map((item, i) => (
          <FoodImage
            key={item.cartItemId || i}
            uri={item.image_url}
            className="h-12 w-12 rounded-xl bg-card"
          />
        ))}
        {items.length > 3 && (
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-card">
            <Text className="paragraph-bold text-muted">
              +{items.length - 3}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between border-t border-card pt-3">
        <Text className="body-regular text-muted">
          {itemCount} {tr("common.items")}
        </Text>
        <Text className="paragraph-bold text-content">
          {tr("orders.total")}: ${order.finalAmount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const Orders = () => {
  const user = useAuthStore((s) => s.user);
  const c = useColors();
  const tr = useT();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getUserOrders(user.$id)
      .then((docs) => {
        if (!cancelled) setOrders(docs);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // No user means there's nothing to fetch — known synchronously during
  // render, so this doesn't need its own effect/state round-trip.
  const showLoading = loading && !!user;

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      <View className="flex-row items-center gap-2 px-5 pb-2 pt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <ChevronLeft size={22} color={c.content} />
        </TouchableOpacity>
        <Text className="h3-bold text-content">{tr("orders.title")}</Text>
      </View>

      {showLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FE8C00" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.$id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 40,
            flexGrow: 1,
            gap: 10,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OrderCard order={item} />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-8">
              <Image
                source={images.emptyState}
                className="mb-5 h-56 w-56"
                resizeMode="contain"
              />
              <Text className="h3-bold text-content">{tr("orders.empty")}</Text>
              <Text className="body-regular mt-2 text-center text-muted">
                {tr("orders.emptyHint")}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Orders;
