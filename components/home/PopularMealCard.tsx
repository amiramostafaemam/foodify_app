import FoodImage from "@/components/FoodImage";
import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import cn from "clsx";
import { router } from "expo-router";
import { Heart, Plus, Star } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: MenuItem;
  badge?: { label: string; tone: "primary" | "accent" };
}

const PopularMealCard = ({ item, badge }: Props) => {
  const addItem = useCartStore((s) => s.addItem);
  const [liked, setLiked] = useState(false);

  const open = () =>
    router.push({ pathname: "/details/[id]", params: { id: item.$id } });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={open}
      className="home-card w-48 p-3"
    >
      <View className="mb-2 flex-row items-start justify-between">
        {badge ? (
          <View
            className={cn(
              "rounded-full px-2.5 py-1",
              badge.tone === "primary" ? "bg-primary" : "bg-accent",
            )}
          >
            <Text
              className={cn(
                "font-quicksand-bold text-[10px]",
                badge.tone === "primary" ? "text-white" : "text-dark-100",
              )}
            >
              {badge.label}
            </Text>
          </View>
        ) : (
          <View />
        )}

        <TouchableOpacity onPress={() => setLiked((v) => !v)} hitSlop={8}>
          <Heart
            size={18}
            color={liked ? "#F14141" : "#878787"}
            fill={liked ? "#F14141" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <FoodImage uri={item.image_url} className="h-28 w-full" />

      <Text className="paragraph-bold mt-2 text-dark-100" numberOfLines={1}>
        {item.name}
      </Text>
      <Text className="body-regular mt-0.5 text-gray-100" numberOfLines={2}>
        {item.description || "Freshly prepared, delivered hot."}
      </Text>

      <View className="mt-2 flex-row items-center gap-1">
        <Star size={13} color="#FFC738" fill="#FFC738" />
        <Text className="body-medium text-gray-100">
          {item.rating?.toFixed(1) ?? "4.5"}
        </Text>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Text className="h3-bold text-dark-100">${item.price}</Text>
        <TouchableOpacity
          onPress={() =>
            addItem({
              id: item.$id,
              name: item.name,
              price: item.price,
              image_url: item.image_url,
            })
          }
          className="h-9 w-9 items-center justify-center rounded-full bg-primary"
          activeOpacity={0.8}
        >
          <Plus size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PopularMealCard;
