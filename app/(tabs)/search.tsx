import CartButton from "@/components/CartButton";
import Filter from "@/components/Filter";
import MenuCard from "@/components/MenuCard";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants";
import { getCategories, getMenu } from "@/lib/appwrite";
import { useT } from "@/lib/i18n";
import useAppwrite from "@/lib/useAppwrite";
import { Category, GetMenuParams, MenuItem } from "@/type";
import cn from "clsx";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const tr = useT();
  const { category, query } = useLocalSearchParams<{
    query?: string;
    category?: string;
  }>();

  // useAppwrite re-fetches automatically when these params change.
  const { data, loading } = useAppwrite<MenuItem[], GetMenuParams>({
    fn: getMenu,
    params: {
      category: category || undefined,
      query: query || undefined,
      limit: 12,
    },
  });

  const { data: categories } = useAppwrite<Category[], Record<string, never>>({
    fn: getCategories,
    params: {} as Record<string, never>,
  });

  return (
    <SafeAreaView className="h-full bg-canvas">
      <FlatList
        data={data || []}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;

          return (
            <View
              className={cn(
                "max-w-[48%] flex-1",
                !isFirstRightColItem ? "mt-10" : "mt-0",
              )}
            >
              <MenuCard item={item} />
            </View>
          );
        }}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 140,
          gap: 28,
        }}
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between w-full flex-row">
              <View className="flex-start">
                <Text className="small-bold uppercase text-primary">
                  {tr("search.title")}
                </Text>
                <View className="flex-start mt-0.5 flex-row gap-x-1">
                  <Text className="paragraph-semibold text-content">
                    {tr("search.subtitle")}
                  </Text>
                </View>
              </View>

              <CartButton />
            </View>

            <SearchBar />

            <Filter categories={categories!} />
          </View>
        )}
        ListEmptyComponent={() =>
          !loading && (
            <View className="flex-center px-10">
              <Image
                source={images.emptyState}
                className="h-[300px] w-[250px] scale-110"
                resizeMode="contain"
              />
              <Text className="h3-bold mb-2 text-center text-content">
                {tr("search.noResults")}
              </Text>
              <Text className="paragraph-medium text-center leading-[24px] text-muted">
                {tr("search.noResultsHint")}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Search;
