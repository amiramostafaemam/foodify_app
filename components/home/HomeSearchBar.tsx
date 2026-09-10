import { router } from "expo-router";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

const HomeSearchBar = () => (
  <View className="flex-row items-center gap-3">
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push("/search")}
      className="h-14 flex-1 flex-row items-center gap-3 rounded-2xl bg-white px-4 shadow-sm shadow-black/5"
    >
      <Search size={20} color="#878787" />
      <Text className="paragraph-medium text-gray-100">
        Search your favorite meal…
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push("/search")}
      className="h-14 w-14 items-center justify-center rounded-2xl bg-primary"
    >
      <SlidersHorizontal size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default HomeSearchBar;
