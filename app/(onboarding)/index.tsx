// app/(onboarding)/index.tsx
import { onboardingSlides } from "@/constants/onboarding";
import { useT } from "@/lib/i18n";
import { setOnboardingSeen } from "@/lib/onboarding";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const tr = useT();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);

  const isLast = index === onboardingSlides.length - 1;

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    await setOnboardingSeen();
    router.replace("/(auth)/sign-in");
  };

  const next = () => {
    if (isLast) finish();
    else listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top", "bottom"]}>
      <View className="h-12 flex-row items-center justify-end px-6">
        {!isLast && (
          <TouchableOpacity onPress={finish} hitSlop={8} activeOpacity={0.7}>
            <Text className="font-quicksand-semibold text-muted">
              {tr("onb.skip")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={listRef}
        data={onboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        scrollEnabled={!busy}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center px-8 pt-4">
            <View className="h-[300px] w-[300px] items-center justify-center rounded-[44px] bg-primary/5">
              <Image
                source={item.image}
                className="h-[210px] w-[210px]"
                resizeMode="contain"
              />
            </View>
            <Text className="mt-12 text-center font-quicksand-bold text-[26px] text-content">
              {tr(`onb.${item.id}.title` as Parameters<typeof tr>[0])}
            </Text>
            <Text className="mt-3 text-center font-quicksand-medium text-base leading-[1.6] text-muted">
              {tr(`onb.${item.id}.desc` as Parameters<typeof tr>[0])}
            </Text>
          </View>
        )}
      />

      <View className="px-8 pb-4">
        <View className="mb-8 flex-row justify-center gap-2">
          {onboardingSlides.map((s, i) => (
            <View
              key={s.id}
              className={
                i === index
                  ? "h-2 w-7 rounded-full bg-primary"
                  : "h-2 w-2 rounded-full bg-line/15"
              }
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={next}
          disabled={busy}
          activeOpacity={0.85}
          className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
        >
          <Text className="font-quicksand-bold text-lg text-white">
            {isLast ? tr("onb.getStarted") : tr("onb.next")}
          </Text>
          <ArrowRight size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
