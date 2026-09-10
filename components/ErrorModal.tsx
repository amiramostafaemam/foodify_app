import { useEffect } from "react";
import {
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";

interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  buttonLabel?: string;
}

/**
 * Shared error dialog: pops in with a spring + shake. The animation lives on a
 * bare Animated.View (no className) so NativeWind's css-interop never tries to
 * "upgrade" it — that path crashes when the subtree contains an <Link>.
 */
const ErrorModal = ({
  visible,
  message,
  onClose,
  buttonLabel = "Try Again",
}: ErrorModalProps) => {
  const scaleAnim = useAnimatedValue(0);
  const shakeAnim = useAnimatedValue(0);

  useEffect(() => {
    if (!visible) {
      scaleAnim.setValue(0);
      shakeAnim.setValue(0);
      return;
    }

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.sequence(
        [10, -10, 10, 0].map((toValue) =>
          Animated.timing(shakeAnim, {
            toValue,
            duration: 100,
            useNativeDriver: true,
          }),
        ),
      ),
    ]).start();
  }, [visible, scaleAnim, shakeAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
          }}
        >
          <View className="w-full max-w-sm items-center rounded-3xl bg-white p-8 shadow-2xl">
            <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <Text className="text-5xl">❌</Text>
            </View>

            <Text className="mb-3 text-center font-quicksand-bold text-2xl text-error">
              Error
            </Text>
            <Text className="mb-6 text-center font-quicksand text-base text-gray-100">
              {message}
            </Text>

            <TouchableOpacity
              onPress={onClose}
              className="w-full items-center rounded-xl bg-error py-4"
              activeOpacity={0.8}
            >
              <Text className="base-bold text-white">{buttonLabel}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ErrorModal;
