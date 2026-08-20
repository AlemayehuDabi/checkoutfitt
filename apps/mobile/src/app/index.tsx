import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "@/context/auth-context";

export default function SplashScreen() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/onboarding");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoading, user]);

  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <View className="h-16 w-16 items-center justify-center rounded-xl bg-primary-500">
        <Text className="text-h2 font-bold text-text-on-primary">C</Text>
      </View>
      <Text className="mt-xl text-h2 font-bold text-text-primary">CheckoutFitt</Text>
      <Text className="mt-1 text-caption text-text-muted">Your AI stylist</Text>
      {isLoading && <ActivityIndicator className="mt-6" color="#C4572D" />}
    </View>
  );
}
