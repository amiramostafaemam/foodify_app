import { Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

const ProfileField = ({ label, value, icon: Icon }: ProfileFieldProps) => {
  return (
    <View className="profile-field">
      <View className="profile-field__icon">
        <Icon size={20} color="#FE8C00" />
      </View>
      <View className="flex-1">
        <Text className="body-regular text-muted">{label}</Text>
        <Text className="paragraph-semibold text-content">{value}</Text>
      </View>
    </View>
  );
};

export default ProfileField;
