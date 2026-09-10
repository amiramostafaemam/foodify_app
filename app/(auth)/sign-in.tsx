import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { User } from "@/type";
import { Link, Redirect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ErrorModal = ({
  visible,
  message,
  onClose,
}: {
  visible: boolean;
  message: string;
  onClose: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      shakeAnim.setValue(0);
    }
  }, [visible, scaleAnim, shakeAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
          }}
          className="mx-5 w-5/6 items-center rounded-3xl bg-white p-8 shadow-2xl"
        >
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <Text className="text-5xl">❌</Text>
          </View>

          <Text className="mb-3 text-center font-quicksand-bold text-2xl text-red-500">
            Error
          </Text>
          <Text className="font-quicksand-regular mb-6 text-center text-base text-gray-400">
            {message}
          </Text>

          <View className="w-full">
            <TouchableOpacity
              onPress={onClose}
              className="items-center rounded-xl bg-red-500 py-4"
              activeOpacity={0.8}
            >
              <Text className="base-bold text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

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
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    const { email, password } = form;

    Keyboard.dismiss();

    if (!email || !password) {
      setErrorMessage("Please enter your email and password");
      setShowErrorModal(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email.toLowerCase().trim(), password);
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
        <Animated.View
          style={{ transform: [{ scale: successAnim }] }}
          className="items-center rounded-3xl bg-white p-8 shadow-xl"
        >
          <View className="mb-6 items-center">
            <Image
              source={images.successs}
              className="h-48 w-48"
              resizeMode="contain"
            />
          </View>

          <Text className="mb-3 text-center font-quicksand-bold text-3xl text-dark-100">
            Login Successful
          </Text>
          <Text className="font-quicksand-regular mb-8 px-4 text-center text-base text-gray-400">
            You are all set to continue where you left off.
          </Text>

          <CustomButton
            title="Go to Homepage"
            onPress={handleGoToHome}
            style="w-full"
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="mt-5 gap-10 rounded-lg bg-white p-5"
      >
        <CustomInput
          label="Email"
          placeholder="Enter Your Email"
          value={form.email}
          onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
          secureTextEntry={false}
          keyboardType="email-address"
        />

        <CustomInput
          label="Password"
          placeholder="Enter Your Password"
          value={form.password}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, password: text }))
          }
          secureTextEntry={true}
        />

        <CustomButton
          title="Sign In"
          isLoading={isSubmitting}
          onPress={submit}
        />

        <View className="mt-3 flex flex-row justify-center gap-2">
          <Text className="base-regular text-gray-100">
            Don&apos;t have an account?
          </Text>
          <Link href="/sign-up" className="base-bold text-primary">
            <Text> Sign Up</Text>
          </Link>
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
