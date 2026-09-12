import { useLocalize, useT } from "@/lib/i18n";
import { Category } from "@/type";
import cn from "clsx";
import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity } from "react-native";

type Chip = { $id: string; name: string; name_ar?: string };

const CategoryStrip = ({ categories }: { categories: Category[] }) => {
  const tr = useT();
  const loc = useLocalize();
  const data: Chip[] = [
    { $id: "all", name: tr("search.all") },
    ...(categories ?? []),
  ];

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
              "rounded-full px-5 py-2.5",
              active ? "bg-primary" : "bg-surface",
            )}
          >
            <Text
              className={cn(
                "font-quicksand-semibold text-sm",
                active ? "text-white" : "text-muted",
              )}
            >
              {loc(item.name, item.name_ar)}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default CategoryStrip;
