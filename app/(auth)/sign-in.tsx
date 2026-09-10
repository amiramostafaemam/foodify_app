import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import ErrorModal from "@/components/ErrorModal";
import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { User } from "@/type";
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
  const { login, completeLogin } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState<User | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const fadeAnim = useAnimatedValue(1);
  const successAnim = useAnimatedValue(0);

  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
    const email = form.email.toLowerCase().trim();
    const { password } = form;

    Keyboard.dismiss();

    if (!email || !password) {
      setErrorMessage("Please enter your email and password");
      setShowErrorModal(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address");
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      setUserData(user);

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSuccess(true);
        setIsSubmitting(false);
        Animated.spring(successAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      });
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(getErrorMessage(error));
      setShowErrorModal(true);
    }
  };

  const handleGoToHome = () => {
    if (userData) {
      completeLogin(userData);
      setShouldRedirect(true);
    }
  };

  if (shouldRedirect) {
    return <Redirect href="/(tabs)" />;
  }

  if (showSuccess) {
    return (
      <View className="flex-1 justify-center p-5">
        <Animated.View style={{ transform: [{ scale: successAnim }] }}>
          <View className="items-center rounded-3xl bg-white p-8 shadow-xl">
            <Image
              source={images.successs}
              className="mb-6 h-48 w-48"
              resizeMode="contain"
            />
            <Text className="mb-3 text-center font-quicksand-bold text-3xl text-dark-100">
              Login Successful
            </Text>
            <Text className="mb-8 px-4 text-center font-quicksand text-base text-gray-100">
              You are all set to continue where you left off.
            </Text>
            <CustomButton
              title="Go to Homepage"
              onPress={handleGoToHome}
              style="w-full"
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
            title="Sign In"
            isLoading={isSubmitting}
            onPress={submit}
          />

          <View className="mt-3 flex-row justify-center gap-2">
            <Text className="base-regular text-gray-100">
              Don&apos;t have an account?
            </Text>
            <Link href="/sign-up" className="base-bold text-primary">
              Sign Up
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

export default SignIn;
