import FoodImage from "@/components/FoodImage";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { images } from "@/constants";
import { useColors } from "@/hooks/useColors";
import { getUserOrders } from "@/lib/appwrite";
import { useT } from "@/lib/i18n";
import { deriveOrderStatus, formatOrderDate, parseOrderItems } from "@/lib/orders";
import useAuthStore from "@/store/auth.store";
import { Order } from "@/type";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
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

const OrderCard = ({ order }: { order: Order }) => {
  const tr = useT();
  const c = useColors();
  const items = parseOrderItems(order.items);
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const status = deriveOrderStatus(order);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.push({ pathname: "/order-details/[id]", params: { id: order.$id } })
      }
      className="gap-3 rounded-2xl bg-surface p-4 shadow-sm shadow-black/5"
    >
      <View className="flex-row items-center justify-between">
        <Text className="paragraph-medium text-muted">
          {formatOrderDate(order.$createdAt)}
        </Text>
        <OrderStatusBadge status={status} />
      </View>

      <View className="flex-row items-center gap-2">
        {items.slice(0, 4).map((item, i) => (
          <FoodImage
            key={item.cartItemId || i}
            uri={item.image_url}
            className="h-14 w-14 rounded-xl bg-primary/5"
          />
        ))}
        {items.length > 4 && (
          <View className="h-14 w-14 items-center justify-center rounded-xl bg-primary/5">
            <Text className="paragraph-bold text-primary">
              +{items.length - 4}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between border-t border-card pt-3">
        <View className="flex-1">
          <Text className="body-regular text-muted">
            {itemCount} {tr("common.items")}
          </Text>
          <Text className="paragraph-bold text-content">
            {tr("orders.total")}: ${order.finalAmount.toFixed(2)}
          </Text>
        </View>
        <ChevronRight size={18} color={c.muted} />
      </View>
    </TouchableOpacity>
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
