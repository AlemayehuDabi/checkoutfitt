import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { ScreenContainer } from "@/components/ui/screen-container";
import { usePendingImages } from "@/context/closet-context";

import { color } from "@/design";

const STEPS = ["Detecting item...", "Identifying color...", "Classifying category..."];

export default function ProcessingScreen() {
  const { pendingImages } = usePendingImages();
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
      <View className="flex-1 items-center justify-center">
        {/* Spec screen 7: a thin brand ring around a soft tint. */}
        <View className="h-32 w-32 items-center justify-center rounded-full border-[1.5px] border-primary-300 bg-primary-50">
          <Sparkles size={40} color={color.primary500} strokeWidth={1.5} />
        </View>
        <Text className="mt-3xl text-center text-h2 font-bold text-text-primary">
          {STEPS[stepIndex]}
        </Text>
        <Text className="mt-sm text-center text-body text-text-muted">
          {pendingImages.length > 1
            ? `Analyzing ${pendingImages.length} items with AI`
            : "Analyzing your item with AI"}
        </Text>
        <View className="mt-3xl h-1.5 w-48 overflow-hidden rounded-full bg-primary-200">
          <View
            className="h-full rounded-full bg-primary-500"
            style={{ width: `${Math.round(((stepIndex + 1) / STEPS.length) * 100)}%` }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
