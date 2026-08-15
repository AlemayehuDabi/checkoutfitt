import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { ProgressBar } from "@/components/ui/progress-bar";
import { ScreenContainer } from "@/components/ui/screen-container";
import { usePendingImages } from "@/context/closet-context";

import { color } from "@/design";
import { IconWell } from "@/components/ui/icon-well";

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
        {/* Spec screen 7: an 80px tinted disc over a segmented progress bar. */}
        <IconWell size="2xl" round>
          <Sparkles size={36} color={color.primary500} strokeWidth={1.5} />
        </IconWell>
        <Text className="mt-3xl text-center text-h2 font-bold text-text-primary">
          {STEPS[stepIndex]}
        </Text>
        <Text className="mt-sm text-center text-body text-text-muted">
          {pendingImages.length > 1
            ? `Analyzing ${pendingImages.length} items with AI`
            : "Analyzing your item with AI"}
        </Text>
        <View className="mt-3xl w-48">
          <ProgressBar step={stepIndex + 1} total={STEPS.length} />
        </View>
      </View>
    </ScreenContainer>
  );
}
