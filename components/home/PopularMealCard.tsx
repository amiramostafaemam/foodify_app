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
      className="home-card w-64 overflow-hidden"
    >
      <View className="relative">
        <FoodImage
          uri={item.image_url}
          className="h-44 w-full bg-primary/5"
          contentFit="cover"
        />

        {badge ? (
          <View
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1",
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
        ) : null}

        <TouchableOpacity
          onPress={() => setLiked((v) => !v)}
          hitSlop={8}
          className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm shadow-black/10"
        >
          <Heart
            size={15}
            color={liked ? "#F14141" : "#878787"}
            fill={liked ? "#F14141" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <Text
            className="paragraph-bold flex-1 pr-2 text-dark-100"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View className="flex-row items-center gap-1">
            <Star size={12} color="#FFC738" fill="#FFC738" />
            <Text className="body-medium text-gray-100">
              {item.rating?.toFixed(1) ?? "4.5"}
            </Text>
          </View>
        </View>

        <Text className="body-regular mt-1 text-gray-100" numberOfLines={1}>
          {item.description || "Freshly prepared, delivered hot."}
        </Text>

        <View className="mt-3 flex-row items-center justify-between">
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
            className="h-10 w-10 items-center justify-center rounded-full bg-primary shadow-sm shadow-primary/30"
            activeOpacity={0.85}
          >
            <Plus size={20} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PopularMealCard;
