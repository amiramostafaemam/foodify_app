import { CartItemType, Order } from "@/type";

/**
 * There's no real kitchen/courier updating `orderStatus` in this project —
 * every order is written once as "pending" and never touched again, so
 * every single order would otherwise sit at "pending" forever. Deriving a
 * status from how long ago the order was placed instead simulates a
 * believable delivery timeline (confirmed → preparing → on the way →
 * delivered) with zero backend involved. A genuinely cancelled order (the
 * one status this app never actually sets, but the schema allows) is
 * shown as-is rather than overridden.
 */
export const deriveOrderStatus = (order: Order): Order["orderStatus"] => {
  if (order.orderStatus === "cancelled") return "cancelled";

  const minutesAgo = (Date.now() - new Date(order.$createdAt).getTime()) / 60_000;
  if (minutesAgo < 2) return "confirmed";
  if (minutesAgo < 8) return "preparing";
  if (minutesAgo < 20) return "on_the_way";
  return "delivered";
};

/** Ordered delivery stages shown in the tracker — "pending" and
 * "cancelled" are handled separately, not steps on this progress line. */
export const ORDER_STEPS = [
  "confirmed",
  "preparing",
  "on_the_way",
  "delivered",
] as const satisfies readonly Order["orderStatus"][];

export const formatOrderDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/** `order.items` is a JSON snapshot taken at checkout — parsed and shown
 * as-is, like a receipt, rather than re-fetched/re-localized live like the
 * cart and favorites are: it's a record of what was actually ordered. */
export const parseOrderItems = (raw: string): CartItemType[] => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
