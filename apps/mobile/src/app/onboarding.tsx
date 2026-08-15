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

/**
 * The mockups set the payoff word of each onboarding headline in the brand
 * colour ("Reimagined", "Every Day"). Splitting on the comma gives the same
 * treatment without touching the copy: everything after it takes the accent.
 */
function splitHeadline(title: string) {
  const comma = title.indexOf(",");
  if (comma === -1) return { lead: title, accent: "" };
  return { lead: title.slice(0, comma + 1), accent: title.slice(comma + 1) };
}

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
    <View className="flex-1 bg-bg">
      <View className="flex-row items-center justify-between px-gutter pt-16">
        {/* Wordmark, top-left in the brand colour — spec screen 1. */}
        <Text className="text-h3 font-bold text-primary-500">CheckoutFitt</Text>
        <Text
          onPress={handleSkip}
          className="text-caption font-medium text-text-muted active:opacity-60"
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
          const { lead, accent } = splitHeadline(slide.title);
          return (
            <View
              key={index}
              style={{ width: SCREEN_WIDTH }}
              className="items-center px-gutter pt-3xl"
            >
              <View className="h-64 w-full items-center justify-center rounded-xl bg-surface-secondary">
                <View className="h-24 w-24 items-center justify-center rounded-full bg-surface">
                  <Icon size={40} color={color.primary500} strokeWidth={1.5} />
                </View>
              </View>
              <Text className="mt-4xl text-center text-display font-bold text-text-primary">
                {lead}
                {accent ? <Text className="text-primary-500">{accent}</Text> : null}
              </Text>
              <Text className="mt-md text-center text-body text-text-muted">
                {slide.description}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View className="gap-2xl px-gutter pb-3xl pt-lg">
        <PaginationDots count={slides.length} activeIndex={activeIndex} />
        <Button label={isLastSlide ? "Get Started" : "Next"} onPress={handleNext} />
      </View>
    </View>
  );
}
