import { MenuItem } from "@/type";
import { Image, Platform, Text, TouchableOpacity } from "react-native";

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  // image_url from Appwrite storage is already a complete URL
  // No need to append project parameter as it's already in the URL
  const imageUrl = item.image_url;

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
    >
      <Image
        source={{ uri: imageUrl }}
        className="size-32 absolute -top-10"
        resizeMode="contain"
      />
      <Text
        className="text-center base-bold mb-2 text-dark-100"
        numberOfLines={1}
      >
        {item.name}
      </Text>
      <Text className="body-regular text-gray-200 mb-4">
        From ${item.price}
      </Text>
      <TouchableOpacity onPress={() => {}}>
        <Text className="paragraph-bold text-primary">Add to cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MenuCard;
