import AppModal from "@/components/AppModal";
import Avatar from "@/components/Avatar";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomInput from "@/components/CustomInput";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { CircleCheck } from "lucide-react-native";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // The root layout blocks rendering until auth has resolved, so `user` is
  // already populated here — initialise the form straight from it.
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    address_home: user?.address_home ?? "",
    address_work: user?.address_work ?? "",
  });

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address_home: form.address_home.trim(),
        address_work: form.address_work.trim(),
      });

      setShowSuccessModal(true);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.replace("/profile");
  };

  // No user state
  if (!user) {
    return (
      <SafeAreaView className="flex-center h-full bg-white">
        <Text className="paragraph-regular text-gray-200">No user found</Text>
        <TouchableOpacity
          onPress={() => router.replace("/sign-in")}
          className="mt-4"
        >
          <Text className="paragraph-semibold text-primary">Go to Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <KeyboardAwareScrollView
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <CustomHeader title="Edit Profile" />

        {/* Profile Avatar Preview */}
        <View className="my-8 items-center">
          <Avatar name={form.name} uri={user.avatar} />
          <Text className="body-regular mt-3 text-gray-100">
            Change your photo from the Profile screen
          </Text>
        </View>

        {/* Form Fields */}
        <View className="gap-5">
          <CustomInput
            label="Full Name *"
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
            label="Home Address"
            placeholder="Enter your home address"
            value={form.address_home}
            onChangeText={(text) => setForm({ ...form, address_home: text })}
            secureTextEntry={false}
          />

          <CustomInput
            label="Work Address"
            placeholder="Enter your work address"
            value={form.address_work}
            onChangeText={(text) => setForm({ ...form, address_work: text })}
            secureTextEntry={false}
          />

          <View className="mt-5 gap-3">
            <CustomButton
              title={isSubmitting ? "Saving..." : "Save Changes"}
              onPress={handleSubmit}
              isLoading={isSubmitting}
            />

            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-center rounded-xl bg-[#F3F4F6] py-4"
              disabled={isSubmitting}
            >
              <Text className="paragraph-semibold text-[#1F2937]">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <AppModal
        visible={showSuccessModal}
        onClose={handleCloseSuccessModal}
        tone="success"
        icon={CircleCheck}
        title="Profile updated"
        message="Your changes have been saved."
        primary={{
          label: "Back to Profile",
          onPress: handleCloseSuccessModal,
        }}
      />
    </SafeAreaView>
  );
};

export default EditProfile;
