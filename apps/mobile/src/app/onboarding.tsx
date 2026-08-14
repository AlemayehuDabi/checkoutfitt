import { router } from "expo-router";
import { CheckCircle2, Shirt, Sparkles } from "lucide-react-native";
import { type ComponentType, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/ui/button";
import { PaginationDots } from "@/components/ui/pagination-dots";

import { color } from "@/design";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Slide = {
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    icon: Shirt,
    title: "Your closet, digitized",
    description: "Snap photos of what you own and build a searchable digital wardrobe in minutes.",
  },
  {
    icon: Sparkles,
    title: "Daily outfits, styled by AI",
    description: "Get fresh outfit picks every morning, tailored to your taste, weather, and plans.",
  },
  {
    icon: CheckCircle2,
    title: "Never wonder what to wear",
    description: "Skip the decision fatigue. Open the app, pick your fit, and walk out the door.",
  },
];

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === slides.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const goToSlide = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (isLastSlide) {
      router.push("/sign-up");
      return;
    }
    goToSlide(activeIndex + 1);
  };

  const handleSkip = () => {
    router.push("/sign-up");
  };

  return (
    <View className="flex-1 bg-canvas">
      <View className="flex-row justify-end px-6 pt-16">
        <Text
          onPress={handleSkip}
          className="text-sm font-medium text-muted active:opacity-60"
          suppressHighlighting
        >
          Skip
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <View key={index} style={{ width: SCREEN_WIDTH }} className="items-center px-8 pt-8">
              <View className="h-64 w-full items-center justify-center rounded-3xl bg-surface-sunken">
                <View className="h-24 w-24 items-center justify-center rounded-full bg-surface">
                  <Icon size={40} color={color.primary} strokeWidth={1.5} />
                </View>
              </View>
              <Text className="mt-12 text-center text-2xl font-bold text-ink">
                {slide.title}
              </Text>
              <Text className="mt-3 text-center text-base leading-6 text-muted">
                {slide.description}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View className="gap-6 px-6 pb-8 pt-4">
        <PaginationDots count={slides.length} activeIndex={activeIndex} />
        <Button label={isLastSlide ? "Get Started" : "Next"} onPress={handleNext} />
      </View>
    </View>
  );
}
