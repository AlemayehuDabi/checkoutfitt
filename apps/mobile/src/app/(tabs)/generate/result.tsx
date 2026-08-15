import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CloudAlert, Shuffle } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OutfitCard } from "@/components/outfit/outfit-card";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { PaginationDots } from "@/components/ui/pagination-dots";
import { Skeleton } from "@/components/ui/skeleton";
import { StateView } from "@/components/ui/state-view";
import { generateOutfits } from "@/constants/mock-outfits";
import { useOutfits } from "@/context/outfits-context";
import type { Outfit } from "@/types";

import { color } from "@/design";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ResultScreen() {
  const { context: contextParam } = useLocalSearchParams<{ context: string }>();
  const context = contextParam || "Casual";
  const { setLastGenerated, toggleSave, isSaved } = useOutfits();

  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const runGenerate = useCallback(() => {
    setLoading(true);
    setFailed(false);
    setActiveIndex(0);
    const timeout = setTimeout(() => {
      if (Math.random() < 0.12) {
        setLoading(false);
        setFailed(true);
        return;
      }
      const next = generateOutfits(context);
      setOutfits(next);
      setLastGenerated(next);
      setLoading(false);
      scrollRef.current?.scrollTo({ x: 0, animated: false });
    }, 1100);
    return () => clearTimeout(timeout);
  }, [context, setLastGenerated]);

  useEffect(() => runGenerate(), [runGenerate]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH));
  };

  return (
    <SafeAreaView edges={["top", "bottom", "left", "right"]} className="flex-1 bg-bg">
      <View className="h-14 flex-row items-center justify-between px-gutter">
        <IconButton accessibilityLabel="Go back" onPress={() => router.back()}>
          <ArrowLeft size={24} color={color.textPrimary} />
        </IconButton>
        <Text className="text-h3 font-semibold text-text-primary">{context}</Text>
        <IconButton accessibilityLabel="Regenerate" onPress={runGenerate}>
          <Shuffle size={20} color={color.textPrimary} />
        </IconButton>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center px-gutter">
          <View className="w-full gap-md rounded-xl border border-border bg-surface p-lg">
            <Skeleton width="35%" height={18} />
            <Skeleton width="65%" height={26} />
            <View className="mt-sm flex-row gap-sm">
              {[0, 1, 2, 3].map((key) => (
                <Skeleton key={key} className="aspect-square flex-1 rounded-md" />
              ))}
            </View>
            <Skeleton height={52} className="mt-md rounded-lg" />
          </View>
          <Text className="mt-2xl text-body text-text-muted">
            Styling your {context.toLowerCase()} look…
          </Text>
        </View>
      ) : failed ? (
        <StateView
          icon={CloudAlert}
          tone="error"
          title="Generation failed"
          description="Something went wrong while styling this look. Give it another try."
          actionLabel="Try Again"
          onAction={runGenerate}
        />
      ) : (
        <>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
          >
            {outfits.map((outfit) => (
              <View key={outfit.id} style={{ width: SCREEN_WIDTH }} className="px-gutter py-sm">
                <OutfitCard outfit={outfit} saved={isSaved(outfit.id)} onToggleSave={() => toggleSave(outfit)} />
              </View>
            ))}
          </ScrollView>
          <View className="items-center pb-md pt-sm">
            <PaginationDots count={outfits.length} activeIndex={activeIndex} />
          </View>
          {/* Spec screen 11: Regenerate left, Save Outfit right. */}
          <View className="flex-row gap-md px-gutter pb-lg">
            <Button
              label="Regenerate"
              variant="secondary"
              onPress={runGenerate}
              className="flex-1"
            />
            <Button
              label={isSaved(outfits[activeIndex]?.id) ? "Saved" : "Save Outfit"}
              onPress={() => {
                const current = outfits[activeIndex];
                if (current) toggleSave(current);
              }}
              className="flex-1"
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
