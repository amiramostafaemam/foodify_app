import FoodImage from "@/components/FoodImage";
import SummaryRow from "@/components/SummaryRow";
import { ORDER_STATUS_META } from "@/components/OrderStatusBadge";
import { images } from "@/constants";
import { useColors } from "@/hooks/useColors";
import { getOrderById } from "@/lib/appwrite";
import { useT } from "@/lib/i18n";
import {
  deriveOrderStatus,
  formatOrderDate,
  ORDER_STEPS,
  parseOrderItems,
} from "@/lib/orders";
import { Order } from "@/type";
import cn from "clsx";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mt-5 rounded-2xl bg-surface p-5">
    <Text className="paragraph-bold mb-4 text-content">{title}</Text>
    {children}
  </View>
);

/** Confirmed → Preparing → On the way → Delivered, with the current and
 * already-passed stages filled in. Cancelled orders skip this entirely —
 * there's no "progress" to show for one. */
const StatusTracker = ({ status }: { status: Order["orderStatus"] }) => {
  const tr = useT();
  const currentIndex = ORDER_STEPS.indexOf(
    status as (typeof ORDER_STEPS)[number],
  );

  return (
    <View className="flex-row items-start">
      {ORDER_STEPS.map((step, i) => {
        const meta = ORDER_STATUS_META[step];
        const Icon = meta.icon;
        const reached = i <= currentIndex;
        return (
          <View key={step} className="flex-1 items-center">
            <View className="w-full flex-row items-center">
              <View
                className={cn(
                  "flex-1",
                  i === 0 && "opacity-0",
                  reached ? "bg-primary" : "bg-line/15",
                )}
                style={{ height: 2 }}
              />
              <View
                className={cn(
                  "h-9 w-9 items-center justify-center rounded-full",
                  reached ? "bg-primary" : "bg-surface",
                )}
              >
                <Icon size={16} color={reached ? "#fff" : "#9AA0A6"} />
              </View>
              <View
                className={cn(
                  "flex-1",
                  i === ORDER_STEPS.length - 1 && "opacity-0",
                  i < currentIndex ? "bg-primary" : "bg-line/15",
                )}
                style={{ height: 2 }}
              />
            </View>
            <Text
              className={cn(
                "mt-2 text-center font-quicksand-semibold text-[10px]",
                reached ? "text-content" : "text-muted",
              )}
              numberOfLines={2}
            >
              {tr(`orders.status.${step}` as Parameters<typeof tr>[0])}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const OrderDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const tr = useT();
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getOrderById(id)
      .then((doc) => {
        if (!cancelled) setOrder(doc);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFound) {
    return (
      <SafeAreaView className="flex-center h-full bg-canvas">
        <Image source={images.notfound} className="h-72 w-72" resizeMode="contain" />
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="paragraph-bold text-primary">{tr("common.goBack")}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className="flex-center h-full bg-canvas">
        <ActivityIndicator color="#FE8C00" />
      </SafeAreaView>
    );
  }

  const status = deriveOrderStatus(order);
  const items = parseOrderItems(order.items);
  const statusMeta = ORDER_STATUS_META[status];
  const StatusIcon = statusMeta.icon;

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
        <View className="flex-1">
          <Text className="h3-bold text-content">{tr("orders.title")}</Text>
          <Text className="body-regular text-muted">
            #{order.$id.slice(-8).toUpperCase()} · {formatOrderDate(order.$createdAt)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status */}
        <View className="mt-4 items-center rounded-2xl bg-surface p-6">
          <View
            className={cn(
              "h-16 w-16 items-center justify-center rounded-full",
              statusMeta.bg,
            )}
          >
            <StatusIcon size={28} color={statusMeta.hex} />
          </View>
          <Text className="mt-3 font-quicksand-bold text-lg text-content">
            {tr(`orders.status.${status}` as Parameters<typeof tr>[0])}
          </Text>

          {status !== "cancelled" && (
            <View className="mt-6 w-full">
              <StatusTracker status={status} />
            </View>
          )}
        </View>

        {/* Items */}
        <Section title={tr("common.items")}>
          <View className="gap-4">
            {items.map((item, i) => (
              <View key={item.cartItemId || i} className="flex-row items-center gap-3">
                <FoodImage uri={item.image_url} className="h-16 w-16 rounded-xl bg-primary/5" />
                <View className="flex-1">
                  <Text className="paragraph-semibold text-content" numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.customizations && item.customizations.length > 0 && (
                    <Text className="body-regular mt-0.5 text-muted" numberOfLines={1}>
                      {item.customizations.map((cst) => cst.name).join(", ")}
                    </Text>
                  )}
                  <Text className="paragraph-medium mt-0.5 text-muted">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </Text>
                </View>
                <Text className="paragraph-bold text-content">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Summary */}
        <Section title={tr("cart.orderSummary")}>
          <SummaryRow
            label={tr("common.items")}
            value={`$${order.totalAmount.toFixed(2)}`}
          />
          <SummaryRow
            label={tr("common.delivery")}
            value={
              order.deliveryFee === 0
                ? tr("common.free")
                : `$${order.deliveryFee.toFixed(2)}`
            }
          />
          <SummaryRow
            label={tr("cart.discount")}
            value={`- $${order.discount.toFixed(2)}`}
            valueStyle="!text-success"
          />
          <View className="my-2 border-t border-line/10" />
          <SummaryRow
            label={tr("cart.total")}
            value={`$${order.finalAmount.toFixed(2)}`}
            labelStyle="base-bold !text-content"
            valueStyle="base-bold !text-content"
          />
        </Section>

        {/* Delivery */}
        {order.deliveryAddress ? (
          <Section title={tr("orders.deliverTo")}>
            <View className="flex-row items-start gap-2.5">
              <MapPin size={16} color="#FE8C00" style={{ marginTop: 2 }} />
              <Text className="paragraph-medium flex-1 text-content">
                {order.deliveryAddress}
              </Text>
            </View>
          </Section>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;
