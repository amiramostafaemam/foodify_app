import { Image } from "@/components/CachedImage";
import { Camera } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface AvatarProps {
  name?: string;
  uri?: string | null;
  size?: number;
  editable?: boolean;
  uploading?: boolean;
  onEditPress?: () => void;
}

const Avatar = ({
  name,
  uri,
  size = 128,
  editable = false,
  uploading = false,
  onEditPress,
}: AvatarProps) => {
  const [failed, setFailed] = useState(false);
  const letter = name?.trim().charAt(0).toUpperCase() || "?";
  const showImage = !!uri && !failed;

  return (
    <View style={{ width: size, height: size }} className="relative">
      <View
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className="items-center justify-center overflow-hidden bg-primary shadow-lg shadow-primary/30"
      >
        {showImage ? (
          <Image
            source={{ uri }}
            style={{ width: size, height: size }}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            onError={() => setFailed(true)}
          />
        ) : (
          <Text
            style={{ fontSize: size * 0.42 }}
            className="font-quicksand-bold text-white"
          >
            {letter}
          </Text>
        )}

        {uploading && (
          <View className="absolute inset-0 items-center justify-center bg-black/40">
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </View>

      {editable && (
        <TouchableOpacity
          onPress={onEditPress}
          disabled={uploading}
          className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-primary"
          accessibilityLabel="Change profile photo"
        >
          <Camera size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Avatar;
