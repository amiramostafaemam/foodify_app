import CategoryStrip from "@/components/home/CategoryStrip";
import ExclusiveOfferBanner from "@/components/home/ExclusiveOfferBanner";
import HomeHeader from "@/components/home/HomeHeader";
import HomeSearchBar from "@/components/home/HomeSearchBar";
import PopularMealsCarousel from "@/components/home/PopularMealsCarousel";
import PromoCarousel from "@/components/home/PromoCarousel";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import useAuthStore from "@/store/auth.store";
import { Category, GetMenuParams, MenuItem } from "@/type";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SectionHeader = ({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll: () => void;
}) => (
  <View className="mb-4 flex-row items-center justify-between px-5">
    <Text className="h3-bold text-content">{title}</Text>
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

  const popular = (menu ?? []).slice(0, 6);

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
          <PromoCarousel />
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
              <Text className="px-5 font-quicksand text-muted">
                No meals yet — seed the menu to see them here.
              </Text>
            ) : (
              <PopularMealsCarousel data={popular} />
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
