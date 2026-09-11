import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import { CreditCard, Lock } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <View className="flex-1">
    <Text className="mb-1.5 pl-1 font-quicksand-medium text-sm text-muted">
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
  const insets = useSafeAreaInsets();
  const c = useColors();
  const tr = useT();
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

  const inputClass =
    "rounded-2xl border-2 border-transparent bg-surface px-4 py-3.5 font-quicksand-semibold text-base text-content";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 justify-end bg-black/50"
      >
        <TouchableOpacity
          activeOpacity={1}
          className="rounded-t-[28px] bg-elevated px-5 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
        >
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-line/15" />

          <View className="flex-row items-center gap-2">
            <CreditCard size={20} color="#FE8C00" />
            <Text className="h3-bold text-content">{tr("card.title")}</Text>
          </View>
          <Text className="mt-1 font-quicksand-medium text-sm text-muted">
            {tr("card.subtitle", { amount: amount.toFixed(2) })}
          </Text>

          <View className="mt-5 gap-3">
            <Field label={tr("card.number")}>
              <TextInput
                value={card}
                onChangeText={(v) => setCard(formatCard(v))}
                placeholder="4242 4242 4242 4242"
                placeholderTextColor={c.muted}
                keyboardType="number-pad"
                className={inputClass}
              />
            </Field>

            <View className="flex-row gap-3">
              <Field label={tr("card.expiry")}>
                <TextInput
                  value={exp}
                  onChangeText={(v) => setExp(formatExp(v))}
                  placeholder="MM/YY"
                  placeholderTextColor={c.muted}
                  keyboardType="number-pad"
                  className={inputClass}
                />
              </Field>
              <Field label={tr("card.cvc")}>
                <TextInput
                  value={cvc}
                  onChangeText={(v) =>
                    setCvc(v.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="123"
                  placeholderTextColor={c.muted}
                  keyboardType="number-pad"
                  className={inputClass}
                />
              </Field>
            </View>

            <Field label={tr("card.nameOnCard")}>
              <TextInput
                value={holder}
                onChangeText={setHolder}
                placeholder={tr("card.fullName")}
                placeholderTextColor={c.muted}
                className={inputClass}
              />
            </Field>
          </View>

          <TouchableOpacity
            onPress={pay}
            disabled={!valid || processing}
            activeOpacity={0.9}
            className={`mt-5 flex-row items-center justify-center gap-2 rounded-full py-4 ${
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
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default MockCardSheet;
