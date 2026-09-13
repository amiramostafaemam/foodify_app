import CustomInput from "@/components/CustomInput";
import { checkEmailExists, requestPasswordRecovery } from "@/lib/appwrite";
import { t, useT } from "@/lib/i18n";
import { Mail, MailCheck } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const getErrorMessage = (error: unknown): string => {
  const message =
    (error as Error)?.message?.toLowerCase() || String(error).toLowerCase();
  if (message.includes("invalid") && message.includes("email")) {
    return t("auth.errInvalidEmail");
  }
  if (message.includes("network") || message.includes("failed to fetch")) {
    return t("auth.errNetwork");
  }
  if (message.includes("too_many_requests") || message.includes("rate limit")) {
    return t("auth.errRateLimit");
  }
  return (error as Error)?.message || t("auth.errGeneric");
};

const ForgotPasswordModal = ({
  visible,
  initialEmail,
  onClose,
}: {
  visible: boolean;
  initialEmail: string;
  onClose: () => void;
}) => {
  const tr = useT();
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  // Reset the form each time the modal opens. Adjusting state during render
  // (rather than in an effect) when a prop changes is the pattern React
  // recommends for this — see "Storing information from previous renders".
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setEmail(initialEmail);
      setStatus("idle");
      setError("");
    }
  }

  const send = async () => {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setError(tr("auth.errInvalidEmail"));
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const exists = await checkEmailExists(trimmed);
      if (!exists) {
        setStatus("error");
        setError(tr("auth.errEmailNotFound"));
        return;
      }
      await requestPasswordRecovery(trimmed);
      setStatus("sent");
    } catch (e) {
      setStatus("error");
      setError(getErrorMessage(e));
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-[360px] items-center rounded-[28px] bg-elevated p-6 shadow-2xl">
          {status === "sent" ? (
            <>
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <MailCheck size={28} color="#2F9B65" />
              </View>
              <Text className="text-center font-quicksand-bold text-xl text-content">
                {tr("auth.resetSentTitle")}
              </Text>
              <Text className="mt-2 text-center font-quicksand-medium text-[15px] leading-[1.5] text-muted">
                {tr("auth.resetSentMsg", { email: email.trim() })}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.9}
                className="mt-6 w-full items-center rounded-full bg-primary py-4"
              >
                <Text className="font-quicksand-bold text-base text-white">
                  {tr("auth.resetDone")}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail size={28} color="#FE8C00" />
              </View>
              <Text className="text-center font-quicksand-bold text-xl text-content">
                {tr("auth.resetTitle")}
              </Text>
              <Text className="mt-2 text-center font-quicksand-medium text-[15px] leading-[1.5] text-muted">
                {tr("auth.resetSub")}
              </Text>

              <View className="mt-5 w-full">
                <CustomInput
                  icon={Mail}
                  placeholder={tr("auth.enterEmail")}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              {status === "error" ? (
                <Text className="mt-2.5 self-start font-quicksand-medium text-sm text-error">
                  {error}
                </Text>
              ) : null}

              <View className="mt-5 w-full gap-2.5">
                <TouchableOpacity
                  onPress={send}
                  disabled={status === "sending"}
                  activeOpacity={0.9}
                  className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
                  style={status === "sending" ? { opacity: 0.7 } : undefined}
                >
                  {status === "sending" ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-quicksand-bold text-base text-white">
                      {tr("auth.resetSend")}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.9}
                  className="items-center rounded-full bg-surface py-4"
                >
                  <Text className="font-quicksand-bold text-base text-content">
                    {tr("common.cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;
