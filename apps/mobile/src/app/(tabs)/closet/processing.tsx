import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { ScreenContainer } from "@/components/ui/screen-container";
import { useCloset } from "@/context/closet-context";

const STEPS = ["Detecting item...", "Identifying color...", "Classifying category..."];

export default function ProcessingScreen() {
  const { pendingImages } = useCloset();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 600);

    const timeout = setTimeout(() => {
      router.replace("/closet/confirm");
    }, 600 * STEPS.length + 200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center px-4">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-clay-50">
          <Sparkles size={36} color="#C1622D" strokeWidth={1.5} />
        </View>
        <ActivityIndicator className="mt-8" color="#C1622D" />
        <Text className="mt-6 text-center text-xl font-bold tracking-tight text-ink">
          {STEPS[stepIndex]}
        </Text>
        <Text className="mt-2 text-center text-sm text-muted">
          {pendingImages.length > 1
            ? `Analyzing ${pendingImages.length} items with AI`
            : "Analyzing your item with AI"}
        </Text>
      </View>
    </ScreenContainer>
  );
}
