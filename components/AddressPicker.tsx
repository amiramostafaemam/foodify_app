import { useColors } from "@/hooks/useColors";
import cn from "clsx";
import { Briefcase, Check, MapPin, Plus } from "lucide-react-native";
import { type ComponentType, useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        "flex-row items-center gap-3 rounded-2xl border-2 p-4",
        selected ? "border-primary bg-primary/5" : "border-transparent bg-surface",
      )}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Icon size={18} color="#FE8C00" />
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
  const insets = useSafeAreaInsets();
  const c = useColors();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const pick = (address: string) => {
    onSelect(address);
    onClose();
  };

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
          <Text className="h3-bold mb-4 text-content">Delivery address</Text>

          <View className="gap-2.5">
            {homeAddress ? (
              <Row
                icon={MapPin}
                label="Home"
                value={homeAddress}
                selected={selected === homeAddress}
                onPress={() => pick(homeAddress)}
              />
            ) : null}
            {workAddress ? (
              <Row
                icon={Briefcase}
                label="Work"
                value={workAddress}
                selected={selected === workAddress}
                onPress={() => pick(workAddress)}
              />
            ) : null}

            {adding ? (
              <View className="gap-2.5 rounded-2xl bg-surface p-4">
                <TextInput
                  autoFocus
                  value={draft}
                  onChangeText={setDraft}
                  placeholder="Street, building, apartment…"
                  placeholderTextColor={c.muted}
                  className="rounded-xl bg-card px-3.5 py-3 font-quicksand-medium text-base text-content"
                />
                <TouchableOpacity
                  onPress={() => draft.trim() && pick(draft.trim())}
                  activeOpacity={0.85}
                  className="items-center rounded-full bg-primary py-3.5"
                >
                  <Text className="font-quicksand-bold text-base text-white">
                    Deliver here
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setAdding(true)}
                activeOpacity={0.75}
                className="flex-row items-center gap-3 rounded-2xl border-2 border-dashed border-line/20 p-4"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Plus size={18} color="#FE8C00" />
                </View>
                <Text className="paragraph-semibold text-content">
                  Add a different address
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddressPicker;
