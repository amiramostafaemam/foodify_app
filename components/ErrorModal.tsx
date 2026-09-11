import AppModal from "@/components/AppModal";
import { useT } from "@/lib/i18n";
import { TriangleAlert } from "lucide-react-native";

interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  buttonLabel?: string;
}

/** Shared error dialog — thin wrapper over the unified AppModal. */
const ErrorModal = ({
  visible,
  message,
  onClose,
  buttonLabel,
}: ErrorModalProps) => {
  const tr = useT();
  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      tone="error"
      icon={TriangleAlert}
      title={tr("common.somethingWrong")}
      message={message}
      primary={{ label: buttonLabel ?? tr("common.tryAgain"), onPress: onClose }}
    />
  );
};

export default ErrorModal;
