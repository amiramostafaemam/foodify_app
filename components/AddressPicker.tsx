import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import cn from "clsx";
import { Briefcase, Check, MapPin, Plus, X } from "lucide-react-native";
import { type ComponentType, useEffect, useState } from "react";
import {
  Animated,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";

interface AddressPickerProps {
  visible: boolean;
  onClose: () => void;
  homeAddress?: string;
  workAddress?: string;
  selected: string;
  onSelect: (address: string) => void;
}

const Row = ({
  icon: Icon,
  label,
  value,
  selected,
  onPress,
}: {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  selected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={cn(
        "flex-row items-center gap-3 rounded-2xl border-2 p-3.5",
        selected ? "border-primary bg-primary/5" : "border-transparent bg-surface",
      )}
    >
      <View
        className={cn(
          "h-11 w-11 items-center justify-center rounded-2xl",
          selected ? "bg-primary" : "bg-primary/10",
        )}
      >
        <Icon size={18} color={selected ? "#fff" : "#FE8C00"} />
      </View>
      <View className="flex-1">
        <Text className="paragraph-semibold text-content">{label}</Text>
        <Text className="body-regular text-muted" numberOfLines={1}>
          {value}
        </Text>
      </View>
      {selected ? (
        <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
          <Check size={14} color="#fff" strokeWidth={3} />
        </View>
      ) : (
        <View className="h-6 w-6 rounded-full border-2 border-line/20" />
      )}
    </TouchableOpacity>
  );
};

const AddressPicker = ({
  visible,
  onClose,
  homeAddress,
  workAddress,
  selected,
  onSelect,
}: AddressPickerProps) => {
  const c = useColors();
  const tr = useT();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const scale = useAnimatedValue(0.9);
  const opacity = useAnimatedValue(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 60,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.9);
      opacity.setValue(0);
    }
  }, [visible, scale, opacity]);

  // Reset the "adding a new address" sub-form each time the modal opens.
  // Adjusting state during render (rather than in an effect) when a prop
  // changes is the pattern React recommends for this.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setAdding(false);
  }

  const pick = (address: string) => {
    onSelect(address);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <Animated.View
          style={{ opacity, transform: [{ scale }], width: "100%", maxWidth: 400 }}
        >
          <View className="rounded-[28px] bg-elevated p-5 shadow-2xl">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="h3-bold text-content">
                {tr("cart.deliveryAddress")}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={10}
                className="h-8 w-8 items-center justify-center rounded-full bg-surface"
              >
                <X size={16} color={c.muted} />
              </TouchableOpacity>
            </View>

            <View className="gap-2.5">
              {homeAddress ? (
                <Row
                  icon={MapPin}
                  label={tr("cart.home")}
                  value={homeAddress}
                  selected={selected === homeAddress}
                  onPress={() => pick(homeAddress)}
                />
              ) : null}
              {workAddress ? (
                <Row
                  icon={Briefcase}
                  label={tr("cart.work")}
                  value={workAddress}
                  selected={selected === workAddress}
                  onPress={() => pick(workAddress)}
                />
              ) : null}

              {adding ? (
                <View className="gap-2.5 rounded-2xl bg-surface p-3.5">
                  <TextInput
                    autoFocus
                    value={draft}
                    onChangeText={setDraft}
                    placeholder={tr("cart.addressPlaceholder")}
                    placeholderTextColor={c.muted}
                    className="rounded-xl bg-card px-3.5 py-3 font-quicksand-medium text-base text-content"
                  />
                  <TouchableOpacity
                    onPress={() => draft.trim() && pick(draft.trim())}
                    activeOpacity={0.85}
                    className="items-center rounded-full bg-primary py-3.5"
                  >
                    <Text className="font-quicksand-bold text-base text-white">
                      {tr("cart.deliverHere")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setAdding(true)}
                  activeOpacity={0.75}
                  className="flex-row items-center gap-3 rounded-2xl border-2 border-dashed border-line/20 p-3.5"
                >
                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    <Plus size={18} color="#FE8C00" />
                  </View>
                  <Text className="paragraph-semibold text-content">
                    {tr("cart.addAddress")}
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

export default AddressPicker;
