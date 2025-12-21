import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please enter valid email address and password");
      return;
    }

    try {
      //call appwrite function to sign in user

      Alert.alert("Success", "You have successfully Signed In!");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="bg-white gap-10 rounded-lg p-5 mt-5">
      <CustomInput
        label="Email"
        placeholder="Enter Your Email"
        value={form.email}
        onChangeText={(text) => {
          setForm((prev) => ({ ...prev, email: text }));
        }}
        secureTextEntry={false}
        keyboardType={"email-address"}
      />

      <CustomInput
        label="Password"
        placeholder="Enter Your Password"
        value={form.password}
        onChangeText={(text) => {
          setForm((prev) => ({ ...prev, password: text }));
        }}
        secureTextEntry={true}
      />
      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />
      <View className="flex justify-center mt-3 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don&apos;t have an account?
        </Text>
        <Link href="/sign-up" className="base-bold text-primary">
          <Text> Sign Up</Text>
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
