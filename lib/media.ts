import type { UploadFile } from "@/lib/appwrite";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

// No avatar needs to be bigger than this to look sharp at any size it's
// actually displayed at in the app — capping it here keeps the upload (and
// every later download of it) fast regardless of how many megapixels the
// device's camera produces.
const AVATAR_MAX_DIMENSION = 640;

/**
 * Opens the photo library, lets the user crop a square, downsizes it to a
 * sane avatar resolution, and returns a file descriptor ready for
 * `uploadImage`. Returns null if cancelled or denied.
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

  // The cropper above only enforces a 1:1 *aspect ratio* — a modern phone
  // camera still hands back a multi-megapixel square (e.g. 3000×3000),
  // which `quality: 0.6` alone can't shrink much since JPEG compression
  // doesn't reduce pixel dimensions. Resize down before upload.
  const resized = await manipulateAsync(
    asset.uri,
    [{ resize: { width: AVATAR_MAX_DIMENSION, height: AVATAR_MAX_DIMENSION } }],
    { compress: 0.7, format: SaveFormat.JPEG },
  );

  return {
    uri: resized.uri,
    name: `avatar-${Date.now()}.jpg`,
    type: "image/jpeg",
    size: 0,
  };
};
