import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language.store";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  CreditCard,
  Hash,
  Lock,
  User,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  amount: number;
  name?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const formatCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExp = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/** Fills the unfilled digits with bullets, grouped like a real card face. */
const maskedCardDisplay = (digits: string) => {
  const clean = digits.replace(/\D/g, "").padEnd(16, "•");
  return (clean.match(/.{1,4}/g) ?? []).join("  ");
};

const Field = ({
  label,
  align,
  icon: Icon,
  children,
}: {
  label: string;
  align: "left" | "right";
  icon: LucideIcon;
  children: React.ReactNode;
}) => {
  const c = useColors();
  return (
    <View className="flex-1">
      <Text
        className="mb-2 px-1 font-quicksand-medium text-sm text-muted"
        style={{ textAlign: align }}
      >
        {label}
      </Text>
      <View className="flex-row items-center gap-3 rounded-2xl border-2 border-transparent bg-surface px-4 py-4">
        <Icon size={18} color={c.muted} />
        {children}
      </View>
    </View>
  );
};

const MockCardSheet = ({
  visible,
  amount,
  name = "",
  onClose,
  onSuccess,
}: Props) => {
  const c = useColors();
  const tr = useT();
  const isArabic = useLanguageStore((s) => s.language === "ar");
  const align = isArabic ? "right" : "left";
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [holder, setHolder] = useState(name);
  const [processing, setProcessing] = useState(false);

  const valid =
    card.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(exp) &&
    cvc.length >= 3;

  const pay = () => {
    if (!valid || processing) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1600);
  };

  const inputStyle = { textAlign: align } as const;
  // Card number/expiry/CVC are universal digit formats, not language-
  // dependent text — forcing them to always render left-to-right avoids
  // the classic RTL text-field glitch where the cursor and the
  // auto-inserted "/" jump around as you type into a right-aligned field.
  const numericInputStyle = {
    textAlign: "left",
    writingDirection: "ltr",
  } as const;
  const inputClass =
    "flex-1 py-0 font-quicksand-semibold text-base text-content";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-canvas">
        <View className="flex-row items-center gap-2 px-5 pb-2 pt-2">
          <TouchableOpacity
            onPress={onClose}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface"
          >
            <ChevronLeft size={22} color={c.content} />
          </TouchableOpacity>
          <Text className="h3-bold text-content">{tr("card.title")}</Text>
        </View>

        {/* Card fields keep a fixed physical layout (number on top, expiry
            left / CVC right below) regardless of language, like every real
            payment form — direction: "ltr" makes this immune to the
            device's native RTL flag, which is unreliable in Expo Go and
            was scrambling the expiry/CVC positions. Text inside each field
            still follows `align` for a properly-RTL reading feel. Now that
            every field is full width, the stack is taller than the screen
            once the keyboard is up, so this scrolls and stays clear of it. */}
        <KeyboardAwareScrollView
          bottomOffset={24}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          style={{ direction: "ltr" }}
        >
          <Text className="mt-3 paragraph-medium text-muted">
            {tr("card.subtitle", { amount: amount.toFixed(2) })}
          </Text>

          {/* Live card preview — a bit bigger than the fields below and
              centered with its own margin, like a physical card sitting on
              the form rather than stretching edge-to-edge with it. */}
          <View className="items-center">
            <LinearGradient
              colors={["#FE8C00", "#B85B00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: "94%",
                borderRadius: 24,
                padding: 22,
                aspectRatio: 1.55,
                marginTop: 18,
              }}
            >
              <View className="flex-row items-start justify-between">
                <View className="h-9 w-12 rounded-md bg-white/25" />
                <View className="rounded-full bg-white/15 px-2.5 py-1">
                  <Text className="font-quicksand-bold text-[10px] tracking-wider text-white/90">
                    DEMO
                  </Text>
                </View>
              </View>

              <Text
                className="mt-7 font-quicksand-bold text-2xl text-white"
                style={{ letterSpacing: 2 }}
              >
                {maskedCardDisplay(card)}
              </Text>

              <View className="mt-6 flex-row items-end justify-between">
                <View className="flex-1 pr-3">
                  <Text className="font-quicksand-semibold text-[9px] tracking-wider text-white/70">
                    {tr("card.cardHolder")}
                  </Text>
                  <Text
                    className="mt-0.5 font-quicksand-bold text-base text-white"
                    numberOfLines={1}
                  >
                    {holder.trim() ? holder.toUpperCase() : tr("card.yourName")}
                  </Text>
                </View>
                <View>
                  <Text className="font-quicksand-semibold text-[9px] tracking-wider text-white/70">
                    {tr("card.expires")}
                  </Text>
                  <Text className="mt-0.5 font-quicksand-bold text-base text-white">
                    {exp || "MM/YY"}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Every field on its own row — the paired Expiry/CVC layout was
              cramping both boxes; full width reads much more like a
              professional form. */}
          <View className="mt-8 gap-5">
            <Field label={tr("card.number")} align={align} icon={CreditCard}>
              <TextInput
                value={card}
                onChangeText={(v) => setCard(formatCard(v))}
                placeholder="4242 4242 4242 4242"
                placeholderTextColor={c.muted}
                keyboardType="number-pad"
                style={numericInputStyle}
                className={inputClass}
              />
            </Field>

            <Field label={tr("card.expiry")} align={align} icon={CreditCard}>
              <TextInput
                value={exp}
                onChangeText={(v) => setExp(formatExp(v))}
                placeholder="MM/YY"
                placeholderTextColor={c.muted}
                keyboardType="number-pad"
                style={numericInputStyle}
                className={inputClass}
              />
            </Field>

            <Field label={tr("card.cvc")} align={align} icon={Hash}>
              <TextInput
                value={cvc}
                onChangeText={(v) => setCvc(v.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                placeholderTextColor={c.muted}
                keyboardType="number-pad"
                secureTextEntry
                style={numericInputStyle}
                className={inputClass}
              />
            </Field>

            <Field label={tr("card.nameOnCard")} align={align} icon={User}>
              <TextInput
                value={holder}
                onChangeText={setHolder}
                placeholder={tr("card.fullName")}
                placeholderTextColor={c.muted}
                style={inputStyle}
                className={inputClass}
              />
            </Field>
          </View>
        </KeyboardAwareScrollView>

        <View className="px-5 pb-4">
          <TouchableOpacity
            onPress={pay}
            disabled={!valid || processing}
            activeOpacity={0.9}
            className={`flex-row items-center justify-center gap-2 rounded-full py-4 ${
              valid && !processing ? "bg-primary" : "bg-primary/40"
            }`}
          >
            {processing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Lock size={16} color="#fff" />
                <Text className="font-quicksand-bold text-base text-white">
                  {tr("card.pay", { amount: amount.toFixed(2) })}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text className="mt-3 text-center font-quicksand-medium text-xs text-muted">
            {tr("card.demo")}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default MockCardSheet;
