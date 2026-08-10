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
    <View className="flex-1 items-center justify-center bg-ink">
      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-clay">
        <Text className="text-2xl font-bold text-white">C</Text>
      </View>
      <Text className="mt-5 text-2xl font-bold tracking-tight text-white">CheckoutFitt</Text>
      <Text className="mt-1 text-sm text-white/50">Your AI stylist</Text>
    </View>
  );
}
