import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import ErrorModal from "@/components/ErrorModal";
import { images } from "@/constants";
import { createUser } from "@/lib/appwrite";
import { Link, Redirect } from "expo-router";
import { useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  Text,
  useAnimatedValue,
  View,
} from "react-native";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const fadeAnim = useAnimatedValue(1);
  const successAnim = useAnimatedValue(0);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async () => {
    const name = form.name.trim();
    const email = form.email.toLowerCase().trim();
    const { password } = form;

    Keyboard.dismiss();

    if (!name || !email || !password) {
      setErrorMessage("Please fill all the fields");
      setShowErrorModal(true);
      return;
    }
    if (name.length < 2) {
      setErrorMessage("Name must be at least 2 characters long");
      setShowErrorModal(true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address");
      setShowErrorModal(true);
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser({ name, email, password });

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSuccess(true);
        Animated.spring(successAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (shouldRedirect) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (showSuccess) {
    return (
      <View className="flex-1 justify-center p-5">
        <Animated.View style={{ transform: [{ scale: successAnim }] }}>
          <View className="items-center gap-5 rounded-lg bg-white p-5">
            <Image
              source={images.successs}
              className="h-80 w-80"
              resizeMode="contain"
            />
            <Text className="text-center font-quicksand-bold text-3xl text-primary">
              Account Created!
            </Text>
            <Text className="px-5 text-center font-quicksand text-base text-gray-100">
              Your account has been created successfully. Please sign in to
              continue.
            </Text>
            <CustomButton
              title="Sign In"
              onPress={() => setShouldRedirect(true)}
              style="w-full mt-5"
            />
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Animated.View style={{ opacity: fadeAnim }}>
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
            onChangeText={(password) =>
              setForm((prev) => ({ ...prev, password }))
            }
            secureTextEntry
          />

          <CustomButton
            title="Sign Up"
            isLoading={isSubmitting}
            onPress={submit}
          />

          <View className="mt-3 flex-row justify-center gap-2">
            <Text className="base-regular text-gray-100">
              Already have an account?
            </Text>
            <Link href="/sign-in" className="base-bold text-primary">
              Sign In
            </Link>
          </View>
        </View>
      </Animated.View>

      <ErrorModal
        visible={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </View>
  );
};

export default SignUp;
