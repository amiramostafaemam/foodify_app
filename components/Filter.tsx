import { useT } from "@/lib/i18n";
import { Category } from "@/type";
import cn from "clsx";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";

const Filter = ({ categories }: { categories: Category[] }) => {
  const tr = useT();
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || "");

  const handlePress = (id: string) => {
    setActive(id);

    if (id === "all") router.setParams({ category: undefined });
    else router.setParams({ category: id });
  };

  const allLabel = tr("search.all");
  const filterData: (Category | { $id: string; name: string })[] = categories
    ? [{ $id: "all", name: allLabel }, ...categories]
    : [{ $id: "all", name: allLabel }];

  return (
    <FlatList
      data={filterData}
      keyExtractor={(item) => item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.$id}
          className={cn(
            "mr-2 rounded-full px-5 py-2.5",
            active === item.$id ? "bg-primary" : "bg-surface",
          )}
          onPress={() => handlePress(item.$id)}
        >
          <Text
            className={cn(
              "font-quicksand-semibold text-sm",
              active === item.$id ? "text-white" : "text-muted",
            )}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};
export default Filter;
