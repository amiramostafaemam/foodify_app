import FoodImage from "@/components/FoodImage";
import { images } from "@/constants";
import { getOfferById } from "@/constants/offers.constants";
import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import {
  FavoriteItem,
  useFavoritesStore,
} from "@/store/favorites.store";
import { router } from "expo-router";
import { ChevronLeft, Heart } from "lucide-react-native";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FavRow = ({
  item,
  onOpen,
  onRemove,
}: {
  item: FavoriteItem;
  onOpen: () => void;
  onRemove: () => void;
}) => {
  const tr = useT();
  const src =
    item.kind === "offer"
      ? (getOfferById(item.id)?.image ?? item.image)
      : item.image;
  // Offer names are local content with a full translation table, so
  // re-derive them live from the current language instead of the frozen
  // snapshot taken when the offer was favorited (menu items come from
  // Appwrite and would need a live re-fetch, so those stay a snapshot).
  const displayName =
    item.kind === "offer" && getOfferById(item.id)
      ? tr(`offerData.${item.id}.title` as Parameters<typeof tr>[0])
      : item.name;
  return (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onOpen}
    className="flex-row items-center gap-3 rounded-2xl bg-surface p-3"
  >
    <FoodImage
      uri={src}
      contentFit={item.kind === "offer" ? "contain" : "cover"}
      className="h-16 w-16 rounded-xl bg-card"
    />
    <View className="flex-1">
      <Text className="paragraph-bold text-content" numberOfLines={1}>
        {displayName}
      </Text>
      <Text className="body-regular mt-0.5 text-muted">
        {item.kind === "offer" ? tr("fav.deal") : tr("fav.meal")}
      </Text>
      <Text className="paragraph-bold mt-0.5 text-primary">
        ${item.price.toFixed(2)}
      </Text>
    </View>
    <TouchableOpacity
      onPress={onRemove}
      hitSlop={10}
      className="h-9 w-9 items-center justify-center rounded-full bg-card shadow-sm shadow-black/10"
    >
      <Heart size={16} color="#F14141" fill="#F14141" />
    </TouchableOpacity>
  </TouchableOpacity>
  );
};

const Favorites = () => {
  const items = useFavoritesStore((s) => s.items);
  const remove = useFavoritesStore((s) => s.remove);
  const clear = useFavoritesStore((s) => s.clear);
  const c = useColors();
  const tr = useT();

  const open = (item: FavoriteItem) =>
    router.push(
      item.kind === "offer"
        ? { pathname: "/offer-details/[id]", params: { id: item.id } }
        : { pathname: "/details/[id]", params: { id: item.id } },
    );

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-2">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface"
          >
            <ChevronLeft size={22} color={c.content} />
          </TouchableOpacity>
          <Text className="h3-bold text-content">{tr("fav.title")}</Text>
        </View>

        {items.length > 0 && (
          <TouchableOpacity onPress={clear} hitSlop={8}>
            <Text className="paragraph-bold text-primary">
              {tr("common.clearAll")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(f) => f.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        ItemSeparatorComponent={() => <View className="h-2" />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FavRow
            item={item}
            onOpen={() => open(item)}
            onRemove={() => remove(item.id)}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-8">
            <Image
              source={images.emptyState}
              className="mb-5 h-56 w-56"
              resizeMode="contain"
            />
            <Text className="h3-bold text-content">{tr("fav.empty")}</Text>
            <Text className="body-regular mt-2 text-center text-muted">
              {tr("fav.emptyHint")}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Favorites;
