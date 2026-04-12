import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import ProfileField from "@/components/ProfileField";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { Mail, MapPin, Phone, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
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
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-5">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
          }}
          className="bg-white rounded-3xl p-8 items-center w-full max-w-sm shadow-2xl"
        >
          {/* Warning Icon */}
          <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
            <Image
              source={require("@/assets/icons/logout.png")}
              className="w-12 h-12"
              tintColor="#EF4444"
            />
          </View>

          {/* Logout Text */}
          <Text className="font-quicksand-bold text-2xl text-dark-100 mb-3 text-center">
            Logout
          </Text>
          <Text className="font-quicksand-regular text-base text-gray-400 mb-6 text-center">
            Are you sure you want to logout?
          </Text>

          {/* Action Buttons */}
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={onConfirm}
              className="bg-red-500 py-4 rounded-xl items-center"
              activeOpacity={0.8}
            >
              <Text className="base-bold text-white">Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel}
              className="bg-[#F3F4F6] py-4 rounded-xl items-center"
              activeOpacity={0.8}
            >
              <Text className="base-bold text-[#1F2937]">Cancel</Text>
            </TouchableOpacity>
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
      <SafeAreaView className="bg-white h-full flex-center">
        <Text className="paragraph-regular text-gray-200">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="bg-white h-full flex-center">
        <Text className="paragraph-regular text-gray-200">
          No user data found
        </Text>
      </SafeAreaView>
    );
  }

  // Generate Avatar with first letter
  const avatarLetter = user.name?.charAt(0).toUpperCase() || "?";

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerClassName="px-5 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader title="Profile" />

        {/* Avatar Section with Letter */}
        <View className="flex-center mb-8">
          <View className="w-32 h-32 rounded-full bg-primary items-center justify-center shadow-xl shadow-primary/30">
            <Text className="text-6xl font-quicksand-bold text-white">
              {avatarLetter}
            </Text>
          </View>
        </View>

        {/* User Info Card */}
        <View className="bg-gray-50 rounded-2xl p-5 mb-6 shadow-sm shadow-gray/20">
          <Text className="h3-bold text-primary mb-4">
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
        <View className="bg-gray-50 rounded-2xl p-5 mb-6 shadow-sm shadow-gray/20">
          <Text className="h3-bold text-primary mb-4">Addresses</Text>

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
        <View className="gap-4 mt-2">
          <CustomButton
            title="Edit Profile"
            onPress={handleEdit}
            style="custom-btn"
            textStyle="paragraph-bold text-white"
          />

          <TouchableOpacity
            onPress={handleLogoutPress}
            className="border-2 border-red-500 rounded-xl p-4 w-full flex-center flex-row"
          >
            <Image
              source={require("@/assets/icons/logout.png")}
              className="w-6 h-6 mr-2"
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
