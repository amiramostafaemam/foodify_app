import { Image as CachedImage } from "@/components/CachedImage";
import DetailHero from "@/components/DetailHero";
import Toast from "@/components/Toast";
import { getCustomizationImage } from "@/constants";
import { getMenuCustomizations, getMenuItemById } from "@/lib/appwrite";
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

const categoryName = (item: MenuItem) =>
  typeof item.categories === "object" && item.categories
    ? item.categories.name
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
  <View className="flex-1 items-center rounded-2xl bg-primary/5 py-3">
    <Icon size={17} color="#FE8C00" />
    <Text className="mt-1.5 font-quicksand-bold text-sm text-dark-100">
      {value}
    </Text>
    <Text className="font-quicksand-medium text-[11px] text-gray-100">
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
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.85}
      className={cn(
        "w-[104px] rounded-2xl border p-2.5",
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200/70 bg-white",
      )}
    >
      <View className="h-14 items-center justify-center">
        {image ? (
          <CachedImage
            source={image}
            className="h-14 w-14"
            contentFit="contain"
          />
        ) : (
          <View className="h-12 w-12 rounded-full bg-primary/10" />
        )}
      </View>
      <Text
        className="mt-1 font-quicksand-semibold text-[12px] text-dark-100"
        numberOfLines={1}
      >
        {option.name}
      </Text>
      <View className="mt-1 flex-row items-center justify-between">
        <Text className="font-quicksand-bold text-[12px] text-primary">
          +${option.price.toFixed(2)}
        </Text>
        <View
          className={cn(
            "h-6 w-6 items-center justify-center rounded-full",
            selected ? "bg-primary" : "bg-primary/10",
          )}
        >
          {selected ? (
            <Check size={13} color="#fff" strokeWidth={3} />
          ) : (
            <Plus size={13} color="#FE8C00" strokeWidth={3} />
          )}
        </View>
      </View>
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
  <View className="mt-6">
    <Text className="h3-bold mb-3 text-dark-100">{title}</Text>
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
      <SafeAreaView className="flex-center h-full bg-white">
        <ActivityIndicator size="large" color="#FE8C00" />
      </SafeAreaView>
    );
  }

  const toppings = customizations?.filter((c) => c.type === "topping") ?? [];
  const sides = customizations?.filter((c) => c.type === "side") ?? [];

  const isSelected = (cid: string) => selected.some((c) => c.id === cid);
  const toggle = (o: CustomizationOption) =>
    setSelected((prev) =>
      prev.some((c) => c.id === o.id)
        ? prev.filter((c) => c.id !== o.id)
        : [...prev, { id: o.id, name: o.name, price: o.price, type: o.type }],
    );

  const extras = selected.reduce((sum, c) => sum + c.price, 0);
  const total = (item.price + extras) * quantity;

  const handleAddToCart = () => {
    const isCartEmpty = useCartStore.getState().items.length === 0;
    addItem(
      {
        id: item.$id,
        name: item.name,
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
      <View className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
        >
          <DetailHero uri={item.image_url} />

          <View className="-mt-6 rounded-t-[28px] bg-white px-5 pt-5">
            <View className="mb-4 h-1 w-10 self-center rounded-full bg-gray-200" />

            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="h1-bold text-dark-100">{item.name}</Text>
                {categoryName(item) ? (
                  <Text className="body-medium mt-0.5 text-gray-100">
                    {categoryName(item)}
                  </Text>
                ) : null}
              </View>
              <View className="flex-row items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1">
                <Star size={13} color="#FFC738" fill="#FFC738" />
                <Text className="font-quicksand-bold text-xs text-dark-100">
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
                label="Calories"
                value={`${item.calories}`}
              />
              <StatCard
                icon={Dumbbell}
                label="Protein"
                value={`${item.protein}g`}
              />
              <StatCard icon={Clock} label="Delivery" value="25 min" />
            </View>

            <Text className="h3-bold mt-6 text-dark-100">About this meal</Text>
            <Text className="paragraph-medium mt-2 leading-[1.7] text-gray-100">
              {item.description ||
                "Freshly prepared with high-quality ingredients and delivered hot to your door."}
            </Text>

            {toppings.length > 0 && (
              <AddonRow
                title="Add toppings"
                data={toppings}
                isSelected={isSelected}
                onToggle={toggle}
              />
            )}
            {sides.length > 0 && (
              <AddonRow
                title="Add sides"
                data={sides}
                isSelected={isSelected}
                onToggle={toggle}
              />
            )}
          </View>
        </ScrollView>

        {/* Sticky bottom bar */}
        <View
          className="absolute inset-x-0 bottom-0 bg-white px-5 pt-3"
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
              <Text className="w-4 text-center font-quicksand-bold text-base text-dark-100">
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
                Add to Cart · ${total.toFixed(2)}
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
