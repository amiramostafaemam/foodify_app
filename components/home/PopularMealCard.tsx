import FavoriteButton from "@/components/FavoriteButton";
import FoodImage from "@/components/FoodImage";
import { useLocalize, useT } from "@/lib/i18n";
import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import cn from "clsx";
import { router } from "expo-router";
import { Plus, Star } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: MenuItem;
  badge?: {
    labelKey: "home.bestseller" | "home.popular";
    tone: "primary" | "accent";
  };
}

const PopularMealCard = ({ item, badge }: Props) => {
  const addItem = useCartStore((s) => s.addItem);
  const tr = useT();
  const loc = useLocalize();
  const name = loc(item.name, item.name_ar);
  const description = loc(item.description, item.description_ar);

  const open = () =>
    router.push({ pathname: "/details/[id]", params: { id: item.$id } });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={open}
      className="home-card w-full overflow-hidden"
    >
      <View className="relative">
        <FoodImage
          uri={item.image_url}
          className="h-52 w-full bg-primary/5"
          contentFit="cover"
        />

        {badge ? (
          <View
            className={cn(
              "absolute left-3.5 top-3.5 rounded-full px-3 py-1",
              badge.tone === "primary" ? "bg-primary" : "bg-accent",
            )}
          >
            <Text
              className={cn(
                "font-quicksand-bold text-[11px]",
                badge.tone === "primary" ? "text-white" : "text-content",
              )}
            >
              {tr(badge.labelKey)}
            </Text>
          </View>
        ) : null}

        <View className="absolute right-3.5 top-3.5">
          <FavoriteButton
            item={{
              id: item.$id,
              kind: "menu",
              name,
              image: item.image_url,
              price: item.price,
            }}
            size={16}
          />
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <Text
            className="h3-bold flex-1 pr-2 text-content"
            numberOfLines={1}
          >
            {name}
          </Text>
          <View className="flex-row items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5">
            <Star size={12} color="#FFC738" fill="#FFC738" />
            <Text className="font-quicksand-bold text-xs text-content">
              {item.rating?.toFixed(1) ?? "4.5"}
            </Text>
          </View>
        </View>

        <Text className="body-regular mt-1 text-muted" numberOfLines={1}>
          {description || tr("details.defaultDesc")}
        </Text>

        <View className="mt-3 flex-row items-center justify-between">
          <Text className="h2-bold text-content">
            ${item.price.toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={() =>
              addItem({
                id: item.$id,
                name,
                price: item.price,
                image_url: item.image_url,
              })
            }
            className="flex-row items-center gap-1.5 rounded-full bg-primary py-2.5 pl-4 pr-5 shadow-sm shadow-primary/30"
            activeOpacity={0.85}
          >
            <Plus size={16} color="#fff" strokeWidth={2.75} />
            <Text className="font-quicksand-bold text-sm text-white">
              {tr("common.add")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PopularMealCard;
