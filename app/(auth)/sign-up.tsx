import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { images } from "@/constants";
import { createUser } from "@/lib/appwrite";
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
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    const { name, email, password } = form;

    Keyboard.dismiss();

    if (!name || !email || !password) {
      setErrorMessage("Please fill all the fields");
      setShowErrorModal(true);
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage("Name must be at least 2 characters long");
      setShowErrorModal(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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
      await createUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
      });

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
        <Animated.View
          style={{ transform: [{ scale: successAnim }] }}
          className="items-center gap-5 rounded-lg bg-white p-5"
        >
          <Image
            source={images.successs}
            className="h-80 w-80"
            resizeMode="contain"
          />

          <Text className="text-center font-quicksand-bold text-3xl text-primary">
            Account Created!
          </Text>
          <Text className="font-quicksand-regular px-5 text-center text-base text-gray-400">
            Your account has been created successfully. Please sign in to
            continue.
          </Text>

          <CustomButton
            title="Sign In"
            onPress={() => setShouldRedirect(true)}
            style="w-full mt-5"
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
          label="Full Name"
          placeholder="Enter Your Full Name"
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        />
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
          title="Sign Up"
          isLoading={isSubmitting}
          onPress={submit}
        />

        <View className="mt-5 flex flex-row justify-center gap-2">
          <Text className="base-regular text-gray-100">
            Already have an account?
          </Text>
          <Link href="/sign-in" className="base-bold text-primary">
            <Text> Sign In</Text>
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

export default SignUp;
