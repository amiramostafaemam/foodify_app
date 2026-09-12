import FoodImage from "@/components/FoodImage";
import { getOfferById } from "@/constants/offers.constants";
import { getMenuItemById } from "@/lib/appwrite";
import { useLocalize, useLocalizeCustomization, useT } from "@/lib/i18n";
import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { Minus, Plus, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const CartItem = ({ item }: { item: CartItemType }) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();
  const tr = useT();
  const loc = useLocalize();
  const locCustomization = useLocalizeCustomization();

  const unitPrice =
    item.price +
    (item.customizations?.reduce((sum, c) => sum + c.price, 0) ?? 0);

  const isOffer = !!getOfferById(item.id);

  // Same live-relocalization as favorites — offer names have a full
  // translation table, menu items come from Appwrite (fetch the live doc
  // for name/name_ar) — either way, don't rely on the frozen snapshot
  // taken when it was added to the cart.
  const [menuNames, setMenuNames] = useState<{ name: string; name_ar?: string } | null>(
    null,
  );
  useEffect(() => {
    if (isOffer) return;
    let cancelled = false;
    getMenuItemById(item.id)
      .then((doc) => {
        if (!cancelled) setMenuNames({ name: doc.name, name_ar: doc.name_ar });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isOffer, item.id]);

  const displayName = isOffer
    ? tr(`offerData.${item.id}.title` as Parameters<typeof tr>[0])
    : menuNames
      ? loc(menuNames.name, menuNames.name_ar)
      : item.name;

  return (
    <View className="flex-row gap-3 rounded-2xl bg-surface p-3">
      <View className="h-20 w-20 items-center justify-center">
        <FoodImage uri={item.image_url} className="h-20 w-20" />
      </View>

      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <Text
            className="paragraph-bold flex-1 pr-2 text-content"
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <TouchableOpacity onPress={() => removeItem(item.cartItemId)} hitSlop={8}>
            <X size={16} color="#9AA0A6" />
          </TouchableOpacity>
        </View>

        {item.customizations && item.customizations.length > 0 ? (
          <Text className="mt-0.5 text-xs text-muted" numberOfLines={1}>
            {item.customizations.map((c) => locCustomization(c.name)).join(", ")}
          </Text>
        ) : null}

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="paragraph-bold text-primary">
            ${(unitPrice * item.quantity).toFixed(2)}
          </Text>

          <View className="flex-row items-center gap-3 rounded-full bg-card px-2.5 py-1.5">
            <TouchableOpacity
              onPress={() => decreaseQty(item.cartItemId)}
              hitSlop={6}
            >
              <Minus size={14} color="#FE8C00" strokeWidth={2.75} />
            </TouchableOpacity>
            <Text className="w-4 text-center font-quicksand-bold text-sm text-content">
              {item.quantity}
            </Text>
            <TouchableOpacity
              onPress={() => increaseQty(item.cartItemId)}
              hitSlop={6}
            >
              <Plus size={14} color="#FE8C00" strokeWidth={2.75} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
