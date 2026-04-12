// app/(onboarding)/index.tsx
import { onboardingSlides } from "@/constants/onboarding";
import { setOnboardingSeen } from "@/lib/onboarding";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isNavigating = useRef(false);

  const isLastSlide = currentIndex === onboardingSlides.length - 1;

  const finishOnboarding = async () => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    await setOnboardingSeen();
    router.replace("/(auth)/sign-in");
  };

  const handleNext = () => {
    if (isLastSlide) {
      finishOnboarding();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  return (
    <View className="flex-1 bg-white">
      {!isLastSlide && (
        <TouchableOpacity
          onPress={finishOnboarding}
          className="absolute top-14 right-6 z-10"
          activeOpacity={0.7}
        >
          <Text className="text-gray-400 font-semibold">Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        scrollEnabled={!isNavigating.current}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center justify-center px-6">
            <Image
              source={item.image}
              className="w-72 h-72"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold mt-8 text-center">
              {item.title}
            </Text>
            <Text className="text-gray-400 text-center mt-3">
              {item.description}
            </Text>
          </View>
        )}
      />

      <View className="flex-row justify-center mb-6">
        {onboardingSlides.map((_, index) => (
          <View
            key={index}
            className={`h-2 mx-1 rounded-full ${
              currentIndex === index ? "w-6 bg-primary" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={handleNext}
        className="bg-primary mx-6 mb-10 py-4 rounded-full"
        activeOpacity={0.7}
        disabled={isNavigating.current}
      >
        <Text className="text-white text-center font-bold text-lg">
          {isLastSlide ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
