import type { UploadFile } from "@/lib/appwrite";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

/**
 * Opens the photo library, lets the user crop a square, and returns a file
 * descriptor ready for `uploadImage`. Returns null if cancelled or denied.
 */
export const pickSquareImage = async (): Promise<UploadFile | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      "Permission needed",
      "Allow photo access to set a profile picture.",
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.6,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  const extension = asset.uri.split(".").pop()?.toLowerCase() || "jpg";

  return {
    uri: asset.uri,
    name: asset.fileName ?? `avatar.${extension}`,
    type: asset.mimeType ?? `image/${extension === "jpg" ? "jpeg" : extension}`,
    size: asset.fileSize ?? 0,
  };
};
