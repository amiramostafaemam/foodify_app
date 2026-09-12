import FoodImage from "@/components/FoodImage";
import { useLocalize, useT } from "@/lib/i18n";
import { MenuItem } from "@/type";
import { router } from "expo-router";
import { Platform, Text, TouchableOpacity, View } from "react-native";

const MenuCard = ({ item }: { item: MenuItem }) => {
  const tr = useT();
  const loc = useLocalize();
  const { $id, image_url, name, name_ar, price } = item;
  const displayName = loc(name, name_ar);

  const openDetails = () =>
    router.push({ pathname: "/details/[id]", params: { id: $id } });

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
      onPress={openDetails}
      activeOpacity={0.85}
    >
      <View className="flex-center absolute -top-10 size-32">
        <FoodImage uri={image_url} className="size-32" />
      </View>

      <Text
        className="base-bold mb-2 text-center text-content"
        numberOfLines={1}
      >
        {displayName}
      </Text>
      <Text className="body-regular mb-4 text-muted">
        {tr("search.fromPrice", { price })}
      </Text>
      <Text className="paragraph-bold text-primary">
        {tr("search.viewDetails")}
      </Text>
    </TouchableOpacity>
  );
};

export default MenuCard;
