import { Image } from "@/components/CachedImage";
import CategoryStrip from "@/components/home/CategoryStrip";
import ExclusiveOfferBanner from "@/components/home/ExclusiveOfferBanner";
import HomeHeader from "@/components/home/HomeHeader";
import HomeSearchBar from "@/components/home/HomeSearchBar";
import PopularMealsCarousel from "@/components/home/PopularMealsCarousel";
import PromoCarousel from "@/components/home/PromoCarousel";
import { useT } from "@/lib/i18n";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import useAuthStore from "@/store/auth.store";
import { Category, GetMenuParams, MenuItem } from "@/type";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
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
  action,
  onSeeAll,
}: {
  title: string;
  action: string;
  onSeeAll: () => void;
}) => (
  <View className="mb-4 flex-row items-center justify-between px-5">
    <Text className="h3-bold text-content">{title}</Text>
    <TouchableOpacity onPress={onSeeAll} hitSlop={8}>
      <Text className="paragraph-bold text-primary">{action} →</Text>
    </TouchableOpacity>
  </View>
);

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const tr = useT();

  const { data: categories, refetch: refetchCategories } = useAppwrite<
    Category[],
    Record<string, never>
  >({
    fn: getCategories,
    params: {} as Record<string, never>,
  });

  const {
    data: menu,
    loading,
    refetch: refetchMenu,
  } = useAppwrite<MenuItem[], GetMenuParams>({
    fn: getMenu,
    params: {},
  });

  // Ratings (and anything else) can change elsewhere in the app — re-pull
  // menu/categories each time this tab regains focus rather than only once
  // on first mount, so the numbers shown here don't go stale for the rest
  // of the session.
  useFocusEffect(
    useCallback(() => {
      refetchMenu();
      refetchCategories();
    }, [refetchMenu, refetchCategories]),
  );

  const popular = (menu ?? []).slice(0, 6);

  // Warm the image cache for the whole menu as soon as it's fetched, not
  // just the 6 cards actually rendered here — Search reuses the same
  // items/URLs right after, so by the time someone taps into it the
  // pictures are typically already on disk instead of loading cold.
  useEffect(() => {
    const urls = (menu ?? [])
      .map((item) => item.image_url)
      .filter((url): url is string => !!url);
    if (urls.length) Image.prefetch(urls, "memory-disk");
  }, [menu]);

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
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
              title={tr("home.popularMeals")}
              action={tr("common.viewAll")}
              onSeeAll={() => router.push("/search")}
            />
            {loading && popular.length === 0 ? (
              <ActivityIndicator color="#FE8C00" className="ml-5" />
            ) : popular.length === 0 ? (
              <Text className="px-5 font-quicksand text-muted">
                {tr("home.noMeals")}
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
