// app/(onboarding)/index.tsx
import { onboardingSlides } from "@/constants/onboarding";
import { useT } from "@/lib/i18n";
import { setOnboardingSeen } from "@/lib/onboarding";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const PHOTO_H = height * 0.44;

export default function Onboarding() {
  const tr = useT();
  const listRef = useRef<Animated.FlatList<(typeof onboardingSlides)[number]>>(
    null,
  );
  const scrollX = useAnimatedValue(0);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);

  const slide = onboardingSlides[index];
  const isLast = index === onboardingSlides.length - 1;
  const fg = slide.dark ? "#FFFFFF" : "#181C2E";
  const fgMuted = slide.dark ? "rgba(255,255,255,0.72)" : "#878787";
  const dotInactive = slide.dark ? "rgba(255,255,255,0.25)" : "rgba(24,28,46,0.12)";

  // Background morphs continuously with the drag, not just once you land on
  // a slide — this is what actually sells the "floating on the page"
  // feeling, since the photo's own background and the screen's background
  // are the same colour at every point along the swipe, not just at rest.
  const bgColor = scrollX.interpolate({
    inputRange: onboardingSlides.map((_, i) => i * width),
    outputRange: onboardingSlides.map((s) => s.bg),
  });

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
    <View className="flex-1">
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]}
      />

      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="h-12 flex-row items-center justify-end px-6">
          {!isLast && (
            <TouchableOpacity onPress={finish} hitSlop={8} activeOpacity={0.7}>
              <Text
                className="font-quicksand-semibold"
                style={{ color: fgMuted }}
              >
                {tr("onb.skip")}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Animated.FlatList
          ref={listRef}
          data={onboardingSlides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          scrollEnabled={!busy}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item }) => (
            <View style={{ width }} className="flex-1 items-center pt-2">
              {/* Full width, nothing cropped — "contain" shows the whole
                  photo, and because the screen behind it now matches the
                  photo's own background colour, there's no visible seam:
                  it just reads as floating on the page. */}
              <Image
                source={item.image}
                style={{ width, height: PHOTO_H }}
                resizeMode="contain"
              />

              <Text
                className="mt-8 px-8 text-center font-quicksand-bold text-[26px]"
                style={{ color: fg }}
              >
                {tr(`onb.${item.id}.title` as Parameters<typeof tr>[0])}
              </Text>
              <Text
                className="mt-3 px-10 text-center font-quicksand-medium text-base leading-[1.6]"
                style={{ color: fgMuted }}
              >
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
                className="h-2 rounded-full"
                style={{
                  width: i === index ? 28 : 8,
                  backgroundColor: i === index ? "#FE8C00" : dotInactive,
                }}
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
    </View>
  );
}
