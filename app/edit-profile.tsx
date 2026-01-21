import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomInput from "@/components/CustomInput";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const { user, updateUserProfile, isLoading } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address_home: user?.address_home || "",
    address_work: user?.address_work || "",
  });

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserProfile({
        name: form.name,
        phone: form.phone,
        address_home: form.address_home,
        address_work: form.address_work,
      });

      Alert.alert("Success", "Profile updated successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/profile"),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !user) {
    return (
      <SafeAreaView className="bg-white h-full flex-center">
        <Text className="paragraph-regular text-gray-200">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="px-5 pb-10">
        <CustomHeader title="Edit Profile" />

        <View className="gap-5 mt-5">
          <CustomInput
            label="Full Name"
            placeholder="Enter your full name"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            secureTextEntry={false}
          />

          <CustomInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            keyboardType="phone-pad"
            secureTextEntry={false}
          />

          <CustomInput
            label="Address 1 - (Home)"
            placeholder="Enter your home address"
            value={form.address_home}
            onChangeText={(text) => setForm({ ...form, address_home: text })}
            secureTextEntry={false}
          />

          <CustomInput
            label="Address 2 - (Work)"
            placeholder="Enter your work address"
            value={form.address_work}
            onChangeText={(text) => setForm({ ...form, address_work: text })}
            secureTextEntry={false}
          />

          <View className="mt-5">
            <CustomButton
              title="Save Changes"
              onPress={handleSubmit}
              isLoading={isSubmitting}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.replace("/profile")}
            className="flex-center py-3"
            disabled={isSubmitting}
          >
            <Text className="paragraph-semibold text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
