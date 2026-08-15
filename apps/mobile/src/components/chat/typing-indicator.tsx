import { Sparkles } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { color, radius } from "@/design";

export function TypingIndicator() {
  return (
    <View className="flex-row items-end gap-sm px-lg">
      <View className="h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-primary-50">
        <Sparkles size={16} color={color.primary500} />
      </View>
      <View
        style={{
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
          borderBottomRightRadius: radius.lg,
          borderBottomLeftRadius: 4,
        }}
        className="flex-row items-center gap-1.5 border border-border bg-surface px-lg py-lg"
      >
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </View>
  );
}

function Dot({ delay }: { delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, { toValue: -4, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.delay(600 - delay),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay, translateY]);

  return (
    <Animated.View
      style={{ transform: [{ translateY }] }}
      className="h-2 w-2 rounded-full bg-text-muted"
    />
  );
}
