import { Image } from "@/components/CachedImage";
import { getCategoryImage } from "@/constants";
import { Category } from "@/type";
import cn from "clsx";
import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type Chip = { $id: string; name: string };

const CategoryStrip = ({ categories }: { categories: Category[] }) => {
  const data: Chip[] = [{ $id: "all", name: "All" }, ...(categories ?? [])];

  const open = (chip: Chip) =>
    router.push(
      chip.$id === "all" ? "/search" : `/search?category=${chip.$id}`,
    );

  return (
    <FlatList
      data={data}
      keyExtractor={(c) => c.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16, paddingRight: 8 }}
      renderItem={({ item, index }) => {
        const active = index === 0;
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => open(item)}
            className="w-16 items-center"
          >
            <View
              className={cn(
                "h-16 w-16 items-center justify-center rounded-full",
                active ? "bg-accent" : "bg-white shadow-sm shadow-black/5",
              )}
            >
              <Image
                source={getCategoryImage(item.name)}
                className="h-10 w-10"
                contentFit="contain"
              />
            </View>
            <Text
              className={cn(
                "mt-1.5 text-xs",
                active
                  ? "font-quicksand-bold text-dark-100"
                  : "font-quicksand-medium text-gray-100",
              )}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default CategoryStrip;
