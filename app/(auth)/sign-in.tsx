import AuthScaffold from "@/components/AuthScaffold";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import ErrorModal from "@/components/ErrorModal";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { t, useT } from "@/lib/i18n";
import useAuthStore from "@/store/auth.store";
import { Redirect } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";

const getErrorMessage = (error: unknown): string => {
  const message =
    (error as Error)?.message?.toLowerCase() || String(error).toLowerCase();

  if (
    message.includes("invalid credentials") ||
    message.includes("invalid_credentials") ||
    message.includes("invalid email or password") ||
    message.includes("wrong password")
  ) {
    return t("auth.errInvalidCreds");
  }
  if (
    message.includes("user_not_found") ||
    message.includes("user not found") ||
    message.includes("no user found")
  ) {
    return t("auth.errNoUser");
  }
  if (message.includes("network") || message.includes("failed to fetch")) {
    return t("auth.errNetwork");
  }
  if (message.includes("too_many_requests") || message.includes("rate limit")) {
    return t("auth.errRateLimit");
  }
  return (error as Error)?.message || t("auth.errGeneric");
};

const SignIn = () => {
  const login = useAuthStore((s) => s.login);
  const tr = useT();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
    const email = form.email.toLowerCase().trim();
    const { password } = form;

    Keyboard.dismiss();

    if (!email || !password) {
      setErrorMessage(tr("auth.errEmailPassword"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage(tr("auth.errInvalidEmail"));
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      setDone(true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <AuthScaffold active="signin">
      <View className="gap-3.5">
        <CustomInput
          label={tr("auth.email")}
          placeholder={tr("auth.enterEmail")}
          icon={Mail}
          value={form.email}
          onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
          keyboardType="email-address"
        />
        <CustomInput
          label={tr("auth.password")}
          placeholder={tr("auth.enterPassword")}
          icon={Lock}
          value={form.password}
          onChangeText={(password) =>
            setForm((prev) => ({ ...prev, password }))
          }
          secureTextEntry
        />

        <CustomButton
          title={tr("auth.signIn")}
          isLoading={isSubmitting}
          onPress={submit}
          style="mt-2"
        />

        <TouchableOpacity
          onPress={() => setShowForgot(true)}
          hitSlop={8}
          className="self-center"
        >
          <Text className="font-quicksand-semibold text-sm text-muted">
            {tr("auth.forgotPassword")}
          </Text>
        </TouchableOpacity>
      </View>

      <ForgotPasswordModal
        visible={showForgot}
        initialEmail={form.email.trim()}
        onClose={() => setShowForgot(false)}
      />

      <ErrorModal
        visible={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </AuthScaffold>
  );
};

export default SignIn;
