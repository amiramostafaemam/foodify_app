import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language.store";
import { ChevronLeft, CreditCard, Lock } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

const Field = ({
  label,
  align,
  children,
}: {
  label: string;
  align: "left" | "right";
  children: React.ReactNode;
}) => (
  <View className="flex-1">
    <Text
      className="mb-1.5 px-1 font-quicksand-medium text-sm text-muted"
      style={{ textAlign: align }}
    >
      {label}
    </Text>
    {children}
  </View>
);

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
  const inputClass =
    "rounded-2xl border-2 border-transparent bg-surface px-4 py-3.5 font-quicksand-semibold text-base text-content";

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

        <View className="flex-1 px-5">
          <View className="mt-4 flex-row items-center gap-2">
            <CreditCard size={20} color="#FE8C00" />
            <Text className="paragraph-semibold text-content">
              {tr("card.subtitle", { amount: amount.toFixed(2) })}
            </Text>
          </View>

          <View className="mt-6 gap-3">
            <Field label={tr("card.number")} align={align}>
              <TextInput
                value={card}
                onChangeText={(v) => setCard(formatCard(v))}
                placeholder="4242 4242 4242 4242"
                placeholderTextColor={c.muted}
                keyboardType="number-pad"
                style={inputStyle}
                className={inputClass}
              />
            </Field>

            <View className="flex-row gap-3">
              <Field label={tr("card.expiry")} align={align}>
                <TextInput
                  value={exp}
                  onChangeText={(v) => setExp(formatExp(v))}
                  placeholder="MM/YY"
                  placeholderTextColor={c.muted}
                  keyboardType="number-pad"
                  style={inputStyle}
                  className={inputClass}
                />
              </Field>
              <Field label={tr("card.cvc")} align={align}>
                <TextInput
                  value={cvc}
                  onChangeText={(v) =>
                    setCvc(v.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="123"
                  placeholderTextColor={c.muted}
                  keyboardType="number-pad"
                  style={inputStyle}
                  className={inputClass}
                />
              </Field>
            </View>

            <Field label={tr("card.nameOnCard")} align={align}>
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
        </View>

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
