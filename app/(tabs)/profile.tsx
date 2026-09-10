import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import ProfileField from "@/components/ProfileField";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { Mail, MapPin, Phone, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Logout Confirmation Modal Component
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
  const shakeAnim = useAnimatedValue(0);

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
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
          }}
        >
          <View className="w-full max-w-sm items-center rounded-3xl bg-white p-8 shadow-2xl">
            <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <Image
                source={require("@/assets/icons/logout.png")}
                className="h-12 w-12"
                tintColor="#EF4444"
              />
            </View>

            <Text className="mb-3 text-center font-quicksand-bold text-2xl text-dark-100">
              Logout
            </Text>
            <Text className="mb-6 text-center font-quicksand text-base text-gray-100">
              Are you sure you want to logout?
            </Text>

            <View className="w-full gap-3">
              <TouchableOpacity
                onPress={onConfirm}
                className="items-center rounded-xl bg-error py-4"
                activeOpacity={0.8}
              >
                <Text className="base-bold text-white">Logout</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onCancel}
                className="items-center rounded-xl bg-gray-100/20 py-4"
                activeOpacity={0.8}
              >
                <Text className="base-bold text-dark-100">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const Profile = () => {
  const { user, logout, isLoading } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleEdit = () => {
    router.push("/edit-profile");
  };

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
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

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-center h-full bg-white">
        <Text className="paragraph-regular text-gray-200">Loading...</Text>
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

  // Generate Avatar with first letter
  const avatarLetter = user.name?.charAt(0).toUpperCase() || "?";

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        contentContainerClassName="px-5 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader title="Profile" />

        {/* Avatar Section with Letter */}
        <View className="flex-center mb-8">
          <View className="h-32 w-32 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/30">
            <Text className="font-quicksand-bold text-6xl text-white">
              {avatarLetter}
            </Text>
          </View>
        </View>

        {/* User Info Card */}
        <View className="shadow-gray/20 mb-6 rounded-2xl bg-gray-50 p-5 shadow-sm">
          <Text className="h3-bold mb-4 text-primary">
            Personal Information
          </Text>

          <ProfileField
            label="Full Name"
            value={user.name || "Not provided"}
            icon={User}
          />

          <ProfileField
            label="Email"
            value={user.email || "Not provided"}
            icon={Mail}
          />

          <ProfileField
            label="Phone Number"
            value={user.phone || "Not provided"}
            icon={Phone}
          />
        </View>

        {/* Addresses Card */}
        <View className="shadow-gray/20 mb-6 rounded-2xl bg-gray-50 p-5 shadow-sm">
          <Text className="h3-bold mb-4 text-primary">Addresses</Text>

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

        {/* Action Buttons */}
        <View className="mt-2 gap-4">
          <CustomButton
            title="Edit Profile"
            onPress={handleEdit}
            style="custom-btn"
            textStyle="paragraph-bold text-white"
          />

          <TouchableOpacity
            onPress={handleLogoutPress}
            className="flex-center w-full flex-row rounded-xl border-2 border-red-500 p-4"
          >
            <Image
              source={require("@/assets/icons/logout.png")}
              className="mr-2 h-6 w-6"
              tintColor="#EF4444"
            />
            <Text className="paragraph-bold text-red-500">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        visible={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </SafeAreaView>
  );
};

export default Profile;
