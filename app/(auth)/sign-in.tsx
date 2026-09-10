import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import ErrorModal from "@/components/ErrorModal";
import useAuthStore from "@/store/auth.store";
import { Link, Redirect } from "expo-router";
import { Lock, Mail, UtensilsCrossed } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, Text, View } from "react-native";

const getErrorMessage = (error: unknown): string => {
  const message =
    (error as Error)?.message?.toLowerCase() || String(error).toLowerCase();

  if (
    message.includes("invalid credentials") ||
    message.includes("invalid_credentials") ||
    message.includes("invalid email or password") ||
    message.includes("wrong password")
  ) {
    return "Invalid email or password. Please check your credentials and try again.";
  }
  if (
    message.includes("user_not_found") ||
    message.includes("user not found") ||
    message.includes("no user found")
  ) {
    return "No account found with this email. Please sign up first.";
  }
  if (message.includes("network") || message.includes("failed to fetch")) {
    return "Network error. Please check your internet connection.";
  }
  if (message.includes("too_many_requests") || message.includes("rate limit")) {
    return "Too many attempts. Please try again later.";
  }
  return (error as Error)?.message || "Something went wrong! Please try again.";
};

const SignIn = () => {
  const login = useAuthStore((s) => s.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
    const email = form.email.toLowerCase().trim();
    const { password } = form;

    Keyboard.dismiss();

    if (!email || !password) {
      setErrorMessage("Please enter your email and password");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address");
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
    <View className="flex-1 justify-center">
      <View className="mb-8 items-center">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
          <UtensilsCrossed size={30} color="#fff" />
        </View>
        <Text className="mt-5 font-quicksand-bold text-3xl text-content">
          Welcome back
        </Text>
        <Text className="mt-1.5 text-center font-quicksand-medium text-base text-muted">
          Sign in to keep ordering your favourites
        </Text>
      </View>

      <View className="gap-4">
        <CustomInput
          label="Email"
          icon={Mail}
          placeholder="you@example.com"
          value={form.email}
          onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
          keyboardType="email-address"
        />
        <CustomInput
          label="Password"
          icon={Lock}
          placeholder="Your password"
          value={form.password}
          onChangeText={(password) =>
            setForm((prev) => ({ ...prev, password }))
          }
          secureTextEntry
        />

        <CustomButton
          title="Sign In"
          isLoading={isSubmitting}
          onPress={submit}
          style="mt-2"
        />
      </View>

      <View className="mt-6 flex-row justify-center gap-1.5">
        <Text className="font-quicksand-medium text-muted">
          Don&apos;t have an account?
        </Text>
        <Link href="/sign-up" className="font-quicksand-bold text-primary">
          Sign Up
        </Link>
      </View>

      <ErrorModal
        visible={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </View>
  );
};

export default SignIn;
