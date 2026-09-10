import AppModal from "@/components/AppModal";
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
  buttonLabel = "Try Again",
}: ErrorModalProps) => (
  <AppModal
    visible={visible}
    onClose={onClose}
    tone="error"
    icon={TriangleAlert}
    title="Something went wrong"
    message={message}
    primary={{ label: buttonLabel, onPress: onClose }}
  />
);

export default ErrorModal;
