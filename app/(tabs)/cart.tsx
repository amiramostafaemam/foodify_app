import CartItem from "@/components/CartItem";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { TAB_BAR_SPACE } from "@/components/navigation/FloatingTabBar";
import { images } from "@/constants";
import { createOrder } from "@/lib/appwrite";
import { createPaymentIntent } from "@/lib/payment.service";
import { useStripe } from "@/lib/stripe";
import useAuthStore from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { PaymentInfoStripeProps, PaymentMethod } from "@/type";
import cn from "clsx";
import { router } from "expo-router";
import { ChevronLeft, MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DELIVERY_FEE = 2.99;
const FREE_DELIVERY_OVER = 30;
const APP_DISCOUNT = 1.0;

const SummaryRow = ({
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

const ResultModal = ({
  visible,
  onClose,
  image,
  title,
  message,
  primaryLabel,
  secondaryLabel,
  onSecondary,
  tone = "primary",
}: {
  visible: boolean;
  onClose: () => void;
  image: number;
  title: string;
  message: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
  tone?: "primary" | "error";
}) => {
  const scaleAnim = useAnimatedValue(0);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, scaleAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View className="w-full max-w-sm items-center rounded-3xl bg-white p-8 shadow-2xl">
            <Image
              source={image}
              className="mb-2 h-56 w-56"
              resizeMode="contain"
            />
            <Text
              className={cn(
                "mb-3 text-center font-quicksand-bold text-2xl",
                tone === "error" ? "text-error" : "text-primary",
              )}
            >
              {title}
            </Text>
            <Text className="mb-6 text-center font-quicksand text-base text-gray-100">
              {message}
            </Text>

            <View className="w-full gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="items-center rounded-xl bg-primary py-4"
                activeOpacity={0.85}
              >
                <Text className="base-bold text-white">{primaryLabel}</Text>
              </TouchableOpacity>
              {secondaryLabel && (
                <TouchableOpacity
                  onPress={onSecondary}
                  className="items-center rounded-xl bg-gray-100/10 py-4"
                  activeOpacity={0.85}
                >
                  <Text className="base-bold text-dark-100">
                    {secondaryLabel}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const PaymentOption = ({
  selected,
  onPress,
  title,
  subtitle,
  disabled,
}: {
  selected: boolean;
  onPress: () => void;
  title: string;
  subtitle: string;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
    className={cn(
      "mb-3 flex-row items-center rounded-2xl border p-4",
      selected ? "border-primary bg-primary/5" : "border-gray-200/70 bg-white",
      disabled && "opacity-40",
    )}
  >
    <View className="flex-1">
      <Text className="base-bold text-dark-100">{title}</Text>
      <Text className="body-regular text-gray-100">{subtitle}</Text>
    </View>
    <View
      className={cn(
        "h-6 w-6 items-center justify-center rounded-full border-2",
        selected ? "border-primary bg-primary" : "border-gray-300",
      )}
    >
      {selected && <View className="h-2 w-2 rounded-full bg-white" />}
    </View>
  </TouchableOpacity>
);

type Step = "review" | "payment";

const Cart = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [step, setStep] = useState<Step>("review");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const discount = subtotal > 0 ? APP_DISCOUNT : 0;
  const finalAmount = Math.max(0, subtotal + deliveryFee - discount);

  const saveOrder = async (
    paymentIntentId: string,
    paymentStatus: "succeeded" | "cash_on_delivery",
  ) => {
    if (!user) throw new Error("Please sign in to continue");
    await createOrder({
      userId: user.$id,
      items: JSON.stringify(items),
      totalAmount: subtotal,
      deliveryFee,
      discount,
      finalAmount,
      paymentIntentId,
      paymentStatus,
      orderStatus: "pending",
      deliveryAddress: user.address_home || "",
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || "",
    });
    clearCart();
    setStep("review");
    setMethod(null);
    setShowSuccess(true);
  };

  const payWithCard = async () => {
    const payment = await createPaymentIntent({
      amount: finalAmount,
      currency: "usd",
      customerEmail: user!.email,
      customerName: user!.name,
    });
    if (!payment.success || !payment.clientSecret) {
      throw new Error(payment.error || "Failed to start payment");
    }

    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: "Foodify",
      paymentIntentClientSecret: payment.clientSecret,
      defaultBillingDetails: {
        name: user!.name,
        email: user!.email,
        phone: user!.phone,
      },
      appearance: {
        colors: { primary: "#FE8C00" },
        shapes: { borderRadius: 14 },
      },
      allowsDelayedPaymentMethods: true,
    });
    if (initError) throw new Error(initError.message);

    const { error: presentError } = await presentPaymentSheet();
    if (presentError) {
      if (presentError.code === "Canceled") {
        setShowCancel(true);
        return;
      }
      throw new Error(presentError.message);
    }

    await saveOrder(payment.paymentIntentId!, "succeeded");
  };

  const placeOrder = async () => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to place an order.");
      return;
    }
    if (!method) return;

    setIsProcessing(true);
    try {
      if (method === "card") {
        await payWithCard();
      } else {
        await saveOrder("cash_on_delivery", "cash_on_delivery");
      }
    } catch (error) {
      Alert.alert(
        "Order failed",
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    router.replace("/");
  };

  const resultModals = (
    <>
      <ResultModal
        visible={showSuccess}
        onClose={closeSuccess}
        image={images.successs}
        title="Order Confirmed!"
        message="Your food is being prepared and will be delivered shortly."
        primaryLabel="Back to Home"
      />
      <ResultModal
        visible={showCancel}
        onClose={() => setShowCancel(false)}
        image={images.canceled}
        title="Payment Cancelled"
        message="Your payment was cancelled. Your cart items are still saved."
        primaryLabel="Try Again"
        secondaryLabel="Back to Home"
        onSecondary={() => {
          setShowCancel(false);
          router.replace("/");
        }}
        tone="error"
      />
    </>
  );

  /* ----------------------------- Empty cart ----------------------------- */
  if (totalItems === 0) {
    return (
      <SafeAreaView className="h-full bg-white">
        <View className="px-5 pt-5">
          <CustomHeader title="Your Cart" />
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Image
            source={images.emptycart}
            className="mb-6 h-72 w-72"
            resizeMode="contain"
          />
          <Text className="h3-bold text-dark-100">Your cart is empty</Text>
          <Text className="paragraph-regular mt-2 text-center text-gray-100">
            Add some delicious items to get started!
          </Text>
          <CustomButton
            title="Browse menu"
            onPress={() => router.push("/search")}
            style="mt-6 px-8"
          />
        </View>
        {resultModals}
      </SafeAreaView>
    );
  }

  /* ------------------------------- Review ------------------------------- */
  if (step === "review") {
    return (
      <SafeAreaView className="h-full bg-white">
        <FlatList
          data={items}
          renderItem={({ item }) => <CartItem item={item} />}
          keyExtractor={(item) => item.cartItemId}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <CustomHeader title={`Your Cart (${totalItems})`} />
          }
          ListFooterComponent={
            <View className="mt-6 rounded-2xl border border-gray-200/70 bg-white p-5">
              <Text className="paragraph-bold mb-4 text-dark-100">
                Order Summary
              </Text>
              <SummaryRow
                label={`Subtotal (${totalItems} items)`}
                value={`$${subtotal.toFixed(2)}`}
              />
              <SummaryRow
                label="Delivery"
                value={
                  deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`
                }
              />
              <SummaryRow
                label="Discount"
                value={`- $${discount.toFixed(2)}`}
                valueStyle="!text-success"
              />
              <View className="my-2 border-t border-gray-200" />
              <SummaryRow
                label="Total"
                value={`$${finalAmount.toFixed(2)}`}
                labelStyle="base-bold !text-dark-100"
                valueStyle="base-bold !text-dark-100"
              />
            </View>
          }
        />

        <View
          className="border-t border-gray-100/40 bg-white px-5 pt-4"
          style={{ paddingBottom: TAB_BAR_SPACE }}
        >
          <CustomButton
            title={`Proceed to Checkout · $${finalAmount.toFixed(2)}`}
            onPress={() => setStep("payment")}
          />
        </View>
        {resultModals}
      </SafeAreaView>
    );
  }

  /* ------------------------------ Payment ------------------------------ */
  const stripeAvailable = process.env.EXPO_PUBLIC_ENABLE_STRIPE === "true";

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="flex-row items-center px-5 pt-5">
        <TouchableOpacity
          onPress={() => setStep("review")}
          hitSlop={10}
          className="mr-2"
        >
          <ChevronLeft size={26} color="#181C2E" />
        </TouchableOpacity>
        <Text className="h3-bold text-dark-100">Checkout</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Deliver to */}
        <Text className="paragraph-bold mb-2 text-dark-100">Deliver to</Text>
        <TouchableOpacity
          onPress={() => router.push("/edit-profile")}
          activeOpacity={0.8}
          className="mb-6 flex-row items-center gap-3 rounded-2xl border border-gray-200/70 bg-white p-4"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin size={18} color="#FE8C00" />
          </View>
          <View className="flex-1">
            <Text className="paragraph-semibold text-dark-100">
              {user?.address_home ? "Home" : "No address yet"}
            </Text>
            <Text className="body-regular text-gray-100" numberOfLines={1}>
              {user?.address_home || "Tap to add a delivery address"}
            </Text>
          </View>
          <Text className="body-medium text-primary">Change</Text>
        </TouchableOpacity>

        {/* Payment method */}
        <Text className="paragraph-bold mb-2 text-dark-100">
          Payment method
        </Text>
        <PaymentOption
          selected={method === "card"}
          onPress={() => setMethod("card")}
          title="Credit / Debit Card"
          subtitle={
            stripeAvailable
              ? "Pay securely with Stripe"
              : "Needs a development build"
          }
          disabled={!stripeAvailable}
        />
        <PaymentOption
          selected={method === "cash"}
          onPress={() => setMethod("cash")}
          title="Cash on Delivery"
          subtitle="Pay when your order arrives"
        />

        {/* Summary */}
        <View className="mt-4 rounded-2xl bg-primary/5 p-5">
          <SummaryRow
            label={`Subtotal (${totalItems} items)`}
            value={`$${subtotal.toFixed(2)}`}
          />
          <SummaryRow
            label="Delivery"
            value={deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
          />
          <SummaryRow
            label="Discount"
            value={`- $${discount.toFixed(2)}`}
            valueStyle="!text-success"
          />
          <View className="my-2 border-t border-primary/15" />
          <SummaryRow
            label="Total"
            value={`$${finalAmount.toFixed(2)}`}
            labelStyle="base-bold !text-dark-100"
            valueStyle="base-bold !text-dark-100"
          />
        </View>
      </ScrollView>

      <View
        className="border-t border-gray-100/40 bg-white px-5 pt-4"
        style={{ paddingBottom: TAB_BAR_SPACE }}
      >
        <CustomButton
          title={
            isProcessing
              ? "Processing…"
              : `Place Order · $${finalAmount.toFixed(2)}`
          }
          onPress={placeOrder}
          disabled={isProcessing || !method}
          leftIcon={
            isProcessing ? (
              <ActivityIndicator color="white" className="mr-2" />
            ) : undefined
          }
        />
      </View>

      {resultModals}
    </SafeAreaView>
  );
};

export default Cart;
