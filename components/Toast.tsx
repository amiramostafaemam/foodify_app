import AppModal from "@/components/AppModal";
import { router } from "expo-router";
import { CircleCheck } from "lucide-react-native";

interface ToastProps {
  visible: boolean;
  onClose: () => void;
  isFirstItem?: boolean;
}

/** Add-to-cart confirmation. */
const Toast = ({ visible, onClose, isFirstItem = false }: ToastProps) => (
  <AppModal
    visible={visible}
    onClose={onClose}
    tone="success"
    icon={CircleCheck}
    title={isFirstItem ? "Great choice!" : "Added to cart"}
    message={
      isFirstItem
        ? "Your first pick is in the cart — keep browsing or check out."
        : "Your cart is getting tastier. Review it or keep adding."
    }
    primary={{
      label: "Review order",
      onPress: () => {
        onClose();
        router.push("/cart");
      },
    }}
    secondary={{
      label: "Keep browsing",
      onPress: () => {
        onClose();
        router.back();
      },
    }}
  />
);

export default Toast;
