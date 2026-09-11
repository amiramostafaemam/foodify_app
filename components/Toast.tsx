import AppModal from "@/components/AppModal";
import { useT } from "@/lib/i18n";
import { router } from "expo-router";
import { CircleCheck } from "lucide-react-native";

interface ToastProps {
  visible: boolean;
  onClose: () => void;
  isFirstItem?: boolean;
}

/** Add-to-cart confirmation. */
const Toast = ({ visible, onClose, isFirstItem = false }: ToastProps) => {
  const tr = useT();
  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      tone="success"
      icon={CircleCheck}
      title={tr(isFirstItem ? "toast.greatChoice" : "toast.added")}
      message={tr(isFirstItem ? "toast.greatChoiceMsg" : "toast.addedMsg")}
      primary={{
        label: tr("toast.reviewOrder"),
        onPress: () => {
          onClose();
          router.push("/cart");
        },
      }}
      secondary={{
        label: tr("toast.keepBrowsing"),
        onPress: () => {
          onClose();
          router.back();
        },
      }}
    />
  );
};

export default Toast;
