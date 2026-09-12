import { useColors } from "@/hooks/useColors";
import { CustomInputProps } from "@/type";
import cn from "clsx";
import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const CustomInput = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  label,
  icon: Icon,
  secureTextEntry = false,
  keyboardType = "default",
  containerStyle,
  inputStyle,
  variant = "filled",
}: CustomInputProps & { icon?: LucideIcon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);
  const c = useColors();

  const visibilityToggle = secureTextEntry ? (
    <TouchableOpacity
      onPress={() => setHidden((h) => !h)}
      hitSlop={10}
      accessibilityLabel={hidden ? "Show password" : "Hide password"}
    >
      {hidden ? (
        <EyeOff size={18} color={c.muted} />
      ) : (
        <Eye size={18} color={c.muted} />
      )}
    </TouchableOpacity>
  ) : null;

  if (variant === "underline") {
    return (
      <View className={cn("w-full", containerStyle)}>
        <View
          className={cn(
            "flex-row items-center gap-2.5 border-b pb-2.5",
            isFocused ? "border-primary" : "border-line/20",
          )}
        >
          {Icon ? (
            <Icon size={17} color={isFocused ? "#FE8C00" : c.muted} />
          ) : null}

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={keyboardType}
            placeholder={label || placeholder}
            placeholderTextColor={c.muted}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={hidden}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 py-1 font-quicksand-medium text-base text-content"
            style={inputStyle}
          />

          {visibilityToggle}
        </View>
      </View>
    );
  }

  return (
    <View className={cn("w-full", containerStyle)}>
      {label ? (
        <Text className="mb-1.5 pl-1 font-quicksand-medium text-sm text-muted">
          {label}
        </Text>
      ) : null}

      <View
        className={cn(
          "flex-row items-center gap-2.5 rounded-2xl border-2 bg-surface px-4",
          isFocused ? "border-primary" : "border-transparent",
        )}
      >
        {Icon ? (
          <Icon size={18} color={isFocused ? "#FE8C00" : c.muted} />
        ) : null}

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={c.muted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 py-4 font-quicksand-medium text-base text-content"
          style={inputStyle}
        />

        {visibilityToggle}
      </View>
    </View>
  );
};

export default CustomInput;
