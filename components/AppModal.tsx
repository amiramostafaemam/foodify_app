import cn from "clsx";
import { type LucideIcon } from "lucide-react-native";
import { useEffect } from "react";
import {
  Animated,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";

type Tone = "primary" | "success" | "error";

interface Action {
  label: string;
  onPress: () => void;
}

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  tone?: Tone;
  /** lucide icon shown in a tinted circle */
  icon?: LucideIcon;
  /** illustration shown instead of the icon circle */
  image?: number;
  primary: Action;
  secondary?: Action;
}

const TONE: Record<Tone, { circle: string; iconColor: string; button: string }> =
  {
    primary: {
      circle: "bg-primary/10",
      iconColor: "#FE8C00",
      button: "bg-primary",
    },
    success: {
      circle: "bg-success/10",
      iconColor: "#2F9B65",
      button: "bg-primary",
    },
    error: { circle: "bg-error/10", iconColor: "#F14141", button: "bg-error" },
  };

const AppModal = ({
  visible,
  onClose,
  title,
  message,
  tone = "primary",
  icon: Icon,
  image,
  primary,
  secondary,
}: AppModalProps) => {
  const scale = useAnimatedValue(0.9);
  const opacity = useAnimatedValue(0);
  const t = TONE[tone];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 60,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.9);
      opacity.setValue(0);
    }
  }, [visible, scale, opacity]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <Animated.View
          style={{ opacity, transform: [{ scale }], width: "100%", maxWidth: 360 }}
        >
          <View className="items-center rounded-[28px] bg-elevated p-6 shadow-2xl">
            {image ? (
              <Image
                source={image}
                className="mb-3 h-40 w-40"
                resizeMode="contain"
              />
            ) : Icon ? (
              <View
                className={cn(
                  "mb-4 h-16 w-16 items-center justify-center rounded-full",
                  t.circle,
                )}
              >
                <Icon size={28} color={t.iconColor} />
              </View>
            ) : null}

            <Text className="text-center font-quicksand-bold text-xl text-content">
              {title}
            </Text>
            {message ? (
              <Text className="mt-2 text-center font-quicksand-medium text-[15px] leading-[1.5] text-muted">
                {message}
              </Text>
            ) : null}

            <View className="mt-6 w-full gap-2.5">
              <TouchableOpacity
                onPress={primary.onPress}
                activeOpacity={0.9}
                className={cn(
                  "items-center rounded-full py-4",
                  t.button,
                )}
              >
                <Text className="font-quicksand-bold text-base text-white">
                  {primary.label}
                </Text>
              </TouchableOpacity>

              {secondary ? (
                <TouchableOpacity
                  onPress={secondary.onPress}
                  activeOpacity={0.9}
                  className="items-center rounded-full bg-surface py-4"
                >
                  <Text className="font-quicksand-bold text-base text-content">
                    {secondary.label}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AppModal;
