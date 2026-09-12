import AddressPicker from "@/components/AddressPicker";
import AppModal from "@/components/AppModal";
import CartItem from "@/components/CartItem";
import MockCardSheet from "@/components/MockCardSheet";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { TAB_BAR_SPACE } from "@/components/navigation/FloatingTabBar";
import { images } from "@/constants";
import { useColors } from "@/hooks/useColors";
import { createOrder } from "@/lib/appwrite";
import { useT } from "@/lib/i18n";
import { createPaymentIntent } from "@/lib/payment.service";
import { useStripe } from "@/lib/stripe";
import useAuthStore from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { PaymentInfoStripeProps, PaymentMethod } from "@/type";
import cn from "clsx";
import { router } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  MapPin,
  Wallet,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DELIVERY_FEE = 2.99;
const FREE_DELIVERY_OVER = 30;
const APP_DISCOUNT = 1.0;

const FOOTER_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 12,
} as const;

const SummaryRow = ({
  label,
  value,
  labelStyle,
  valueStyle,
}: PaymentInfoStripeProps) => (
  <View className="flex-between my-1 flex-row">
    <Text className={cn("paragraph-medium text-muted", labelStyle)}>
      {label}
    </Text>
    <Text className={cn("paragraph-bold text-content", valueStyle)}>
      {value}
    </Text>
  </View>
);

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
      "mb-3 flex-row items-center rounded-2xl p-4",
      selected ? "bg-primary/10" : "bg-surface",
      disabled && "opacity-40",
    )}
  >
    <View className="flex-1">
      <Text className="base-bold text-content">{title}</Text>
      <Text className="body-regular text-muted">{subtitle}</Text>
    </View>
    <View
      className={cn(
        "h-6 w-6 items-center justify-center rounded-full border-2",
        selected ? "border-primary bg-primary" : "border-line/20",
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
  const c = useColors();
  const tr = useT();

  const [step, setStep] = useState<Step>("review");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showSelectPayment, setShowSelectPayment] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showMockCard, setShowMockCard] = useState(false);
  const [address, setAddress] = useState(user?.address_home || "");

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
      deliveryAddress: address || user.address_home || "",
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || "",
    });
    clearCart();

    useNotificationsStore.getState().add({
      type: "order",
      titleKey: "cart.orderConfirmed",
      bodyKey: "cart.orderConfirmedMsg",
    });

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

  const stripeAvailable = process.env.EXPO_PUBLIC_ENABLE_STRIPE === "true";

  const placeOrder = async () => {
    if (!user) {
      Alert.alert(tr("cart.signInRequiredTitle"), tr("cart.signInRequiredMsg"));
      return;
    }
    if (!method) {
      setShowSelectPayment(true);
      return;
    }

    // Card via the demo sheet unless a real Stripe build is enabled.
    if (method === "card" && !stripeAvailable) {
      setShowMockCard(true);
      return;
    }

    setIsProcessing(true);
    try {
      if (method === "card") {
        await payWithCard();
      } else {
        await saveOrder("cash_on_delivery", "cash_on_delivery");
      }
    } catch (error) {
      Alert.alert(
        tr("common.orderFailed"),
        error instanceof Error ? error.message : tr("auth.errGeneric"),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const completeMockCard = async () => {
    setShowMockCard(false);
    setIsProcessing(true);
    try {
      await saveOrder("demo_card_payment", "succeeded");
    } catch (error) {
      Alert.alert(
        tr("common.orderFailed"),
        error instanceof Error ? error.message : tr("auth.errGeneric"),
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
      <AppModal
        visible={showSuccess}
        onClose={closeSuccess}
        tone="success"
        icon={CircleCheck}
        title={tr("cart.orderConfirmed")}
        message={tr("cart.orderConfirmedMsg")}
        primary={{ label: tr("cart.backToHome"), onPress: closeSuccess }}
      />
      <AppModal
        visible={showCancel}
        onClose={() => setShowCancel(false)}
        tone="error"
        icon={CircleAlert}
        title={tr("cart.paymentCancelled")}
        message={tr("cart.paymentCancelledMsg")}
        primary={{
          label: tr("common.tryAgain"),
          onPress: () => setShowCancel(false),
        }}
        secondary={{
          label: tr("cart.backToHome"),
          onPress: () => {
            setShowCancel(false);
            router.replace("/");
          },
        }}
      />
      <AppModal
        visible={showSelectPayment}
        onClose={() => setShowSelectPayment(false)}
        tone="primary"
        icon={Wallet}
        title={tr("cart.selectPaymentTitle")}
        message={tr("cart.selectPaymentMsg")}
        primary={{
          label: tr("auth.resetDone"),
          onPress: () => setShowSelectPayment(false),
        }}
      />
    </>
  );

  /* ----------------------------- Empty cart ----------------------------- */
  if (totalItems === 0) {
    return (
      <SafeAreaView className="h-full bg-canvas">
        <View className="px-5 pt-5">
          <CustomHeader title={tr("cart.title")} />
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Image
            source={images.emptycart}
            className="mb-6 h-72 w-72"
            resizeMode="contain"
          />
          <Text className="h3-bold text-content">{tr("cart.empty")}</Text>
          <Text className="paragraph-regular mt-2 text-center text-muted">
            {tr("cart.emptyHint")}
          </Text>
          <CustomButton
            title={tr("cart.browseMenu")}
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
      <SafeAreaView className="h-full bg-canvas">
        <FlatList
          data={items}
          renderItem={({ item }) => <CartItem item={item} />}
          keyExtractor={(item) => item.cartItemId}
          ItemSeparatorComponent={() => <View className="h-2.5" />}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="mb-1">
              <CustomHeader title={tr("cart.titleN", { n: totalItems })} />
            </View>
          }
          ListFooterComponent={
            <View className="mt-6 rounded-2xl bg-surface p-5">
              <Text className="paragraph-bold mb-4 text-content">
                {tr("cart.orderSummary")}
              </Text>
              <SummaryRow
                label={tr("cart.subtotalN", { n: totalItems })}
                value={`$${subtotal.toFixed(2)}`}
              />
              <SummaryRow
                label={tr("common.delivery")}
                value={
                  deliveryFee === 0
                    ? tr("common.free")
                    : `$${deliveryFee.toFixed(2)}`
                }
              />
              <SummaryRow
                label={tr("cart.discount")}
                value={`- $${discount.toFixed(2)}`}
                valueStyle="!text-success"
              />
              <View className="my-2 border-t border-line/10" />
              <SummaryRow
                label={tr("cart.total")}
                value={`$${finalAmount.toFixed(2)}`}
                labelStyle="base-bold !text-content"
                valueStyle="base-bold !text-content"
              />
            </View>
          }
        />

        <View
          className="bg-elevated px-5 pt-4"
          style={{ paddingBottom: TAB_BAR_SPACE, ...FOOTER_SHADOW }}
        >
          <CustomButton
            title={tr("cart.proceedTo", { amount: finalAmount.toFixed(2) })}
            onPress={() => setStep("payment")}
          />
        </View>
        {resultModals}
      </SafeAreaView>
    );
  }

  /* ------------------------------ Payment ------------------------------ */
  return (
    <SafeAreaView className="h-full bg-canvas">
      <View className="flex-row items-center px-5 pt-5">
        <TouchableOpacity
          onPress={() => setStep("review")}
          hitSlop={10}
          className="mr-2"
        >
          <ChevronLeft size={26} color={c.content} />
        </TouchableOpacity>
        <Text className="h3-bold text-content">{tr("cart.checkout")}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Deliver to */}
        <Text className="paragraph-bold mb-2 text-content">
          {tr("cart.deliverTo")}
        </Text>
        <TouchableOpacity
          onPress={() => setShowAddressPicker(true)}
          activeOpacity={0.8}
          className="mb-6 flex-row items-center gap-3 rounded-2xl bg-surface p-4"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin size={18} color="#FE8C00" />
          </View>
          <View className="flex-1">
            <Text className="paragraph-semibold text-content">
              {address === user?.address_home
                ? tr("cart.home")
                : address === user?.address_work
                  ? tr("cart.work")
                  : address
                    ? tr("cart.deliveryAddress")
                    : tr("cart.noAddress")}
            </Text>
            <Text className="body-regular text-muted" numberOfLines={1}>
              {address || tr("cart.chooseAddress")}
            </Text>
          </View>
          <ChevronRight size={18} color={c.muted} />
        </TouchableOpacity>

        {/* Payment method */}
        <Text className="paragraph-bold mb-2 text-content">
          {tr("cart.paymentMethod")}
        </Text>
        <PaymentOption
          selected={method === "card"}
          onPress={() => setMethod("card")}
          title={tr("cart.card")}
          subtitle={
            stripeAvailable
              ? tr("cart.payWithStripeSecure")
              : tr("cart.cardSub")
          }
        />
        <PaymentOption
          selected={method === "cash"}
          onPress={() => setMethod("cash")}
          title={tr("cart.cash")}
          subtitle={tr("cart.cashSub")}
        />

        {/* Summary */}
        <View className="mt-4 rounded-2xl bg-primary/5 p-5">
          <SummaryRow
            label={tr("cart.subtotalN", { n: totalItems })}
            value={`$${subtotal.toFixed(2)}`}
          />
          <SummaryRow
            label={tr("common.delivery")}
            value={
              deliveryFee === 0 ? tr("common.free") : `$${deliveryFee.toFixed(2)}`
            }
          />
          <SummaryRow
            label={tr("cart.discount")}
            value={`- $${discount.toFixed(2)}`}
            valueStyle="!text-success"
          />
          <View className="my-2 border-t border-primary/15" />
          <SummaryRow
            label={tr("cart.total")}
            value={`$${finalAmount.toFixed(2)}`}
            labelStyle="base-bold !text-content"
            valueStyle="base-bold !text-content"
          />
        </View>
      </ScrollView>

      <View
        className="bg-elevated px-5 pt-4"
        style={{ paddingBottom: TAB_BAR_SPACE, ...FOOTER_SHADOW }}
      >
        <CustomButton
          title={
            isProcessing
              ? tr("cart.processing")
              : tr("cart.placeOrder", { amount: finalAmount.toFixed(2) })
          }
          onPress={placeOrder}
          disabled={isProcessing}
          leftIcon={
            isProcessing ? (
              <ActivityIndicator color="white" className="mr-2" />
            ) : undefined
          }
        />
      </View>

      {resultModals}

      <AddressPicker
        visible={showAddressPicker}
        onClose={() => setShowAddressPicker(false)}
        homeAddress={user?.address_home}
        workAddress={user?.address_work}
        selected={address}
        onSelect={setAddress}
      />

      <MockCardSheet
        visible={showMockCard}
        amount={finalAmount}
        name={user?.name}
        onClose={() => setShowMockCard(false)}
        onSuccess={completeMockCard}
      />
    </SafeAreaView>
  );
};

export default Cart;
