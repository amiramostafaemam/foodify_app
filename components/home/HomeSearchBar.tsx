import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";

/** A launcher — tapping it opens the Search screen with the keyboard up. */
const HomeSearchBar = () => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => router.push("/search?focus=1")}
    className="h-14 flex-row items-center gap-3 rounded-2xl bg-surface px-4"
  >
    <Search size={20} color="#9AA0A6" />
    <Text className="paragraph-medium text-muted">
      Search meals, restaurants…
    </Text>
  </TouchableOpacity>
);

export default HomeSearchBar;
