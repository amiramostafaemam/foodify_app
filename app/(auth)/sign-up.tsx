import { router } from "expo-router";
import { View, Text, Button } from "react-native";

const singUp = () => {
  return (
    <View>
      <Text>singUp</Text>
      <Button title="Sign In" onPress={() => router.push("./sign-in")} />
    </View>
  );
};

export default singUp;
