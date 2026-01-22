import { CustomButtonProps } from "@/type";
import cn from "clsx";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const CustomButton = ({
  onPress,
  title = "Click Me",
  style,
  textStyle,
  leftIcon,
  disabled = false,
  isLoading = false,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn("custom-btn", style)}
      disabled={disabled}
    >
      {leftIcon}
      <View className="flex-center flex-row">
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className={cn("text-white-100 paragraph-semibold", textStyle)}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
