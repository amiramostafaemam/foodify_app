// // // app/(auth)/_layout.tsx
// // import { images } from "@/constants";
// // import { Slot, usePathname } from "expo-router";
// // import {
// //   Dimensions,
// //   ImageBackground,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ScrollView,
// //   View,
// // } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";

// // export default function AuthLayout() {
// //   const pathname = usePathname();

// //   // ✅ شيلنا الـ redirect تماماً - كل حاجة من الـ success screen

// //   const Logo = images.Logo;

// //   const backgroundImage = pathname.includes("sign-up")
// //     ? images.signupGraphic
// //     : images.loginGraphic;

// //   return (
// //     <SafeAreaView className="flex-1 bg-white">
// //       <KeyboardAvoidingView
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //         className="flex-1"
// //       >
// //         <ScrollView
// //           className="flex-1"
// //           keyboardShouldPersistTaps="handled"
// //           showsVerticalScrollIndicator={false}
// //         >
// //           <View
// //             className="w-full relative"
// //             style={{ height: Dimensions.get("screen").height / 2.25 }}
// //           >
// //             {/* Background Image */}
// //             <ImageBackground
// //               source={backgroundImage}
// //               className="size-full rounded-b-lg"
// //               resizeMode="stretch"
// //             />

// //             {/* SVG LOGO */}
// //             <Logo
// //               width={192}
// //               height={192}
// //               style={{
// //                 position: "absolute",
// //                 bottom: -20,
// //                 alignSelf: "center",
// //                 zIndex: 10,
// //               }}
// //             />
// //           </View>

// //           {/* Page Content (sign-in / sign-up) */}
// //           <Slot />
// //         </ScrollView>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // }
// import { images } from "@/constants";
// import { Slot, usePathname } from "expo-router";
// import {
//   Dimensions,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function AuthLayout() {
//   const pathname = usePathname();

//   const Logo = images.Logo;

//   const backgroundImage = pathname.includes("sign-up")
//     ? images.signupGraphic
//     : images.loginGraphic;

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//       >
//         <ScrollView
//           className="flex-1"
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ flexGrow: 1 }}
//           bounces={false}
//         >
//           <View
//             className="w-full relative"
//             style={{ height: Dimensions.get("screen").height / 2.25 }}
//           >
//             {/* Background Image */}
//             <ImageBackground
//               source={backgroundImage}
//               className="size-full rounded-b-lg"
//               resizeMode="stretch"
//             />

//             {/* SVG LOGO */}
//             <Logo
//               width={192}
//               height={192}
//               style={{
//                 position: "absolute",
//                 bottom: -20,
//                 alignSelf: "center",
//                 zIndex: 10,
//               }}
//             />
//           </View>

//           {/* Page Content (sign-in / sign-up) */}
//           <View style={{ flex: 1 }}>
//             <Slot />
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }
import { images } from "@/constants";
import { Slot, usePathname } from "expo-router";
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  const pathname = usePathname();

  const Logo = images.Logo;

  const backgroundImage = pathname.includes("sign-up")
    ? images.signupGraphic
    : images.loginGraphic;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          bounces={false}
        >
          <View
            className="w-full relative"
            style={{ height: Dimensions.get("screen").height / 2.25 }}
          >
            {/* Background Image */}
            <ImageBackground
              source={backgroundImage}
              className="size-full rounded-b-lg"
              resizeMode="stretch"
            />

            {/* SVG LOGO */}
            <Logo
              width={192}
              height={192}
              style={{
                position: "absolute",
                bottom: -20,
                alignSelf: "center",
                zIndex: 10,
              }}
            />
          </View>

          {/* Page Content (sign-in / sign-up) */}
          <View style={{ flex: 1 }}>
            <Slot />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
