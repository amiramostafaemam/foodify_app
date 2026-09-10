import { images } from "@/constants";
import { MenuItem } from "@/type";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MenuCard = ({ item }: { item: MenuItem }) => {
  const { $id, image_url, name, price } = item;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const imageUrl = image_url || "";

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handlePress = () => {
    router.push({
      pathname: "/details/[id]",
      params: { id: $id },
    });
  };

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
      onPress={handlePress}
    >
      <View className="flex-center absolute -top-10 size-32">
        {imageLoading && !imageError && (
          <ActivityIndicator
            size="small"
            color="#FE8C00"
            className="absolute"
          />
        )}
        {imageError ? (
          <Image
            source={images.emptyState}
            className="size-32"
            resizeMode="contain"
          />
        ) : (
          <Image
            source={{ uri: imageUrl }}
            className="size-32"
            resizeMode="contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </View>
      <Text
        className="base-bold mb-2 text-center text-dark-100"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="body-regular mb-4 text-gray-200">From ${price}</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text className="paragraph-bold text-primary">View Details</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MenuCard;
