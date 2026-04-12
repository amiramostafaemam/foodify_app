// // // import CustomButton from "@/components/CustomButton";
// // // import CustomInput from "@/components/CustomInput";
// // // import { images } from "@/constants";
// // // import useAuthStore from "@/store/auth.store";
// // // import { Link, router } from "expo-router";
// // // import { useEffect, useRef, useState } from "react";
// // // import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

// // // // Error Modal Component
// // // const ErrorModal = ({
// // //   visible,
// // //   message,
// // //   onClose,
// // // }: {
// // //   visible: boolean;
// // //   message: string;
// // //   onClose: () => void;
// // // }) => {
// // //   const scaleAnim = useRef(new Animated.Value(0)).current;
// // //   const shakeAnim = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     if (visible) {
// // //       Animated.sequence([
// // //         Animated.spring(scaleAnim, {
// // //           toValue: 1,
// // //           tension: 50,
// // //           friction: 7,
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.sequence([
// // //           Animated.timing(shakeAnim, {
// // //             toValue: 10,
// // //             duration: 100,
// // //             useNativeDriver: true,
// // //           }),
// // //           Animated.timing(shakeAnim, {
// // //             toValue: -10,
// // //             duration: 100,
// // //             useNativeDriver: true,
// // //           }),
// // //           Animated.timing(shakeAnim, {
// // //             toValue: 10,
// // //             duration: 100,
// // //             useNativeDriver: true,
// // //           }),
// // //           Animated.timing(shakeAnim, {
// // //             toValue: 0,
// // //             duration: 100,
// // //             useNativeDriver: true,
// // //           }),
// // //         ]),
// // //       ]).start();
// // //     } else {
// // //       scaleAnim.setValue(0);
// // //       shakeAnim.setValue(0);
// // //     }
// // //   }, [visible]);

// // //   return (
// // //     <View
// // //       style={{
// // //         display: visible ? "flex" : "none",
// // //         position: "absolute",
// // //         top: 0,
// // //         left: 0,
// // //         right: 0,
// // //         bottom: 0,
// // //         backgroundColor: "rgba(0,0,0,0.5)",
// // //         justifyContent: "center",
// // //         alignItems: "center",
// // //         zIndex: 1000,
// // //       }}
// // //     >
// // //       <Animated.View
// // //         style={{
// // //           transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
// // //         }}
// // //         className="bg-white rounded-3xl p-8 items-center mx-5 shadow-2xl"
// // //       >
// // //         <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
// // //           <Text className="text-5xl">❌</Text>
// // //         </View>

// // //         <Text className="font-quicksand-bold text-2xl text-red-500 mb-3 text-center">
// // //           Error
// // //         </Text>
// // //         <Text className="font-quicksand-regular text-base text-gray-400 mb-6 text-center">
// // //           {message}
// // //         </Text>

// // //         <View className="w-full">
// // //           <TouchableOpacity
// // //             onPress={onClose}
// // //             className="bg-red-500 px-5 py-4 rounded-xl items-center"
// // //             activeOpacity={0.8}
// // //           >
// // //             <Text className="base-bold text-white">Try Again</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </Animated.View>
// // //     </View>
// // //   );
// // // };

// // // const SignIn = () => {
// // //   const { login } = useAuthStore();
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [showSuccess, setShowSuccess] = useState(false);
// // //   const [showErrorModal, setShowErrorModal] = useState(false);
// // //   const [errorMessage, setErrorMessage] = useState("");
// // //   const fadeAnim = useRef(new Animated.Value(1)).current;
// // //   const successAnim = useRef(new Animated.Value(0)).current;

// // //   const [form, setForm] = useState({
// // //     email: "",
// // //     password: "",
// // //   });

// // //   const submit = async () => {
// // //     const { email, password } = form;
// // //     if (!email || !password) {
// // //       setErrorMessage("Please enter valid email address and password");
// // //       setShowErrorModal(true);
// // //       return;
// // //     }

// // //     setIsSubmitting(true);
// // //     try {
// // //       await login(email, password);

// // //       // Show success screen
// // //       Animated.timing(fadeAnim, {
// // //         toValue: 0,
// // //         duration: 300,
// // //         useNativeDriver: true,
// // //       }).start(() => {
// // //         setShowSuccess(true);
// // //         setIsSubmitting(false);

// // //         Animated.spring(successAnim, {
// // //           toValue: 1,
// // //           tension: 50,
// // //           friction: 7,
// // //           useNativeDriver: true,
// // //         }).start();
// // //       });
// // //     } catch (error: any) {
// // //       setIsSubmitting(false);
// // //       setErrorMessage(error.message || "Something went wrong!");
// // //       setShowErrorModal(true);
// // //     }
// // //   };

// // //   const handleErrorClose = () => {
// // //     setShowErrorModal(false);
// // //   };

// // //   const handleGoToHome = () => {
// // //     router.replace("/");
// // //   };

// // //   // Success Screen
// // //   if (showSuccess) {
// // //     return (
// // //       <Animated.View
// // //         style={{ transform: [{ scale: successAnim }] }}
// // //         className="bg-white rounded-3xl p-8 mt-5 items-center shadow-xl mx-5"
// // //       >
// // //         <View className="items-center mb-6">
// // //           <Image
// // //             source={images.successs}
// // //             className="w-48 h-48"
// // //             resizeMode="contain"
// // //           />
// // //         </View>

// // //         <Text className="font-quicksand-bold text-3xl text-dark-100 text-center mb-3">
// // //           Login Successful
// // //         </Text>
// // //         <Text className="font-quicksand-regular text-base text-gray-400 text-center mb-8 px-4">
// // //           You are all set to continue where you left off.
// // //         </Text>

// // //         <CustomButton
// // //           title="Go to Homepage"
// // //           onPress={handleGoToHome}
// // //           style="w-full"
// // //         />
// // //       </Animated.View>
// // //     );
// // //   }

// // //   // Sign In Form
// // //   return (
// // //     <>
// // //       <Animated.View
// // //         style={{ opacity: fadeAnim }}
// // //         className="bg-white gap-10 rounded-lg p-5 mt-5"
// // //       >
// // //         <CustomInput
// // //           label="Email"
// // //           placeholder="Enter Your Email"
// // //           value={form.email}
// // //           onChangeText={(text) => {
// // //             setForm((prev) => ({ ...prev, email: text }));
// // //           }}
// // //           secureTextEntry={false}
// // //           keyboardType={"email-address"}
// // //         />

// // //         <CustomInput
// // //           label="Password"
// // //           placeholder="Enter Your Password"
// // //           value={form.password}
// // //           onChangeText={(text) => {
// // //             setForm((prev) => ({ ...prev, password: text }));
// // //           }}
// // //           secureTextEntry={true}
// // //         />
// // //         <CustomButton
// // //           title="Sign In"
// // //           isLoading={isSubmitting}
// // //           onPress={submit}
// // //         />
// // //         <View className="flex justify-center mt-3 flex-row gap-2">
// // //           <Text className="base-regular text-gray-100">
// // //             Don&apos;t have an account?
// // //           </Text>
// // //           <Link href="/sign-up" className="base-bold text-primary">
// // //             <Text> Sign Up</Text>
// // //           </Link>
// // //         </View>
// // //       </Animated.View>

// // //       <ErrorModal
// // //         visible={showErrorModal}
// // //         message={errorMessage}
// // //         onClose={handleErrorClose}
// // //       />
// // //     </>
// // //   );
// // // };

// // // export default SignIn;
// // // import CustomButton from "@/components/CustomButton";
// // import CustomButton from "@/components/CustomButton";
// // import CustomInput from "@/components/CustomInput";
// // import { images } from "@/constants";
// // import useAuthStore from "@/store/auth.store";
// // import { User } from "@/type";
// // import { Link, router } from "expo-router";
// // import { useEffect, useRef, useState } from "react";
// // import {
// //   Animated,
// //   Image,
// //   Keyboard,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";

// // // Error Modal Component
// // const ErrorModal = ({
// //   visible,
// //   message,
// //   onClose,
// // }: {
// //   visible: boolean;
// //   message: string;
// //   onClose: () => void;
// // }) => {
// //   const scaleAnim = useRef(new Animated.Value(0)).current;
// //   const shakeAnim = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     if (visible) {
// //       Animated.sequence([
// //         Animated.spring(scaleAnim, {
// //           toValue: 1,
// //           tension: 50,
// //           friction: 7,
// //           useNativeDriver: true,
// //         }),
// //         Animated.sequence([
// //           Animated.timing(shakeAnim, {
// //             toValue: 10,
// //             duration: 100,
// //             useNativeDriver: true,
// //           }),
// //           Animated.timing(shakeAnim, {
// //             toValue: -10,
// //             duration: 100,
// //             useNativeDriver: true,
// //           }),
// //           Animated.timing(shakeAnim, {
// //             toValue: 10,
// //             duration: 100,
// //             useNativeDriver: true,
// //           }),
// //           Animated.timing(shakeAnim, {
// //             toValue: 0,
// //             duration: 100,
// //             useNativeDriver: true,
// //           }),
// //         ]),
// //       ]).start();
// //     } else {
// //       scaleAnim.setValue(0);
// //       shakeAnim.setValue(0);
// //     }
// //   }, [visible]);

// //   return (
// //     <View
// //       style={{
// //         display: visible ? "flex" : "none",
// //         position: "absolute",
// //         top: 0,
// //         left: 0,
// //         right: 0,
// //         bottom: 0,
// //         backgroundColor: "rgba(0,0,0,0.5)",
// //         justifyContent: "center",
// //         alignItems: "center",
// //         zIndex: 1000,
// //       }}
// //     >
// //       <Animated.View
// //         style={{
// //           transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
// //         }}
// //         className="bg-white rounded-3xl p-8 items-center mx-5 shadow-2xl"
// //       >
// //         <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
// //           <Text className="text-5xl">❌</Text>
// //         </View>

// //         <Text className="font-quicksand-bold text-2xl text-red-500 mb-3 text-center">
// //           Error
// //         </Text>
// //         <Text className="font-quicksand-regular text-base text-gray-400 mb-6 text-center">
// //           {message}
// //         </Text>

// //         <View className="w-full">
// //           <TouchableOpacity
// //             onPress={onClose}
// //             className="bg-red-500 py-4 rounded-xl items-center"
// //             activeOpacity={0.8}
// //           >
// //             <Text className="base-bold text-white">Try Again</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </Animated.View>
// //     </View>
// //   );
// // };

// // const SignIn = () => {
// //   const { login, completeLogin } = useAuthStore();
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [showSuccess, setShowSuccess] = useState(false);
// //   const [showErrorModal, setShowErrorModal] = useState(false);
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const [userData, setUserData] = useState<User | null>(null);
// //   const fadeAnim = useRef(new Animated.Value(1)).current;
// //   const successAnim = useRef(new Animated.Value(0)).current;

// //   const [form, setForm] = useState({
// //     email: "",
// //     password: "",
// //   });

// //   // ✅ دالة لتحويل رسائل الخطأ لرسائل واضحة
// //   const getErrorMessage = (error: any): string => {
// //     const errorMessage = error?.message || error?.toString() || "";

// //     // Invalid credentials
// //     if (
// //       errorMessage.includes("Invalid credentials") ||
// //       errorMessage.includes("invalid_credentials") ||
// //       errorMessage.includes("Invalid email or password")
// //     ) {
// //       return "Invalid email or password. Please check your credentials and try again.";
// //     }

// //     // User not found
// //     if (
// //       errorMessage.includes("user_not_found") ||
// //       errorMessage.includes("User not found")
// //     ) {
// //       return "No account found with this email. Please sign up first.";
// //     }

// //     // Network error
// //     if (
// //       errorMessage.includes("network") ||
// //       errorMessage.includes("Failed to fetch")
// //     ) {
// //       return "Network error. Please check your internet connection.";
// //     }

// //     // Too many requests
// //     if (
// //       errorMessage.includes("too_many_requests") ||
// //       errorMessage.includes("Rate limit")
// //     ) {
// //       return "Too many attempts. Please try again later.";
// //     }

// //     return errorMessage || "Something went wrong! Please try again.";
// //   };

// //   const submit = async () => {
// //     const { email, password } = form;

// //     // ✅ Dismiss keyboard before submitting
// //     Keyboard.dismiss();

// //     if (!email || !password) {
// //       setErrorMessage("Please enter your email and password");
// //       setShowErrorModal(true);
// //       return;
// //     }

// //     // ✅ Validate email format
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(email)) {
// //       setErrorMessage("Please enter a valid email address");
// //       setShowErrorModal(true);
// //       return;
// //     }

// //     setIsSubmitting(true);
// //     try {
// //       const user = await login(email, password);
// //       setUserData(user);

// //       // Show success screen
// //       Animated.timing(fadeAnim, {
// //         toValue: 0,
// //         duration: 300,
// //         useNativeDriver: true,
// //       }).start(() => {
// //         setShowSuccess(true);
// //         setIsSubmitting(false);

// //         Animated.spring(successAnim, {
// //           toValue: 1,
// //           tension: 50,
// //           friction: 7,
// //           useNativeDriver: true,
// //         }).start();
// //       });
// //     } catch (error: any) {
// //       setIsSubmitting(false);
// //       setErrorMessage(getErrorMessage(error));
// //       setShowErrorModal(true);
// //     }
// //   };

// //   const handleErrorClose = () => {
// //     setShowErrorModal(false);
// //   };

// //   const handleGoToHome = () => {
// //     if (userData) {
// //       completeLogin(userData);
// //     }
// //     router.replace("/");
// //   };

// //   // Success Screen
// //   if (showSuccess) {
// //     return (
// //       <Animated.View
// //         style={{ transform: [{ scale: successAnim }] }}
// //         className="bg-white rounded-3xl p-8 mt-5 items-center shadow-xl mx-5"
// //       >
// //         <View className="items-center mb-6">
// //           <Image
// //             source={images.successs}
// //             className="w-48 h-48"
// //             resizeMode="contain"
// //           />
// //         </View>

// //         <Text className="font-quicksand-bold text-3xl text-dark-100 text-center mb-3">
// //           Login Successful
// //         </Text>
// //         <Text className="font-quicksand-regular text-base text-gray-400 text-center mb-8 px-4">
// //           You are all set to continue where you left off.
// //         </Text>

// //         <CustomButton
// //           title="Go to Homepage"
// //           onPress={handleGoToHome}
// //           style="w-full"
// //         />
// //       </Animated.View>
// //     );
// //   }

// //   // Sign In Form
// //   return (
// //     <>
// //       <Animated.View
// //         style={{ opacity: fadeAnim }}
// //         className="bg-white gap-10 rounded-lg p-5 mt-5"
// //       >
// //         <CustomInput
// //           label="Email"
// //           placeholder="Enter Your Email"
// //           value={form.email}
// //           onChangeText={(text) => {
// //             setForm((prev) => ({ ...prev, email: text }));
// //           }}
// //           secureTextEntry={false}
// //           keyboardType={"email-address"}
// //         />

// //         <CustomInput
// //           label="Password"
// //           placeholder="Enter Your Password"
// //           value={form.password}
// //           onChangeText={(text) => {
// //             setForm((prev) => ({ ...prev, password: text }));
// //           }}
// //           secureTextEntry={true}
// //         />
// //         <CustomButton
// //           title="Sign In"
// //           isLoading={isSubmitting}
// //           onPress={submit}
// //         />
// //         <View className="flex justify-center mt-3 flex-row gap-2">
// //           <Text className="base-regular text-gray-100">
// //             Don&apos;t have an account?
// //           </Text>
// //           <Link href="/sign-up" className="base-bold text-primary">
// //             <Text> Sign Up</Text>
// //           </Link>
// //         </View>
// //       </Animated.View>

// //       <ErrorModal
// //         visible={showErrorModal}
// //         message={errorMessage}
// //         onClose={handleErrorClose}
// //       />
// //     </>
// //   );
// // };

// // export default SignIn;
// import CustomButton from "@/components/CustomButton";
// import CustomInput from "@/components/CustomInput";
// import { images } from "@/constants";
// import useAuthStore from "@/store/auth.store";
// import { User } from "@/type";
// import { Link, router } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Image,
//   Keyboard,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // Error Modal Component
// const ErrorModal = ({
//   visible,
//   message,
//   onClose,
// }: {
//   visible: boolean;
//   message: string;
//   onClose: () => void;
// }) => {
//   const scaleAnim = useRef(new Animated.Value(0)).current;
//   const shakeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.sequence([
//         Animated.spring(scaleAnim, {
//           toValue: 1,
//           tension: 50,
//           friction: 7,
//           useNativeDriver: true,
//         }),
//         Animated.sequence([
//           Animated.timing(shakeAnim, {
//             toValue: 10,
//             duration: 100,
//             useNativeDriver: true,
//           }),
//           Animated.timing(shakeAnim, {
//             toValue: -10,
//             duration: 100,
//             useNativeDriver: true,
//           }),
//           Animated.timing(shakeAnim, {
//             toValue: 10,
//             duration: 100,
//             useNativeDriver: true,
//           }),
//           Animated.timing(shakeAnim, {
//             toValue: 0,
//             duration: 100,
//             useNativeDriver: true,
//           }),
//         ]),
//       ]).start();
//     } else {
//       scaleAnim.setValue(0);
//       shakeAnim.setValue(0);
//     }
//   }, [visible]);

//   if (!visible) return null;

//   return (
//     <View
//       style={{
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 1000,
//       }}
//     >
//       <Animated.View
//         style={{
//           transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
//         }}
//         className="bg-white rounded-3xl p-8 items-center mx-5 shadow-2xl"
//       >
//         <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
//           <Text className="text-5xl">❌</Text>
//         </View>

//         <Text className="font-quicksand-bold text-2xl text-red-500 mb-3 text-center">
//           Error
//         </Text>
//         <Text className="font-quicksand-regular text-base text-gray-400 mb-6 text-center">
//           {message}
//         </Text>

//         <View className="w-full">
//           <TouchableOpacity
//             onPress={onClose}
//             className="bg-red-500 py-4 rounded-xl items-center"
//             activeOpacity={0.8}
//           >
//             <Text className="base-bold text-white">Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     </View>
//   );
// };

// const SignIn = () => {
//   const { login, completeLogin } = useAuthStore();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [userData, setUserData] = useState<User | null>(null);
//   const fadeAnim = useRef(new Animated.Value(1)).current;
//   const successAnim = useRef(new Animated.Value(0)).current;

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   // ✅ دالة لتحويل رسائل الخطأ لرسائل واضحة
//   const getErrorMessage = (error: any): string => {
//     const errorMessage = error?.message || error?.toString() || "";

//     console.log("Error received:", errorMessage);

//     // Invalid credentials
//     if (
//       errorMessage.toLowerCase().includes("invalid credentials") ||
//       errorMessage.toLowerCase().includes("invalid_credentials") ||
//       errorMessage.toLowerCase().includes("invalid email or password") ||
//       errorMessage.toLowerCase().includes("wrong password")
//     ) {
//       return "Invalid email or password. Please check your credentials and try again.";
//     }

//     // User not found
//     if (
//       errorMessage.toLowerCase().includes("user_not_found") ||
//       errorMessage.toLowerCase().includes("user not found") ||
//       errorMessage.toLowerCase().includes("no user found")
//     ) {
//       return "No account found with this email. Please sign up first.";
//     }

//     // Network error
//     if (
//       errorMessage.toLowerCase().includes("network") ||
//       errorMessage.toLowerCase().includes("failed to fetch")
//     ) {
//       return "Network error. Please check your internet connection.";
//     }

//     // Too many requests
//     if (
//       errorMessage.toLowerCase().includes("too_many_requests") ||
//       errorMessage.toLowerCase().includes("rate limit")
//     ) {
//       return "Too many attempts. Please try again later.";
//     }

//     return errorMessage || "Something went wrong! Please try again.";
//   };

//   const submit = async () => {
//     const { email, password } = form;

//     // ✅ Dismiss keyboard before submitting
//     Keyboard.dismiss();

//     if (!email || !password) {
//       setErrorMessage("Please enter your email and password");
//       setShowErrorModal(true);
//       return;
//     }

//     // ✅ Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setErrorMessage("Please enter a valid email address");
//       setShowErrorModal(true);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const user = await login(email.toLowerCase().trim(), password);
//       setUserData(user);

//       // Show success screen
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => {
//         setShowSuccess(true);
//         setIsSubmitting(false);

//         Animated.spring(successAnim, {
//           toValue: 1,
//           tension: 50,
//           friction: 7,
//           useNativeDriver: true,
//         }).start();
//       });
//     } catch (error: any) {
//       console.log("Submit error:", error);
//       setIsSubmitting(false);
//       setErrorMessage(getErrorMessage(error));
//       setShowErrorModal(true);
//     }
//   };

//   const handleErrorClose = () => {
//     setShowErrorModal(false);
//   };

//   const handleGoToHome = () => {
//     if (userData) {
//       completeLogin(userData);
//     }
//     // ✅ استخدمنا setTimeout عشان نتأكد إن الـ state اتحدث
//     setTimeout(() => {
//       router.replace("/(tabs)");
//     }, 100);
//   };

//   // Success Screen
//   if (showSuccess) {
//     return (
//       <View className="flex-1 p-5">
//         <Animated.View
//           style={{ transform: [{ scale: successAnim }] }}
//           className="bg-white rounded-3xl p-8 items-center shadow-xl"
//         >
//           <View className="items-center mb-6">
//             <Image
//               source={images.successs}
//               className="w-48 h-48"
//               resizeMode="contain"
//             />
//           </View>

//           <Text className="font-quicksand-bold text-3xl text-dark-100 text-center mb-3">
//             Login Successful
//           </Text>
//           <Text className="font-quicksand-regular text-base text-gray-400 text-center mb-8 px-4">
//             You are all set to continue where you left off.
//           </Text>

//           <CustomButton
//             title="Go to Homepage"
//             onPress={handleGoToHome}
//             style="w-full"
//           />
//         </Animated.View>
//       </View>
//     );
//   }

//   // Sign In Form
//   return (
//     <View className="flex-1">
//       <Animated.View
//         style={{ opacity: fadeAnim }}
//         className="bg-white gap-10 rounded-lg p-5 mt-5"
//       >
//         <CustomInput
//           label="Email"
//           placeholder="Enter Your Email"
//           value={form.email}
//           onChangeText={(text) => {
//             setForm((prev) => ({ ...prev, email: text }));
//           }}
//           secureTextEntry={false}
//           keyboardType={"email-address"}
//         />

//         <CustomInput
//           label="Password"
//           placeholder="Enter Your Password"
//           value={form.password}
//           onChangeText={(text) => {
//             setForm((prev) => ({ ...prev, password: text }));
//           }}
//           secureTextEntry={true}
//         />
//         <CustomButton
//           title="Sign In"
//           isLoading={isSubmitting}
//           onPress={submit}
//         />
//         <View className="flex justify-center mt-3 flex-row gap-2">
//           <Text className="base-regular text-gray-100">
//             Don&apos;t have an account?
//           </Text>
//           <Link href="/sign-up" className="base-bold text-primary">
//             <Text> Sign Up</Text>
//           </Link>
//         </View>
//       </Animated.View>

//       {showErrorModal && (
//         <ErrorModal
//           visible={showErrorModal}
//           message={errorMessage}
//           onClose={handleErrorClose}
//         />
//       )}
//     </View>
//   );
// };

// export default SignIn;
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { User } from "@/type";
import { Link, Redirect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Error Modal Component
const ErrorModal = ({
  visible,
  message,
  onClose,
}: {
  visible: boolean;
  message: string;
  onClose: () => void;
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
            toValue: 10,
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
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
          }}
          className="bg-white rounded-3xl p-8 items-center mx-5 shadow-2xl w-5/6"
        >
          <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
            <Text className="text-5xl">❌</Text>
          </View>

          <Text className="font-quicksand-bold text-2xl text-red-500 mb-3 text-center">
            Error
          </Text>
          <Text className="font-quicksand-regular text-base text-gray-400 mb-6 text-center">
            {message}
          </Text>

          <View className="w-full">
            <TouchableOpacity
              onPress={onClose}
              className="bg-red-500 py-4 rounded-xl items-center"
              activeOpacity={0.8}
            >
              <Text className="base-bold text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const SignIn = () => {
  const { login, completeLogin } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState<User | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false); // ✅ جديد
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const getErrorMessage = (error: any): string => {
    const errorMessage = error?.message || error?.toString() || "";

    console.log("Error received:", errorMessage);

    // Invalid credentials
    if (
      errorMessage.toLowerCase().includes("invalid credentials") ||
      errorMessage.toLowerCase().includes("invalid_credentials") ||
      errorMessage.toLowerCase().includes("invalid email or password") ||
      errorMessage.toLowerCase().includes("wrong password")
    ) {
      return "Invalid email or password. Please check your credentials and try again.";
    }

    // User not found
    if (
      errorMessage.toLowerCase().includes("user_not_found") ||
      errorMessage.toLowerCase().includes("user not found") ||
      errorMessage.toLowerCase().includes("no user found")
    ) {
      return "No account found with this email. Please sign up first.";
    }

    // Network error
    if (
      errorMessage.toLowerCase().includes("network") ||
      errorMessage.toLowerCase().includes("failed to fetch")
    ) {
      return "Network error. Please check your internet connection.";
    }

    // Too many requests
    if (
      errorMessage.toLowerCase().includes("too_many_requests") ||
      errorMessage.toLowerCase().includes("rate limit")
    ) {
      return "Too many attempts. Please try again later.";
    }

    return errorMessage || "Something went wrong! Please try again.";
  };

  const submit = async () => {
    const { email, password } = form;

    // ✅ Dismiss keyboard before submitting
    Keyboard.dismiss();

    if (!email || !password) {
      setErrorMessage("Please enter your email and password");
      setShowErrorModal(true);
      return;
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email.toLowerCase().trim(), password);
      setUserData(user);

      // Show success screen
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSuccess(true);
        setIsSubmitting(false);

        Animated.spring(successAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      });
    } catch (error: any) {
      console.log("Submit error:", error);
      setIsSubmitting(false);
      setErrorMessage(getErrorMessage(error));
      setShowErrorModal(true);
    }
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
  };

  const handleGoToHome = () => {
    if (userData) {
      completeLogin(userData);
      // ✅ نحدث الـ state عشان نعمل redirect
      setShouldRedirect(true);
    }
  };

  // ✅ Redirect بعد ما نحدث الـ authentication
  if (shouldRedirect) {
    return <Redirect href="/(tabs)" />;
  }

  // Success Screen
  if (showSuccess) {
    return (
      <View className="flex-1 p-5 justify-center">
        <Animated.View
          style={{ transform: [{ scale: successAnim }] }}
          className="bg-white rounded-3xl p-8 items-center shadow-xl"
        >
          <View className="items-center mb-6">
            <Image
              source={images.successs}
              className="w-48 h-48"
              resizeMode="contain"
            />
          </View>

          <Text className="font-quicksand-bold text-3xl text-dark-100 text-center mb-3">
            Login Successful
          </Text>
          <Text className="font-quicksand-regular text-base text-gray-400 text-center mb-8 px-4">
            You are all set to continue where you left off.
          </Text>

          <CustomButton
            title="Go to Homepage"
            onPress={handleGoToHome}
            style="w-full"
          />
        </Animated.View>
      </View>
    );
  }

  // Sign In Form
  return (
    <View className="flex-1">
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="bg-white gap-10 rounded-lg p-5 mt-5"
      >
        <CustomInput
          label="Email"
          placeholder="Enter Your Email"
          value={form.email}
          onChangeText={(text) => {
            setForm((prev) => ({ ...prev, email: text }));
          }}
          secureTextEntry={false}
          keyboardType={"email-address"}
        />

        <CustomInput
          label="Password"
          placeholder="Enter Your Password"
          value={form.password}
          onChangeText={(text) => {
            setForm((prev) => ({ ...prev, password: text }));
          }}
          secureTextEntry={true}
        />
        <CustomButton
          title="Sign In"
          isLoading={isSubmitting}
          onPress={submit}
        />
        <View className="flex justify-center mt-3 flex-row gap-2">
          <Text className="base-regular text-gray-100">
            Don&apos;t have an account?
          </Text>
          <Link href="/sign-up" className="base-bold text-primary">
            <Text> Sign Up</Text>
          </Link>
        </View>
      </Animated.View>

      <ErrorModal
        visible={showErrorModal}
        message={errorMessage}
        onClose={handleErrorClose}
      />
    </View>
  );
};

export default SignIn;
