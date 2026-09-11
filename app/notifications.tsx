import { images } from "@/constants";
import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import {
  AppNotification,
  NotificationType,
  selectUnreadCount,
  useNotificationsStore,
} from "@/store/notifications.store";
import cn from "clsx";
import { router } from "expo-router";
import {
  Bell,
  Bike,
  ChevronLeft,
  type LucideIcon,
  Percent,
  ShoppingBag,
} from "lucide-react-native";
import { useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

const relativeTime = (ts: number) => {
  const diff = Date.now() - ts;
  if (diff < HOUR) return `${Math.max(1, Math.floor(diff / 60_000))}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const META: Record<
  NotificationType,
  { Icon: LucideIcon; color: string; tile: string }
> = {
  order: { Icon: ShoppingBag, color: "#FE8C00", tile: "bg-primary/10" },
  offer: { Icon: Percent, color: "#B57D00", tile: "bg-accent/20" },
  delivery: { Icon: Bike, color: "#2F9B65", tile: "bg-success/10" },
  system: { Icon: Bell, color: "#9AA0A6", tile: "bg-muted/10" },
};

const NotificationRow = ({
  item,
  onPress,
}: {
  item: AppNotification;
  onPress: () => void;
}) => {
  const { Icon, color, tile } = META[item.type];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={cn(
        "flex-row gap-3 rounded-2xl p-3.5",
        item.read ? "bg-card" : "bg-primary/5",
      )}
    >
      <View
        className={cn(
          "h-11 w-11 items-center justify-center rounded-full",
          tile,
        )}
      >
        <Icon size={19} color={color} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            className="paragraph-bold flex-1 pr-2 text-content"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text className="font-quicksand-medium text-[11px] text-muted">
            {relativeTime(item.createdAt)}
          </Text>
        </View>
        <Text
          className="body-regular mt-1 leading-[1.5] text-muted"
          numberOfLines={2}
        >
          {item.body}
        </Text>
      </View>

      {!item.read && (
        <View className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
      )}
    </TouchableOpacity>
  );
};

const Notifications = () => {
  const items = useNotificationsStore((s) => s.items);
  const unread = useNotificationsStore(selectUnreadCount);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const clearAll = useNotificationsStore((s) => s.clearAll);
  const c = useColors();
  const tr = useT();

  // Opening the screen counts as seeing everything — clear the badge.
  useEffect(() => {
    if (useNotificationsStore.getState().items.some((n) => !n.read)) {
      markAllRead();
    }
  }, [markAllRead]);

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-2">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface"
          >
            <ChevronLeft size={22} color={c.content} />
          </TouchableOpacity>
          <Text className="h3-bold text-content">{tr("notif.title")}</Text>
        </View>

        {unread > 0 && (
          <TouchableOpacity onPress={markAllRead} hitSlop={8}>
            <Text className="paragraph-bold text-primary">
              {tr("common.markAllRead")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        ItemSeparatorComponent={() => <View className="h-1.5" />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <NotificationRow item={item} onPress={() => markRead(item.id)} />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-8">
            <Image
              source={images.emptyState}
              className="mb-5 h-56 w-56"
              resizeMode="contain"
            />
            <Text className="h3-bold text-content">{tr("notif.empty")}</Text>
            <Text className="body-regular mt-2 text-center text-muted">
              {tr("notif.emptyHint")}
            </Text>
          </View>
        }
        ListFooterComponent={
          items.length > 0 ? (
            <TouchableOpacity
              onPress={clearAll}
              className="mt-4 items-center py-3"
              hitSlop={8}
            >
              <Text className="paragraph-semibold text-muted">
                {tr("common.clearAll")}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default Notifications;
