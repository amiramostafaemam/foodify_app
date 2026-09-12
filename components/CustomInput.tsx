import { useColors } from "@/hooks/useColors";
import { CustomInputProps } from "@/type";
import cn from "clsx";
import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";

const FloatingLabelInput = ({
  placeholder,
  value,
  onChangeText,
  label,
  icon: Icon,
  secureTextEntry = false,
  keyboardType = "default",
  containerStyle,
  inputStyle,
}: CustomInputProps & { icon?: LucideIcon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);
  const c = useColors();

  const floated = isFocused || value.length > 0;
  const anim = useAnimatedValue(floated ? 1 : 0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: floated ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [floated, anim]);

  const labelColor = isFocused ? "#FE8C00" : c.muted;

  return (
    <View className={cn("w-full", containerStyle)}>
      <View
        className={cn("flex-row items-center gap-2.5 rounded-xl bg-surface px-3.5")}
        style={{
          height: 52,
          borderWidth: 1.5,
          borderColor: isFocused ? "#FE8C00" : "transparent",
        }}
      >
        {Icon ? <Icon size={17} color={labelColor} /> : null}

        <View className="flex-1 justify-center">
          <Animated.Text
            pointerEvents="none"
            className="font-quicksand-semibold"
            style={{
              position: "absolute",
              color: labelColor,
              top: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 5] }),
              fontSize: anim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] }),
            }}
          >
            {label}
          </Animated.Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={keyboardType}
            placeholder={floated ? placeholder : ""}
            placeholderTextColor={c.muted}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={hidden}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="font-quicksand-bold text-[15px] text-content"
            style={[{ marginTop: floated ? 13 : 0, padding: 0 }, inputStyle]}
          />
        </View>

        {secureTextEntry ? (
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
        ) : null}
      </View>
    </View>
  );
};

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

  if (variant === "floating") {
    return (
      <FloatingLabelInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        label={label}
        icon={Icon}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        containerStyle={containerStyle}
        inputStyle={inputStyle}
      />
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

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            {hidden ? (
              <EyeOff size={20} color={c.muted} />
            ) : (
              <Eye size={20} color={c.muted} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default CustomInput;
