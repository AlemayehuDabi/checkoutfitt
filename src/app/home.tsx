import { Text, View } from "react-native";

import { ScreenContainer } from "@/components/ui/screen-container";

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold tracking-tight text-ink">
          Welcome to CheckoutFitt
        </Text>
      </View>
    </ScreenContainer>
  );
}
