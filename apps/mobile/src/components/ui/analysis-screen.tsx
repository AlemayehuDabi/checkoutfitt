import { Sparkles, type LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { ScreenContainer } from "@/components/ui/screen-container";
import { color } from "@/design";
import { AppImage } from "@/components/ui/app-image";

type AnalysisScreenProps = {
  /** Copy cycled through while the fake analysis runs. */
  steps: string[];
  caption?: string;
  icon?: LucideIcon;
  /** Optional captured photo, shown behind the progress ring. */
  imageUri?: string;
  /** Milliseconds per step. */
  pace?: number;
  onDone: () => void;
};

/**
 * The "AI is working" moment shared by Style Coach, Outfit Rating and Colour
 * Analysis. Deliberately paced so the result feels earned rather than instant.
 */
export function AnalysisScreen({
  steps,
  caption,
  icon: Icon = Sparkles,
  imageUri,
  pace = 900,
  onDone,
}: AnalysisScreenProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, pace);
    const timeout = setTimeout(onDone, pace * steps.length + 350);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // Intentionally runs once: the pacing shouldn't restart if the parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = (index + 1) / steps.length;

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        {imageUri ? (
          <View className="h-56 w-44 overflow-hidden rounded-xl border border-border">
            <AppImage source={{ uri: imageUri }} className="h-full w-full" contentFit="cover" />
          </View>
        ) : (
          // A thin brand ring around a soft tint, per the AI Processing mockup.
          <View className="h-32 w-32 items-center justify-center rounded-full border-[1.5px] border-primary-300 bg-primary-50">
            <Icon size={40} color={color.primary500} strokeWidth={1.5} />
          </View>
        )}

        <Text className="mt-3xl text-center text-h2 font-bold text-text-primary">{steps[index]}</Text>
        {caption ? (
          <Text className="mt-sm text-center text-body text-text-muted">{caption}</Text>
        ) : null}

        <View className="mt-3xl h-1.5 w-48 overflow-hidden rounded-full bg-primary-200">
          <View
            className="h-full rounded-full bg-primary-500"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </View>
        <Text className="mt-md text-eyebrow font-semibold uppercase text-text-muted">
          Step {index + 1} of {steps.length}
        </Text>
      </View>
    </ScreenContainer>
  );
}
