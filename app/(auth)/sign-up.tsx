import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import ErrorModal from "@/components/ErrorModal";
import { createUser } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { Link, Redirect } from "expo-router";
import { Lock, Mail, User, UtensilsCrossed } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, Text, View } from "react-native";

const getErrorMessage = (error: unknown): string => {
  const message =
    (error as Error)?.message?.toLowerCase() || String(error).toLowerCase();

  if (
    message.includes("user_already_exists") ||
    message.includes("already exists") ||
    message.includes("a user with the same email already exists")
  ) {
    return "This email is already registered. Please use a different email or sign in.";
  }
  if (message.includes("invalid_email") || message.includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  if (
    message.includes("password_policy") ||
    message.includes("password must be") ||
    message.includes("at least")
  ) {
    return "Password must be at least 8 characters long.";
  }
  if (message.includes("network") || message.includes("failed to fetch")) {
    return "Network error. Please check your internet connection.";
  }
  return (error as Error)?.message || "Something went wrong! Please try again.";
};

const SignUp = () => {
  const fetchAuthenticatedUser = useAuthStore((s) => s.fetchAuthenticatedUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async () => {
    const name = form.name.trim();
    const email = form.email.toLowerCase().trim();
    const { password } = form;

    Keyboard.dismiss();

    if (!name || !email || !password) {
      setErrorMessage("Please fill all the fields");
      return;
    }
    if (name.length < 2) {
      setErrorMessage("Name must be at least 2 characters long");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
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
    <View className="flex-1 justify-center">
      <View className="mb-8 items-center">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
          <UtensilsCrossed size={30} color="#fff" />
        </View>
        <Text className="mt-5 font-quicksand-bold text-3xl text-content">
          Create account
        </Text>
        <Text className="mt-1.5 text-center font-quicksand-medium text-base text-muted">
          Join Foodify — your first delivery is on us
        </Text>
      </View>

      <View className="gap-4">
        <CustomInput
          label="Full name"
          icon={User}
          placeholder="Amira Mostafa"
          value={form.name}
          onChangeText={(name) => setForm((prev) => ({ ...prev, name }))}
        />
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
          placeholder="At least 8 characters"
          value={form.password}
          onChangeText={(password) =>
            setForm((prev) => ({ ...prev, password }))
          }
          secureTextEntry
        />

        <CustomButton
          title="Sign Up"
          isLoading={isSubmitting}
          onPress={submit}
          style="mt-2"
        />
      </View>

      <View className="mt-6 flex-row justify-center gap-1.5">
        <Text className="font-quicksand-medium text-muted">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="font-quicksand-bold text-primary">
          Sign In
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

export default SignUp;
