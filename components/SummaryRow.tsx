import cn from "clsx";
import { Text, View } from "react-native";

interface SummaryRowProps {
  label: string;
  value: string;
  labelStyle?: string;
  valueStyle?: string;
}

/** A label/value line in a price or order summary — shared by the cart's
 * checkout summary and the order-details receipt so both read the same. */
const SummaryRow = ({ label, value, labelStyle, valueStyle }: SummaryRowProps) => (
  <View className="flex-between my-1 flex-row">
    <Text className={cn("paragraph-medium text-muted", labelStyle)}>
      {label}
    </Text>
    <Text className={cn("paragraph-bold text-content", valueStyle)}>
      {value}
    </Text>
  </View>
);

export default SummaryRow;
