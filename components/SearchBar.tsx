import { router, useLocalSearchParams } from "expo-router";
import { Search, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [value, setValue] = useState(params.query ?? "");

  // Debounced live search — the results list refetches whenever the query param
  // changes, so results appear as you type.
  useEffect(() => {
    const id = setTimeout(() => {
      router.setParams({ query: value.trim() || undefined });
    }, 300);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <View className="h-14 flex-row items-center gap-3 rounded-2xl bg-surface px-4">
      <Search size={20} color="#878787" />
      <TextInput
        className="flex-1 font-quicksand-medium text-base text-content"
        placeholder="Search for pizzas, burgers…"
        value={value}
        onChangeText={setValue}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        placeholderTextColor="#A0A0A0"
      />
      {value.length > 0 ? (
        <TouchableOpacity onPress={() => setValue("")} hitSlop={8}>
          <View className="h-6 w-6 items-center justify-center rounded-full bg-muted">
            <X size={13} color="#fff" strokeWidth={3} />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchBar;
