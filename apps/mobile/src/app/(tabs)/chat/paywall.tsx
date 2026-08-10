import { router } from "expo-router";
import { Check, Crown, X } from "lucide-react-native";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { ScreenContainer } from "@/components/ui/screen-container";

const FEATURES = [
  "Unlimited AI stylist conversations",
  "Capsule wardrobe & trip packing builder",
  "Priority outfit generation, no waiting",
  "Unlimited digital closet items",
];

export default function ChatPaywallScreen() {
  return (
    <ScreenContainer>
      <View className="flex-row justify-end pt-4">
        <IconButton onPress={() => router.back()}>
          <X size={20} color="#1A1917" />
        </IconButton>
      </View>

      <View className="flex-1 items-center px-2 pt-4">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-ink">
          <Crown size={26} color="#FAF8F5" />
        </View>
        <Text className="mt-6 text-center text-3xl font-bold tracking-tight text-ink">
          Upgrade to Pro
        </Text>
        <Text className="mt-2 text-center text-base leading-6 text-muted">
          Unlock your AI stylist&apos;s full closet of tricks.
        </Text>

        <View className="mt-8 w-full gap-4">
          {FEATURES.map((feature) => (
            <View key={feature} className="flex-row items-center gap-3">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-clay-50">
                <Check size={14} color="#C1622D" />
              </View>
              <Text className="flex-1 text-base text-ink">{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-3 pb-4">
        <Button label="Upgrade for $9.99/mo" onPress={() => router.back()} />
        <Button label="Maybe Later" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScreenContainer>
  );
}
