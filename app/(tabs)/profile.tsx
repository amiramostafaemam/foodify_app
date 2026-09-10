import Avatar from "@/components/Avatar";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import ProfileField from "@/components/ProfileField";
import { uploadImage } from "@/lib/appwrite";
import { pickSquareImage } from "@/lib/media";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { LogOut, Mail, MapPin, Phone, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LogoutModal = ({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const scaleAnim = useAnimatedValue(0);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, scaleAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View className="w-full max-w-sm items-center rounded-3xl bg-white p-8 shadow-2xl">
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-error/10">
              <LogOut size={26} color="#F14141" />
            </View>

            <Text className="mb-2 text-center font-quicksand-bold text-xl text-dark-100">
              Log out?
            </Text>
            <Text className="mb-6 text-center font-quicksand text-base text-gray-100">
              You&apos;ll need to sign in again to place orders.
            </Text>

            <View className="w-full gap-3">
              <TouchableOpacity
                onPress={onConfirm}
                className="items-center rounded-xl bg-error py-4"
                activeOpacity={0.85}
              >
                <Text className="base-bold text-white">Log out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onCancel}
                className="items-center rounded-xl bg-gray-100/10 py-4"
                activeOpacity={0.85}
              >
                <Text className="base-bold text-dark-100">Stay signed in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const Profile = () => {
  const { user, logout, isLoading, updateUserProfile } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleChangeAvatar = async () => {
    try {
      const file = await pickSquareImage();
      if (!file) return;

      setUploadingAvatar(true);
      const avatar = await uploadImage(file);
      await updateUserProfile({ avatar });
      Alert.alert("Photo updated", "Your new profile picture is live.");
    } catch (error) {
      Alert.alert(
        "Upload failed",
        error instanceof Error ? error.message : "Could not update your photo.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logout();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-center h-full bg-white">
        <Text className="paragraph-regular text-gray-200">Loading…</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-center h-full bg-white">
        <Text className="paragraph-regular text-gray-200">
          No user data found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader title="Profile" />

        {/* Identity */}
        <View className="mb-8 items-center">
          <Avatar
            name={user.name}
            uri={user.avatar}
            editable
            uploading={uploadingAvatar}
            onEditPress={handleChangeAvatar}
          />
          <Text className="mt-4 font-quicksand-bold text-2xl text-dark-100">
            {user.name}
          </Text>
          <Text className="body-regular text-gray-100">{user.email}</Text>
        </View>

        {/* Personal information */}
        <View className="mb-4 rounded-2xl border border-gray-200/70 bg-white p-5">
          <Text className="paragraph-bold mb-4 text-dark-100">
            Personal information
          </Text>
          <ProfileField label="Full Name" value={user.name} icon={User} />
          <ProfileField label="Email" value={user.email} icon={Mail} />
          <ProfileField
            label="Phone Number"
            value={user.phone || "Not provided"}
            icon={Phone}
          />
        </View>

        {/* Addresses */}
        <View className="mb-6 rounded-2xl border border-gray-200/70 bg-white p-5">
          <Text className="paragraph-bold mb-4 text-dark-100">Addresses</Text>
          <ProfileField
            label="Home Address"
            value={user.address_home || "Not provided"}
            icon={MapPin}
          />
          <ProfileField
            label="Work Address"
            value={user.address_work || "Not provided"}
            icon={MapPin}
          />
        </View>

        <CustomButton
          title="Edit Profile"
          onPress={() => router.push("/edit-profile")}
        />

        <TouchableOpacity
          onPress={() => setShowLogoutModal(true)}
          className="mt-3 flex-row items-center justify-center gap-2 py-4"
          activeOpacity={0.7}
        >
          <LogOut size={18} color="#F14141" />
          <Text className="paragraph-bold text-error">Log out</Text>
        </TouchableOpacity>
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </SafeAreaView>
  );
};

export default Profile;
