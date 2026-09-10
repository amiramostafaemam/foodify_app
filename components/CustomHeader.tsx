// components/CustomHeader.tsx
import { useColors } from "@/hooks/useColors";
import { CustomHeaderProps } from "@/type";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

const CustomHeader = ({ title, style }: CustomHeaderProps) => {
  const router = useRouter();
  const c = useColors();

  return (
    <View className={`custom-header ${style || ""}`}>
      <TouchableOpacity
        onPress={() => router.back()}
        hitSlop={10}
        className="h-10 w-10 items-center justify-center rounded-full bg-surface"
      >
        <ChevronLeft size={22} color={c.content} />
      </TouchableOpacity>

      {title && <Text className="h3-bold mb-0 text-content">{title}</Text>}

      <View className="h-10 w-10" />
    </View>
  );
};

export default CustomHeader;
