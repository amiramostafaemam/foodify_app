import { Category } from "@/type";
import cn from "clsx";
import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity } from "react-native";

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
      contentContainerStyle={{ gap: 10, paddingRight: 8 }}
      renderItem={({ item, index }) => {
        const active = index === 0;
        return (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => open(item)}
            className={cn(
              "rounded-full border px-5 py-2.5",
              active ? "border-primary bg-primary" : "border-gray-200 bg-white",
            )}
          >
            <Text
              className={cn(
                "font-quicksand-semibold text-sm",
                active ? "text-white" : "text-gray-100",
              )}
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
