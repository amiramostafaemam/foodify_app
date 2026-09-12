import AppModal from "@/components/AppModal";
import Avatar from "@/components/Avatar";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import ProfileField from "@/components/ProfileField";
import { useColors } from "@/hooks/useColors";
import { getInitialsAvatarUrl, uploadImage } from "@/lib/appwrite";
import { useT } from "@/lib/i18n";
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
  Camera,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Settings,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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
    className="flex-row items-center gap-3 rounded-2xl bg-surface p-4"
  >
    <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
      <Icon size={18} color="#FE8C00" />
    </View>
    <Text className="paragraph-semibold flex-1 text-content">{label}</Text>
    {count > 0 ? (
      <View className="h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5">
        <Text className="font-quicksand-bold text-[11px] text-white">
          {count > 99 ? "99+" : count}
        </Text>
      </View>
    ) : null}
    <ChevronRight size={18} color="#9AA0A6" />
  </TouchableOpacity>
);

const Profile = () => {
  const { user, logout, isLoading, updateUserProfile } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [photoSuccessAction, setPhotoSuccessAction] = useState<
    "update" | "remove" | null
  >(null);
  const [photoError, setPhotoError] = useState("");
  const favCount = useFavoritesStore(selectFavoriteCount);
  const unreadCount = useNotificationsStore(selectUnreadCount);
  const c = useColors();
  const tr = useT();

  const handleChangeAvatar = async () => {
    setShowPhotoOptions(false);
    try {
      const file = await pickSquareImage();
      if (!file) return;

      setUploadingAvatar(true);
      const avatar = await uploadImage(file);
      await updateUserProfile({ avatar });
      setPhotoSuccessAction("update");
    } catch (error) {
      setPhotoError(
        error instanceof Error ? error.message : tr("profile.uploadFailedGeneric"),
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setShowPhotoOptions(false);
    if (!user) return;
    try {
      setUploadingAvatar(true);
      const avatar = getInitialsAvatarUrl(user.name);
      await updateUserProfile({ avatar });
      setPhotoSuccessAction("remove");
    } catch (error) {
      setPhotoError(
        error instanceof Error ? error.message : tr("profile.uploadFailedGeneric"),
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
      <SafeAreaView className="flex-center h-full bg-canvas">
        <Text className="paragraph-regular text-muted">Loading…</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-center h-full bg-canvas">
        <Text className="paragraph-regular text-muted">
          No user data found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-canvas">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader
          title={tr("profile.title")}
          right={
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              hitSlop={10}
              className="h-10 w-10 items-center justify-center rounded-full bg-surface"
            >
              <Settings size={20} color={c.content} />
            </TouchableOpacity>
          }
        />

        {/* Identity */}
        <View className="mb-8 items-center">
          <Avatar
            name={user.name}
            uri={user.avatar}
            editable
            uploading={uploadingAvatar}
            onEditPress={() => setShowPhotoOptions(true)}
          />
          <Text className="mt-4 font-quicksand-bold text-2xl text-content">
            {user.name}
          </Text>
          <Text className="body-regular text-muted">{user.email}</Text>
        </View>

        {/* Quick links */}
        <View className="mb-4 gap-2.5">
          <NavRow
            icon={Heart}
            label={tr("fav.title")}
            count={favCount}
            onPress={() => router.push("/favorites")}
          />
          <NavRow
            icon={Bell}
            label={tr("notif.title")}
            count={unreadCount}
            onPress={() => router.push("/notifications")}
          />
        </View>

        {/* Personal information */}
        <View className="mb-4 rounded-2xl bg-surface p-5">
          <Text className="paragraph-bold mb-4 text-content">
            {tr("profile.personalInfo")}
          </Text>
          <ProfileField
            label={tr("profile.fullName")}
            value={user.name}
            icon={User}
          />
          <ProfileField
            label={tr("profile.email")}
            value={user.email}
            icon={Mail}
          />
          <ProfileField
            label={tr("profile.phone")}
            value={user.phone || tr("profile.notProvided")}
            icon={Phone}
          />
        </View>

        {/* Addresses */}
        <View className="mb-6 rounded-2xl bg-surface p-5">
          <Text className="paragraph-bold mb-4 text-content">
            {tr("profile.addresses")}
          </Text>
          <ProfileField
            label={tr("profile.homeAddress")}
            value={user.address_home || tr("profile.notProvided")}
            icon={MapPin}
          />
          <ProfileField
            label={tr("profile.workAddress")}
            value={user.address_work || tr("profile.notProvided")}
            icon={MapPin}
          />
        </View>

        <CustomButton
          title={tr("profile.editProfile")}
          onPress={() => router.push("/edit-profile")}
        />

        <TouchableOpacity
          onPress={() => setShowLogoutModal(true)}
          className="mt-3 flex-row items-center justify-center gap-2 py-4"
          activeOpacity={0.7}
        >
          <LogOut size={18} color="#F14141" />
          <Text className="paragraph-bold text-error">
            {tr("profile.logout")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <AppModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        tone="error"
        icon={LogOut}
        title={tr("profile.logoutTitle")}
        message={tr("profile.logoutMsg")}
        primary={{ label: tr("profile.logout"), onPress: handleConfirmLogout }}
        secondary={{
          label: tr("profile.stayIn"),
          onPress: () => setShowLogoutModal(false),
        }}
      />

      <AppModal
        visible={showPhotoOptions}
        onClose={() => setShowPhotoOptions(false)}
        tone="primary"
        icon={Camera}
        title={tr("profile.updatePhotoTitle")}
        message={tr("profile.updatePhotoMsg")}
        primary={{ label: tr("profile.changePhoto"), onPress: handleChangeAvatar }}
        secondary={{ label: tr("profile.removePhoto"), onPress: handleRemoveAvatar }}
      />

      <AppModal
        visible={photoSuccessAction !== null}
        onClose={() => setPhotoSuccessAction(null)}
        tone="success"
        icon={CircleCheck}
        title={tr(
          photoSuccessAction === "remove"
            ? "profile.photoRemoved"
            : "profile.photoUpdated",
        )}
        message={tr(
          photoSuccessAction === "remove"
            ? "profile.photoRemovedMsg"
            : "profile.photoUpdatedMsg",
        )}
        primary={{
          label: tr("auth.resetDone"),
          onPress: () => setPhotoSuccessAction(null),
        }}
      />

      <AppModal
        visible={!!photoError}
        onClose={() => setPhotoError("")}
        tone="error"
        icon={CircleAlert}
        title={tr("profile.uploadFailed")}
        message={photoError}
        primary={{ label: tr("common.tryAgain"), onPress: () => setPhotoError("") }}
      />
    </SafeAreaView>
  );
};

export default Profile;
