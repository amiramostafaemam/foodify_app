// // // // import CustomButton from "@/components/CustomButton";
// // // // import CustomInput from "@/components/CustomInput";
// // // // import { images } from "@/constants";
// // // // import { createUser } from "@/lib/appwrite";
// // // // import { Link, router } from "expo-router";
// // // // import { useEffect, useRef, useState } from "react";
// // // // import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

// // // // // Error Modal Component
// // // // const ErrorModal = ({
// // // //   visible,
// // // //   message,
// // // //   onClose,
// // // // }: {
// // // //   visible: boolean;
// // // //   message: string;
// // // //   onClose: () => void;
// // // // }) => {
// // // //   const scaleAnim = useRef(new Animated.Value(0)).current;
// // // //   const shakeAnim = useRef(new Animated.Value(0)).current;

// // // //   useEffect(() => {
// // // //     if (visible) {
// // // //       Animated.sequence([
// // // //         Animated.spring(scaleAnim, {
// // // //           toValue: 1,
// // // //           tension: 50,
// // // //           friction: 7,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //         Animated.sequence([
// // // //           Animated.timing(shakeAnim, {
// // // //             toValue: 10,
// // // //             duration: 100,
// // // //             useNativeDriver: true,
// // // //           }),
// // // //           Animated.timing(shakeAnim, {
// // // //             toValue: -10,
// // // //             duration: 100,
// // // //             useNativeDriver: true,
// // // //           }),
// // // //           Animated.timing(shakeAnim, {
// // // //             toValue: 10,
// // // //             duration: 100,
// // // //             useNativeDriver: true,
// // // //           }),
// // // //           Animated.timing(shakeAnim, {
// // // //             toValue: 0,
// // // //             duration: 100,
// // // //             useNativeDriver: true,
// // // //           }),
// // // //         ]),
// // // //       ]).start();
// // // //     } else {
// // // //       scaleAnim.setValue(0);
// // // //       shakeAnim.setValue(0);
// // // //     }
// // // //   }, [visible]);

// // // //   return (
// // // //     <View
// // // //       style={{
// // // //         display: visible ? "flex" : "none",
// // // //         position: "absolute",
// // // //         top: 0,
// // // //         left: 0,
// // // //         right: 0,
// // // //         bottom: 0,
// // // //         backgroundColor: "rgba(0,0,0,0.5)",
// // // //         justifyContent: "center",
// // // //         alignItems: "center",
// // // //         zIndex: 1000,
// // // //       }}
// // // //     >
// // // //       <Animated.View
// // // //         style={{
// // // //           transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
// // // //         }}
// // // //         className="bg-white rounded-3xl p-8 items-center mx-5 shadow-2xl"
// // // //       >
// // // //         <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
// // // //           <Text className="text-5xl">❌</Text>
// // // //         </View>

// // // //         <Text className="font-quicksand-bold text-2xl text-red-500 mb-3 text-center">
// // // //           Error
// // // //         </Text>
// // // //         <Text className="font-quicksand-regular text-base text-gray-400 mb-6 text-center">
// // // //           {message}
// // // //         </Text>

// // // //         <View className="w-full">
// // // //           <TouchableOpacity
// // // //             onPress={onClose}
// // // //             className="bg-red-500 py-4 px-5 rounded-xl items-center"
// // // //             activeOpacity={0.8}
// // // //           >
// // // //             <Text className="base-bold text-white">Try Again</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       </Animated.View>
// // // //     </View>
// // // //   );
// // // // };

// // // // const SignUp = () => {
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const [showSuccess, setShowSuccess] = useState(false);
// // // //   const [showErrorModal, setShowErrorModal] = useState(false);
// // // //   const [errorMessage, setErrorMessage] = useState("");
// // // //   const fadeAnim = useRef(new Animated.Value(1)).current;
// // // //   const successAnim = useRef(new Animated.Value(0)).current;

// // // //   const [form, setForm] = useState({
// // // //     name: "",
// // // //     email: "",
// // // //     password: "",
// // // //   });

// // // //   const submit = async () => {
// // // //     const { name, email, password } = form;
// // // //     if (!name || !email || !password) {
// // // //       setErrorMessage("Please fill all the fields");
// // // //       setShowErrorModal(true);
// // // //       return;
// // // //     }

// // // //     setIsSubmitting(true);
// // // //     try {
// // // //       await createUser({ name, email, password });

// // // //       // Animate transition to success screen
// // // //       Animated.sequence([
// // // //         Animated.timing(fadeAnim, {
// // // //           toValue: 0,
// // // //           duration: 300,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //       ]).start(() => {
// // // //         setShowSuccess(true);
// // // //         Animated.spring(successAnim, {
// // // //           toValue: 1,
// // // //           tension: 50,
// // // //           friction: 7,
// // // //           useNativeDriver: true,
// // // //         }).start();
// // // //       });
// // // //     } catch (error: any) {
// // // //       setErrorMessage(error.message || "Something went wrong!");
// // // //       setShowErrorModal(true);
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const handleErrorClose = () => {
// // // //     setShowErrorModal(false);
// // // //   };

// // // //   const handleGoToSignIn = () => {
// // // //     router.replace("/sign-in");
// // // //   };

// // // //   // Success Screen
// // // //   if (showSuccess) {
// // // //     return (
// // // //       <Animated.View
// // // //         style={{ transform: [{ scale: successAnim }] }}
// // // //         className="bg-white gap-5 rounded-lg p-5  items-center"
// // // //       >
// // // //         <Image
// // // //           source={images.successs}
// // // //           className="w-80 h-80"
// // // //           resizeMode="contain"
// // // //         />

// // // //         <Text className="font-quicksand-bold text-3xl text-primary text-center">
// // // //           Account Created!
// // // //         </Text>
// // // //         <Text className="font-quicksand-regular text-base text-gray-400 text-center px-5">
// // // //           Your account has been created successfully. Please sign in to
// // // //           continue.
// // // //         </Text>

// // // //         <CustomButton
// // // //           title="Sign In"
// // // //           onPress={handleGoToSignIn}
// // // //           style="w-full mt-5"
// // // //         />
// // // //       </Animated.View>
// // // //     );
// // // //   }

// // // //   // Sign Up Form
// // // //   return (
// // // //     <>
// // // //       <Animated.View
// // // //         style={{ opacity: fadeAnim }}
// // // //         className="bg-white gap-10 rounded-lg p-5 mt-5"
// // // //       >
// // // //         <CustomInput
// // // //           label="Full Name"
// // // //           placeholder="Enter Your Full Name"
// // // //           value={form.name}
// // // //           onChangeText={(text) => {
// // // //             setForm((prev) => ({ ...prev, name: text }));
// // // //           }}
// // // //         />
// // // //         <CustomInput
// // // //           label="Email"
// // // //           placeholder="Enter Your Email"
// // // //           value={form.email}
// // // //           onChangeText={(text) => {
// // // //             setForm((prev) => ({ ...prev, email: text }));
// // // //           }}
// // // //           secureTextEntry={false}
// // // //           keyboardType={"email-address"}
// // // //         />

// // // //         <CustomInput
// // // //           label="Password"
// // // //           placeholder="Enter Your Password"
// // // //           value={form.password}
// // // //           onChangeText={(text) => {
// // // //             setForm((prev) => ({ ...prev, password: text }));
// // // //           }}
// // // //           secureTextEntry={true}
// // // //         />
// // // //         <CustomButton
// // // //           title="Sign Up"
// // // //           isLoading={isSubmitting}
// // // //           onPress={submit}
// // // //         />
// // // //         <View className="flex justify-center mt-5 flex-row gap-2">
// // // //           <Text className="base-regular text-gray-100">
// // // //             Already have an account?
// // // //           </Text>
// // // //           <Link href="/sign-in" className="base-bold text-primary">
// // // //             <Text> Sign In</Text>
// // // //           </Link>
// // // //         </View>
// // // //       </Animated.View>

// // // //       {/* Error Modal */}
// // // //       <ErrorModal
// // // //         visible={showErrorModal}
// // // //         message={errorMessage}
// // // //         onClose={handleErrorClose}
// // // //       />
// // // //     </>
// // // //   );
// // // // };

// // // // export default SignUp;
// // // import CustomButton from "@/components/CustomButton";
// // // import CustomInput from "@/components/CustomInput";
// // // import { images } from "@/constants";
// // // import { createUser } from "@/lib/appwrite";
// // // import { Link, router } from "expo-router";
// // // import { useEffect, useRef, useState } from "react";
// // // import {
// // //   Animated,
// // //   Image,
// // //   Keyboard,
// // //   Text,
// // //   TouchableOpacity,
// // //   View,
// // // } from "react-native";

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
// // //             className="bg-red-500 py-4 rounded-xl items-center"
// // //             activeOpacity={0.8}
// // //           >
// // //             <Text className="base-bold text-white">Try Again</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </Animated.View>
// // //     </View>
// // //   );
// // // };

// // // const SignUp = () => {
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [showSuccess, setShowSuccess] = useState(false);
// // //   const [showErrorModal, setShowErrorModal] = useState(false);
// // //   const [errorMessage, setErrorMessage] = useState("");
// // //   const fadeAnim = useRef(new Animated.Value(1)).current;
// // //   const successAnim = useRef(new Animated.Value(0)).current;

// // //   const [form, setForm] = useState({
// // //     name: "",
// // //     email: "",
// // //     password: "",
// // //   });

// // //   // ✅ دالة لتحويل رسائل الخطأ لرسائل واضحة
// // //   const getErrorMessage = (error: any): string => {
// // //     const errorMessage = error?.message || error?.toString() || "";

// // //     // User already exists
// // //     if (
// // //       errorMessage.includes("user_already_exists") ||
// // //       errorMessage.includes("already exists") ||
// // //       errorMessage.includes("A user with the same email already exists")
// // //     ) {
// // //       return "This email is already registered. Please use a different email or sign in.";
// // //     }

// // //     // Invalid email
// // //     if (
// // //       errorMessage.includes("invalid_email") ||
// // //       errorMessage.includes("Invalid email")
// // //     ) {
// // //       return "Please enter a valid email address.";
// // //     }

// // //     // Password too short
// // //     if (
// // //       errorMessage.includes("password_policy") ||
// // //       errorMessage.includes("Password must be") ||
// // //       errorMessage.includes("at least")
// // //     ) {
// // //       return "Password must be at least 8 characters long.";
// // //     }

// // //     // Network error
// // //     if (
// // //       errorMessage.includes("network") ||
// // //       errorMessage.includes("Failed to fetch")
// // //     ) {
// // //       return "Network error. Please check your internet connection.";
// // //     }

// // //     return errorMessage || "Something went wrong! Please try again.";
// // //   };

// // //   const submit = async () => {
// // //     const { name, email, password } = form;

// // //     // ✅ Dismiss keyboard before submitting
// // //     Keyboard.dismiss();

// // //     if (!name || !email || !password) {
// // //       setErrorMessage("Please fill all the fields");
// // //       setShowErrorModal(true);
// // //       return;
// // //     }

// // //     // ✅ Validate name
// // //     if (name.trim().length < 2) {
// // //       setErrorMessage("Name must be at least 2 characters long");
// // //       setShowErrorModal(true);
// // //       return;
// // //     }

// // //     // ✅ Validate email format
// // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // //     if (!emailRegex.test(email)) {
// // //       setErrorMessage("Please enter a valid email address");
// // //       setShowErrorModal(true);
// // //       return;
// // //     }

// // //     // ✅ Validate password
// // //     if (password.length < 8) {
// // //       setErrorMessage("Password must be at least 8 characters long");
// // //       setShowErrorModal(true);
// // //       return;
// // //     }

// // //     setIsSubmitting(true);
// // //     try {
// // //       await createUser({
// // //         name: name.trim(),
// // //         email: email.toLowerCase().trim(),
// // //         password,
// // //       });

// // //       // Animate transition to success screen
// // //       Animated.sequence([
// // //         Animated.timing(fadeAnim, {
// // //           toValue: 0,
// // //           duration: 300,
// // //           useNativeDriver: true,
// // //         }),
// // //       ]).start(() => {
// // //         setShowSuccess(true);
// // //         Animated.spring(successAnim, {
// // //           toValue: 1,
// // //           tension: 50,
// // //           friction: 7,
// // //           useNativeDriver: true,
// // //         }).start();
// // //       });
// // //     } catch (error: any) {
// // //       setErrorMessage(getErrorMessage(error));
// // //       setShowErrorModal(true);
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const handleErrorClose = () => {
// // //     setShowErrorModal(false);
// // //   };

// // //   const handleGoToSignIn = () => {
// // //     router.replace("/sign-in");
// // //   };

// // //   // Success Screen
// // //   if (showSuccess) {
// // //     return (
// // //       <Animated.View
// // //         style={{ transform: [{ scale: successAnim }] }}
// // //         className="bg-white gap-5 rounded-lg p-5 items-center"
// // //       >
// // //         <Image
// // //           source={images.successs}
// // //           className="w-80 h-80"
// // //           resizeMode="contain"
// // //         />

// // //         <Text className="font-quicksand-bold text-3xl text-primary text-center">
// // //           Account Created!
// // //         </Text>
// // //         <Text className="font-quicksand-regular text-base text-gray-400 text-center px-5">
// // //           Your account has been created successfully. Please sign in to
// // //           continue.
// // //         </Text>

// // //         <CustomButton
// // //           title="Sign In"
// // //           onPress={handleGoToSignIn}
// // //           style="w-full mt-5"
// // //         />
// // //       </Animated.View>
// // //     );
// // //   }

// // //   // Sign Up Form
// // //   return (
// // //     <>
// // //       <Animated.View
// // //         style={{ opacity: fadeAnim }}
// // //         className="bg-white gap-10 rounded-lg p-5 mt-5"
// // //       >
// // //         <CustomInput
// // //           label="Full Name"
// // //           placeholder="Enter Your Full Name"
// // //           value={form.name}
// // //           onChangeText={(text) => {
// // //             setForm((prev) => ({ ...prev, name: text }));
// // //           }}
// // //           // autoCapitalize="words"
// // //           // autoComplete="name"
// // //         />
// // //         <CustomInput
// // //           label="Email"
// // //           placeholder="Enter Your Email"
// // //           value={form.email}
// // //           onChangeText={(text) => {
// // //             setForm((prev) => ({ ...prev, email: text }));
// // //           }}
// // //           secureTextEntry={false}
// // //           keyboardType={"email-address"}
// // //           // autoCapitalize="none"
// // //           // autoComplete="email"
// // //         />

// // //         <CustomInput
// // //           label="Password"
// // //           placeholder="Enter Your Password"
// // //           value={form.password}
// // //           onChangeText={(text) => {
// // //             setForm((prev) => ({ ...prev, password: text }));
// // //           }}
// // //           secureTextEntry={true}
// // //           // autoCapitalize="none"
// // //           // autoComplete="password"
// // //         />
// // //         <CustomButton
// // //           title="Sign Up"
// // //           isLoading={isSubmitting}
// // //           onPress={submit}
// // //         />
// // //         <View className="flex justify-center mt-5 flex-row gap-2">
// // //           <Text className="base-regular text-gray-100">
// // //             Already have an account?
// // //           </Text>
// // //           <Link href="/sign-in" className="base-bold text-primary">
// // //             <Text> Sign In</Text>
// // //           </Link>
// // //         </View>
// // //       </Animated.View>

// // //       {/* Error Modal */}
// // //       <ErrorModal
// // //         visible={showErrorModal}
// // //         message={errorMessage}
// // //         onClose={handleErrorClose}
// // //       />
// // //     </>
// // //   );
// // // };

// // // export default SignUp;
// // import CustomButton from "@/components/CustomButton";
// // import CustomInput from "@/components/CustomInput";
// // import { images } from "@/constants";
// // import { createUser } from "@/lib/appwrite";
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

// // const SignUp = () => {
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [showSuccess, setShowSuccess] = useState(false);
// //   const [showErrorModal, setShowErrorModal] = useState(false);
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const fadeAnim = useRef(new Animated.Value(1)).current;
// //   const successAnim = useRef(new Animated.Value(0)).current;

// //   const [form, setForm] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //   });

// //   // ✅ دالة لتحويل رسائل الخطأ لرسائل واضحة
// //   const getErrorMessage = (error: any): string => {
// //     const errorMessage = error?.message || error?.toString() || "";

// //     // User already exists
// //     if (
// //       errorMessage.includes("user_already_exists") ||
// //       errorMessage.includes("already exists") ||
// //       errorMessage.includes("A user with the same email already exists")
// //     ) {
// //       return "This email is already registered. Please use a different email or sign in.";
// //     }

// //     // Invalid email
// //     if (
// //       errorMessage.includes("invalid_email") ||
// //       errorMessage.includes("Invalid email")
// //     ) {
// //       return "Please enter a valid email address.";
// //     }

// //     // Password too short
// //     if (
// //       errorMessage.includes("password_policy") ||
// //       errorMessage.includes("Password must be") ||
// //       errorMessage.includes("at least")
// //     ) {
// //       return "Password must be at least 8 characters long.";
// //     }

// //     // Network error
// //     if (
// //       errorMessage.includes("network") ||
// //       errorMessage.includes("Failed to fetch")
// //     ) {
// //       return "Network error. Please check your internet connection.";
// //     }

// //     return errorMessage || "Something went wrong! Please try again.";
// //   };

// //   const submit = async () => {
// //     const { name, email, password } = form;

// //     // ✅ Dismiss keyboard before submitting
// //     Keyboard.dismiss();

// //     if (!name || !email || !password) {
// //       setErrorMessage("Please fill all the fields");
// //       setShowErrorModal(true);
// //       return;
// //     }

// //     // ✅ Validate name
// //     if (name.trim().length < 2) {
// //       setErrorMessage("Name must be at least 2 characters long");
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

// //     // ✅ Validate password
// //     if (password.length < 8) {
// //       setErrorMessage("Password must be at least 8 characters long");
// //       setShowErrorModal(true);
// //       return;
// //     }

// //     setIsSubmitting(true);
// //     try {
// //       await createUser({
// //         name: name.trim(),
// //         email: email.toLowerCase().trim(),
// //         password,
// //       });

// //       // Animate transition to success screen
// //       Animated.sequence([
// //         Animated.timing(fadeAnim, {
// //           toValue: 0,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }),
// //       ]).start(() => {
// //         setShowSuccess(true);
// //         Animated.spring(successAnim, {
// //           toValue: 1,
// //           tension: 50,
// //           friction: 7,
// //           useNativeDriver: true,
// //         }).start();
// //       });
// //     } catch (error: any) {
// //       setErrorMessage(getErrorMessage(error));
// //       setShowErrorModal(true);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleErrorClose = () => {
// //     setShowErrorModal(false);
// //   };

// //   const handleGoToSignIn = () => {
// //     router.replace("/sign-in");
// //   };

// //   // Success Screen
// //   if (showSuccess) {
// //     return (
// //       <Animated.View
// //         style={{ transform: [{ scale: successAnim }] }}
// //         className="bg-white gap-5 rounded-lg p-5 items-center"
// //       >
// //         <Image
// //           source={images.successs}
// //           className="w-80 h-80"
// //           resizeMode="contain"
// //         />

// //         <Text className="font-quicksand-bold text-3xl text-primary text-center">
// //           Account Created!
// //         </Text>
// //         <Text className="font-quicksand-regular text-base text-gray-400 text-center px-5">
// //           Your account has been created successfully. Please sign in to
// //           continue.
// //         </Text>

// //         <CustomButton
// //           title="Sign In"
// //           onPress={handleGoToSignIn}
// //           style="w-full mt-5"
// //         />
// //       </Animated.View>
// //     );
// //   }

// //   // Sign Up Form
// //   return (
// //     <>
// //       <Animated.View
// //         style={{ opacity: fadeAnim }}
// //         className="bg-white gap-10 rounded-lg p-5 mt-5"
// //       >
// //         <CustomInput
// //           label="Full Name"
// //           placeholder="Enter Your Full Name"
// //           value={form.name}
// //           onChangeText={(text) => {
// //             setForm((prev) => ({ ...prev, name: text }));
// //           }}
// //         />
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
// //           title="Sign Up"
// //           isLoading={isSubmitting}
// //           onPress={submit}
// //         />
// //         <View className="flex justify-center mt-5 flex-row gap-2">
// //           <Text className="base-regular text-gray-100">
// //             Already have an account?
// //           </Text>
// //           <Link href="/sign-in" className="base-bold text-primary">
// //             <Text> Sign In</Text>
// //           </Link>
// //         </View>
// //       </Animated.View>

// //       {/* Error Modal */}
// //       <ErrorModal
// //         visible={showErrorModal}
// //         message={errorMessage}
// //         onClose={handleErrorClose}
// //       />
// //     </>
// //   );
// // };

// // export default SignUp;
// import CustomButton from "@/components/CustomButton";
// import CustomInput from "@/components/CustomInput";
// import { images } from "@/constants";
// import { createUser } from "@/lib/appwrite";
// import { Link, router } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Image,
//   Keyboard,
//   Modal,
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

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="none"
//       onRequestClose={onClose}
//     >
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: "rgba(0,0,0,0.5)",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Animated.View
//           style={{
//             transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
//           }}
//           className="bg-white rounded-3xl p-8 items-center mx-5 shadow-2xl w-5/6"
//         >
//           <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
//             <Text className="text-5xl">❌</Text>
//           </View>

//           <Text className="font-quicksand-bold text-2xl text-red-500 mb-3 text-center">
//             Error
//           </Text>
//           <Text className="font-quicksand-regular text-base text-gray-400 mb-6 text-center">
//             {message}
//           </Text>

//           <View className="w-full">
//             <TouchableOpacity
//               onPress={onClose}
//               className="bg-red-500 py-4 rounded-xl items-center"
//               activeOpacity={0.8}
//             >
//               <Text className="base-bold text-white">Try Again</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// const SignUp = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const fadeAnim = useRef(new Animated.Value(1)).current;
//   const successAnim = useRef(new Animated.Value(0)).current;

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   // ✅ دالة لتحويل رسائل الخطأ لرسائل واضحة
//   const getErrorMessage = (error: any): string => {
//     const errorMessage = error?.message || error?.toString() || "";

//     // User already exists
//     if (
//       errorMessage.includes("user_already_exists") ||
//       errorMessage.includes("already exists") ||
//       errorMessage.includes("A user with the same email already exists")
//     ) {
//       return "This email is already registered. Please use a different email or sign in.";
//     }

//     // Invalid email
//     if (
//       errorMessage.includes("invalid_email") ||
//       errorMessage.includes("Invalid email")
//     ) {
//       return "Please enter a valid email address.";
//     }

//     // Password too short
//     if (
//       errorMessage.includes("password_policy") ||
//       errorMessage.includes("Password must be") ||
//       errorMessage.includes("at least")
//     ) {
//       return "Password must be at least 8 characters long.";
//     }

//     // Network error
//     if (
//       errorMessage.includes("network") ||
//       errorMessage.includes("Failed to fetch")
//     ) {
//       return "Network error. Please check your internet connection.";
//     }

//     return errorMessage || "Something went wrong! Please try again.";
//   };

//   const submit = async () => {
//     const { name, email, password } = form;

//     // ✅ Dismiss keyboard before submitting
//     Keyboard.dismiss();

//     if (!name || !email || !password) {
//       setErrorMessage("Please fill all the fields");
//       setShowErrorModal(true);
//       return;
//     }

//     // ✅ Validate name
//     if (name.trim().length < 2) {
//       setErrorMessage("Name must be at least 2 characters long");
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

//     // ✅ Validate password
//     if (password.length < 8) {
//       setErrorMessage("Password must be at least 8 characters long");
//       setShowErrorModal(true);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await createUser({
//         name: name.trim(),
//         email: email.toLowerCase().trim(),
//         password,
//       });

//       // Animate transition to success screen
//       Animated.sequence([
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ]).start(() => {
//         setShowSuccess(true);
//         Animated.spring(successAnim, {
//           toValue: 1,
//           tension: 50,
//           friction: 7,
//           useNativeDriver: true,
//         }).start();
//       });
//     } catch (error: any) {
//       setErrorMessage(getErrorMessage(error));
//       setShowErrorModal(true);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleErrorClose = () => {
//     setShowErrorModal(false);
//   };

//   const handleGoToSignIn = () => {
//     router.replace("/(auth)/sign-in");
//   };

//   // Success Screen
//   if (showSuccess) {
//     return (
//       <View className="flex-1 p-5 justify-center">
//         <Animated.View
//           style={{ transform: [{ scale: successAnim }] }}
//           className="bg-white gap-5 rounded-lg p-5 items-center"
//         >
//           <Image
//             source={images.successs}
//             className="w-80 h-80"
//             resizeMode="contain"
//           />

//           <Text className="font-quicksand-bold text-3xl text-primary text-center">
//             Account Created!
//           </Text>
//           <Text className="font-quicksand-regular text-base text-gray-400 text-center px-5">
//             Your account has been created successfully. Please sign in to
//             continue.
//           </Text>

//           <CustomButton
//             title="Sign In"
//             onPress={handleGoToSignIn}
//             style="w-full mt-5"
//           />
//         </Animated.View>
//       </View>
//     );
//   }

//   // Sign Up Form
//   return (
//     <View className="flex-1">
//       <Animated.View
//         style={{ opacity: fadeAnim }}
//         className="bg-white gap-10 rounded-lg p-5 mt-5"
//       >
//         <CustomInput
//           label="Full Name"
//           placeholder="Enter Your Full Name"
//           value={form.name}
//           onChangeText={(text) => {
//             setForm((prev) => ({ ...prev, name: text }));
//           }}
//         />
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
//           title="Sign Up"
//           isLoading={isSubmitting}
//           onPress={submit}
//         />
//         <View className="flex justify-center mt-5 flex-row gap-2">
//           <Text className="base-regular text-gray-100">
//             Already have an account?
//           </Text>
//           <Link href="/sign-in" className="base-bold text-primary">
//             <Text> Sign In</Text>
//           </Link>
//         </View>
//       </Animated.View>

//       <ErrorModal
//         visible={showErrorModal}
//         message={errorMessage}
//         onClose={handleErrorClose}
//       />
//     </View>
//   );
// };

// export default SignUp;
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { images } from "@/constants";
import { createUser } from "@/lib/appwrite";
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

// Error Modal Component (نفس الكود)
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

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false); // ✅ جديد
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ دالة لتحويل رسائل الخطأ لرسائل واضحة
  const getErrorMessage = (error: any): string => {
    const errorMessage = error?.message || error?.toString() || "";

    // User already exists
    if (
      errorMessage.includes("user_already_exists") ||
      errorMessage.includes("already exists") ||
      errorMessage.includes("A user with the same email already exists")
    ) {
      return "This email is already registered. Please use a different email or sign in.";
    }

    // Invalid email
    if (
      errorMessage.includes("invalid_email") ||
      errorMessage.includes("Invalid email")
    ) {
      return "Please enter a valid email address.";
    }

    // Password too short
    if (
      errorMessage.includes("password_policy") ||
      errorMessage.includes("Password must be") ||
      errorMessage.includes("at least")
    ) {
      return "Password must be at least 8 characters long.";
    }

    // Network error
    if (
      errorMessage.includes("network") ||
      errorMessage.includes("Failed to fetch")
    ) {
      return "Network error. Please check your internet connection.";
    }

    return errorMessage || "Something went wrong! Please try again.";
  };

  const submit = async () => {
    const { name, email, password } = form;

    // ✅ Dismiss keyboard before submitting
    Keyboard.dismiss();

    if (!name || !email || !password) {
      setErrorMessage("Please fill all the fields");
      setShowErrorModal(true);
      return;
    }

    // ✅ Validate name
    if (name.trim().length < 2) {
      setErrorMessage("Name must be at least 2 characters long");
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

    // ✅ Validate password
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
      });

      // Animate transition to success screen
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSuccess(true);
        Animated.spring(successAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      });
    } catch (error: any) {
      setErrorMessage(getErrorMessage(error));
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
  };

  const handleGoToSignIn = () => {
    // ✅ نحدث الـ state عشان نعمل redirect
    setShouldRedirect(true);
  };

  // ✅ Redirect
  if (shouldRedirect) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Success Screen
  if (showSuccess) {
    return (
      <View className="flex-1 p-5 justify-center">
        <Animated.View
          style={{ transform: [{ scale: successAnim }] }}
          className="bg-white gap-5 rounded-lg p-5 items-center"
        >
          <Image
            source={images.successs}
            className="w-80 h-80"
            resizeMode="contain"
          />

          <Text className="font-quicksand-bold text-3xl text-primary text-center">
            Account Created!
          </Text>
          <Text className="font-quicksand-regular text-base text-gray-400 text-center px-5">
            Your account has been created successfully. Please sign in to
            continue.
          </Text>

          <CustomButton
            title="Sign In"
            onPress={handleGoToSignIn}
            style="w-full mt-5"
          />
        </Animated.View>
      </View>
    );
  }

  // Sign Up Form
  return (
    <View className="flex-1">
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="bg-white gap-10 rounded-lg p-5 mt-5"
      >
        <CustomInput
          label="Full Name"
          placeholder="Enter Your Full Name"
          value={form.name}
          onChangeText={(text) => {
            setForm((prev) => ({ ...prev, name: text }));
          }}
        />
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
          title="Sign Up"
          isLoading={isSubmitting}
          onPress={submit}
        />
        <View className="flex justify-center mt-5 flex-row gap-2">
          <Text className="base-regular text-gray-100">
            Already have an account?
          </Text>
          <Link href="/sign-in" className="base-bold text-primary">
            <Text> Sign In</Text>
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

export default SignUp;
