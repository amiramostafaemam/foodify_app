import AuthScaffold from "@/components/AuthScaffold";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import ErrorModal from "@/components/ErrorModal";
import { createUser } from "@/lib/appwrite";
import { t, useT } from "@/lib/i18n";
import useAuthStore from "@/store/auth.store";
import { Redirect } from "expo-router";
import { Lock, Mail, User } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, View } from "react-native";

const getErrorMessage = (error: unknown): string => {
  const message =
    (error as Error)?.message?.toLowerCase() || String(error).toLowerCase();

  if (
    message.includes("user_already_exists") ||
    message.includes("already exists") ||
    message.includes("a user with the same email already exists")
  ) {
    return t("auth.errEmailExists");
  }
  if (message.includes("invalid_email") || message.includes("invalid email")) {
    return t("auth.errInvalidEmail");
  }
  if (
    message.includes("password_policy") ||
    message.includes("password must be") ||
    message.includes("at least")
  ) {
    return t("auth.errPasswordLen");
  }
  if (message.includes("network") || message.includes("failed to fetch")) {
    return t("auth.errNetwork");
  }
  return (error as Error)?.message || t("auth.errGeneric");
};

const SignUp = () => {
  const fetchAuthenticatedUser = useAuthStore((s) => s.fetchAuthenticatedUser);
  const tr = useT();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const submit = async () => {
    const name = form.name.trim();
    const email = form.email.toLowerCase().trim();
    const { password, confirmPassword } = form;

    Keyboard.dismiss();

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage(tr("auth.errFillFields"));
      return;
    }
    if (name.length < 2) {
      setErrorMessage(tr("auth.errNameLen"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage(tr("auth.errInvalidEmail"));
      return;
    }
    if (password.length < 8) {
      setErrorMessage(tr("auth.errPasswordLen"));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(tr("auth.errPasswordMismatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser({ name, email, password });
      await fetchAuthenticatedUser();
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
    <AuthScaffold active="signup">
      <View className="gap-5">
        <CustomInput
          variant="badge"
          label={tr("auth.fullName")}
          placeholder="Amira Mostafa"
          icon={User}
          value={form.name}
          onChangeText={(name) => setForm((prev) => ({ ...prev, name }))}
        />
        <CustomInput
          variant="badge"
          label={tr("auth.email")}
          placeholder="you@example.com"
          icon={Mail}
          value={form.email}
          onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
          keyboardType="email-address"
        />
        <CustomInput
          variant="badge"
          label={tr("auth.password")}
          placeholder={tr("auth.min8")}
          icon={Lock}
          value={form.password}
          onChangeText={(password) =>
            setForm((prev) => ({ ...prev, password }))
          }
          secureTextEntry
        />
        <CustomInput
          variant="badge"
          label={tr("auth.confirmPassword")}
          placeholder={tr("auth.confirmPassword")}
          icon={Lock}
          value={form.confirmPassword}
          onChangeText={(confirmPassword) =>
            setForm((prev) => ({ ...prev, confirmPassword }))
          }
          secureTextEntry
        />

        <CustomButton
          title={tr("auth.signUp")}
          isLoading={isSubmitting}
          onPress={submit}
          style="mt-1"
        />
      </View>

      <ErrorModal
        visible={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </AuthScaffold>
  );
};

export default SignUp;
