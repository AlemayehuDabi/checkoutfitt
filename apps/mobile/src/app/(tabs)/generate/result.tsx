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
import { IconButton } from "@/components/ui/icon-button";
import { PaginationDots } from "@/components/ui/pagination-dots";
import { Skeleton } from "@/components/ui/skeleton";
import { StateView } from "@/components/ui/state-view";
import { generateOutfits } from "@/constants/mock-outfits";
import { useOutfits } from "@/context/outfits-context";
import type { Outfit } from "@/types";

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
    <SafeAreaView edges={["top", "bottom", "left", "right"]} className="flex-1 bg-sand">
      <View className="flex-row items-center justify-between px-6 pb-2 pt-2">
        <IconButton onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1A1917" />
        </IconButton>
        <Text className="text-base font-semibold text-ink">{context}</Text>
        <IconButton onPress={runGenerate}>
          <Shuffle size={20} color="#1A1917" />
        </IconButton>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full gap-3 rounded-3xl border border-line bg-white p-5">
            <Skeleton width="35%" height={18} />
            <Skeleton width="65%" height={26} />
            <View className="mt-2 flex-row gap-2">
              {[0, 1, 2, 3].map((key) => (
                <Skeleton key={key} className="aspect-square flex-1 rounded-xl" />
              ))}
            </View>
            <Skeleton height={48} className="mt-3" />
          </View>
          <Text className="mt-6 text-sm text-muted">Styling your {context.toLowerCase()} look…</Text>
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
              <View key={outfit.id} style={{ width: SCREEN_WIDTH }} className="px-6 py-2">
                <OutfitCard outfit={outfit} saved={isSaved(outfit.id)} onToggleSave={() => toggleSave(outfit)} />
              </View>
            ))}
          </ScrollView>
          <View className="items-center pb-4 pt-2">
            <PaginationDots count={outfits.length} activeIndex={activeIndex} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
