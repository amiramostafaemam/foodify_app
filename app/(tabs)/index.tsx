import CategoryStrip from "@/components/home/CategoryStrip";
import ExclusiveOfferBanner from "@/components/home/ExclusiveOfferBanner";
import HomeHeader from "@/components/home/HomeHeader";
import HomeSearchBar from "@/components/home/HomeSearchBar";
import PopularMealCard from "@/components/home/PopularMealCard";
import PromoCarousel from "@/components/home/PromoCarousel";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import useAuthStore from "@/store/auth.store";
import { Category, GetMenuParams, MenuItem } from "@/type";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const badgeFor = (item: MenuItem, index: number) => {
  if (index === 0) return { label: "Bestseller", tone: "primary" as const };
  if ((item.rating ?? 0) >= 4.5)
    return { label: "Popular", tone: "accent" as const };
  return undefined;
};

const SectionHeader = ({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll: () => void;
}) => (
  <View className="mb-4 flex-row items-center justify-between px-5">
    <Text className="h3-bold text-dark-100">{title}</Text>
    <TouchableOpacity onPress={onSeeAll} hitSlop={8}>
      <Text className="paragraph-bold text-primary">View All →</Text>
    </TouchableOpacity>
  </View>
);

export default function Home() {
  const user = useAuthStore((s) => s.user);

  const { data: categories } = useAppwrite<Category[], Record<string, never>>({
    fn: getCategories,
    params: {} as Record<string, never>,
  });

  const { data: menu, loading } = useAppwrite<MenuItem[], GetMenuParams>({
    fn: getMenu,
    params: {},
  });

  const popular = (menu ?? []).slice(0, 8);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        <View className="gap-6 pt-2">
          <View className="px-5">
            <HomeHeader name={user?.name} />
          </View>
          <View className="px-5">
            <HomeSearchBar />
          </View>
          <View className="px-5">
            <PromoCarousel />
          </View>
          <View className="pl-5">
            <CategoryStrip categories={categories ?? []} />
          </View>

          <View>
            <SectionHeader
              title="Popular Meals"
              onSeeAll={() => router.push("/search")}
            />
            {loading && popular.length === 0 ? (
              <ActivityIndicator color="#FE8C00" className="ml-5" />
            ) : popular.length === 0 ? (
              <Text className="px-5 font-quicksand text-gray-100">
                No meals yet — seed the menu to see them here.
              </Text>
            ) : (
              <FlatList
                data={popular}
                horizontal
                keyExtractor={(item) => item.$id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 14, paddingHorizontal: 20 }}
                renderItem={({ item, index }) => (
                  <PopularMealCard item={item} badge={badgeFor(item, index)} />
                )}
              />
            )}
          </View>

          <View className="px-5 pt-2">
            <ExclusiveOfferBanner />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
