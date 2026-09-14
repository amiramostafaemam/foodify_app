import { Star } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface Props {
  rating: number;
  size?: number;
  /** Present only for the interactive picker in the review form — a plain
   * display rating (an item's average, a past review) omits it. */
  onChange?: (value: number) => void;
}

/** Five stars, filled up to `rating` (rounded). Read-only unless `onChange`
 * is given, in which case each star becomes a tap target — one component
 * for both the display and the picker use, since they're the same five
 * shapes either way. */
const StarRating = ({ rating, size = 16, onChange }: Props) => {
  const rounded = Math.round(rating);
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <TouchableOpacity key={n} onPress={() => onChange(n)} hitSlop={4}>
            <Star
              size={size}
              color="#FFC738"
              fill={n <= rounded ? "#FFC738" : "transparent"}
            />
          </TouchableOpacity>
        ) : (
          <Star
            key={n}
            size={size}
            color="#FFC738"
            fill={n <= rounded ? "#FFC738" : "transparent"}
          />
        ),
      )}
    </View>
  );
};

export default StarRating;
