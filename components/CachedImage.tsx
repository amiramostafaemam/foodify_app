import { Image } from "expo-image";
import { cssInterop } from "nativewind";

// expo-image with NativeWind `className` support. Import this instead of
// "expo-image" directly so the interop is registered exactly once.
cssInterop(Image, { className: "style" });

export { Image };
