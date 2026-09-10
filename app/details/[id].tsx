import { Image as CachedImage } from "@/components/CachedImage";
import CustomButton from "@/components/CustomButton";
import DetailHero from "@/components/DetailHero";
import Toast from "@/components/Toast";
import { getCustomizationImage } from "@/constants";
import { getMenuCustomizations, getMenuItemById } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useCartStore } from "@/store/cart.store";
import { CartCustomization, CustomizationOption, MenuItem } from "@/type";
import cn from "clsx";
import { useLocalSearchParams } from "expo-router";
import { Check, Flame, Minus, Plus, Star } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
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

const CustomizationChip = ({
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
        "w-[30%] items-center rounded-2xl border p-2.5",
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200/70 bg-white",
      )}
    >
      <View className="h-12 w-12 items-center justify-center">
        {image && (
          <CachedImage
            source={image}
            className="h-11 w-11"
            contentFit="contain"
          />
        )}
      </View>
      <Text
        className="mt-1 text-center font-quicksand-semibold text-[11px] text-dark-100"
        numberOfLines={1}
      >
        {option.name}
      </Text>
      <Text className="mt-0.5 font-quicksand-bold text-[11px] text-primary">
        +${option.price.toFixed(2)}
      </Text>
      {selected && (
        <View className="absolute -right-1.5 -top-1.5 h-5 w-5 items-center justify-center rounded-full bg-primary">
          <Check size={12} color="#fff" strokeWidth={3} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const Details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const addItem = useCartStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<CartCustomization[]>([]);
  const [tab, setTab] = useState<"details" | "customize">("details");
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
  const hasCustomize = toppings.length > 0 || sides.length > 0;

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
          <DetailHero imageUri={item.image_url} />

          <View className="px-5 pt-4">
            <View className="flex-row items-start justify-between">
              <Text className="h1-bold flex-1 pr-3 text-dark-100">
                {item.name}
              </Text>
              <Text className="h2-bold text-primary">
                ${item.price.toFixed(2)}
              </Text>
            </View>
            {categoryName(item) ? (
              <Text className="body-medium mt-0.5 text-gray-100">
                {categoryName(item)}
              </Text>
            ) : null}

            {/* quick stats */}
            <View className="mt-3 flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <Star size={15} color="#FFC738" fill="#FFC738" />
                <Text className="body-medium text-gray-100">
                  {item.rating?.toFixed(1) ?? "4.5"}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Flame size={15} color="#FE8C00" />
                <Text className="body-medium text-gray-100">
                  {item.calories} cal
                </Text>
              </View>
              <Text className="body-medium text-gray-100">
                {item.protein}g protein
              </Text>
            </View>

            {/* tabs */}
            <View className="mt-5 flex-row gap-2">
              <TouchableOpacity
                onPress={() => setTab("details")}
                className={cn(
                  "rounded-full px-5 py-2",
                  tab === "details" ? "bg-primary" : "bg-gray-100/10",
                )}
              >
                <Text
                  className={cn(
                    "font-quicksand-bold text-sm",
                    tab === "details" ? "text-white" : "text-gray-100",
                  )}
                >
                  Details
                </Text>
              </TouchableOpacity>
              {hasCustomize && (
                <TouchableOpacity
                  onPress={() => setTab("customize")}
                  className={cn(
                    "rounded-full px-5 py-2",
                    tab === "customize" ? "bg-primary" : "bg-gray-100/10",
                  )}
                >
                  <Text
                    className={cn(
                      "font-quicksand-bold text-sm",
                      tab === "customize" ? "text-white" : "text-gray-100",
                    )}
                  >
                    Customize
                    {selected.length > 0 ? ` (${selected.length})` : ""}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {tab === "details" ? (
              <View className="mt-4">
                <Text className="paragraph-medium leading-[1.7] text-[#6A6A6A]">
                  {item.description ||
                    "Delicious and freshly prepared with high-quality ingredients."}
                </Text>
                <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-primary/5 px-5 py-3.5">
                  <View className="items-center">
                    <Text className="paragraph-bold text-dark-100">Free</Text>
                    <Text className="body-regular text-gray-100">Delivery</Text>
                  </View>
                  <View className="items-center">
                    <Text className="paragraph-bold text-dark-100">20–30</Text>
                    <Text className="body-regular text-gray-100">Minutes</Text>
                  </View>
                  <View className="items-center">
                    <Text className="paragraph-bold text-dark-100">
                      {item.rating?.toFixed(1) ?? "4.5"}
                    </Text>
                    <Text className="body-regular text-gray-100">Rating</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View className="mt-4 gap-5">
                {toppings.length > 0 && (
                  <View>
                    <Text className="paragraph-bold mb-3 text-dark-100">
                      Toppings
                    </Text>
                    <View className="flex-row flex-wrap gap-3">
                      {toppings.map((o) => (
                        <CustomizationChip
                          key={o.id}
                          option={o}
                          selected={isSelected(o.id)}
                          onToggle={() => toggle(o)}
                        />
                      ))}
                    </View>
                  </View>
                )}
                {sides.length > 0 && (
                  <View>
                    <Text className="paragraph-bold mb-3 text-dark-100">
                      Sides
                    </Text>
                    <View className="flex-row flex-wrap gap-3">
                      {sides.map((o) => (
                        <CustomizationChip
                          key={o.id}
                          option={o}
                          selected={isSelected(o.id)}
                          onToggle={() => toggle(o)}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom bar */}
        <View
          className="absolute inset-x-0 bottom-0 flex-row items-center gap-4 rounded-t-3xl bg-white px-5 pt-4"
          style={{
            paddingBottom: Math.max(insets.bottom, 16),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 12,
          }}
        >
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-9 w-9 items-center justify-center rounded-full bg-primary/10"
            >
              <Minus size={16} color="#FE8C00" />
            </TouchableOpacity>
            <Text className="w-4 text-center font-quicksand-bold text-lg text-dark-100">
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity((q) => q + 1)}
              className="h-9 w-9 items-center justify-center rounded-full bg-primary/10"
            >
              <Plus size={16} color="#FE8C00" />
            </TouchableOpacity>
          </View>

          <View className="flex-1">
            <CustomButton
              title={`Add to Cart · $${total.toFixed(2)}`}
              onPress={handleAddToCart}
            />
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
