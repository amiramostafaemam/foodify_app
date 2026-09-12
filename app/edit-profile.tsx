import AppModal from "@/components/AppModal";
import Avatar from "@/components/Avatar";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomInput from "@/components/CustomInput";
import { updateUserPassword } from "@/lib/appwrite";
import { t, useT } from "@/lib/i18n";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { ChevronDown, ChevronUp, CircleCheck, Lock } from "lucide-react-native";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const getPasswordErrorMessage = (error: unknown): string => {
  const message =
    (error as Error)?.message?.toLowerCase() || String(error).toLowerCase();
  if (
    message.includes("invalid credentials") ||
    message.includes("invalid_credentials")
  ) {
    return t("edit.errCurrentPasswordWrong");
  }
  if (message.includes("password_policy") || message.includes("at least")) {
    return t("auth.errPasswordLen");
  }
  if (message.includes("network") || message.includes("failed to fetch")) {
    return t("auth.errNetwork");
  }
  return (error as Error)?.message || t("auth.errGeneric");
};

const EditProfile = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const tr = useT();

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  const handleChangePassword = async () => {
    setPasswordError("");
    const { current, next, confirm } = passwordForm;

    if (!current || !next || !confirm) {
      setPasswordError(tr("edit.errFillPasswordFields"));
      return;
    }
    if (next.length < 8) {
      setPasswordError(tr("auth.errPasswordLen"));
      return;
    }
    if (next !== confirm) {
      setPasswordError(tr("auth.errPasswordMismatch"));
      return;
    }

    setIsChangingPassword(true);
    try {
      await updateUserPassword(next, current);
      setPasswordForm({ current: "", next: "", confirm: "" });
      setShowPasswordSection(false);
      setShowPasswordSuccess(true);
    } catch (error) {
      setPasswordError(getPasswordErrorMessage(error));
    } finally {
      setIsChangingPassword(false);
    }
  };

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

        {/* Change password — separate from the profile form above; updates
            the account password immediately via the current session, no
            email flow needed. */}
        <View className="mt-6 rounded-2xl bg-surface p-1">
          <TouchableOpacity
            onPress={() => setShowPasswordSection((v) => !v)}
            activeOpacity={0.8}
            className="flex-row items-center gap-3 p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Lock size={18} color="#FE8C00" />
            </View>
            <Text className="paragraph-semibold flex-1 text-content">
              {tr("edit.changePassword")}
            </Text>
            {showPasswordSection ? (
              <ChevronUp size={18} color="#878787" />
            ) : (
              <ChevronDown size={18} color="#878787" />
            )}
          </TouchableOpacity>

          {showPasswordSection ? (
            <View className="gap-4 p-4 pt-0">
              <CustomInput
                label={tr("edit.currentPassword")}
                placeholder={tr("edit.enterCurrentPassword")}
                value={passwordForm.current}
                onChangeText={(current) =>
                  setPasswordForm((prev) => ({ ...prev, current }))
                }
                secureTextEntry
              />
              <CustomInput
                label={tr("edit.newPassword")}
                placeholder={tr("auth.min8")}
                value={passwordForm.next}
                onChangeText={(next) =>
                  setPasswordForm((prev) => ({ ...prev, next }))
                }
                secureTextEntry
              />
              <CustomInput
                label={tr("edit.confirmNewPassword")}
                placeholder={tr("auth.enterConfirmPassword")}
                value={passwordForm.confirm}
                onChangeText={(confirm) =>
                  setPasswordForm((prev) => ({ ...prev, confirm }))
                }
                secureTextEntry
              />

              {passwordError ? (
                <Text className="font-quicksand-medium text-sm text-error">
                  {passwordError}
                </Text>
              ) : null}

              <CustomButton
                title={tr("edit.updatePassword")}
                onPress={handleChangePassword}
                isLoading={isChangingPassword}
              />
            </View>
          ) : null}
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

      <AppModal
        visible={showPasswordSuccess}
        onClose={() => setShowPasswordSuccess(false)}
        tone="success"
        icon={CircleCheck}
        title={tr("edit.passwordUpdated")}
        message={tr("edit.passwordUpdatedMsg")}
        primary={{
          label: tr("auth.resetDone"),
          onPress: () => setShowPasswordSuccess(false),
        }}
      />
    </SafeAreaView>
  );
};

export default EditProfile;
