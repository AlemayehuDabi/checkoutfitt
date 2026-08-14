import { Sparkles } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { color } from "@/design";

export function TypingIndicator() {
  return (
    <View className="flex-row items-end gap-2 px-4">
      <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-50">
        <Sparkles size={14} color={color.primary} />
      </View>
      <View className="flex-row items-center gap-1.5 rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-4">
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
      className="h-2 w-2 rounded-full bg-muted"
    />
  );
}
