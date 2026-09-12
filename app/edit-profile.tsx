import AppModal from "@/components/AppModal";
import Avatar from "@/components/Avatar";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomInput from "@/components/CustomInput";
import { useT } from "@/lib/i18n";
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
  const tr = useT();

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
      Alert.alert(tr("common.error"), tr("common.nameRequired"));
      return;
    }

    if (!user) {
      Alert.alert(tr("common.error"), tr("common.userNotFound"));
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
      Alert.alert(
        tr("common.error"),
        error?.message || tr("common.failedUpdateProfile"),
      );
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
      <SafeAreaView className="flex-center h-full bg-canvas">
        <Text className="paragraph-regular text-muted">No user found</Text>
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
    <SafeAreaView className="h-full bg-canvas">
      <KeyboardAwareScrollView
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <CustomHeader title={tr("edit.title")} />

        {/* Profile Avatar Preview */}
        <View className="my-8 items-center">
          <Avatar name={form.name} uri={user.avatar} />
          <Text className="body-regular mt-3 text-muted">
            {tr("edit.changePhotoHint")}
          </Text>
        </View>

        {/* Form Fields */}
        <View className="gap-5">
          <CustomInput
            label={`${tr("profile.fullName")} *`}
            placeholder={tr("edit.enterName")}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            secureTextEntry={false}
          />

          <CustomInput
            label={tr("profile.phone")}
            placeholder={tr("edit.enterPhone")}
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            keyboardType="phone-pad"
            secureTextEntry={false}
          />

          <CustomInput
            label={tr("profile.homeAddress")}
            placeholder={tr("edit.enterHome")}
            value={form.address_home}
            onChangeText={(text) => setForm({ ...form, address_home: text })}
            secureTextEntry={false}
          />

          <CustomInput
            label={tr("profile.workAddress")}
            placeholder={tr("edit.enterWork")}
            value={form.address_work}
            onChangeText={(text) => setForm({ ...form, address_work: text })}
            secureTextEntry={false}
          />

          <View className="mt-5 gap-3">
            <CustomButton
              title={tr(isSubmitting ? "common.saving" : "common.saveChanges")}
              onPress={handleSubmit}
              isLoading={isSubmitting}
            />

            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-center rounded-xl bg-surface py-4"
              disabled={isSubmitting}
            >
              <Text className="paragraph-semibold text-content">
                {tr("common.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <AppModal
        visible={showSuccessModal}
        onClose={handleCloseSuccessModal}
        tone="success"
        icon={CircleCheck}
        title={tr("edit.updated")}
        message={tr("edit.updatedMsg")}
        primary={{
          label: tr("edit.backToProfile"),
          onPress: handleCloseSuccessModal,
        }}
      />
    </SafeAreaView>
  );
};

export default EditProfile;
