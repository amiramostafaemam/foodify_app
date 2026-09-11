import PopularMealCard from "@/components/home/PopularMealCard";
import { MenuItem } from "@/type";
import { useState } from "react";
import { Dimensions, FlatList, View } from "react-native";

const { width } = Dimensions.get("window");
// Gutter === gap so a snapped card is centred with white on both sides and the
// next card sits exactly off-screen (no peek). 20 matches the rest of Home.
const SIDE = 20;
const GAP = 20;
const CARD_W = width - SIDE * 2;
const SNAP = CARD_W + GAP;

const badgeFor = (item: MenuItem, index: number) => {
  if (index === 0)
    return { labelKey: "home.bestseller" as const, tone: "primary" as const };
  if ((item.rating ?? 0) >= 4.5)
    return { labelKey: "home.popular" as const, tone: "accent" as const };
  return undefined;
};

const PopularMealsCarousel = ({ data }: { data: MenuItem[] }) => {
  const [index, setIndex] = useState(0);

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.$id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SIDE }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / SNAP))
        }
        renderItem={({ item, index: i }) => (
          <View style={{ width: CARD_W }}>
            <PopularMealCard item={item} badge={badgeFor(item, i)} />
          </View>
        )}
      />

      {data.length > 1 ? (
        <View className="mt-4 flex-row justify-center gap-1.5">
          {data.map((m, i) => (
            <View
              key={m.$id}
              className={
                i === index
                  ? "h-1.5 w-5 rounded-full bg-primary"
                  : "h-1.5 w-1.5 rounded-full bg-line/20"
              }
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default PopularMealsCarousel;
