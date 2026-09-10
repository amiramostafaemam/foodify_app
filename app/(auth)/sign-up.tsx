import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import ErrorModal from "@/components/ErrorModal";
import { createUser } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { Link, Redirect } from "expo-router";
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
      // createUser also opens an Appwrite session — hydrate the store from it.
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
    <View className="flex-1">
      <View className="mt-5 gap-8 rounded-lg bg-white p-5">
        <CustomInput
          label="Full Name"
          placeholder="Enter Your Full Name"
          value={form.name}
          onChangeText={(name) => setForm((prev) => ({ ...prev, name }))}
        />
        <CustomInput
          label="Email"
          placeholder="Enter Your Email"
          value={form.email}
          onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
          keyboardType="email-address"
        />
        <CustomInput
          label="Password"
          placeholder="Enter Your Password"
          value={form.password}
          onChangeText={(password) => setForm((prev) => ({ ...prev, password }))}
          secureTextEntry
        />

        <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />

        <View className="mt-3 flex-row justify-center gap-2">
          <Text className="base-regular text-gray-100">
            Already have an account?
          </Text>
          <Link href="/sign-in" className="base-bold text-primary">
            Sign In
          </Link>
        </View>
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
