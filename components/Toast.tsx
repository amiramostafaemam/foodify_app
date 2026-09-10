import { images } from "@/constants";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ToastProps {
  visible: boolean;
  onClose: () => void;
  isFirstItem?: boolean;
}

const Toast = ({ visible, onClose, isFirstItem = false }: ToastProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 24,
            width: "100%",
            maxWidth: 380,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Success Icon */}
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#10B981",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginBottom: 16,
            }}
          >
            <Image
              source={images.check}
              style={{ width: 32, height: 32 }}
              tintColor="white"
            />
          </View>

          {/* Success Message */}
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Quicksand-Bold",
              color: "#1F2937",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {isFirstItem ? "Great Choice ! " : "Taste Upgraded ! "}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: "Quicksand-Medium",
              color: "#6B7280",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            {isFirstItem
              ? "Your first pick looks amazing !"
              : "Your cart is getting tastier !"}
          </Text>

          {/* Buttons */}
          <View style={{ gap: 12 }}>
            {/* View Cart Button */}
            <TouchableOpacity
              onPress={() => {
                onClose();
                router.push("/cart");
              }}
              style={{
                backgroundColor: "#FE8C00",
                paddingVertical: 14,
                paddingHorizontal: 24,
                borderRadius: 100,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              activeOpacity={0.8}
            >
              <Image
                source={images.bag}
                style={{ width: 20, height: 20 }}
                tintColor="white"
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontFamily: "Quicksand-Bold",
                }}
              >
                Review Order
              </Text>
            </TouchableOpacity>

            {/* Continue Shopping Button */}
            <TouchableOpacity
              onPress={() => {
                onClose();
                router.back();
              }}
              style={{
                backgroundColor: "#F3F4F6",
                paddingVertical: 14,
                paddingHorizontal: 24,
                borderRadius: 100,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: "#1F2937",
                  fontSize: 16,
                  fontFamily: "Quicksand-SemiBold",
                }}
              >
                Order More
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default Toast;
