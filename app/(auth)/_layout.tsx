import { Slot } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function AuthLayout() {
  return (
    <KeyboardAwareScrollView
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
    >
      <Slot />
    </KeyboardAwareScrollView>
  );
}
