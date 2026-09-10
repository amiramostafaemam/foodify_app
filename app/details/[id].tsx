import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import FoodImage from "@/components/FoodImage";
import Toast from "@/components/Toast";
import { getCustomizationImage, images } from "@/constants";
import {
  getCategoryById,
  getMenuCustomizations,
  getMenuItemById,
} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useCartStore } from "@/store/cart.store";
import { CartCustomization, CustomizationOption, MenuItem } from "@/type";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_PADDING = 3;
const CARD_GAP = 23;
const CARDS_VISIBLE = 3.5;
const CARD_WIDTH =
  (SCREEN_WIDTH - CARD_PADDING - CARD_GAP * (CARDS_VISIBLE - 1)) /
  CARDS_VISIBLE;

const fetchMenuItem = ({ menuId }: { menuId: string }) =>
  getMenuItemById(menuId);
const fetchCustomizations = ({ menuId }: { menuId: string }) =>
  getMenuCustomizations(menuId);

const CustomizationCard = ({
  item,
  isSelected,
  onToggle,
}: {
  item: CustomizationOption;
  isSelected: boolean;
  onToggle: () => void;
}) => {
  const image = getCustomizationImage(item.name);

  return (
    <TouchableOpacity
      onPress={onToggle}
      className={`h-[120px] items-center overflow-hidden rounded-2xl ${
        isSelected ? "bg-primary/90" : "bg-[#3C2F2F]"
      }`}
      style={{
        width: CARD_WIDTH,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: isSelected ? 0.25 : 0.1,
        shadowRadius: isSelected ? 6 : 4,
        elevation: isSelected ? 6 : 3,
      }}
      activeOpacity={0.7}
    >
      <View className="h-[75px] w-full items-center justify-center rounded-b-2xl bg-white">
        {image && (
          <Image
            source={image}
            className="h-16 w-16 scale-125"
            resizeMode="contain"
          />
        )}
      </View>

      <View className="w-full flex-row items-center justify-between px-2 py-4">
        <Text
          className="mr-1 flex-1 font-quicksand-semibold text-[12px] leading-[1.3] text-white"
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <TouchableOpacity
          onPress={onToggle}
          className={`h-5 w-5 items-center justify-center rounded-full ${
            isSelected ? "bg-success" : "bg-[#EF2A39]"
          }`}
          activeOpacity={0.8}
        >
          {!isSelected && (
            <Image source={images.plus} className="h-3 w-3" tintColor="white" />
          )}
          {isSelected && (
            <Image
              source={images.check}
              className="h-3 w-3"
              tintColor="white"
            />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <View className="flex-row items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Image
          key={star}
          source={images.star}
          className="h-4 w-4"
          tintColor={star <= rating ? "#FE8C00" : "#D1D5DB"}
        />
      ))}
      <Text className="paragraph-semibold ml-2 text-[#878787]">{rating}/5</Text>
    </View>
  );
};

const Details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    CartCustomization[]
  >([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [isFirstItem, setIsFirstItem] = useState(false);
  const insets = useSafeAreaInsets();

  const { data: menuItem, loading: menuLoading } = useAppwrite<
    MenuItem,
    { menuId: string }
  >({
    fn: fetchMenuItem,
    params: { menuId: id! },
  });

  const { data: customizations, loading: customizationsLoading } = useAppwrite<
    CustomizationOption[],
    { menuId: string }
  >({
    fn: fetchCustomizations,
    params: { menuId: id! },
  });

  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (menuItem?.categories) {
        try {
          if (
            typeof menuItem.categories === "object" &&
            "$id" in menuItem.categories
          ) {
            setCategoryName(menuItem.categories.name);
          } else if (typeof menuItem.categories === "string") {
            const category = await getCategoryById(menuItem.categories);
            setCategoryName(category.name);
          }
        } catch (error) {
          console.error("Error fetching category:", error);
          setCategoryName("");
        }
      }
    };

    fetchCategoryName();
  }, [menuItem]);

  const toppings = customizations?.filter((c) => c.type === "topping") || [];
  const sides = customizations?.filter((c) => c.type === "side") || [];

  const toggleCustomization = (customization: CustomizationOption) => {
    const exists = selectedCustomizations.find(
      (c) => c.id === customization.id,
    );

    if (exists) {
      setSelectedCustomizations(
        selectedCustomizations.filter((c) => c.id !== customization.id),
      );
    } else {
      setSelectedCustomizations([
        ...selectedCustomizations,
        {
          id: customization.id,
          name: customization.name,
          price: customization.price,
          type: customization.type,
        },
      ]);
    }
  };

  const isSelected = (customizationId: string) => {
    return selectedCustomizations.some((c) => c.id === customizationId);
  };

  const calculateTotalPrice = () => {
    if (!menuItem) return 0;
    const basePrice = menuItem.price;
    const customizationsPrice = selectedCustomizations.reduce(
      (total, c) => total + c.price,
      0,
    );
    return (basePrice + customizationsPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!menuItem || quantity === 0) return;

    const isCartEmpty = useCartStore.getState().items.length === 0;

    addItem(
      {
        id: menuItem.$id,
        name: menuItem.name,
        price: menuItem.price,
        image_url: menuItem.image_url,
        customizations: selectedCustomizations,
      },
      quantity,
    );

    setShowToast(true);
    setIsFirstItem(isCartEmpty);
  };

  if (menuLoading || customizationsLoading || !menuItem) {
    return (
      <SafeAreaView className="flex-center h-full bg-white">
        <ActivityIndicator size="large" color="#FE8C00" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView className="h-full bg-white" edges={["top"]}>
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row px-5 py-4">
              <View className="flex-1 justify-start pr-3">
                <CustomHeader style="mb-7" />
                {/* Menu Item Name */}
                <Text className="h1-bold mb-2 text-dark-100">
                  {menuItem.name}
                </Text>
                {/* Category Name */}
                {categoryName && (
                  <Text className="paragraph-medium mb-3 text-[#878787]">
                    {categoryName}
                  </Text>
                )}

                {/* Rating */}
                <View className="mb-4">
                  <StarRating rating={menuItem.rating} />
                </View>

                {/* Price */}
                <Text className="mb-4 font-quicksand-bold text-2xl text-dark-100">
                  <Text className="text-2xl font-bold text-primary">$</Text>
                  {menuItem.price.toFixed(2)}
                </Text>

                {/* Calories & Protein */}
                <View className="mb-4 flex-row gap-2">
                  {/* Calories */}
                  <View className="flex-1 py-3">
                    <Text className="paragraph-medium mb-1 text-[#878787]">
                      Calories
                    </Text>
                    <Text className="font-quicksand-semibold text-lg text-dark-100">
                      {menuItem.calories} Cal
                    </Text>
                  </View>

                  {/* Protein */}
                  <View className="flex-1 py-3">
                    <Text className="paragraph-medium mb-1 text-[#878787]">
                      Protein
                    </Text>
                    <Text className="font-quicksand-semibold text-lg text-dark-100">
                      {menuItem.protein}g
                    </Text>
                  </View>
                </View>
              </View>

              {/* Menu Item Image */}
              <View className="flex-1 items-center justify-center">
                <FoodImage
                  uri={menuItem.image_url}
                  className="h-80 w-full scale-125"
                />
              </View>
            </View>

            {/* Stats Section */}
            <View className="mx-auto mb-5 w-[390px] rounded-full bg-primary/5 px-5 py-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="font-quicksand-semibold text-base text-dark-100">
                    <Text className="font-extrabold text-primary">$</Text> Free
                    Delivery
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <Image
                    source={images.clock}
                    className="h-4 w-4"
                    tintColor="#FE8C00"
                  />
                  <Text className="font-quicksand-semibold text-base text-dark-100">
                    20 - 30 mins
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <Image
                    source={images.star}
                    className="h-4 w-4"
                    tintColor="#FE8C00"
                  />
                  <Text className="font-quicksand-semibold text-base text-dark-100">
                    {menuItem.rating}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View className="mb-5 px-5">
              <Text className="font-quicksand-medium text-base leading-[1.7] text-[#6A6A6A]">
                {menuItem.description ||
                  "Delicious and freshly prepared meal with high-quality ingredients."}
              </Text>
            </View>

            {/* Toppings */}
            {toppings.length > 0 && (
              <View className="mb-6">
                <Text className="h3-bold mb-4 px-5 text-dark-100">
                  Toppings
                </Text>
                <FlatList
                  data={toppings}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                  }}
                  ItemSeparatorComponent={() => (
                    <View style={{ width: CARD_GAP }} />
                  )}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <CustomizationCard
                      item={item}
                      isSelected={isSelected(item.id)}
                      onToggle={() => toggleCustomization(item)}
                    />
                  )}
                  decelerationRate="fast"
                  snapToInterval={CARD_WIDTH + CARD_GAP}
                  snapToAlignment="start"
                />
              </View>
            )}

            {/* Side Options */}
            {sides.length > 0 && (
              <View className="mb-6">
                <Text className="h3-bold mb-4 px-5 text-dark-100">
                  Side Options
                </Text>

                <FlatList
                  data={sides}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                  }}
                  ItemSeparatorComponent={() => (
                    <View style={{ width: CARD_GAP }} />
                  )}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <CustomizationCard
                      item={item}
                      isSelected={isSelected(item.id)}
                      onToggle={() => toggleCustomization(item)}
                    />
                  )}
                  decelerationRate="fast"
                  snapToInterval={CARD_WIDTH + CARD_GAP}
                  snapToAlignment="start"
                />
              </View>
            )}
          </ScrollView>

          {/* Add to Cart Button - Fixed at Bottom */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <View
              className="w-full rounded-t-3xl bg-white px-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                paddingBottom: Math.max(insets.bottom, 16),
                paddingTop: 16,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-5 rounded-full px-5 py-3">
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-9 w-9 items-center justify-center rounded-[4px] bg-primary/5"
                  >
                    <Image
                      source={images.minus}
                      className="h-1 w-5"
                      tintColor="#FE8C00"
                    />
                  </TouchableOpacity>

                  <Text className="w-[12px] text-center font-quicksand-bold text-xl text-dark-100">
                    {quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setQuantity(quantity + 1)}
                    className="h-9 w-9 items-center justify-center rounded-[4px] bg-primary/5"
                  >
                    <Image
                      source={images.plus}
                      className="h-5 w-5"
                      tintColor="#FE8C00"
                    />
                  </TouchableOpacity>
                </View>

                <View className="flex-1 py-4 font-quicksand-bold text-[14px]">
                  <CustomButton
                    title={`Add to cart ($${calculateTotalPrice().toFixed(2)})`}
                    onPress={handleAddToCart}
                    style="px-6 py-4 rounded-[100px]"
                    leftIcon={
                      <Image
                        source={images.bag}
                        className="mr-3 h-5 w-5"
                        tintColor="white"
                      />
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <Toast
        visible={showToast}
        onClose={() => setShowToast(false)}
        isFirstItem={isFirstItem}
      />
    </>
  );
};

export default Details;
