import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    try {
      //call appwrite function to sign up user

      Alert.alert("Success", "You have successfully Signed Up!");
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
        label="Full Name"
        placeholder="Enter Your Full Name"
        value={form.name}
        onChangeText={(text) => {
          setForm((prev) => ({ ...prev, name: text }));
        }}
      />
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
      <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="base-bold text-primary">
          <Text> Sign In</Text>
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
