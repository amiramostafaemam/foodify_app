// // app/(tabs)/cart.tsx
// import CartItem from "@/components/CartItem";
// import CustomButton from "@/components/CustomButton";
// import CustomHeader from "@/components/CustomHeader";
// import { useCartStore } from "@/store/cart.store";
// import { PaymentInfoStripeProps } from "@/type";
// import cn from "clsx";
// import { FlatList, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const PaymentInfoStripe = ({
//   label,
//   value,
//   labelStyle,
//   valueStyle,
// }: PaymentInfoStripeProps) => (
//   <View className="flex-between flex-row my-1">
//     <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
//       {label}
//     </Text>
//     <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
//       {value}
//     </Text>
//   </View>
// );

// const Cart = () => {
//   const { items, getTotalItems, getTotalPrice } = useCartStore();

//   const totalItems = getTotalItems();
//   const totalPrice = getTotalPrice();

//   return (
//     <SafeAreaView className="bg-white h-full">
//       <FlatList
//         data={items}
//         renderItem={({ item }) => <CartItem item={item} />}
//         keyExtractor={(item) => item.cartItemId}
//         contentContainerClassName="pb-28 px-5 pt-5"
//         ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
//         ListEmptyComponent={() => (
//           <View className="flex-1 items-center justify-center mt-20">
//             <Text className="h3-bold text-gray-400">Your cart is empty</Text>
//             <Text className="paragraph-regular text-gray-300 mt-2">
//               Add some delicious items to get started!
//             </Text>
//           </View>
//         )}
//         ListFooterComponent={() =>
//           totalItems > 0 && (
//             <View className="gap-5">
//               <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
//                 <Text className="h3-bold text-dark-100 mb-5">
//                   Payment Summary
//                 </Text>

//                 <PaymentInfoStripe
//                   label={`Total Items (${totalItems})`}
//                   value={`$${totalPrice.toFixed(2)}`}
//                 />
//                 <PaymentInfoStripe label={`Delivery Fee`} value={`$5.00`} />
//                 <PaymentInfoStripe
//                   label={`Discount`}
//                   value={`- $0.50`}
//                   valueStyle="!text-success"
//                 />
//                 <View className="border-t border-gray-300 my-2" />
//                 <PaymentInfoStripe
//                   label={`Total`}
//                   value={`$${(totalPrice + 5 - 0.5).toFixed(2)}`}
//                   labelStyle="base-bold !text-dark-100"
//                   valueStyle="base-bold !text-dark-100 !text-right"
//                 />
//               </View>

//               <CustomButton title="Order Now" />
//             </View>
//           )
//         }
//       />
//     </SafeAreaView>
//   );
// };

// export default Cart;
//////////////////////////////
// app/(tabs)/cart.tsx
import CartItem from "@/components/CartItem";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { createOrder } from "@/lib/appwrite";
import { createPaymentIntent } from "@/lib/payment.service";
import useAuthStore from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { PaymentInfoStripeProps, PaymentMethod } from "@/type";
import { useStripe } from "@stripe/stripe-react-native";
import cn from "clsx";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
  <View className="flex-between flex-row my-1">
    <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
      {label}
    </Text>
    <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
      {value}
    </Text>
  </View>
);

const Cart = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

      // Step 2: Initialize Payment Sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Foodify",
        paymentIntentClientSecret: paymentResponse.clientSecret,
        defaultBillingDetails: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });

      if (initError) {
        throw new Error(initError.message);
      }

      // Step 3: Present Payment Sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === "Canceled") {
          Alert.alert("Payment Cancelled", "You cancelled the payment");
        } else {
          throw new Error(presentError.message);
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

      // Clear cart and show success
      clearCart();
      Alert.alert(
        "Order Placed! 🎉",
        "Your order has been placed successfully",
        [
          {
            text: "OK",
            onPress: () => router.push("/"),
          },
        ],
      );
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
      Alert.alert(
        "Order Placed! 🎉",
        "Your order has been placed. Pay cash on delivery",
        [
          {
            text: "OK",
            onPress: () => router.push("/"),
          },
        ],
      );
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

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.cartItemId}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="h3-bold text-gray-400">Your cart is empty</Text>
            <Text className="paragraph-regular text-gray-300 mt-2">
              Add some delicious items to get started!
            </Text>
          </View>
        )}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              {/* Payment Summary */}
              <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">
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
                <View className="border-t border-gray-300 my-2" />
                <PaymentInfoStripe
                  label={`Total`}
                  value={`$${finalAmount.toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>

              {/* Payment Method Selection */}
              <View className="border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-4">
                  Payment Method
                </Text>

                {/* Card Payment Option */}
                <TouchableOpacity
                  onPress={() => setSelectedPaymentMethod("card")}
                  className={cn(
                    "flex-row items-center p-4 rounded-xl border-2 mb-3",
                    selectedPaymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200",
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
                      "w-6 h-6 rounded-full border-2 items-center justify-center",
                      selectedPaymentMethod === "card"
                        ? "border-primary bg-primary"
                        : "border-gray-300",
                    )}
                  >
                    {selectedPaymentMethod === "card" && (
                      <View className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Cash Payment Option */}
                <TouchableOpacity
                  onPress={() => setSelectedPaymentMethod("cash")}
                  className={cn(
                    "flex-row items-center p-4 rounded-xl border-2",
                    selectedPaymentMethod === "cash"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200",
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
                      "w-6 h-6 rounded-full border-2 items-center justify-center",
                      selectedPaymentMethod === "cash"
                        ? "border-primary bg-primary"
                        : "border-gray-300",
                    )}
                  >
                    {selectedPaymentMethod === "cash" && (
                      <View className="w-3 h-3 rounded-full bg-white" />
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
                // leftIcon={() =>
                //   isProcessing ? (
                //     <ActivityIndicator color="white" className="mr-2" />
                //   ) : null
                // }
              />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Cart;
