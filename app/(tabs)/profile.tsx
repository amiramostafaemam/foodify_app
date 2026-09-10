import AppModal from "@/components/AppModal";
import Avatar from "@/components/Avatar";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import ProfileField from "@/components/ProfileField";
import { uploadImage } from "@/lib/appwrite";
import { pickSquareImage } from "@/lib/media";
import useAuthStore from "@/store/auth.store";
import {
  selectFavoriteCount,
  useFavoritesStore,
} from "@/store/favorites.store";
import {
  selectUnreadCount,
  useNotificationsStore,
} from "@/store/notifications.store";
import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NavRow = ({
  icon: Icon,
  label,
  count,
  onPress,
}: {
  icon: typeof Heart;
  label: string;
  count: number;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className="flex-row items-center gap-3 rounded-2xl bg-gray-50 p-4"
  >
    <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
      <Icon size={18} color="#FE8C00" />
    </View>
    <Text className="paragraph-semibold flex-1 text-dark-100">{label}</Text>
    {count > 0 ? (
      <View className="h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5">
        <Text className="font-quicksand-bold text-[11px] text-white">
          {count > 99 ? "99+" : count}
        </Text>
      </View>
    ) : null}
    <ChevronRight size={18} color="#878787" />
  </TouchableOpacity>
);

const Profile = () => {
  const { user, logout, isLoading, updateUserProfile } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const favCount = useFavoritesStore(selectFavoriteCount);
  const unreadCount = useNotificationsStore(selectUnreadCount);

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

        {/* Quick links */}
        <View className="mb-4 gap-2.5">
          <NavRow
            icon={Heart}
            label="Favorites"
            count={favCount}
            onPress={() => router.push("/favorites")}
          />
          <NavRow
            icon={Bell}
            label="Notifications"
            count={unreadCount}
            onPress={() => router.push("/notifications")}
          />
        </View>

        {/* Personal information */}
        <View className="mb-4 rounded-2xl bg-gray-50 p-5">
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
        <View className="mb-6 rounded-2xl bg-gray-50 p-5">
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

      <AppModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        tone="error"
        icon={LogOut}
        title="Log out?"
        message="You'll need to sign in again to place orders."
        primary={{ label: "Log out", onPress: handleConfirmLogout }}
        secondary={{
          label: "Stay signed in",
          onPress: () => setShowLogoutModal(false),
        }}
      />
    </SafeAreaView>
  );
};

export default Profile;
