import { useT } from "@/lib/i18n";
import { Order } from "@/type";
import {
  Bike,
  ChefHat,
  CircleCheck,
  CircleX,
  Clock,
  PackageCheck,
  type LucideIcon,
} from "lucide-react-native";
import { Text, View } from "react-native";

type Status = Order["orderStatus"];

/** Icon + colour per status, shared by the orders list pill and the order-
 * details screen's bigger header/tracker so both read as one system. */
export const ORDER_STATUS_META: Record<
  Status,
  { icon: LucideIcon; bg: string; text: string; hex: string }
> = {
  pending: { icon: Clock, bg: "bg-surface", text: "text-muted", hex: "#878787" },
  confirmed: {
    icon: CircleCheck,
    bg: "bg-primary/10",
    text: "text-primary",
    hex: "#FE8C00",
  },
  preparing: {
    icon: ChefHat,
    bg: "bg-primary/10",
    text: "text-primary",
    hex: "#FE8C00",
  },
  on_the_way: {
    icon: Bike,
    bg: "bg-primary/10",
    text: "text-primary",
    hex: "#FE8C00",
  },
  delivered: {
    icon: PackageCheck,
    bg: "bg-success/10",
    text: "text-success",
    hex: "#2F9B65",
  },
  cancelled: {
    icon: CircleX,
    bg: "bg-error/10",
    text: "text-error",
    hex: "#F14141",
  },
};

const OrderStatusBadge = ({ status }: { status: Status }) => {
  const tr = useT();
  const meta = ORDER_STATUS_META[status] ?? ORDER_STATUS_META.pending;
  const Icon = meta.icon;

  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-full px-3 py-1 ${meta.bg}`}
    >
      <Icon size={13} color={meta.hex} />
      <Text className={`font-quicksand-bold text-xs ${meta.text}`}>
        {tr(`orders.status.${status}` as Parameters<typeof tr>[0])}
      </Text>
    </View>
  );
};

export default OrderStatusBadge;
