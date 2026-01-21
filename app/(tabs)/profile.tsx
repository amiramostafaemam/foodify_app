import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import ProfileField from "@/components/ProfileField";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { Mail, MapPin, Phone, User } from "lucide-react-native";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, logout, isLoading } = useAuthStore();

  const handleEdit = () => {
    router.push("/edit-profile");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/(auth)/sign-in");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
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

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="px-5 pb-10">
        <CustomHeader title="Profile" />

        {/* Avatar Section */}
        <View className="flex-center mb-8">
          <View className="profile-avatar">
            <Image
              source={{ uri: user.avatar || "https://via.placeholder.com/150" }}
              className="size-28 rounded-full"
              resizeMode="cover"
            />
            {/* <TouchableOpacity className="profile-edit" onPress={handleEdit}>
              <Edit2 size={14} color="#FFFFFF" />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* User Info Fields */}
        <View className="mb-6">
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

          <ProfileField
            label="Address 1 - (Home)"
            value={user.address_home || "Not provided"}
            icon={MapPin}
          />

          <ProfileField
            label="Address 2 - (Work)"
            value={user.address_work || "Not provided"}
            icon={MapPin}
          />
        </View>

        {/* Action Buttons */}
        <View className="gap-4 mt-6">
          <CustomButton
            title="Edit Profile"
            onPress={handleEdit}
            style="custom-btn"
            textStyle="paragraph-bold text-white"
          />

          <TouchableOpacity
            onPress={handleLogout}
            className="border-2 border-red-500 rounded-full p-3 w-full flex-center"
          >
            <Text className="paragraph-bold text-red-500">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
