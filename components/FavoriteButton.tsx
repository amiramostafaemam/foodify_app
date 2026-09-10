import type { FavoriteItem } from "@/store/favorites.store";
import { useFavoritesStore } from "@/store/favorites.store";
import { Heart } from "lucide-react-native";
import {
  Animated,
  TouchableOpacity,
  useAnimatedValue,
} from "react-native";

interface Props {
  item: FavoriteItem;
  size?: number;
  /** "overlay" = white circle for use on top of an image; "bare" = icon only */
  variant?: "overlay" | "bare";
}

const FavoriteButton = ({ item, size = 18, variant = "overlay" }: Props) => {
  const active = useFavoritesStore((s) => s.items.some((i) => i.id === item.id));
  const toggle = useFavoritesStore((s) => s.toggle);
  const scale = useAnimatedValue(1);

  const onPress = () => {
    toggle(item);
    scale.setValue(0.7);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 140,
    }).start();
  };

  const icon = (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Heart
        size={size}
        color={active ? "#F14141" : variant === "overlay" ? "#878787" : "#fff"}
        fill={active ? "#F14141" : "transparent"}
        strokeWidth={2.2}
      />
    </Animated.View>
  );

  if (variant === "bare") {
    return (
      <TouchableOpacity onPress={onPress} hitSlop={10} activeOpacity={0.7}>
        {icon}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={8}
      activeOpacity={0.85}
      className="h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm shadow-black/10"
    >
      {icon}
    </TouchableOpacity>
  );
};

export default FavoriteButton;
