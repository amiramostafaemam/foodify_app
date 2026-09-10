import { CustomInputProps } from "@/type";
import cn from "clsx";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const CustomInput = ({
  placeholder = "Enter Text",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
  containerStyle,
  inputStyle,
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View className="w-full">
      {label && <Text className="label">{label}</Text>}

      <View className="relative w-full">
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "input",
            secureTextEntry && "pr-12",
            isFocused ? "border-primary" : "border-gray-300",
            containerStyle,
          )}
          style={inputStyle}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            className="absolute bottom-0 right-3 top-0 justify-center"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            {hidden ? (
              <EyeOff size={20} color="#878787" />
            ) : (
              <Eye size={20} color="#878787" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInput;
