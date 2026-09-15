import CustomInput from "@/components/CustomInput";
import {
  abandonPasswordReset,
  checkEmailExists,
  completePasswordReset,
  requestPasswordResetCode,
  verifyPasswordResetCode,
} from "@/lib/appwrite";
import { t, useT } from "@/lib/i18n";
import useAuthStore from "@/store/auth.store";
import { KeyRound, Lock, Mail, MailCheck } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useColors } from "@/hooks/useColors";

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
  if (
    message.includes("invalid_token") ||
    message.includes("invalid token") ||
    message.includes("expired")
  ) {
    return t("auth.errInvalidCode");
  }
  return (error as Error)?.message || t("auth.errGeneric");
};

type Step = "email" | "code" | "password" | "success";

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
  const c = useColors();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Reset the form each time the modal opens. Adjusting state during render
  // (rather than in an effect) when a prop changes is the pattern React
  // recommends for this — see "Storing information from previous renders".
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setStep("email");
      setEmail(initialEmail);
      setCode("");
      setUserId("");
      setPassword("");
      setConfirmPassword("");
      setBusy(false);
      setError("");
    }
  }

  // A session already exists once the code is verified (step "password") —
  // closing without finishing the reset should drop it rather than leave
  // the app half signed-in as this account.
  const close = () => {
    if (step === "password") abandonPasswordReset();
    onClose();
  };

  const sendCode = async () => {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(tr("auth.errInvalidEmail"));
      return;
    }
    setBusy(true);
    setError("");
    try {
      const exists = await checkEmailExists(trimmed);
      if (!exists) {
        setError(tr("auth.errEmailNotFound"));
        return;
      }
      const id = await requestPasswordResetCode(trimmed);
      setUserId(id);
      setStep("code");
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    const trimmed = code.trim();
    if (trimmed.length < 6) {
      setError(tr("auth.errCodeLen"));
      return;
    }
    setBusy(true);
    setError("");
    try {
      await verifyPasswordResetCode(userId, trimmed);
      setStep("password");
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const resendCode = async () => {
    setBusy(true);
    setError("");
    try {
      const id = await requestPasswordResetCode(email.trim());
      setUserId(id);
      setCode("");
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const setNewPassword = async () => {
    if (password.length < 8) {
      setError(tr("auth.errPasswordLen"));
      return;
    }
    if (password !== confirmPassword) {
      setError(tr("auth.errPasswordMismatch"));
      return;
    }
    setBusy(true);
    setError("");
    try {
      await completePasswordReset(password);
      await useAuthStore.getState().fetchAuthenticatedUser();
      setStep("success");
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={close}
    >
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-[360px] items-center rounded-[28px] bg-elevated p-6 shadow-2xl">
            {step === "success" ? (
              <>
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <MailCheck size={28} color="#2F9B65" />
                </View>
                <Text className="text-center font-quicksand-bold text-xl text-content">
                  {tr("auth.resetSuccessTitle")}
                </Text>
                <Text className="mt-2 text-center font-quicksand-medium text-[15px] leading-[1.5] text-muted">
                  {tr("auth.resetSuccessMsg")}
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
            ) : step === "password" ? (
              <>
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Lock size={28} color="#FE8C00" />
                </View>
                <Text className="text-center font-quicksand-bold text-xl text-content">
                  {tr("auth.resetNewPasswordTitle")}
                </Text>
                <Text className="mt-2 text-center font-quicksand-medium text-[15px] leading-[1.5] text-muted">
                  {tr("auth.resetNewPasswordSub")}
                </Text>

                <View className="mt-5 w-full gap-3">
                  <CustomInput
                    icon={Lock}
                    placeholder={tr("auth.resetNewPasswordPlaceholder")}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <CustomInput
                    icon={Lock}
                    placeholder={tr("auth.confirmPassword")}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>

                {error ? (
                  <Text className="mt-2.5 self-start font-quicksand-medium text-sm text-error">
                    {error}
                  </Text>
                ) : null}

                <View className="mt-5 w-full gap-2.5">
                  <TouchableOpacity
                    onPress={setNewPassword}
                    disabled={busy}
                    activeOpacity={0.9}
                    className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
                    style={busy ? { opacity: 0.7 } : undefined}
                  >
                    {busy ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-quicksand-bold text-base text-white">
                        {tr("auth.resetSetPassword")}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={close}
                    activeOpacity={0.9}
                    className="items-center rounded-full bg-surface py-4"
                  >
                    <Text className="font-quicksand-bold text-base text-content">
                      {tr("common.cancel")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : step === "code" ? (
              <>
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <KeyRound size={28} color="#FE8C00" />
                </View>
                <Text className="text-center font-quicksand-bold text-xl text-content">
                  {tr("auth.resetCodeTitle")}
                </Text>
                <Text className="mt-2 text-center font-quicksand-medium text-[15px] leading-[1.5] text-muted">
                  {tr("auth.resetCodeSub", { email: email.trim() })}
                </Text>

                <View className="mt-5 w-full flex-row items-center gap-2.5 rounded-2xl bg-surface px-4">
                  <TextInput
                    autoFocus
                    value={code}
                    onChangeText={(v) => setCode(v.replace(/[^0-9]/g, ""))}
                    placeholder={tr("auth.resetCodePlaceholder")}
                    placeholderTextColor={c.muted}
                    keyboardType="number-pad"
                    maxLength={6}
                    className="flex-1 py-3.5 text-center font-quicksand-bold text-lg tracking-[4px] text-content"
                  />
                </View>

                {error ? (
                  <Text className="mt-2.5 self-start font-quicksand-medium text-sm text-error">
                    {error}
                  </Text>
                ) : null}

                <View className="mt-5 w-full gap-2.5">
                  <TouchableOpacity
                    onPress={verifyCode}
                    disabled={busy}
                    activeOpacity={0.9}
                    className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
                    style={busy ? { opacity: 0.7 } : undefined}
                  >
                    {busy ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-quicksand-bold text-base text-white">
                        {tr("auth.resetVerifyCode")}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={resendCode}
                    disabled={busy}
                    activeOpacity={0.9}
                    className="items-center py-2"
                  >
                    <Text className="font-quicksand-semibold text-sm text-muted">
                      {tr("auth.resetResendCode")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={close}
                    activeOpacity={0.9}
                    className="items-center rounded-full bg-surface py-4"
                  >
                    <Text className="font-quicksand-bold text-base text-content">
                      {tr("common.cancel")}
                    </Text>
                  </TouchableOpacity>
                </View>
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

                {error ? (
                  <Text className="mt-2.5 self-start font-quicksand-medium text-sm text-error">
                    {error}
                  </Text>
                ) : null}

                <View className="mt-5 w-full gap-2.5">
                  <TouchableOpacity
                    onPress={sendCode}
                    disabled={busy}
                    activeOpacity={0.9}
                    className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
                    style={busy ? { opacity: 0.7 } : undefined}
                  >
                    {busy ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="font-quicksand-bold text-base text-white">
                        {tr("auth.resetSend")}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={close}
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ForgotPasswordModal;
