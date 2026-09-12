import { Image as CachedImage } from "@/components/CachedImage";
import DetailHero from "@/components/DetailHero";
import FloatingDish, {
  CONTENT_PT,
  PANEL_H,
  SHEET_PULL,
} from "@/components/FloatingDish";
import Toast from "@/components/Toast";
import { getCustomizationImage } from "@/constants";
import { getMenuCustomizations, getMenuItemById } from "@/lib/appwrite";
import { useLocalize, useLocalizeCustomization, useT } from "@/lib/i18n";
import useAppwrite from "@/lib/useAppwrite";
import { useCartStore } from "@/store/cart.store";
import { CartCustomization, CustomizationOption, MenuItem } from "@/type";
import cn from "clsx";
import { useLocalSearchParams } from "expo-router";
import {
  Check,
  Clock,
  Dumbbell,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const fetchMenuItem = ({ menuId }: { menuId: string }) =>
  getMenuItemById(menuId);
const fetchCustomizations = ({ menuId }: { menuId: string }) =>
  getMenuCustomizations(menuId);

const categoryName = (item: MenuItem, loc: (en: string, ar?: string | null) => string) =>
  typeof item.categories === "object" && item.categories
    ? loc(item.categories.name, item.categories.name_ar)
    : "";

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <View className="flex-1 items-center rounded-2xl bg-primary/5 py-3.5">
    <Icon size={17} color="#FE8C00" />
    <Text className="mt-1.5 font-quicksand-bold text-sm text-content">
      {value}
    </Text>
    <Text className="font-quicksand-medium text-[11px] text-muted">
      {label}
    </Text>
  </View>
);

const AddonCard = ({
  option,
  selected,
  onToggle,
}: {
  option: CustomizationOption;
  selected: boolean;
  onToggle: () => void;
}) => {
  const image = getCustomizationImage(option.name);
  const locName = useLocalizeCustomization();
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.85}
      className={cn(
        "w-[116px] rounded-[20px] p-3",
        selected ? "bg-primary/10" : "bg-surface",
      )}
    >
      <View className="items-center">
        <View className="relative h-16 w-16 items-center justify-center">
          {image ? (
            <CachedImage
              source={image}
              className="h-16 w-16"
              contentFit="contain"
            />
          ) : (
            <View className="h-12 w-12 rounded-full bg-primary/10" />
          )}
          {selected ? (
            <View className="absolute -right-1.5 -top-1.5 h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-primary">
              <Check size={11} color="#fff" strokeWidth={3.5} />
            </View>
          ) : null}
        </View>
      </View>
      <Text
        className="mt-2.5 text-center font-quicksand-semibold text-[13px] text-content"
        numberOfLines={1}
      >
        {locName(option.name)}
      </Text>
      <Text className="mt-0.5 text-center font-quicksand-bold text-xs text-primary">
        +${option.price.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

const AddonRow = ({
  title,
  data,
  isSelected,
  onToggle,
}: {
  title: string;
  data: CustomizationOption[];
  isSelected: (id: string) => boolean;
  onToggle: (o: CustomizationOption) => void;
}) => (
  <View className="mt-7">
    <Text className="h3-bold mb-3 text-content">{title}</Text>
    <FlatList
      data={data}
      horizontal
      keyExtractor={(o) => o.id}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="w-3" />}
      renderItem={({ item }) => (
        <AddonCard
          option={item}
          selected={isSelected(item.id)}
          onToggle={() => onToggle(item)}
        />
      )}
    />
  </View>
);

const Details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const addItem = useCartStore((s) => s.addItem);
  const tr = useT();
  const loc = useLocalize();

  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<CartCustomization[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [isFirstItem, setIsFirstItem] = useState(false);

  const { data: item, loading } = useAppwrite<MenuItem, { menuId: string }>({
    fn: fetchMenuItem,
    params: { menuId: id! },
  });
  const { data: customizations } = useAppwrite<
    CustomizationOption[],
    { menuId: string }
  >({ fn: fetchCustomizations, params: { menuId: id! } });

  if (loading || !item) {
    return (
      <SafeAreaView className="flex-center h-full bg-canvas">
        <ActivityIndicator size="large" color="#FE8C00" />
      </SafeAreaView>
    );
  }

  const toppings = customizations?.filter((c) => c.type === "topping") ?? [];
  const sides = customizations?.filter((c) => c.type === "side") ?? [];
  const name = loc(item.name, item.name_ar);
  const description = loc(item.description, item.description_ar);

  const isSelected = (cid: string) => selected.some((c) => c.id === cid);
  const toggle = (o: CustomizationOption) =>
    setSelected((prev) =>
      prev.some((c) => c.id === o.id)
        ? prev.filter((c) => c.id !== o.id)
        : [
            // Store the raw (English) name, not localized — it needs to be
            // re-translated at display time so it still follows the
            // language if it changes after this item is in the cart.
            ...prev,
            { id: o.id, name: o.name, price: o.price, type: o.type },
          ],
    );

  const extras = selected.reduce((sum, c) => sum + c.price, 0);
  const total = (item.price + extras) * quantity;

  const handleAddToCart = () => {
    const isCartEmpty = useCartStore.getState().items.length === 0;
    addItem(
      {
        id: item.$id,
        name,
        price: item.price,
        image_url: item.image_url,
        customizations: selected,
      },
      quantity,
    );
    setIsFirstItem(isCartEmpty);
    setShowToast(true);
  };

  return (
    <>
      <View className="flex-1 bg-canvas">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
        >
          <DetailHero
            mode="product"
            height={PANEL_H}
            favorite={{
              id: item.$id,
              kind: "menu",
              name,
              image: item.image_url,
              price: item.price,
            }}
          />

          <View
            className="rounded-t-[30px] bg-card px-5"
            style={{ marginTop: -SHEET_PULL, paddingTop: CONTENT_PT }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="h1-bold text-content">{name}</Text>
                {categoryName(item, loc) ? (
                  <Text className="body-medium mt-0.5 text-muted">
                    {categoryName(item, loc)}
                  </Text>
                ) : null}
              </View>
              <View className="flex-row items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1">
                <Star size={13} color="#FFC738" fill="#FFC738" />
                <Text className="font-quicksand-bold text-xs text-content">
                  {item.rating?.toFixed(1) ?? "4.5"}
                </Text>
              </View>
            </View>

            <Text className="h2-bold mt-2 text-primary">
              ${item.price.toFixed(2)}
            </Text>

            <View className="mt-4 flex-row gap-2.5">
              <StatCard
                icon={Flame}
                label={tr("details.calories")}
                value={`${item.calories}`}
              />
              <StatCard
                icon={Dumbbell}
                label={tr("details.protein")}
                value={`${item.protein}g`}
              />
              <StatCard
                icon={Clock}
                label={tr("common.delivery")}
                value={tr("details.deliveryTime")}
              />
            </View>

            <Text className="h3-bold mt-7 text-content">
              {tr("details.aboutMeal")}
            </Text>
            <Text className="paragraph-medium mt-2 leading-[1.7] text-muted">
              {description || tr("details.defaultDesc")}
            </Text>

            {toppings.length > 0 && (
              <AddonRow
                title={tr("details.addToppings")}
                data={toppings}
                isSelected={isSelected}
                onToggle={toggle}
              />
            )}
            {sides.length > 0 && (
              <AddonRow
                title={tr("details.addSides")}
                data={sides}
                isSelected={isSelected}
                onToggle={toggle}
              />
            )}
          </View>

          <FloatingDish uri={item.image_url} />
        </ScrollView>

        {/* Sticky bottom bar */}
        <View
          className="absolute inset-x-0 bottom-0 bg-elevated px-5 pt-3"
          style={{
            paddingBottom: Math.max(insets.bottom, 14) + 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.07,
            shadowRadius: 12,
            elevation: 16,
          }}
        >
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-3 rounded-full bg-primary/5 px-3 py-2.5">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                hitSlop={6}
              >
                <Minus size={16} color="#FE8C00" strokeWidth={2.5} />
              </TouchableOpacity>
              <Text className="w-4 text-center font-quicksand-bold text-base text-content">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                hitSlop={6}
              >
                <Plus size={16} color="#FE8C00" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              activeOpacity={0.9}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
            >
              <ShoppingBag size={17} color="#fff" />
              <Text className="font-quicksand-bold text-base text-white">
                {tr("details.addToCartTotal", { amount: total.toFixed(2) })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Toast
        visible={showToast}
        onClose={() => setShowToast(false)}
        isFirstItem={isFirstItem}
      />
    </>
  );
};

export default Details;
