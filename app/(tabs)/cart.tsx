import CartItem from "@/components/CartItem";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import { createOrder } from "@/lib/appwrite";
import { createPaymentIntent } from "@/lib/payment.service";
import { useStripe } from "@/lib/stripe";
import useAuthStore from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { PaymentInfoStripeProps, PaymentMethod } from "@/type";
import cn from "clsx";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentInfoStripe = ({
  label,
  value,
  labelStyle,
  valueStyle,
}: PaymentInfoStripeProps) => (
  <View className="flex-between my-1 flex-row">
    <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
      {label}
    </Text>
    <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
      {value}
    </Text>
  </View>
);

// Success Modal Component
const SuccessModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(checkAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      checkAnim.setValue(0);
    }
  }, [visible, scaleAnim, checkAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="w-full max-w-sm items-center rounded-3xl bg-white p-8 shadow-2xl"
        >
          <Image
            source={images.successs}
            className="mb-2 h-60  w-60 items-center justify-center"
            resizeMode="contain"
          />

          {/* Success Text */}
          <Text className="mb-3 text-center font-quicksand-bold text-2xl text-primary">
            Order Confirmed !
          </Text>
          <Text className="font-quicksand-regular mb-6 text-center text-base text-gray-400">
            Your food is being prepared and will be delivered shortly.
          </Text>

          {/* Action Buttons */}
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="items-center rounded-xl bg-primary py-4"
              activeOpacity={0.8}
            >
              <Text className="base-bold text-white">Back to Home</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Cancel Modal Component
const CancelModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
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
  }, [visible, scaleAnim, shakeAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
          }}
          className="w-full max-w-sm items-center rounded-3xl bg-white p-8 shadow-2xl"
        >
          {/* Cancel Image */}
          <Image
            source={images.canceled}
            className="mb-2 h-60 w-60 items-center justify-center"
            resizeMode="contain"
          />

          {/* Cancel Text */}
          <Text className="mb-3 text-center font-quicksand-bold text-2xl text-red-500">
            Payment Cancelled !
          </Text>
          <Text className="font-quicksand-regular mb-6 text-center text-base text-gray-400">
            Your payment was cancelled. Your cart items are still saved.
          </Text>

          {/* Action Buttons */}
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="items-center rounded-xl bg-primary py-4"
              activeOpacity={0.8}
            >
              <Text className="base-bold text-white">Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onClose();
                router.push("/");
              }}
              className="items-center rounded-xl bg-[#F3F4F6] py-4"
              activeOpacity={0.8}
            >
              <Text className="base-bold text-[#1F2937]">Back to Home</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const Cart = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const deliveryFee = 5.0;
  const discount = 0.5;
  const finalAmount = totalPrice + deliveryFee - discount;

  // Handle Card Payment
  const handleCardPayment = async () => {
    if (!user) {
      Alert.alert("Error", "Please login to continue");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create Payment Intent
      const paymentResponse = await createPaymentIntent({
        amount: finalAmount,
        currency: "usd",
        customerEmail: user.email,
        customerName: user.name,
      });

      if (!paymentResponse.success || !paymentResponse.clientSecret) {
        throw new Error(paymentResponse.error || "Failed to create payment");
      }

      // Step 2: Initialize Payment Sheet - Enhanced Appearance
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Foodify",
        paymentIntentClientSecret: paymentResponse.clientSecret,
        defaultBillingDetails: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },

        appearance: {
          colors: {
            // Brand
            primary: "#F59E0B",

            // Backgrounds
            background: "#FFFFFF",
            componentBackground: "#FFFBEB",

            // Borders & Dividers
            componentBorder: "#FDE68A",
            componentDivider: "#E5E7EB",

            // Text
            componentText: "#111827",
            primaryText: "#111827",
            secondaryText: "#6B7280",
            placeholderText: "#9CA3AF",

            // Icons & States
            icon: "#F59E0B",
            error: "#EF4444",
          },

          shapes: {
            borderRadius: 14,
            borderWidth: 1.25,
          },

          primaryButton: {
            colors: {
              background: "#F59E0B",
              text: "#FFFFFF",
              border: "#F59E0B",
            },
            shapes: {
              borderRadius: 14,
            },
          },
        },

        allowsDelayedPaymentMethods: true,
      });

      if (initError) {
        throw new Error(initError.message);
      }

      // Step 3: Present Payment Sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === "Canceled") {
          setShowCancelModal(true);
        } else {
          Alert.alert("Payment Failed", presentError.message);
        }
        setIsProcessing(false);
        return;
      }

      // Step 4: Payment Success - Create Order
      await createOrder({
        userId: user.$id,
        items: JSON.stringify(items),
        totalAmount: totalPrice,
        deliveryFee,
        discount,
        finalAmount,
        paymentIntentId: paymentResponse.paymentIntentId!,
        paymentStatus: "succeeded",
        orderStatus: "pending",
        deliveryAddress: user.address_home || "",
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || "",
      });

      // Clear cart and show success modal
      clearCart();
      setShowSuccessModal(true);
    } catch (error: any) {
      Alert.alert("Payment Failed", error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Cash Payment
  const handleCashPayment = async () => {
    if (!user) {
      Alert.alert("Error", "Please login to continue");
      return;
    }

    setIsProcessing(true);

    try {
      await createOrder({
        userId: user.$id,
        items: JSON.stringify(items),
        totalAmount: totalPrice,
        deliveryFee,
        discount,
        finalAmount,
        paymentIntentId: "cash_on_delivery",
        paymentStatus: "cash_on_delivery",
        orderStatus: "pending",
        deliveryAddress: user.address_home || "",
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || "",
      });

      clearCart();
      setShowSuccessModal(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOrderNow = () => {
    if (!selectedPaymentMethod) {
      Alert.alert(
        "Select Payment Method",
        "Please select a payment method to continue",
      );
      return;
    }

    if (selectedPaymentMethod === "card") {
      handleCardPayment();
    } else {
      handleCashPayment();
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/");
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.cartItemId}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => (
          <View className="mt-20 flex-1 items-center justify-center">
            <Image
              source={images.emptycart}
              className="mb-6 h-80 w-80"
              resizeMode="contain"
            />
            <Text className="h3-bold text-[#878787]">Your cart is empty</Text>
            <Text className="paragraph-regular mt-2 text-[#878787]">
              Add some delicious items to get started!
            </Text>
          </View>
        )}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              {/* Payment Summary */}
              <View className="shadow-gray/50 mt-6 rounded-2xl bg-white p-5 shadow-lg ">
                <Text className="h3-bold mb-5 text-primary">
                  Payment Summary
                </Text>

                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`$${totalPrice.toFixed(2)}`}
                />
                <PaymentInfoStripe
                  label={`Delivery Fee`}
                  value={`$${deliveryFee.toFixed(2)}`}
                />
                <PaymentInfoStripe
                  label={`Discount`}
                  value={`- $${discount.toFixed(2)}`}
                  valueStyle="!text-success"
                />
                <View className="my-2 border-t border-gray-300" />
                <PaymentInfoStripe
                  label={`Total`}
                  value={`$${finalAmount.toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>

              {/* Payment Method Selection */}
              <View className="shadow-gray/50 rounded-2xl bg-white p-5 shadow-lg">
                <Text className="h3-bold mb-4 text-primary">
                  Payment Method
                </Text>

                {/* Card Payment Option */}
                <TouchableOpacity
                  onPress={() => setSelectedPaymentMethod("card")}
                  className={cn(
                    "mb-3 flex-row items-center rounded-xl p-4",
                    selectedPaymentMethod === "card"
                      ? "border-[#F59E0B] bg-[#FEF3E2]/50"
                      : "border-gray-200 bg-white",
                  )}
                >
                  <View className="flex-1">
                    <Text className="base-bold text-dark-100">
                      💳 Credit/Debit Card
                    </Text>
                    <Text className="paragraph-regular text-gray-300">
                      Pay securely with Stripe
                    </Text>
                  </View>
                  <View
                    className={cn(
                      "h-6 w-6 items-center justify-center rounded-full border-2",
                      selectedPaymentMethod === "card"
                        ? "border-[#F59E0B] bg-[#F59E0B]"
                        : "border-gray-300",
                    )}
                  >
                    {selectedPaymentMethod === "card" && (
                      <View className="h-3 w-3 rounded-full bg-white" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Cash Payment Option */}
                <TouchableOpacity
                  onPress={() => setSelectedPaymentMethod("cash")}
                  className={cn(
                    "flex-row items-center rounded-xl p-4",
                    selectedPaymentMethod === "cash"
                      ? "border-[#F59E0B] bg-[#FEF3E2]/50"
                      : "border-gray-200 bg-white",
                  )}
                >
                  <View className="flex-1">
                    <Text className="base-bold text-dark-100">
                      💵 Cash on Delivery
                    </Text>
                    <Text className="paragraph-regular text-gray-300">
                      Pay when you receive
                    </Text>
                  </View>
                  <View
                    className={cn(
                      "h-6 w-6 items-center justify-center rounded-full border-2",
                      selectedPaymentMethod === "cash"
                        ? "border-[#F59E0B] bg-[#F59E0B]"
                        : "border-gray-300",
                    )}
                  >
                    {selectedPaymentMethod === "cash" && (
                      <View className="h-3 w-3 rounded-full bg-white" />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {/* Order Button */}
              <CustomButton
                title={isProcessing ? "Processing..." : "Order Now"}
                onPress={handleOrderNow}
                disabled={isProcessing}
                leftIcon={
                  isProcessing ? (
                    <ActivityIndicator color="white" className="mr-2" />
                  ) : undefined
                }
              />
            </View>
          )
        }
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />

      {/* Cancel Modal */}
      <CancelModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      />
    </SafeAreaView>
  );
};

export default Cart;
