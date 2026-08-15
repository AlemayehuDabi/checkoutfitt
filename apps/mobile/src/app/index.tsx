import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <View className="h-16 w-16 items-center justify-center rounded-xl bg-primary-500">
        <Text className="text-h2 font-bold text-text-on-primary">C</Text>
      </View>
      <Text className="mt-xl text-h2 font-bold text-text-primary">CheckoutFitt</Text>
      <Text className="mt-1 text-caption text-text-muted">Your AI stylist</Text>
    </View>
  );
}
