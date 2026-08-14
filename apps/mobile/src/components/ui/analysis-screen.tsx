import { Sparkles, type LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { ScreenContainer } from "@/components/ui/screen-container";
import { color } from "@/design";
import { AppImage } from "@/components/ui/app-image";
import { IconWell } from "@/components/ui/icon-well";

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
          <View className="h-56 w-44 overflow-hidden rounded-3xl border border-line">
            <AppImage source={{ uri: imageUri }} className="h-full w-full" contentFit="cover" />
          </View>
        ) : (
          <IconWell size="2xl"><Icon size={34} color={color.primary} strokeWidth={1.5} /></IconWell>
        )}

        <Text className="mt-9 text-center text-h3 font-bold text-ink">{steps[index]}</Text>
        {caption ? (
          <Text className="mt-2 text-center text-body text-muted">{caption}</Text>
        ) : null}

        <View className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-surface-muted">
          <View
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </View>
        <Text className="mt-3 text-micro font-semibold uppercase text-faint">
          Step {index + 1} of {steps.length}
        </Text>
      </View>
    </ScreenContainer>
  );
}
